# Implementation Plan - Phase 5: Shopify-Style Admin Panel & UX Refinements

This document outlines the detailed implementation plan for developing the administrative dashboard. It aligns the admin panel with a Shopify-style workspace UX, incorporates staff/admin role separation, sets up a private append-only notes feed, and integrates refinements for the Phase 4 seller-facing dashboard.

---

## 1. 🎨 Visual Identity & Branding (Admin Portal)

To preserve visual consistency across the admin workspace:
*   **Theme & Colors**:
    *   **Sidebar & Layout**: `Midnight Navy` (`#0B1D2E`) background with `Parchment Off-White` (`#FBFBF9`) text.
    *   **Data Lists**: `Parchment Off-White` table backgrounds with `Soft Smoke Grey` (`#E8EBE9`) borders.
    *   **Highlights & Selection**: `Warm Gold` (`#C5A059`) for active borders, focus rings, hover highlights, and tabs.
    *   **Interactive Success Indicators**: `Heritage Green` (`#14452F`) for primary CTA buttons, badges, and positive alerts.
*   **Typography**: Serif titles in `Playfair Display` and clean tabular numbers/labels in `Inter` (using `font-mono` for IDs and monetary values).
*   **Recharts Integration**: Customized with theme colors (`Midnight Navy` lines, `Warm Gold` fills, `Heritage Green` bars).

---

## 2. 📂 Directory & Page Routing Structure

We will implement the following admin routes:
```
app/
└── admin/                           # Secure admin space
    ├── layout.tsx                   # Admin sidebar layout (live counts, staff checks)
    ├── page.tsx                     # Admin overview (financial summary metrics, charts, exports)
    ├── submissions/
    │   ├── page.tsx                 # Submissions list (7 status tabs, bulk actions, CSV export)
    │   └── [id]/page.tsx            # Appraisal workspace (2-column detail: main workspace + right-rail)
    ├── categories/
    │   └── page.tsx                 # Stamp rates manager (staff can view; only admins can edit rates)
    ├── sellers/
    │   └── page.tsx                 # Seller directory (status tabs, search, bans, restriction audits)
    └── reports/
        └── page.tsx                 # Volume graphs, payouts breakdown, CSV metrics download
```

---

## 3. 🗄️ Database Schema & Security Updates

We will add a new `staff` role and implement a secure, private notes timeline.

```sql
-- 1. Add 'staff' to user_role enum (run check first to avoid duplication)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'user_role' AND e.enumlabel = 'staff') THEN
        ALTER TYPE public.user_role ADD VALUE 'staff';
    END IF;
END $$;

-- 2. Create the submission_internal_notes table (private audit-trail comments)
CREATE TABLE IF NOT EXISTS public.submission_internal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    note TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Enable RLS on notes table
ALTER TABLE public.submission_internal_notes ENABLE ROW LEVEL SECURITY;

-- 4. Create secure RLS policies (restricted to admin & staff only)
DROP POLICY IF EXISTS "Internal notes are readable by staff and admins only" ON public.submission_internal_notes;
CREATE POLICY "Internal notes are readable by staff and admins only" ON public.submission_internal_notes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff')
        )
    );

DROP POLICY IF EXISTS "Internal notes are insertable by staff and admins only" ON public.submission_internal_notes;
CREATE POLICY "Internal notes are insertable by staff and admins only" ON public.submission_internal_notes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'staff')
        )
    );

-- 5. Set up rates policy: Only admins can perform write operations on active categories
DROP POLICY IF EXISTS "Admins can update categories" ON public.stamp_categories;
CREATE POLICY "Admins can update categories" ON public.stamp_categories
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
```

---

## 4. 🎛️ Detailed UI & UX Layout Specifications

### A. Admin Sidebar Nav Layout (`/admin/layout.tsx`)
*   **Live Counts**: Display real-time notification badges next to menu labels:
    *   **Submissions Queue**: Live count of pending appraisals (`quote_requested` + `received` + `under_review`).
    *   **Sellers**: Count of registered profiles.
