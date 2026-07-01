# Implementation Plan - Phase 6: Pre-Launch System & Responsive Audit

This document serves as the permanent record of the Phase 6 Pre-Launch Audit. It covers the full system validation (auth, roles, routing, database) and responsive design checks across desktop, tablet, and mobile breakpoints, detailing the issues identified and the subsequent technical resolutions.

---

## 1. Audit Findings Report

### Pass 1: Full System Audit Findings
- **Auth Flows & Role-Based Routing**:
  - The middleware (`middleware.ts`) secures dashboard and administration routes. Standard users and anonymous sessions are prevented from accessing `/admin`. Redirects default to `/dashboard` for sellers and `/admin` for staff/admin roles.
  - Profile roles are evaluated server-side directly against the Database, mitigating client-side spoofing vectors.
  - The Postgres email-verification trigger links guest submissions to confirmed user profiles in the database correctly, preserving records on registration.
- **Database & Realtime Subscriptions**:
  - Submissions tables and chat messages successfully use Supabase Realtime channels (`supabase.channel()`) to listen for update events and redraw components dynamically.
  - **Issue (Strict Mode Crashes)**: React Strict Mode double-mounts caused fatal crashes where components tried to subscribe to already active realtime channel names (e.g. `Uncaught Error: cannot add postgres_changes callbacks after subscribe()`).
  - **Fix**: Appended unique mount identifiers (`Date.now()` and random suffixes) and added `isMounted` safety guards to all realtime subscribers.
- **Account Status Database Realignment**:
  - **Issue**: The admin panels tried to read `u.status` (an always-green badge) which was undefined because the database uses the `is_suspended` (boolean) column instead of `status`.
  - **Fix**: Realigned the Sellers Accounts directory and Recent Users table to render badges dynamically based on `is_suspended` and live Presence status.
- **Realtime Online/Offline Presence**:
  - **Issue**: Users were showing as offline because of different Presence channel names.
  - **Fix**: Standardized and joined the global `'online-users'` channel in `ResponsiveSidebarWrapper` (tracker), `RecentUsersTable` (listener), and `sellers/page.tsx` (listener) to synchronize active sessions.
- **Compilation Health**:
  - Code compiles without TypeScript errors, next-dev warnings, or deployment-blocking failures.

---

## 2. Full Responsive/Device Audit Findings

- **Header Phone Representation**:
  - **Issue**: The full business phone number string (`+44 (0)20 1234 5678`) was rendered directly next to the logo on narrow screens. This caused clipping, overlap, and horizontal layout overflow on viewports under `400px`.
  - **Fix**: Hidden below `sm` breakpoint (`hidden sm:inline`), leaving only the compact `PhoneCall` icon link.
- **Global Dashboard Sidebars**:
  - **Issue**: The dashboard layouts rendered a static left sidebar (`w-80` / `320px`) on all screen sizes, including mobile/tablet viewports. This crushed core page components (tables, statistics) into narrow, unreadable blocks and broke usability.
  - **Fix**: Extracted the sidebar layouts into a client-side responsive shell (`components/dashboard/responsive-sidebar-wrapper.tsx`). It hides the sidebar on mobile/tablet viewports (below `lg`) and renders a top navigation bar with a hamburger-triggered Radix `Sheet` drawer containing the menu options.
- **Admin Submissions Workstation Header**:
  - **Issue**: Workstation panels used flex rows without wrapping classes for Valuation IDs, status badges, and action buttons. Buttons overflowed off-screen on tablet and mobile.
  - **Fix**: Wrapped action buttons in flex-wrap containers and changed the outer bar to wrap dynamically (`flex-col md:flex-row`).

---

## 3. Technical Implementation Steps

### Step 1: Linter & Build Warnings Cleanup
- Configured `.eslintignore` in the project root to exclude helper utility scripts in the `scratch/` folder, removing four TS-JS require warnings and establishing clean linter outputs.

### Step 2: Compact Mobile Contact Info
- Modified the phone number label markup in `components/layout/header.tsx` to hide text on mobile screens while preserving call anchor tap triggers.

### Step 3: Responsive Sidebar Drawer Wrapper
- Created `components/dashboard/responsive-sidebar-wrapper.tsx` supporting:
  - Slide-out sheet drawer triggered by menu button.
  - Pathname-based listener hook to close the drawer automatically upon navigation.
  - Configurable `className` styling injection for standard sidebar views.
- Updated `app/admin/layout.tsx` and `app/dashboard/layout.tsx` to use the responsive shell wrapper.

### Step 4: Supabase Realtime & Presence Implementation
- Standardized all client realtime channels (`sidebar-nav.tsx`, `submissions-dashboard.tsx`, `submission-detail-client.tsx`, `page.tsx`) to prevent React Strict Mode collisions using unique mount-bound channel suffixes and `isMounted` guards.
- Implemented global Presence tracking over the `'online-users'` channel inside the sidebar wrapper.
- Extracted the Recent Users table in `app/admin/page.tsx` into a client-side component `RecentUsersTable` that updates user statuses to **Online** or **Offline** based on Presence.
- Updated `sellers/page.tsx` directory with segmented filters (All, Online, Offline, Suspended) and presence-tracking logic.

---

## 4. Verification & Testing Checklist

- [x] **Lint & Build Validation**
  - Run `npm run lint` and confirm no compile-blocking code quality errors.
  - Run `npm run build` to confirm output compilation success.
- [x] **Header Navigation Checks**
  - Verify header does not trigger horizontal scrollbars on viewports down to `320px`.
  - Verify phone icon remains clickable on mobile.
- [x] **Dashboard Navigation Checks**
  - Verify dashboard content has full width on mobile/tablet.
  - Verify top menu button opens the sidebar panel in a slide-out drawer on mobile/tablet.
  - Verify navigation options work correctly and close the drawer automatically upon selection.
- [x] **Workstation Workspace Checks**
  - Verify admin workstation buttons stack correctly without overlapping title text.
- [x] **Realtime Presence Checks**
  - Verify logging in/out of a seller account immediately flips their status between **Online** and **Offline** on the Admin dashboard and Sellers account directory.
