# Implementation Plan - Phase 2: Authentication & Onboarding Flow Updates

This document outlines the detailed implementation plan for integrating both passwordless and password-based Supabase user authentication, designing the login and registration pages with dual tabs, setting up role-based middleware redirection, and establishing profile management with onboarding/promotion nudges.

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
    ├── login/page.tsx               # Auth page with Tabs: Magic Link & Password (includes forgot password inline toggle)
    ├── signup/page.tsx              # Signup page with Tabs: Magic Link & Password
    ├── reset-password/page.tsx      # Password reset page (new password input)
    └── logout/route.ts              # Route handler to destroy cookies and sign out
```

---

## 3. 🛠️ Implementation Steps

### Step 1: Authentication Tabs & Forms Integration
We will refactor the existing `/login` and `/signup` pages to use the custom [tabs.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/ui/tabs.tsx) component.

#### 1. Passwordless Magic Link & OTP Tab
*   Keep the existing OTP / Magic Link behavior.
*   Upon entering email, users receive an OTP code/link. Input fields update to display the 6-digit OTP verification interface with a 60-second cooldown timer.

#### 2. Password Authentication Tab
*   **Login Form**:
    *   Provide **Email** and **Password** inputs.
    *   Include a **"Forgot Password?"** link/button.
    *   On submit, call:
        ```typescript
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        ```
    *   Redirect to `redirectedFrom` path (defaults to `/dashboard`) on success. Show a premium `sonner` error toast on failure.
*   **Signup Form**:
    *   Provide **Full Name**, **Email**, **Password**, and **Confirm Password** inputs.
    *   Implement client-side validations:
        *   Passwords must match.
        *   Password length must be at least 6 characters.
    *   On submit, call:
        ```typescript
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
            data: {
              full_name: fullName.trim(),
            },
          },
        });
        ```
    *   **Confirmation State**:
        *   If `data.session` exists (email verification disabled in Supabase), redirect directly to `/dashboard`.
        *   If `data.session` is `null` (email verification enabled), show a success state informing the user: *"Registration pending. Please check your inbox at [email] to confirm your account before signing in."*

### Step 2: Forgot & Reset Password Flow
1. **Forgot Password Request**:
   *   Inside the `/login` page's Password tab, clicking "Forgot Password?" toggles the card view to display a reset request form (email input only).
   *   On submission, trigger:
       ```typescript
       const { error } = await supabase.auth.resetPasswordForEmail(email, {
         redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
       });
       ```
   *   Show success toast: *"If an account exists, a password reset link has been sent to your email."* Provide a button to return to the login tabs.
2. **Reset Password Page (`/reset-password/page.tsx`)**:
   *   Users click the link in their email, routing through `/auth/callback?next=/reset-password`, which exchanges the temporary code for a session and redirects them to `/reset-password` (authenticated).
   *   Render a password form with **New Password** and **Confirm Password** inputs.
   *   On submit, call:
       ```typescript
       const { error } = await supabase.auth.updateUser({ password: newPassword });
       ```
   *   On success, sign the user out or redirect to `/dashboard` with a success toast.

### Step 3: Role Checker Middleware
Update `middleware.ts` to check user session roles server-side:
*   If not logged in: Redirect `/dashboard`, `/admin`, and `/reset-password` (unless they have a valid recovery session) to `/login`.
*   If logged in:
    *   Redirect `/login` and `/signup` to `/dashboard` (or `/admin` if the user is an admin).
    *   Block non-admins from accessing `/admin` (redirecting to `/unauthorized`).

### Step 4: Non-Blocking Profile Onboarding & Auto-Save
1. **Onboarding Banner (Profile Info)**:
   *   Render a dismissible premium banner on `/dashboard` if `full_name`, `phone`, or `postcode` is missing.
2. **Auto-Save Profile Details during Valuation Submission**:
   *   Pre-fill the `/sell-your-stamps` form with profile details. Submitting updates missing profile fields in the database.

### Step 5: User → Seller Promotion & Sticky Banner
To actively encourage promotion:
1. **Sticky Seller Promotion Banner**:
   *   For logged-in accounts where `profile?.role === 'user'` (registered but haven't requested an appraisal yet):
   *   Render a **non-dismissible (sticky)** premium card banner on `/dashboard`.
   *   **Branding & Copy**: Stylized in `Heritage Green` (`#14452F`) with a `Warm Gold` (`#C5A059`) border accent.
     *   *Headline*: "✉️ Get Your Free Stamp Valuation"
     *   *Body*: *"Request an appraisal for your stamp collection today. Submitting your first appraisal automatically promotes your account to a **Seller** account, unlocking advanced tracking for quotes, valuations, and payouts."*
     *   *CTA Button*: *"Start Your Valuation"* linking to `/sell-your-stamps`.
   *   The banner remains active until the user submits their first appraisal form, which triggers the database update to `role = 'seller'`, making the banner disappear naturally.