*   **Authorization Check**: Verify if the user's role is either `admin` or `staff`. Block standard `user` and `seller` accounts and redirect to unauthorized.

### B. Submissions Queue (`/admin/submissions/page.tsx`)
*   **Shopify-Style Tabbed Filters**: Horizontal status tabs to quickly view grouped submissions:
    1.  **All** (Full list)
    2.  **Requests** (`quote_requested`)
    3.  **Awaiting Shipment** (`awaiting_shipment`, `in_transit`)
    4.  **Appraising** (`received`, `under_review`)
    5.  **Approved** (`approved`)
    6.  **Paid** (`paid`)
    7.  **Closed** (`rejected`, `cancelled`)
*   **Bulk Actions Control Bar**: Appears dynamically at the top of the grid when rows are selected:
    *   **Mark as Received**: Transitions status of selected submissions to `received`.
    *   **Mark as Paid**: Opens payment logging drawer to apply details to multiple submissions.
    *   **Export Selected (CSV)**: Prompts a file download of all selected row records.
    *   **Print Packing Slips**: Formats and triggers native print/PDF compilation.
*   **Search**: Real-time filtering by tracking reference, seller name, or seller email.

### C. Appraisal Workspace (`/admin/submissions/[id]/page.tsx`)
A two-column detailed workstation layout split **70% Main Workspace** and **30% Right-Rail**:
*   **Main Workspace (Left, 70% width)**:
    1.  *Photo Appraisal Carousel*: Left-hand frame displaying submission image assets with smooth cursor zoom-in, rotate, and full-screen preview.
    2.  *Item Count Audit Worksheet Table*: Displays categories. Staff can adjust audited quantities. Calculated columns reactively update values (`reviewed_quantity * rate_at_submission`) client-side before submission.
    3.  *Live 2-Way Chat Widget*: Embedded messaging panel with real-time Supabase streaming. Allows appraiser to chat with the seller (automatically marks incoming messages as read by admin when active).
*   **Right-Rail Summary (Right, 30% width)**:
    1.  *Status & Valuation Summary Card*: Shows original estimate vs. audited final totals side-by-side. Displays large CTA transitions (e.g. "Approve Appraisal", "Reject Valuation") and the "Log Payout" Modal trigger.
    2.  *Seller Card*: Displays avatar, verification badge, and contact profile. Displays preferred payout info.
    3.  *Append-Only Private Notes Timeline*: Textbox allowing staff/admin to post comments (saved to `submission_internal_notes`). Renders a timeline with timestamps and staff avatar/name initials.
    4.  *Audit Timeline Logs*: Historical milestones extracted from `submission_history`.

### D. Rates Manager (`/admin/categories/page.tsx`)
*   **Role Restrictions**:
    *   `staff` can search, filter, and view stamp rates. The edit button/drawer triggers a read-only message.
    *   `admin` can edit prices/rates. Includes category toggle switches (active/paused) and automatically writes audits to `rate_changes_history`.
*   **Tabs**: Group stamp categories by `All`, `Active`, `Paused`.

### E. Seller Account Directory (`/admin/sellers/page.tsx`)
*   **Tabs**: Filter by `All`, `Active`, `Restricted`, `Banned`.
*   **Bulk Actions**: Multi-select accounts to apply "Restricted" or "Banned" status flags.
*   **Detail Panel**: Shows a transaction overview and security audit log.

### F. Reports & Analytics (`/admin/reports/page.tsx`)
*   **Visual Charts**: Recharts plotting monthly volume trends, payout methods, and valuation accuracy.
*   **Data Export**: "Export Metrics" button to compile and download valuation and payout metrics as a CSV.

---

## 📦 Seller Dashboard Enhancements (Phase 4 Co-exist)

To optimize communication and alignment alongside the Admin improvements, the Seller Dashboard (`/dashboard/submissions/[id]/page.tsx` and main index) will receive:
1.  **SLA Stepper / Progress Timeline**: A clean visual timeline on the submission detail view indicating step milestones:
    `Quote Requested` ➔ `Quote Accepted` ➔ `Package Shipped` ➔ `Inspection Underway` ➔ `Appraisal Approved` ➔ `Payment Disbursed`.
