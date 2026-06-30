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

---

## 🧪 Verification & Testing Plan

*   **Magic Link Test**: Enter an email in `/login`, receive the magic link, click it, and confirm successful authentication and redirection to `/dashboard`.
*   **Unauthorized Middleware Test**: Access `/admin` or `/dashboard` directly without logging in and confirm automatic redirection to `/login`.
*   **Non-Admin Redirect Test**: Log in as a standard user (`role = 'user'` or `'seller'`) and try to browse to `/admin`. Verify that Middleware intercepts and redirects to `/dashboard`.
*   **Logout Test**: Click the Logout button and confirm the user session is destroyed, cookies are cleared, and they are redirected back to `/login`.
