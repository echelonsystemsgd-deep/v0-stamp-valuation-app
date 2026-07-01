# Implementation Plan - Phase 4: Client Dashboard Layout & Enhancements

This document outlines the detailed implementation plan for creating the secure seller-facing dashboard, displaying submission lists and status timelines, accepting quotes, updating shipping details, and configuring payout bank information. It incorporates Realtime updates, communication threads, printable receipts, and strict validations.

---

## 1. 🎨 Visual Identity & Branding (Seller Dashboard)

To ensure the client dashboard feels premium and matches the main site branding:
*   **Background**: `Parchment Off-White` (`#FBFBF9`) for the page body to give a trusted, editorial texture.
*   **Sidebar & Header**: Dark backgrounds in `Midnight Navy` (`#0B1D2E`) with gold border accents.
*   **CTAs & Actions**: Primary action buttons (like "Accept Quote", "Save Settings") in `Heritage Green` (`#14452F`).
*   **Badges**: Status-colored labels using `Warm Gold` (`#C5A059`) for in-review/quote-given states and `Heritage Green` (`#14452F`) for approved/paid states.
*   **Typography**: Serif titles in `Playfair Display` and UI controls/body copy in `Inter`.

---

## 📂 Directory & Page Routing Structure

We will implement the following routes for the client dashboard:
```
app/
└── dashboard/                       # Secure client-facing space
    ├── layout.tsx                   # Seller dashboard navigation layout (Sidebar, Mobile Header)
    ├── page.tsx                     # Overview page (submissions, stats, empty states, SLA banner)
    ├── submissions/
    │   ├── [id]/
    │   │   ├── page.tsx             # Details, timeline stepper, chat, audited items, tracking
    │   │   └── receipt/
    │   │       └── page.tsx         # Print-optimized HTML layout for native browser "Save as PDF"
    │   └── page.tsx                 # Redirects to /dashboard or lists valuations (if needed)
    └── settings/
        └── page.tsx                 # Bank payout details (with UK masking/validation)
```

> [!IMPORTANT]
> **Admin-Side Reply Path Dependency**: 
> A corresponding chat component must be integrated into the Admin Submissions Detail view (under Phase 5) to allow admins to reply to user inquiries. This is a critical end-to-end requirement.

---

## 🛠️ Implementation Steps

### Step 1: Database Migration (Messages Table & Realtime)

1. **Create Messages Table (`submission_messages`)**:
   Create a table to store lightweight messages between the seller and the admin.
   ```sql
   CREATE TABLE public.submission_messages (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
       sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
       message TEXT NOT NULL,
       is_read_by_admin BOOLEAN DEFAULT FALSE NOT NULL,
       is_read_by_seller BOOLEAN DEFAULT TRUE NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
   );
   ```
2. **Enable Row Level Security (RLS)**:
   *   **Select Policy**: Sellers can read messages for submissions they own. Admins can read all.
       ```sql
       CREATE POLICY "Sellers can view own submission messages" ON public.submission_messages
       FOR SELECT USING (
           EXISTS (
               SELECT 1 FROM public.submissions s 
               WHERE s.id = submission_messages.submission_id 
               AND (s.user_id = auth.uid() OR s.guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
           )
           OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
       );
       ```
   *   **Insert Policy**: Sellers can insert messages for submissions they own. Admins can insert messages for any.
       ```sql
       CREATE POLICY "Sellers can insert own submission messages" ON public.submission_messages
       FOR INSERT WITH CHECK (
           EXISTS (
               SELECT 1 FROM public.submissions s 
               WHERE s.id = submission_messages.submission_id 
               AND s.user_id = auth.uid()
           )
           OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
       );
       ```
3. **Enable Supabase Realtime**:
   Add the `submissions` and `submission_messages` tables to the `supabase_realtime` publication:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
   ALTER PUBLICATION supabase_realtime ADD TABLE public.submission_messages;
   ```

---

### Step 2: Dashboard Navigation Layout (`/dashboard/layout.tsx`)

1. Verify layout wrapper contains a responsive sidebar (desktop side-nav, mobile drawer).
2. Navigation links: **My Valuations** (`/dashboard`), **Payout Settings** (`/dashboard/settings`), and **Log Out** button. (Ensure active states are highlighted using `#14452F`).

