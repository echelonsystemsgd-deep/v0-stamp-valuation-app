# Implementation Plan - Phase 1: Supabase Setup & RLS Configuration

This document outlines the detailed plan for provisioning the PostgreSQL database schema in Supabase, establishing triggers/functions, creating storage buckets, configuring indexing, and setting up Row Level Security (RLS) policies.

---

## 1. 🧠 Database Schema (Supabase PostgreSQL)

The database schema will include tables for profiles, payout details, stamp categories, submissions, calculation breakdowns, image storage paths, and audit/history tables.

### Types & Enums
```sql
CREATE TYPE public.user_role AS ENUM ('user', 'seller', 'admin');
CREATE TYPE public.account_status AS ENUM ('active', 'restricted', 'banned');
CREATE TYPE public.submission_status AS ENUM (
    'quote_requested', 'quote_given', 'awaiting_shipment', 
    'in_transit', 'received', 'under_review', 
    'approved', 'paid', 'rejected', 'cancelled'
);
CREATE TYPE public.payout_method_type AS ENUM ('bank_transfer', 'cheque');
```

### Table 1: `profiles` (Linked to Supabase Auth)
Stores user roles, account state, and basic contact info. Payout details have been isolated to a dedicated table to avoid data exposure.
```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    postcode TEXT,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    status public.account_status DEFAULT 'active'::public.account_status NOT NULL,
    ban_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### Table 2: `profile_payout_details` (Sensitive Payment Settings)
1:1 relationship with `profiles`. Separated to enforce tighter, isolated RLS controls.
```sql
CREATE TABLE public.profile_payout_details (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    payout_method public.payout_method_type DEFAULT 'bank_transfer'::public.payout_method_type NOT NULL,
    bank_account_name TEXT,
    bank_account_number TEXT, -- Sensitive: Read/Write restricted to owner and admin
    bank_sort_code TEXT,       -- Sensitive: Read/Write restricted to owner and admin
    cheque_recipient_name TEXT,
    cheque_address_line1 TEXT,
    cheque_address_line2 TEXT,
    cheque_city TEXT,
    cheque_postcode TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### Table 3: `stamp_categories` (Stamp Rates Catalog)
Holds the active buying rates and availability states.
```sql
CREATE TABLE public.stamp_categories (
    id TEXT PRIMARY KEY, -- e.g., '1st-purple-complete-sheets-25-50'
    name TEXT NOT NULL,
    group_name TEXT NOT NULL, -- '1st Class', '2nd Class', 'Barcoded Values', etc.
    description TEXT,
    face_value NUMERIC(10, 2) NOT NULL,
    rate NUMERIC(4, 3) NOT NULL, -- e.g., 0.570 for 57%
    image_url TEXT,
    is_barcoded BOOLEAN DEFAULT TRUE NOT NULL,
    allow_decimal BOOLEAN DEFAULT FALSE NOT NULL,
    min_quantity NUMERIC(12, 2),
    max_quantity NUMERIC(12, 2),
    condition_requirements TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    paused_reason TEXT,
    paused_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### Table 4: `submissions` (Valuation Requests)
Tracks quotes, statuses, shipping numbers, and links to user profiles.
```sql
CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable for Guest submissions
    guest_name TEXT,
    guest_email TEXT,
    guest_phone TEXT,
    guest_postcode TEXT,
    collection_type TEXT NOT NULL,
    approx_quantity TEXT NOT NULL,
    estimated_era TEXT NOT NULL,
    description TEXT NOT NULL,
    valuable_items TEXT,
    estimated_valuation NUMERIC(12, 2) NOT NULL,
    final_reviewed_valuation NUMERIC(12, 2),
    status public.submission_status DEFAULT 'quote_requested'::public.submission_status NOT NULL,
    tracking_reference TEXT,
    date_received TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    rejection_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    cancellation_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### Table 5: `submission_items` (Calculation Breakdown Snapshot)
Saves the specific category breakdown. Copies the rate to prevent retroactive changes if catalog updates.
```sql
CREATE TABLE public.submission_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    category_id TEXT REFERENCES public.stamp_categories(id) ON DELETE SET NULL,
    quantity NUMERIC(12, 2) NOT NULL,
    rate_at_submission NUMERIC(4, 3) NOT NULL,
    face_value_at_submission NUMERIC(10, 2) NOT NULL,
    calculated_value NUMERIC(12, 2) NOT NULL,
    reviewed_quantity NUMERIC(12, 2), -- Populated by admin on physical audit
    reviewed_value NUMERIC(12, 2)     -- Populated by admin on physical audit
);
```

### Table 6: `submission_images` (File Upload Details)
```sql
CREATE TABLE public.submission_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Storage path in Supabase bucket
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### Table 7: `payouts` (Manual Payment Logs)
```sql
CREATE TABLE public.payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID UNIQUE REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    method public.payout_method_type NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    reference_number TEXT NOT NULL, -- Bank reference or cheque number
    issued_by UUID REFERENCES public.profiles(id) NOT NULL, -- Admin user ID
    recipient_name TEXT NOT NULL,
    recipient_details JSONB DEFAULT '{}'::jsonb NOT NULL, -- Masked account/sort codes or cheque address
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### Audit Log & History Tables

> [!NOTE]
> `stamp_category_history` replaces `rate_changes_history` entirely. Maintaining both would create redundant audit trails. A unified history table is cleaner and tracks all catalog mutations (rate adjustments, pause/reactivate state, metadata changes) in a single unified schema.

```sql
-- Unified Catalog modification logging
CREATE TABLE public.stamp_category_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT REFERENCES public.stamp_categories(id) ON DELETE CASCADE NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) NOT NULL,
    change_type TEXT NOT NULL, -- 'RATE_UPDATE', 'STATUS_CHANGE', 'METADATA_UPDATE'
    old_value JSONB DEFAULT '{}'::jsonb NOT NULL,
    new_value JSONB DEFAULT '{}'::jsonb NOT NULL,
    reason TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Submission status lifecycle changes
CREATE TABLE public.submission_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    changed_by UUID REFERENCES public.profiles(id),
    old_status public.submission_status NOT NULL,
    new_status public.submission_status NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Admin critical operations (bans, role changes, overrides)
CREATE TABLE public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id) NOT NULL,
    action_type TEXT NOT NULL, -- 'ROLE_CHANGE', 'USER_BAN', 'MANUAL_OVERRIDE'
    target_user_id UUID REFERENCES public.profiles(id),
    details JSONB DEFAULT '{}'::jsonb,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Session tracking
CREATE TABLE public.user_login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### Indexing Strategy
To optimize queries and join performance, the following indexes are defined:
```sql
-- Submissions Indexes
CREATE INDEX idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_guest_email ON public.submissions(guest_email) WHERE guest_email IS NOT NULL;

-- Catalog Indexes
CREATE INDEX idx_stamp_categories_is_active ON public.stamp_categories(is_active) WHERE is_active = true;
CREATE INDEX idx_stamp_categories_group_name ON public.stamp_categories(group_name);

-- Foreign Key/Join Indexes for Child Tables
CREATE INDEX idx_submission_items_submission_id ON public.submission_items(submission_id);
CREATE INDEX idx_submission_images_submission_id ON public.submission_images(submission_id);
CREATE INDEX idx_payouts_submission_id ON public.payouts(submission_id);
CREATE INDEX idx_submission_history_submission_id ON public.submission_history(submission_id);
CREATE INDEX idx_stamp_category_history_category_id ON public.stamp_category_history(category_id);
CREATE INDEX idx_admin_audit_logs_target_user ON public.admin_audit_logs(target_user_id) WHERE target_user_id IS NOT NULL;
CREATE INDEX idx_user_login_history_user_id ON public.user_login_history(user_id);
```

---

## 2. 🚦 Database Triggers & Auth Hooks

1. **Auto-Create Profile trigger:**
   Create a trigger function that automatically inserts a profile in `public.profiles` upon standard Supabase user signup.
   ```sql
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
       INSERT INTO public.profiles (id, email, full_name, role, status)
       VALUES (
           new.id, 
           new.email, 
           coalesce(new.raw_user_meta_data->>'full_name', ''),
           CASE 
               WHEN new.email = 'gslegacywealth@gmail.com' THEN 'admin'::public.user_role
               ELSE 'user'::public.user_role
           END,
           'active'::public.account_status
       );
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
       AFTER INSERT ON auth.users
       FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

2. **Role Trigger Upgrades (Upgrade to Seller):**
   Run an automatic database trigger when a submission is created: if the associated profile's role is `'user'`, it automatically upgrades to `'seller'`.
   ```sql
   CREATE OR REPLACE FUNCTION public.handle_submission_inserted()
   RETURNS TRIGGER AS $$
   BEGIN
       IF NEW.user_id IS NOT NULL THEN
           UPDATE public.profiles
           SET role = 'seller'::public.user_role
           WHERE id = NEW.user_id AND role = 'user'::public.user_role;
       END IF;
       
       -- Insert initial status history record
       INSERT INTO public.submission_history (submission_id, changed_by, old_status, new_status, notes)
       VALUES (NEW.id, NEW.user_id, 'quote_requested'::public.submission_status, 'quote_requested'::public.submission_status, 'Submission initial creation');
       
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_submission_inserted
       AFTER INSERT ON public.submissions
       FOR EACH ROW EXECUTE FUNCTION public.handle_submission_inserted();
   ```

3. **Log Status Changes to Submission History:**
   ```sql
   CREATE OR REPLACE FUNCTION public.log_submission_status_change()
   RETURNS TRIGGER AS $$
   BEGIN
       IF OLD.status IS DISTINCT FROM NEW.status THEN
           INSERT INTO public.submission_history (submission_id, old_status, new_status)
           VALUES (NEW.id, OLD.status, NEW.status);
       END IF;
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_submission_status_changed
       AFTER UPDATE ON public.submissions
       FOR EACH ROW EXECUTE FUNCTION public.log_submission_status_change();
   ```

4. **Auto-update `updated_at` Column Trigger:**
   Generically update the `updated_at` timestamps on write for target tables.
   ```sql
   CREATE OR REPLACE FUNCTION public.update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
       NEW.updated_at = NOW();
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   -- Triggers
   CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
   CREATE TRIGGER set_profile_payout_details_updated_at BEFORE UPDATE ON public.profile_payout_details FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
   CREATE TRIGGER set_stamp_categories_updated_at BEFORE UPDATE ON public.stamp_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
   CREATE TRIGGER set_submissions_updated_at BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
   ```

---

## 3. 📂 Storage Bucket configuration

Create a private storage bucket named `submissions` with the following security policies:
- **`INSERT`**: Allowed for authenticated users if upload destination matches their UID: `{auth.uid()}/...`
- **`SELECT`**: Allowed if `auth.uid() = user_id` of the submission OR if the user's role is `'admin'`.

---

## 4. 🔒 Row Level Security (RLS) Policies

Enable RLS on all tables and apply these policies:

*   **`profiles`**: 
    *   `SELECT`/`UPDATE`: Allowed for the resource owner (`auth.uid() = id`).
    *   Admins have full access.
*   **`profile_payout_details`**: 
    *   `SELECT`/`INSERT`/`UPDATE`: Allowed only for the resource owner (`auth.uid() = id`).
    *   Admins have full access.
*   **`submissions`**:
    *   `SELECT`: Allowed if `auth.uid() = user_id` OR if the customer's profile email matches the guest email: `guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid())`.
    *   `UPDATE`: Allowed if `auth.uid() = user_id` (typically only status transitions/cancellation or tracking info details).
    *   `INSERT`: Allowed for everyone (authenticated users or guest sessions).
    *   Admins have full access.
*   **`submission_items`**:
    *   `SELECT`: Inherited access check. Allowed if the parent submission is owned by the user or matches their profile email:
      ```sql
      EXISTS (
          SELECT 1 FROM public.submissions 
          WHERE id = submission_items.submission_id 
            AND (user_id = auth.uid() OR guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
      )
      ```
    *   `INSERT`: Guarded insert. Only allow insertion of items for parent submissions that the creator has control over:
      *   *For authenticated users:* `EXISTS (SELECT 1 FROM public.submissions WHERE id = submission_id AND user_id = auth.uid())`
      *   *For guests:* `EXISTS (SELECT 1 FROM public.submissions WHERE id = submission_id AND user_id IS NULL)`
      *   *For admins:* `EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')`
    *   `UPDATE`/`DELETE`: Restricted to Admins.
*   **`submission_images`**:
    *   `SELECT`: Inherited access check. Allowed if parent submission is owned or matches profile email:
      ```sql
      EXISTS (
          SELECT 1 FROM public.submissions 
          WHERE id = submission_images.submission_id 
            AND (user_id = auth.uid() OR guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
      )
      ```
    *   `INSERT`: Guarded insert.
      *   *For authenticated users:* `EXISTS (SELECT 1 FROM public.submissions WHERE id = submission_id AND user_id = auth.uid())`
      *   *For guests:* `EXISTS (SELECT 1 FROM public.submissions WHERE id = submission_id AND user_id IS NULL)`
      *   *For admins:* `EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')`
    *   `UPDATE`/`DELETE`: Restricted to Admins.
*   **`stamp_categories`**:
    *   `SELECT`: Read allowed for everyone (public access).
    *   `INSERT`/`UPDATE`/`DELETE`: Restricted to Admins.
*   **`payouts` / History Tables**:
    *   `SELECT`: Allowed for resource owner (linked via `submissions.user_id = auth.uid()`) or admins.
    *   `INSERT`: Restricted to Admins.

---

## 🚧 Deferred & Follow-up Items (Later Phases)

1. **Guest Submissions WAF / Gateway Rate Limiting:**
   Since open guest inserts on `submissions` present a potential spam vector, rate limiting must be configured at the application gateway level (e.g. Next.js edge middleware or Cloudflare Turnstile verification endpoints) prior to making the Supabase database write call.

---

## 🧪 Verification & Testing Plan

### Automated / SQL Schema Validation
*   Verify all tables exist with `\d` or by querying information_schema.
*   Confirm index creation:
    ```sql
    SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = 'public';
    ```

### Trigger Verification
- [ ] **Trigger: Profile Creation**: Create a mock auth user (via Supabase Auth) and verify that a matching row in `public.profiles` is immediately spawned.
- [ ] **Trigger: Role Auto-Upgrade**: Log in as a user with role `user`. Create a mock submission. Verify that the user's role in `profiles` automatically upgrades to `seller`.
- [ ] **Trigger: Submission History Logging**: Create a submission, then update its status to `in_transit`. Verify that a matching entry is added to `submission_history` capturing the old and new statuses.
- [ ] **Trigger: Auto-Update `updated_at`**: Perform an update on a row in `profiles`, `stamp_categories`, or `profile_payout_details`, and confirm `updated_at` matches the latest transaction time.

### RLS Verification
- [ ] **Test: Anonymous Submission Creation**: Confirm that an unauthenticated client can successfully insert a record into `submissions` and add associated `submission_items` and `submission_images`.
- [ ] **Test: Item/Image Insertion Isolation**: Confirm that an anonymous client or logged-in user CANNOT insert items or images that link to another user's private `submission_id`.
- [ ] **Test: Payout Security Isolation**: Verify that a user with role `seller` can SELECT their own payouts, but CANNOT see other users' payouts. Confirm that `payouts` cannot be read by anonymous users.
- [ ] **Test: Payout Details Access**: Verify that a user can SELECT and UPDATE their own record in `profile_payout_details` but cannot see any other user's record. Confirm that this data does not leak into public queries on `profiles`.
- [ ] **Test: Admin Escalation Rules**: Verify that only users with `role = 'admin'` can INSERT, UPDATE, or DELETE categories, or SELECT logs from `stamp_category_history`, `admin_audit_logs`, and `user_login_history`.