2. **Onboarding Email Nudge**:
   *   **Phase 2**: Customize the default confirmation/welcome email template directly within the Supabase Auth templates to include a clear CTA button linking back to `/sell-your-stamps`.
   *   **Phase 3 (Deferred)**: Set up the automated scheduled onboarding email nudge (using Resend) to trigger 24–48 hours after signup for inactive users with `role = 'user'`.

---

## 4. 📂 Database Schema updates
The existing triggers in Phase 1 already handle:
1. Profile auto-creation on `auth.users` insert (reads `full_name` metadata).
2. Auto-upgrade to `seller` when a new submission is inserted in the `submissions` table.
No new database migrations are required for Phase 2 auth updates.

---

## 5. 🔒 Session & Rate-Limiting Policy
1. **Session Length**:
   *   **JWT Access Token Expiry**: 1 hour.
   *   **Refresh Token Expiry**: 1 year.
2. **Rate Limiting**:
   *   60-second cooldown lock on `/login` and `/signup` forms after requesting an OTP or password reset.

---

## 🧪 Verification & Testing Plan

### 🚀 Phase 2 Implementation Checklist

- [ ] **Dual-Tab Authentication Pages**
  - [ ] Implement `Tabs` UI for `/login` page (Tabs: Magic Link, Password).
  - [ ] Implement `Tabs` UI for `/signup` page (Tabs: Magic Link, Password).
  - [ ] Confirm email validation, password minimum 6-character length validation, and confirm password check on signup.
  - [ ] Validate password signup correctly passes `full_name` metadata to trigger the `handle_new_user()` Postgres function.
  - [ ] Implement confirmation state on password signup if email verification is enabled.

- [ ] **Forgot & Reset Password Flow**
  - [ ] Build inline "Forgot Password?" trigger and email request form on `/login`.
  - [ ] Ensure recovery link correctly uses `resetPasswordForEmail` with redirect pointing to `/auth/callback?next=/reset-password`.
  - [ ] Create `/reset-password/page.tsx` with secure password input fields and validation.
  - [ ] Verify `supabase.auth.updateUser` successfully changes user password and logs them in.

- [ ] **Sticky Seller Promotion Banner**
  - [ ] Build the promotion card component for `role === 'user'` users on `/dashboard`.
  - [ ] Implement styling: Heritage Green background, gold accent line, custom illustration or icons.
  - [ ] Verify banner is **non-dismissible** (no close button) and disappears automatically once the user's role transitions to `'seller'`.
  - [ ] Double-check existing users' emails and passwords are not impacted.

- [ ] **Auth Callback & Middleware**
  - [ ] Confirm `/auth/callback` handles code exchange and routes to `/reset-password` or `/dashboard` properly.
  - [ ] Confirm `middleware.ts` intercepts `/reset-password` if user is unauthenticated.

- [ ] **Email Configuration**
  - [ ] Manually update Supabase Auth templates (Welcome & Confirmation emails) to display a call-to-action link pointing to `/sell-your-stamps`.
