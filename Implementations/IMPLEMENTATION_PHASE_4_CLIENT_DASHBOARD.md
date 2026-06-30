# Implementation Plan - Phase 4: Client Dashboard Layout

This document outlines the detailed implementation plan for creating the secure seller-facing dashboard, displaying submission lists and status timelines, accepting quotes, updating shipping details, and configuring payout bank information.

---

## 1. 🎨 Visual Identity & Branding (Seller Dashboard)

To ensure the client dashboard feels premium and matches the main site branding:
*   **Background**: `Parchment Off-White` (`#FBFBF9`) for the page body to give a trusted, editorial texture.
*   **Sidebar & Header**: Dark backgrounds in `Midnight Navy` (`#0B1D2E`) with gold border accents.
*   **CTAs & Actions**: Primary action buttons (like "Accept Quote", "Save Settings") in `Heritage Green` (`#14452F`).
*   **Badges**: Status-colored labels using `Warm Gold` (`#C5A059`) for in-review states and `Heritage Green` (`#14452F`) for approved/paid states.
*   **Typography**: Serif titles in `Playfair Display` and UI controls/body copy in `Inter`.

---

## 2. 📂 Directory & Page Routing Structure

We will implement the following routes for the client dashboard:
```
app/
└── dashboard/                       # Secure client-facing space
    ├── layout.tsx                   # Seller dashboard navigation layout (Sidebar, Mobile Header)
    ├── page.tsx                     # Overview page listing seller submissions & stats
    ├── submissions/
    │   └── [id]/page.tsx            # Submission details, status timeline, and action forms
    └── settings/page.tsx            # Bank payout details and account configuration
```

---

## 3. 🛠️ Implementation Steps

### Step 1: Dashboard Layout (`/dashboard/layout.tsx`)
1. Create a dashboard layout wrapper containing a responsive sidebar (desktop side-nav, mobile drawer).
2. Navigation links: **My Valuations** (`/dashboard`), **Payout Settings** (`/dashboard/settings`), and **Log Out** button (which calls the `/logout` endpoint).

### Step 2: Submissions List Overview (`/dashboard/page.tsx`)
1. Fetch all submissions matching `auth.uid() = user_id`.
2. Display metrics cards: "Total Appraisals", "Awaiting Quotes", "Paid Out".
3. Render a clean table or card list showing:
   *   Valuation ID
   *   Submission Date
   *   Estimated Valuation
   *   Current Status (with premium styled badge)
   *   Clickable row to view details.

### Step 3: Submission Details & Timeline (`/dashboard/submissions/[id]/page.tsx`)
1. Fetch specific submission details including items and image uploads.
2. Render a step-by-step progress timeline:
   *   `Quote Requested` ➔ `Quote Given` ➔ `Awaiting Shipment` ➔ `In Transit` ➔ `Received` ➔ `Under Review` ➔ `Approved` ➔ `Paid`
3. Implement conditional action cards based on status:
   *   **Status: `quote_given`**:
       *   Display administrative estimated valuation.
       *   Provide "Accept Quote" CTA. Clicking it updates status to `awaiting_shipment`.
   *   **Status: `awaiting_shipment`**:
       *   Show packaging and shipping address instructions.
       *   Render a form to enter **Carrier Name** and **Tracking Reference**. Submitting updates status to `in_transit` and records details.
   *   **Status: `approved` / `paid`**:
       *   Show final audited valuation and payment receipts/references if available.

### Step 4: Bank Payout Settings (`/dashboard/settings/page.tsx`)
1. Implement a form to capture **Bank Name**, **Account Holder Name**, **Sort Code**, and **Account Number**.
2. Mask values on load (e.g. Sort Code: `**-**-12`, Account Number: `****3456`) to prevent screen-scraping of sensitive details.
3. Save data securely into `profiles.payout_details` JSONB field in the database.

---

## 🧪 Verification & Testing Plan

*   **Submissions Render Test**: Log in as a user with existing valuations, navigate to `/dashboard`, and verify the overview lists all submissions with correct status badges.
*   **Accept Quote Flow**:
    1. Simulate an admin quote given (`quote_given`).
    2. Log in as client, click "Accept Quote", and verify status updates to `awaiting_shipment`.
*   **Add Tracking Reference**:
    1. Enter "Royal Mail" and a mock tracking number in the shipping card.
    2. Submit and confirm the status transitions to `in_transit` and values are stored in the database.
*   **Bank Masking Security Test**:
    1. Enter and save valid bank details.
    2. Refresh the page and confirm the input values are masked on load. Verify editing is still possible.