2.  **"Action Required" Alert Banner**: Prominently displayed at the top of the Seller's dashboard home page when a submission requires their consent (e.g. status: `quote_given`).
3.  **Unread Message Notification Badge**: Alerts sellers with an amber notification dot next to specific submission cards if there are new unread replies from the valuation desk.
4.  **Printable Packing Slip Layout**: Simple button to export/print a formatted layout containing shipment instructions, the tracking reference, and the estimated stamp breakdown.

---

## 🛠️ Actionable Implementation Checklist

### Step 1: Database Updates & Role Permissions
- [ ] Run migration to add `'staff'` to `public.user_role` type.
- [ ] Create `public.submission_internal_notes` table with references.
- [ ] Enable RLS on the notes table and write select/insert policies for staff and admins.
- [ ] Configure `public.stamp_categories` RLS policy to restrict updates strictly to the `admin` role.

### Step 2: Next.js Routing & Middleware Guards
- [ ] Update `middleware.ts` / `/admin/layout.tsx` to handle permission logic, routing `staff` and `admin` roles, and rejecting others to `/unauthorized`.
- [ ] Implement sidebar layout component with real-time badges (Supabase subscriber for count checks).

### Step 3: Shopify-Style Submissions Table
- [x] Create `/admin/submissions/page.tsx`.
- [x] Build horizontal status navigation tabs (7 groups).
- [x] Add checkbox row selection controls to the grid.
- [x] Build the sticky bottom Bulk Actions action bar ("Mark as Received", "Mark as Paid", "Export CSV", "Print Slips").
- [x] Add client-side CSV parsing to compile and export selected rows.

### Step 4: 2-Column Appraisal Workspace
- [x] Create `/admin/submissions/[id]/page.tsx`.
- [x] **Left Main Column**:
    - [x] Build a responsive image grid/carousel viewer with zoom/rotate canvas effects.
    - [x] Create the inline quantitative audit form table. Bind quantity controls to reactively calculate values in real-time.
    - [x] Embed the 2-way real-time chat window utilizing Supabase channel stream.
- [x] **Right-Rail Column**:
    - [x] Design the Status & Payout action card with the "Log Payout" modal.
    - [x] Assemble the Seller context metadata and billing preference block.
    - [x] Implement the append-only Private Notes feed, binding input to `submission_internal_notes` and listing notes in chronological order.
    - [x] Build the history milestones timeline.

### Step 5: Rates & Category Manager
- [x] Create `/admin/categories/page.tsx`.
- [x] Render the stamp categories directory grouped by tabs.
- [x] Restrict price adjustments to `admin` role only. Disable editing inputs and show access indicators for `staff`.

### Step 6: Seller Directory & Reports
- [x] Create `/admin/sellers/page.tsx` with ban/restriction bulk selectors.
- [x] Create `/admin/reports/page.tsx` integrating charting and CSV download buttons.

### Step 7: Seller Dashboard (Phase 4) Polish
- [x] Insert the SLA Stepper component in `/dashboard/submissions/[id]/page.tsx`.
- [x] Add the "Action Required" Banner to the main seller dashboard home view.
- [x] Add the unread messages check query and indicator dots on dashboard lists.
- [x] Construct the printer-friendly print packing slip view.

---

## 🧪 Verification & Testing Plan

*   **Role Protection**:
    *   Verify `seller` role is redirected away from `/admin`.
    *   Verify `staff` role can read rates, write notes, and process appraisals, but fails to save category rate adjustments.
    *   Verify `admin` role has unrestricted access.
*   **Appraisal Calculator**: Adjust quantites in the audit grid and verify the right-rail calculations recalculate instantly.
*   **Private Notes Security**: Log in as a seller and confirm that internal notes are completely hidden from API payloads and dashboard layouts.
*   **Two-Way Chat Stream**: Send message from admin workspace; confirm it appears instantly on the seller dashboard, and vice versa.
*   **CSV Exports**: Export Submissions and Reports records; check that columns parse correctly in spreadsheet software.