---

### Step 3: Submissions List Overview (`/dashboard/page.tsx`)

1. **Stats Display**:
   *   Display metrics cards: "Total Appraisals", "Awaiting Action/Quotes", "Paid Out".
2. **Global Turnaround SLA Banner**:
   *   Add a prominent, high-trust notice banner: *"Our specialists are reviewing submissions. Turnaround SLA: Quotes in 24 hours | Valuations & physical audits within 2-3 business days of receipt."*
3. **Submission List & Empty States**:
   *   If `submissionCount === 0`, render a beautiful empty state card with gold borders (`#C5A059`) explaining the appraisal process step-by-step and showcasing a prominent Call-to-Action to **"Request a New Appraisal"** (`/sell-your-stamps`).
   *   If submissions exist, display a responsive layout (table on desktop, elegant card list on mobile) showing:
       *   Valuation ID (shortened e.g. `VAL-df83`)
       *   Submission Date
       *   Estimated Valuation
       *   Current Status (premium styled badge)
       *   Clickable row linking to details page.
4. **Realtime Updates**:
   *   Integrate a realtime subscription to update status badges/estimates dynamically when changed by the admin.

---

### Step 4: Submission Details & Timelines (`/dashboard/submissions/[id]/page.tsx`)

1. **Submission Fetch**:
   *   Retrieve the details, stamp items list, and uploads.
2. **Timeline Stepper vs. Status Banner (End-states)**:
   *   **Standard Stepper**: Render progress nodes: `Quote Requested` ➔ `Quote Given` ➔ `Awaiting Shipment` ➔ `In Transit` ➔ `Received` ➔ `Under Review` ➔ `Approved` ➔ `Paid`.
   *   **Special End States**: If status is `rejected` or `cancelled`, **do not display the stepper**. Instead, render a clean, high-contrast status banner (e.g. red/gray alert box) detailing the reason for rejection/cancellation (`rejection_reason` or `cancellation_reason`) and contact details.
3. **Contextual SLA Copy**:
   *   Render specific SLA notifications directly under the timeline:
       *   *Status: `quote_requested`* ➔ "Specialists typically review and issue quotes within 24 hours."
       *   *Status: `under_review`* ➔ "Physical auditing and verification typically take 2-3 business days."
4. **Conditional Action Cards**:
   *   **Status: `quote_given`**:
       *   Display administrative estimated valuation.
       *   Provide "Accept Quote" CTA. Updates status to `awaiting_shipment`.
   *   **Status: `awaiting_shipment`**:
       *   Show packaging instructions and physical shipping address.
       *   Render form for **Carrier Name** and **Tracking Reference** (UK shipping options).
       *   Submitting updates status to `in_transit`.
   *   **Status: `in_transit` / `received` / `under_review`**:
       *   Show Carrier and Tracking ID. If a carrier tracking URL pattern is matched, render the tracking reference as an external clickable link.
   *   **Status: `approved` / `paid`**:
       *   Show final audited valuation and payout receipts.
       *   Show a button to **"Download Summary Receipt"** (redirects to `/receipt` print sub-route).
5. **Itemized Audit Breakdown (Submitted vs. Reviewed)**:
   *   Render a table listing each category, quantity, rate, and calculated value.
   *   If the submission is in an audited state (`approved`/`paid`) and `reviewed_quantity` is different from original `quantity`, display both side-by-side with clear highlights (original struck out in gray, reviewed highlighted in a soft green/gold background) for transparent review.
6. **Lightweight Chat Board**:
   *   Embed a "Valuation Discussion" widget on the details page.
   *   Render message logs sorted chronologically.
   *   Connect to Supabase Realtime channel for `submission_messages` to stream updates live.

---

### Step 5: Printable Receipt Layout (`/dashboard/submissions/[id]/receipt/page.tsx`)

1. **Route Structure**: A clean layout containing only the receipt invoice.
2. **Styles**:
   *   Apply print-optimized Tailwind/CSS classes (`@media print` / `print:hidden`).
   *   Hide dashboard sidebars, header navigation, and input forms.
   *   Show high-end branding, transaction meta-data (ID, date paid, payout method, reference number), and itemized stamp tables.
