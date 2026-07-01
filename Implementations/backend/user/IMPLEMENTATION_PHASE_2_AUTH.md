# Implementation Plan - Phase 2: Authentication Flows

This document outlines the detailed implementation plan for integrating passwordless Supabase user authentication, designing the login and registration pages, setting up role-based middleware redirection, and establishing profile management with onboarding nudges.

---

## 1. 🎨 Visual Identity & Branding for Auth Pages

To align the login/signup experience with the premium brand of **Sell Your Stamps UK**:
*   **Colors**: Utilize a rich dark background (`Midnight Navy` `#0B1D2E`) or premium canvas background (`Parchment Off-White` `#FBFBF9`) with `Warm Gold` (`#C5A059`) border accents on the card.
*   **Buttons**: CTAs styled in `Heritage Green` (`#14452F`) with gold hover glows or transitions.
*   **Typography**: Serif title fonts (`Playfair Display`) and clean, modern form control/label fonts (`Inter`).
*   **Toasts**: Top-left toast notifications (via `sonner`) with custom branding borders matching status changes.

---

## 2. 📂 Directory & Page Routing Structure

We will implement the following auth-related routes:
```
app/
└── (auth)/
    ├── login/page.tsx               # Passwordless login page (Email + OTP Code / Magic Link)
    ├── signup/page.tsx              # Passwordless registration page (Email + Name only)
    └── logout/route.ts              # Route handler to destroy cookies and sign out (or action)
```

---

## 3. 🛠️ Implementation Steps

### Step 1: Passwordless Magic Link & OTP Integration
1. **Supabase Client Setup**: Ensure `createClient` (browser-side) and `createServerSupabaseClient` (server-side) are properly imported.
2. **Passwordless Login Page (`/login`)**:
   *   Remove password fields/tabs. Provide a single unified email field.
   *   Support two ways of logging in upon submitting the email:
       1. **Magic Link Click**: User clicks the secure link in their email.
       2. **OTP Code Entry**: User types a 6-digit verification code directly on `/login` (revealing an OTP input field after sending).
   *   Disable the submit button for 60 seconds with a visual countdown timer after sending to prevent SMTP rate abuse.
3. **Passwordless Signup Page (`/signup`)**:
   *   Remove password and confirm-password fields.
   *   Collect **Full Name** (maps to `options.data.full_name`) and **Email**.
   *   Trigger the `signInWithOtp` call to sign up the new user and trigger public profile generation.
4. **Auth Callback Route (`/auth/callback/route.ts`)**:
   *   Exchange the code/token for a session and redirect the user to `/dashboard` (or the previous path via `redirectedFrom`).

```typescript
// Supabase call for passwordless entry
const { data, error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectedFrom)}`,
    data: {
      full_name: fullName, // Handled only during signup
    }
  },
});
```

### Step 2: Custom Logout Handler
Ensure the global logout action or `/logout` route handler destroys cookie sessions and redirects users back to `/login`:
```typescript
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/login');
}
```

### Step 3: Role Checker Middleware
Update `middleware.ts` to check user session roles server-side:
*   If not logged in: Redirect `/dashboard` and `/admin` to `/login`.
*   If logged in:
    *   Redirect `/login` and `/signup` to `/dashboard` (or `/admin` if the user is an admin).
    *   Block non-admins from accessing `/admin` (redirecting them to `/unauthorized`).
    *   Redirect admins accessing `/dashboard` directly to `/admin`.

### Step 4: Non-Blocking Profile Onboarding & Autosave

To prompt users to complete their profile without gating access to the dashboard:

1. **Dashboard Onboarding Banner**:
   *   On `/dashboard` (or in the dashboard layout), if `full_name`, `phone`, or `postcode` is missing from the user's profile, render a non-blocking, dismissible premium alert banner.
   *   *Banner Text*: `"✉️ Complete your profile details to unlock seamless valuations and track payments. [Complete Profile ->]"` linking to `/dashboard/profile`.
2. **Profile Completion Gating**:
   *   Do **NOT** block dashboard entry.
   *   Instead, enforce that `phone` and `postcode` are specifically required when performing high-intent actions, such as **accepting a quote** or **providing shipping details** in Phase 4.
3. **Autosave Profile Details during Valuation Submission**:
   *   When an authenticated user submits a valuation through the `SellForm` (which collects name, email, phone, and postcode), pre-fill the form with existing profile data.
   *   If they fill in missing details, the backend submission endpoint (`/api/sell/route.ts`) will automatically write these details into their `public.profiles` row, completing their profile seamlessly.
4. **Dropdown Menu Navigation**:
   *   Update `components/layout/header.tsx` to replace "Sign In" with a profile avatar button (or initials badge in a gold border).
   *   Dropdown options:
       *   User Summary (Name, Email, Role badge).
       *   **Profile Settings** (`/dashboard/profile` or `/admin/settings`).
       *   **Log Out** (triggers Server Action).

---

## 📂 Database Schema updates

### 1. Profile Avatar Columns
```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

