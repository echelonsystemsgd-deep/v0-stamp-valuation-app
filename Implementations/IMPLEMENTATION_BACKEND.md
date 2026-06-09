# Backend & Dashboard Implementation Plan

## 1. 🎯 Project Context
This project is a UK-based stamp valuation and buying platform. The primary goals are:
- Allow users to submit stamp collections for valuation.
- Provide instant estimated values via a calculator.
- Enable users to request a full appraisal (via a 3-step form).
- Allow admins to review, manage, and respond to submissions.

**Note:** This is a lead-generation and valuation service. It is **NOT** a booking system or an e-commerce checkout. Users are selling to the platform, not buying. All actual transactions are handled offline.

---

## 2. ⚙️ Tech Stack
- **Frontend**: Next.js, Tailwind CSS, shadcn/ui.
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage, Edge Functions).

---

## 3. 👥 User Roles & Logic

We will implement Role-Based Access Control (RBAC) with the following roles:

- **Guest**: Not logged in. Can use the public calculator and view informational pages.
- **User**: Signed up but hasn't submitted a valuation yet. Can save calculator states and access their profile.
- **Client**: A User who has successfully submitted at least one valuation request. Unlocks the Client Dashboard.
- **Admin**: Full system access. Can manage users, submissions, categories, and settings.

### Logic Rules:
- **Upgrades**: User automatically upgrades to Client upon their first successful valuation submission.
- **Restrictions**: Admins can set user status to `Restricted` (cannot submit new valuations) or `Banned` (cannot log in).

---

## 4. 📄 Pages Required

### General User Pages
- `/signup` - User registration.
- `/login` - User and Admin authentication.
- `/logout` - Session termination.
- `/profile` - Manage personal details, password changes, and view basic account info.

### Client Pages
- `/dashboard` - Client overview.
  - View submitted valuations and their current statuses.
  - View estimated values.
- `/dashboard/submissions/[id]` - Submission Details.
  - Full breakdown of the submitted data.
  - View uploaded images.
  - Timeline of status updates.

### Admin Pages
- `/admin` - Dashboard overview (stats, recent submissions).
- `/admin/submissions` - Valuation Requests Management.
  - Table view with filters (status, date) and sorting.
- `/admin/submissions/[id]` - Detailed view to update status and add internal notes.
- `/admin/categories` - Stamp Categories & Rates Management.
  - Manage the pricing logic used in the public calculator.
  - Enable/disable specific categories.
- `/admin/users` - Users Management.
  - List all users, assign roles, restrict/ban, and view activity history.
- `/admin/reports` - Reporting & Analytics.
  - Charts/tables for submission volume, estimated values, and conversion insights.
- `/admin/settings` - General system configuration (e.g., contact emails, global notices).

---

## 5. 🧠 Core Features to Support

### As a User / Client:
- **3-Step Valuation Request**:
  1. **Collection Details**: Type, approx. quantity, era, description, known valuable items.
  2. **Photos**: Multi-image upload to Supabase Storage.
  3. **Contact Info**: Full name, email, phone, preferred contact method, postcode.
- **Calculator Integration**:
  - Pre-fill submission fields based on calculator usage.
  - Store the calculated totals and rate snapshot alongside the submission.
- **Dashboard Tracking**:
  - View status updates and history of past submissions.

### As an Admin:
- **Submission Management**:
  - View a full breakdown of each submission (categories, quantities, base prices, rates, subtotals).
  - Update statuses: `Draft` ➔ `Submitted` ➔ `Under Review` ➔ `Awaiting Info` ➔ `Valued` ➔ `Contacted` ➔ `Completed` / `Rejected`.
  - Add private internal notes.
- **Catalog/Category Management**:
  - CRUD operations for stamp categories (Name, Description, Base Price, Rate %, Availability).
- **User Management**:
  - Manage roles, ban users, and view audit logs (login history, actions taken).

---

## 6. 🧱 Database Design (Supabase PostgreSQL)

### 1. `users` (Extends `auth.users`)
- `id` (uuid, PK, references `auth.users.id`)
- `email` (text)
- `full_name` (text)
- `phone` (text)
- `postcode` (text)
- `role` (enum: 'User', 'Client', 'Admin')
- `account_status` (enum: 'Active', 'Restricted', 'Banned')
- `created_at` (timestamp)
- `last_login` (timestamp)

### 2. `stamp_categories`
- `id` (uuid, PK)
- `name` (text)
- `description` (text)
- `base_price` (numeric)
- `rate_percentage` (numeric)
- `is_active` (boolean)

### 3. `valuation_submissions`
- `id` (uuid, PK)
- `user_id` (uuid, FK to `users.id`)
- `status` (enum: Draft, Submitted, Under Review, Awaiting Info, Valued, Contacted, Completed, Rejected)
- `collection_type` (text)
- `approx_quantity` (integer)
- `estimated_era` (text)
- `description` (text)
- `known_valuable_items` (text)
- `preferred_contact_method` (text)
- `estimated_total_value` (numeric)
- `submission_step_progress` (integer) - *Tracks multi-step form drop-offs*
- `calculator_data_snapshot` (jsonb) - *Locks in the rates at the time of calculation*
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 4. `submission_items`
- `id` (uuid, PK)
- `submission_id` (uuid, FK to `valuation_submissions.id`)
- `category_id` (uuid, FK to `stamp_categories.id`)
- `quantity` (integer)
- `calculated_price` (numeric)
- `subtotal` (numeric)

