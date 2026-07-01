# Implementation Plan - Phase 5: Admin Management Panel

This document outlines the detailed implementation plan for developing the secure administrative dashboard. It includes submission filters, the physical appraisal editor workspace, payment logging, category rate controls, seller management audits, and the admin-side chat interface.

---

## 1. 🎨 Visual Identity & Branding (Admin Portal)

To preserve visual consistency across the admin workspace:
*   **Colors**: Primary headers and sidebar sections are in `Midnight Navy` (`#0B1D2E`). Data elements use `Parchment Off-White` (`#FBFBF9`) tables with `Soft Smoke Grey` (`#E8EBE9`) borders.
*   **Interactive Elements**: Audit controls and calculators use responsive hover actions with `Warm Gold` (`#C5A059`) highlights and green checkboxes.
*   **Typography**: Serif titles in `Playfair Display` and clean tabular numbers/labels in `Inter`.
*   **Charts**: Analytics charts built with `recharts` customized with theme colors (`Midnight Navy` lines, `Warm Gold` fills, `Heritage Green` bars).

---

## 2. 📂 Directory & Page Routing Structure

We will implement the following admin routes:
```
app/
└── admin/                           # Secure admin space
    ├── layout.tsx                   # Admin sidebar layout (Submissions, Rates, Sellers, Reports)
    ├── page.tsx                     # Admin overview (Metrics, pending counts, charts)
    ├── submissions/
    │   ├── page.tsx                 # Submissions list (Status filters, search, pagination)
    │   └── [id]/page.tsx            # Appraisal workspace (Verify items, adjust amounts, log payouts, chat)
    ├── categories/
    │   └── page.tsx                 # Stamp rates manager (CRUD, edit rates, pause category)
    ├── sellers/
    │   └── page.tsx                 # Seller directory (Bans, status check, transaction logs)
    └── reports/
        └── page.tsx                 # Valuation graphs, payout metrics, volume charts
```

> [!NOTE]
> **Cross-Phase Dependency**:
> This phase relies on the `public.submission_messages` table and Supabase Realtime publication configured in Phase 4.

---

## 3. 🛠️ Implementation Steps

### Step 1: Admin Layout & Home Dashboard (`/admin/page.tsx`)
1. Create `/admin/layout.tsx` containing the admin navigation sidebar.
2. Build `/admin/page.tsx` home displaying key summary metrics cards:
   *   Total Valuation Requests (Pending Review)
   *   Total Payout Volume
   *   Average Appraisal Value
3. Integrate `recharts` to render a visual overview of monthly submissions and payout distributions.

### Step 2: Submissions Directory (`/admin/submissions/page.tsx`)
1. Render a search bar for name, email, or tracking reference.
2. Add filters for status (e.g. `quote_requested`, `under_review`, `approved`, `paid`).
3. Implement tabular layout with page pagination to manage large volume loads.

### Step 3: Appraisal Workspace & Seller Chat (`/admin/submissions/[id]/page.tsx`)
1. **Photo Appraisal Panel**: Render uploaded submission images in a side-by-side or carousel view.
2. **Item Count Adjuster Table**:
   *   Render the list of categories in the submission.
   *   Allow admins to modify the physical audited quantity in real-time.
   *   Instantly calculate totals using client-side reactivity, relying on the locked rates (`rate_at_submission`) from `submission_items`.
3. **Status Transitions**: Buttons to trigger state updates (e.g. "Approve Valuation", "Reject Submission").
4. **Log Payment Modal**:
   *   Triggers when marked as `paid`.
   *   Fields: Payment Method (`bank_transfer`/`cheque`), Reference Number (Transaction ID / Cheque #), Amount.
   *   Saves the details to the `payouts` table.
5. **Lightweight Seller Messaging Board (Phase 4 Dependency)**:
   *   Embed the admin-side messaging widget in the workspace sidebar or detail panel.
   *   Show chronological message logs between the seller and admins.
   *   Implement an input text area with a "Send Reply" button. Saving a message inserts a row in `submission_messages` with `sender_id = auth.uid()` (admin's profile ID) and resets `is_read_by_seller` to `false`.
   *   Utilize Supabase Realtime to stream incoming messages from the seller instantly.
   *   Provide an automatic trigger to mark incoming messages as read by admin (`is_read_by_admin = true`) when the workspace page is open.

### Step 4: Category Rates Manager (`/admin/categories/page.tsx`)
1. List all active stamp category entries.
2. Allow CRUD operations on buying rates:
   *   Clicking a row opens a drawer/modal to edit the `rate` (e.g., changing from `0.55` to `0.58`).
   *   Write the historical change details to `rate_changes_history` for auditing.
   *   Include a toggler to pause a category (sets `is_active` to `false` and records `paused_reason`).

### Step 5: Seller & Account Directory (`/admin/sellers/page.tsx`)
1. Display a searchable list of registered profiles.
2. Option to restrict or ban user accounts (sets `status` in `profiles` to `restricted`/`banned`).
3. Display audit logs showing activities linked to specific users.

---

## 🧪 Verification & Testing Plan

*   **Access Verification**: Log in as a non-admin and attempt to load `/admin`. Ensure middleware intercepts and redirects.
*   **Appraisal Quantity Adjustment**: In the workspace, edit the audited quantity of an item. Verify that total calculations update instantly and accurately.
*   **Log Payment Flow**: Complete an appraisal, trigger the "Log Payment" modal, input a transaction code, and click submit. Verify the submission status changes to `paid` and a record is created in the `payouts` table.
*   **Realtime Seller Communication Thread**:
    *   Open both the seller submission details page and the admin appraisal workspace side-by-side.
    *   Send a message from the seller side; verify it appears in the admin workspace live without page refresh.
    *   Send a reply from the admin side; verify it appears on the seller's dashboard live and updates `is_read_by_seller` and `is_read_by_admin` statuses correctly.
*   **Rates Auditor Check**: Edit a stamp buy-back rate in `/admin/categories` and verify that a new entry appears in the `rate_changes_history` table detailing the old rate, new rate, and the changing admin's user ID.