### 2. Storage Bucket for Avatars
*   Create a public storage bucket `avatars`.
*   Establish RLS Policies:
    *   **Select**: Publicly readable.
    *   **Insert/Update/Delete**: Restricted to authenticated users managing their own subfolder (matching `auth.uid()::text`).

---

## 🔒 Session & Rate-Limiting Policy

1. **Session Length**:
   *   **JWT Access Token Expiry**: 1 hour (Default).
   *   **Refresh Token Expiry**: 1 year rolling. User remains logged in indefinitely as long as they are active.
   *   **Global Sign Out**: Include a button on `/dashboard/profile` to sign out of all devices using `supabase.auth.signOut({ scope: 'global' })`.
2. **Rate Limiting**:
   *   **Supabase Level**: 30 requests per 5 minutes per IP (Default). SMTP cooldown of 60 seconds between magic link emails.
   *   **Client Level**: 60-second submission lock on `/login` and `/signup` forms after requesting an OTP.
   *   **Turnstile Captcha**: Deferred to a subsequent security hardening phase.

---

## 🧪 Verification & Testing Plan

### 🚀 Phase 2 Implementation Checklist

- [x] **Auth Client Configuration**
  - [x] Validate cookie middleware matches Next.js App Router rules.
  - [x] Configure local and production Supabase clients.

- [x] **Passwordless Pages**
  - [x] Clean `/login` page containing only email input (no password fields).
  - [x] UI-level 60s cooldown timer upon clicking "Send Link".
  - [x] 6-digit OTP input field shown after submitting email.
  - [x] Clean `/signup` page collecting only Full Name and Email.

- [x] **Auth Callback & Middleware**
  - [x] `/auth/callback` endpoint successfully exchanges OTP code/hash for session.
  - [x] Middleware blocks unauthenticated `/dashboard` and `/admin` access.
  - [x] Middleware blocks non-admin access to `/admin`.
  - [x] Middleware redirects logged-in users away from `/login` and `/signup`.

- [x] **Onboarding & Header UX**
  - [x] Dismissible onboarding banner shown in `/dashboard` if profile fields are empty.
  - [x] Header updates with initials badge/avatar on successful login.
  - [x] Dropdown menu works with correct links and log out button.
  - [x] Global sign out button on profile settings page functions.

- [x] **Profile Page & Storage**
  - [x] `/dashboard/profile` allows updating Full Name, Phone, and Postcode.
  - [x] Avatar upload works and updates profile photo bucket.
  - [x] RLS policies restrict avatar updates to the user's folder.

- [x] **Autosave Submission Verification**
  - [x] Logged-in user submission pre-fills form data.
  - [x] Submitting a form writes missing profile details to database automatically.

---

### Manual Verification Scenarios

*   **Test Magic Link**: Enter email in `/login`, receive email, click link -> redirected to `/dashboard`.
*   **Test OTP Code**: Enter email in `/login`, copy 6-digit OTP code from email, paste code into OTP input field -> logged in.
*   **Test Rate-Limit Cooldown**: Click "Send Magic Link", verify button is disabled and displays a countdown timer. Attempting to submit again is blocked.
*   **Test Role Access Interception**: Log in as a seller. Attempt to visit `/admin`. Verify middleware redirects to `/unauthorized`.
*   **Test Onboarding Banner**: Log in with a fresh email, verify onboarding banner is displayed in the dashboard. Fill out profile fields, refresh, verify banner disappears.
*   **Test Submission Profile Write**: Submit an appraisal as a logged-in user with an incomplete profile. Verify that `public.profiles` is populated with the form's phone and postcode upon submission.
*   **Test Global Logout**: Click "Sign out of all devices" on `/dashboard/profile`. Verify all browser sessions on different devices are invalidated.
