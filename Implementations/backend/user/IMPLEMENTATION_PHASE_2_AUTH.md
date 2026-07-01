# Implementation Plan - Phase 2: Authentication Flows

This document outlines the detailed implementation plan for integrating Supabase user authentication, designing the login and registration pages, and setting up role-based middleware redirection.

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
    ├── login/page.tsx               # Login page with Email + Magic Link OTP options
    ├── signup/page.tsx              # Sign up page
    └── logout/route.ts              # Route handler to destroy cookies and sign out
```

---

## 3. 🛠️ Implementation Steps

### Step 1: Magic Link Integration
1. Configure the Supabase Client in the application.
2. Build the `/login` and `/signup` page interfaces.
3. Hook up the forms to invoke Supabase Magic Link authentication:
   ```typescript
   const { data, error } = await supabase.auth.signInWithOtp({
     email,
     options: {
       emailRedirectTo: `${window.location.origin}/auth/callback`, // Callback route that parses code/token
     },
   });
   ```
4. Create the `/auth/callback` page or route handler to exchange the OTP hash/code for a session and redirect to `/dashboard`.

### Step 2: Custom Logout Handler
Create a server route `/logout/route.ts` to log out the user, destroy cookies, and redirect to the home page:
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/login', request.url), {
    status: 303,
  });
}
```

### Step 3: Role Checker Middleware
Create/Update `middleware.ts` in the root of the project to check user session roles server-side:
1. Parse the user session using `@supabase/auth-helpers-nextjs` or `@supabase/ssr`.
2. Retrieve the user's role from the database profiles table (or decode a custom claim if stored in JWT).
3. Apply access control rules:
   *   If trying to access `/dashboard` or its subpages without being authenticated: Redirect to `/login`.
   *   If trying to access `/admin` or its subpages and the profile role is NOT `'admin'`: Redirect to `/dashboard` (or show a 403 Access Denied page).
   *   If authenticated and trying to access `/login` or `/signup`: Auto-redirect to `/dashboard` (or `/admin` depending on role).

### Step 4: User Profile Page & Navigation Dropdown
To support profile management for users of all roles, we will implement the following:

1. **Database Schema Update**:
   * Add an `avatar_url` text column to the `public.profiles` table to store the storage URL of the user's avatar.
   ```sql
   ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
   ```
2. **Supabase Storage Bucket**:
   * Create a public storage bucket named `avatars` in Supabase to hold user profile pictures.
   * Add Row Level Security (RLS) policies:
     * **Public Read**: Allow anyone (public/anonymous) to download/view files.
       ```sql
       CREATE POLICY "Allow public read access" ON storage.objects
       FOR SELECT USING (bucket_id = 'avatars');
       ```
     * **Owner Manage**: Allow authenticated users to upload, update, and delete objects in their own folder.
       ```sql
       CREATE POLICY "Allow users to manage own avatars" ON storage.objects
       FOR ALL TO authenticated USING (
         bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
       );
       ```
3. **Dropdown Menu Navigation**:
   * Update the desktop and mobile navigation in `components/layout/header.tsx` to replace the "Sign In" / "Valuation Console" text links for authenticated users with a profile picture button.
   * If a user has an `avatar_url`, render the image; if not (or if it fails to load), render a styled placeholder containing the user's initials inside a gold-bordered circular badge.
   * Clicking the profile picture toggles a dropdown menu containing:
     * A user info summary (Name, Email, Role badge).
     * A link to **Profile Settings** (taking admins to `/admin/settings` and standard users/sellers to `/dashboard/profile`).
     * A button to **Log Out** (calling the sign-out actions handler).
4. **Profile Page & Form Components**:
   * Create the profile pages: `/app/dashboard/profile/page.tsx` for users/sellers and support updates for `/app/admin/settings` (or a dedicated admin profile subpage).
   * Create a reusable profile form component allowing users to update their:
     * Full Name
     * Phone Number
     * Postcode
     * Profile picture (handled via interactive upload to the `avatars` storage bucket).
   * Read-only displays for user role (`user`, `seller`, `admin`) and account status.
   * Connect toast alerts (via `sonner`) for validation errors, upload progress, and success events.

---

## 🧪 Verification & Testing Plan

*   **Magic Link Test**: Enter an email in `/login`, receive the magic link, click it, and confirm successful authentication and redirection to `/dashboard`.
*   **Unauthorized Middleware Test**: Access `/admin` or `/dashboard` directly without logging in and confirm automatic redirection to `/login`.
*   **Non-Admin Redirect Test**: Log in as a standard user (`role = 'user'` or `'seller'`) and try to browse to `/admin`. Verify that Middleware intercepts and redirects to `/dashboard`.
*   **Logout Test**: Click the Logout button and confirm the user session is destroyed, cookies are cleared, and they are redirected back to `/login`.
*   **Profile Picture Placeholder Test**: Log in with an account that has no avatar set, and verify that the header displays the initials placeholder with a premium aesthetic border.
*   **Dropdown Toggle Test**: Click the profile button in the header, verify that the dropdown opens with 'Profile' and 'Log Out' links, and closes when clicking outside or selecting an option.
*   **Profile Page Navigation**: Click the 'Profile' option in the dropdown and confirm that the user is correctly routed (Admins to `/admin/settings` and standard users to `/dashboard/profile`).
*   **Avatar Upload & Update Test**: Upload a profile picture on the profile page, verify the upload completes, and check that the header profile button updates immediately with the new image.
*   **Profile Field Modification Test**: Modify name/phone/postcode on the profile settings page, save changes, and verify that the database profile table updates and reflect on page refresh.