3. **Behavior**:
   *   Execute `window.print()` inside a client-side `useEffect` on page load.
   *   Provide a fallback "Print this Page" button.

---

### Step 6: Bank Payout Settings (`/dashboard/settings/page.tsx`)

1. **Input Fields**: Bank Name, Account Holder Name, Sort Code, Account Number.
2. **UK Formatting & Validation**:
   *   **Sort Code**: Validate as 6 digits. Auto-format input with hyphens (e.g. `12-34-56`).
   *   **Account Number**: Validate as exactly 8 digits.
3. **Security Masking**:
   *   On page load, fetch details from `profiles.payout_details`.
   *   Mask values (e.g., Sort Code shown as `**-**-56`, Account Number shown as `******78`).
   *   Only reveal or overwrite details when the user explicitly clicks "Edit details" and starts typing.
4. **Data Sync**: Save to profiles `payout_details` JSONB.

---

## 🧪 Verification & Testing Plan

*   **Submissions Overview & Empty States**:
    *   Test user with zero valuations: Verify the step-by-step instructions and "Request Appraisal" CTA render.
    *   Test user with valuations: Verify submission cards show correct shortened IDs and status badges.
*   **Realtime Status Transitions**:
    *   Change a submission's status in the database (or admin panel). Confirm the details page transitions stepper automatically without manual page refresh.
*   **Realtime Message Board**:
    *   Send a message from the seller dashboard; verify it is inserted with the user's ID.
    *   Simulate an admin reply in database; verify it streams live onto the chat feed instantly.
*   **Itemized Audit Verification**:
    *   Compare a normal submission breakdown with an audited submission. Ensure reviewed quantities/values display side-by-side with original values.
*   **Print-Native PDF Save**:
    *   Navigate to receipt sub-route. Confirm browser print dialog triggers immediately. Ensure header navigation is hidden on the print preview.
*   **UK Bank Details Masking & Validation**:
    *   Validate Sort Codes (e.g. Reject `123-456`, accept `123456` or `12-34-56`).
    *   Validate Account Numbers (Reject `<8` or `>8` digits).
    *   Confirm saved bank info loads masked on refresh.

---

## 📝 Phase 4 Checklist

### 1. Database & Security Setup
- [x] Database migration: Create `submission_messages` table.
- [x] Database migration: Add RLS policies for `submission_messages` (select/insert).
- [x] Database migration: Add `submissions` and `submission_messages` to `supabase_realtime` publication.

### 2. Dashboard Shell & Layout
- [x] Secure layout component with authenticated user check.
- [x] Sidebar navigation links styling and mobile responsive drawer logic.

### 3. Dashboard Overview Page
- [x] Submissions summary metric cards.
- [x] Global turnaround time SLA banner.
- [x] Empty state UI illustration and CTA button.
- [x] Submissions list display (desktop table / mobile cards).
- [x] Supabase Realtime listener to update submission statuses live.

### 4. Submission Details Page
- [x] Route handler and database fetch for individual submission details.
- [x] Visual timeline stepper with active state highlights.
- [x] Distinct status alert banners replacing the stepper for `rejected` or `cancelled` end-states.
- [x] Contextual turnaround time SLAs next to active timeline states.
- [x] Conditional Action Card: "Accept Quote" for `quote_given` status.
- [x] Conditional Action Card: Carrier and Tracking entry form for `awaiting_shipment`.
- [x] Clickable external courier tracking links for active transit statuses.
- [x] Audit breakdown table showing side-by-side original and reviewed items.

### 5. Chat Communication Thread
- [x] Message history component in details view.
- [x] Form submission handler for new message entry.
- [x] Realtime channel listener streaming new messages in.

### 6. Printable Receipt
- [x] `/dashboard/submissions/[id]/receipt` route.
- [x] Print media CSS overrides and high-quality receipt invoice structure.
- [x] Client component trigger calling `window.print()` on mount.

### 7. Payout Settings Page
- [x] Payout settings form in `/dashboard/settings`.
- [x] Strict UK Sort Code format filter and 8-digit Account Number regex validation.
- [x] Masking utility to obfuscate bank numbers on fetch.
- [x] Secure profile update sync (upsert to `profile_payout_details` table).
