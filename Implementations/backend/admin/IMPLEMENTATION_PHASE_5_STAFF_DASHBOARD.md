# Implementation Plan - Staff Appraiser Dashboard & Workstation

This document outlines the changes to create a unique, tailored workspace for staff appraisers (role: `'staff'`) to inspect stamp collections, manage assignments, and track their personal audit history.

---

## 🛠️ Operational Workflow & Layout Design

### 1. Appraiser Overview Dashboard (Overview Route Refactor)
If the logged-in user is `staff`, the home page at `/admin` will render a custom **Appraiser Workbench** instead of the admin dashboard:
* **Appraiser Header Banner:** A personalized greeting: *"Welcome to the Appraiser Workbench, {name}. Ready for today's audits?"*.
* **My Metrics Dashboard:**
  * *Parcels Appraised Today:* Number of submissions audited and approved by this appraiser today.
  * *Active Assigned Parcels:* Count of submissions currently checked out to their desk.
* **Unassigned Arrival Queue:** A table of submissions that have arrived (`status = 'received'`) but do not have an appraiser assigned. Appraisers can click **"Claim Parcel"** to assign it to their workstation.
* **My Workstation Queue:** A list of submissions currently assigned to them. Appraisers can click **"Begin Inspection"** to launch the workstation sheet.

### 2. Submission Assignment Schema
To support checking out packages:
* Add `assigned_appraiser_id UUID REFERENCES public.profiles(id)` to `public.submissions`.
* Enable appraiser assignment transitions inside detailed view.

### 3. Workstation Detailed Page Enforcement
In `/admin/submissions/[id]/page.tsx`:
* **Assignment Bar:**
  * If unassigned, display a yellow banner: *"This parcel is currently unassigned."* with a **"Claim & Start Audit"** button.
  * If assigned to the current staff member, show a green banner: *"Assigned to your workbench."*
  * If assigned to another appraiser, show a red locked banner: *"This parcel is assigned to {appraiser_name}."* and disable editing of quantities.
* **Log Payout Restriction:** Ensure the payout modal is completely inaccessible to staff users, hiding the "Log Payout" button.

---

## 📂 Proposed File Changes

### 1. Database Migrations
* **Migration File:** [20260701090000_add_assigned_appraiser.sql](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/supabase/migrations/20260701090000_add_assigned_appraiser.sql)
  * Add `assigned_appraiser_id` column to `public.submissions`.
  * Update RLS policies to allow staff to update submissions where `assigned_appraiser_id` matches their user ID, or is null.

### 2. Interface Types
* **Modify Types:** Update `Submission` interface in `app/admin/submissions/[id]/page.tsx` and common helpers to include `assigned_appraiser_id` and joined `assigned_profile:profiles(full_name)`.

### 3. Appraiser Home View
* **Modify `/admin/page.tsx`:** Refactor the page to detect `profile.role === 'staff'` and render the tailored **Appraiser Workbench** component.

### 4. Detailed Workspace Claims
* **Modify `/admin/submissions/[id]/page.tsx`:** Add the Claim/Reassign banner controls. Disable quantities audit form elements if checked out to another appraiser.

---

## 🧪 Verification Plan

### Automated Tests
* Run `npm run build` to verify Next.js bundle compiles without TypeScript errors.

### Manual Verification
* Log in as staff and verify `/admin` redirects to the custom Appraiser Workbench instead of Admin Console.
* Click "Claim Parcel" on an unassigned submission and verify it updates `assigned_appraiser_id` in Supabase.
* Verify "Log Payout" button is hidden for staff, and attempting to edit another appraiser's checked-out parcel is blocked.