### 5. `submission_status_history`
- `id` (uuid, PK)
- `submission_id` (uuid, FK to `valuation_submissions.id`)
- `old_status` (text)
- `new_status` (text)
- `changed_by` (uuid, FK to `users.id`)
- `internal_note` (text)
- `created_at` (timestamp)

### 6. `file_uploads`
- `id` (uuid, PK)
- `submission_id` (uuid, FK to `valuation_submissions.id`)
- `file_path` (text) - *Path in Supabase Storage*
- `file_size` (integer)
- `content_type` (text)
- `uploaded_at` (timestamp)

### 7. `user_activity_logs`
- `id` (uuid, PK)
- `user_id` (uuid, FK to `users.id`)
- `action` (text)
- `ip_address` (text)
- `created_at` (timestamp)

**Indexing Strategy**: 
- Index `user_id` on `valuation_submissions`.
- Index `submission_id` on `submission_items`, `submission_status_history`, and `file_uploads`.
- Index `status` on `valuation_submissions` for fast admin filtering.

---

## 7. 🖼️ Image Upload Handling

- **Storage**: Supabase Storage buckets.
- **Bucket Configuration**: `private` bucket for security. Files are only accessible via signed URLs generated by the backend for the submitting User or an Admin.
- **Constraints**:
  - Max file size: 5MB per image.
  - Accepted formats: `.jpg`, `.jpeg`, `.png`, `.heic` (if processable).
  - Max images per submission: 10.
- **Linking**: Images uploaded are logged in the `file_uploads` table, linking the Supabase storage path to the specific `submission_id`.

---

## 8. 🔐 Authentication & Permissions

- **Provider**: Supabase Auth (Email/Password & Magic Links).
- **Route Protection** (Next.js Middleware):
  - `/admin/*` routes strictly verify the `Admin` role in the JWT/Database.
  - `/dashboard/*` routes ensure the user is logged in and owns the requested data.
- **Row Level Security (RLS)** in Supabase:
  - Users can only `SELECT`, `INSERT`, `UPDATE` their own records in `valuation_submissions`.
  - Admins bypass RLS or have specific policies granting `ALL` access.
  - `stamp_categories` is readable by everyone but editable only by Admins.

---

## 9. 🎨 UI / UX Guidelines

- **Navigation**: Use separate pages with slugs (e.g., `/dashboard/submissions/123`) rather than rendering massive modals.
- **Modals**: Restricted to quick actions like "Confirm Deletion" or "Update Status".
- **Aesthetics**: High-trust design. Clean, readable serif/sans-serif typography, large text for accessibility, high contrast.
- **Components**: Rely on `shadcn/ui`.
- **Feedback**: Implement toast notifications (positioned top-left or top-right) for all CRUD operations (e.g., "Submission Saved", "Image Uploaded").

---

## 10. 📊 Additional Suggestions (Agent Recommendations)

### 💡 Suggested Missing Pages / Data
- **Admin Audit Logs**: A dedicated page for Admins to view the `user_activity_logs` for security and troubleshooting.
- **System Settings Table**: A `system_settings` table to store global configurable values (e.g., support email, maintenance mode flag).

### 🚀 Improving the Submission Flow & Reducing Drop-off
- **Auto-Save Drafts**: Save form progress to local storage or create a `Draft` status submission in the DB as soon as Step 1 is completed. If they drop off at Step 2, you still capture the lead.
- **Magic Link Guest Submissions**: Allow a user to submit without explicitly creating an account first. At the end of the form, send them a magic link to claim their auto-created account and view their dashboard.
- **Clear Progress Indicators**: A visual stepper (Step 1 of 3) so users know exactly how long the process takes.
- **Contextual Tooltips**: Add small "Why do we need this?" tooltips next to phone number and postcode fields to ease privacy concerns.

### 🤝 Increasing Trust for Older Users
- **Prominent Phone Number**: Display a customer service phone number in the header or directly on the submission form.
- **Trust Badges**: Include badges like "Secure 256-bit Encryption", "Data Protected", or "Established 19XX" near the submit button.
- **Clear Next Steps**: After submission, show a clear timeline component: "What happens next? 1. We review (24 hrs) ➔ 2. We email you an offer ➔ 3. You decide."

### 🛠️ Better Admin Workflows
- **Bulk Actions**: Allow admins to select multiple submissions and bulk-update their status (e.g., mark 5 submissions as "Completed").
- **Email Triggers**: Set up Supabase Edge Functions to automatically send an email to the client when an Admin changes their submission status to "Valued" or "Awaiting Info".
