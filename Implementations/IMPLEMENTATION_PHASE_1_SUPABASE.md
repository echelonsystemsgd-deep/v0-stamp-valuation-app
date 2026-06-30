# Implementation Plan - Phase 1: Supabase Setup & RLS Configuration

This document outlines the detailed plan for provisioning the PostgreSQL database schema in Supabase, establishing triggers/functions, creating storage buckets, and configuring Row Level Security (RLS) policies.

---

## 1. 🧠 Database Schema (Supabase PostgreSQL)

The database schema will include tables for profiles, stamp categories, submissions, calculation breakdowns, image storage paths, payout details, and audit/history tables.

### Types & Enums
```sql
CREATE TYPE user_role AS ENUM ('user', 'seller', 'admin');
CREATE TYPE account_status AS ENUM ('active', 'restricted', 'banned');
CREATE TYPE submission_status AS ENUM (
    'quote_requested', 'quote_given', 'awaiting_shipment', 
    'in_transit', 'received', 'under_review', 
    'approved', 'paid', 'rejected', 'cancelled'
);
CREATE TYPE payout_method_type AS ENUM ('bank_transfer', 'cheque');
```

### Table 1: `profiles` (Linked to Supabase Auth)
Stores user roles, account state, and secure payout details.
```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    postcode TEXT,
    role user_role DEFAULT 'user'::user_role NOT NULL,
    status account_status DEFAULT 'active'::account_status NOT NULL,
    ban_reason TEXT,
    payout_details JSONB DEFAULT '{}'::jsonb, -- Securely stores bank info (Sort Code, Account Number, Account Name)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### Table 2: `stamp_categories` (Stamp Rates Catalog)
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

### Table 3: `submissions` (Valuation Requests)
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
    status submission_status DEFAULT 'quote_requested'::submission_status NOT NULL,
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

### Table 4: `submission_items` (Calculation Breakdown Snapshot)
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

### Table 5: `submission_images` (File Upload Details)
```sql
CREATE TABLE public.submission_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Storage path in Supabase bucket
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### Table 6: `payouts` (Manual Payment Logs)
```sql
CREATE TABLE public.payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID UNIQUE REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    method payout_method_type NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    reference_number TEXT NOT NULL, -- Bank reference or cheque number
    issued_by UUID REFERENCES public.profiles(id) NOT NULL, -- Admin user ID
    recipient_name TEXT NOT NULL,
    recipient_details JSONB DEFAULT '{}'::jsonb NOT NULL, -- Masked account/sort codes or cheque address
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### Audit Log & History Tables
```sql
-- Category rate modification logging
CREATE TABLE public.rate_changes_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT REFERENCES public.stamp_categories(id) ON DELETE CASCADE NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) NOT NULL,
    old_rate NUMERIC(4, 3) NOT NULL,
    new_rate NUMERIC(4, 3) NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Submission status lifecycle changes
CREATE TABLE public.submission_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    changed_by UUID REFERENCES public.profiles(id),
    old_status submission_status NOT NULL,
    new_status submission_status NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Admin critical operations
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

---

## 2. 🚦 Database Triggers & Auth Hooks

1. **Auto-Create Profile trigger:**
   Create a trigger function that automatically inserts a profile in `public.profiles` upon standard Supabase user signup.
   ```sql
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
       INSERT INTO public.profiles (id, email, role, status)
       VALUES (new.id, new.email, 'user'::user_role, 'active'::account_status);
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
   CREATE OR REPLACE FUNCTION public.handle_new_submission_role()
   RETURNS TRIGGER AS $$
   BEGIN
       IF NEW.user_id IS NOT NULL THEN
           UPDATE public.profiles
           SET role = 'seller'::user_role
           WHERE id = NEW.user_id AND role = 'user'::user_role;
       END IF;
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_submission_created
       AFTER INSERT ON public.submissions
       FOR EACH ROW EXECUTE FUNCTION public.handle_new_submission_role();
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
*   **`submissions`**:
    *   `SELECT`/`UPDATE`: Allowed if `auth.uid() = user_id`.
    *   `INSERT`: Allowed for anyone (authenticated users or guest sessions).
    *   Admins have full access.
*   **`stamp_categories`**:
    *   `SELECT`: Read allowed for everyone (public access).
    *   `INSERT`/`UPDATE`/`DELETE`: Restricted to Admins.
*   **`payouts` / History Tables**:
    *   `SELECT`: Allowed for resource owner or admins.
    *   `INSERT`: Restricted to Admins.

---

## 🧪 Verification & Testing Plan

*   **Trigger Test**: Register a new user in Supabase auth and verify a record is immediately created in `public.profiles`.
*   **Role Upgrade Test**: Submit a new valuation for the logged-in user and verify their role upgrades from `'user'` to `'seller'`.
*   **RLS Test**: Log in as a standard user and attempt to fetch another user's submissions. Confirm that the request yields empty data or access errors.
*   **Storage Access Test**: Attempt to download an image from a private bucket folder that belongs to another user's submission. Verify access is denied.
