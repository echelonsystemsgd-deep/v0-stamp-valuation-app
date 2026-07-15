# Implementation Plan - Admin-Only Sign-In (Footer Link)

This plan outlines the changes needed to hide the public "Sign In" options from the header and place a dedicated "Sign In (Admin)" link in the footer, while securing routes and disabling legacy client dashboards.

## User Review Required

> [!IMPORTANT]
> Since we are removing public client/user dashboards, standard user accounts will no longer have access to a dashboard portal. All signup pages (`/signup`) should be deprecated/deleted, and new registrations will need to be handled manually or by invitation in the Supabase console.

## Open Questions

None at this time. The proposed footer placement and bracket design `Sign In (Admin)` have been selected as the optimal layout.

---

## Proposed Changes

### Layout & Navigation Components

#### [MODIFY] [header.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/layout/header.tsx)
* Remove the public "Sign In" link from the desktop navigation bar (lines 259–275) when the user is not authenticated.
* Remove the public "Sign In" link from the mobile slide-out sheet menu (lines 405–418).
* Preserve the avatar dropdown and navigation to the **Admin Console** / **Appraiser Console** for users who are already logged in.

#### [MODIFY] [footer.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/layout/footer.tsx)
* Add a `Sign In (Admin)` link in the footer's bottom bar, immediately following the "Terms of Service" link:
  ```tsx
  <Link
    href="/login"
    onClick={(e) => handleLinkClick(e, '/login')}
    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
  >
    Sign In (Admin)
  </Link>
  ```

---

### Route Protection & Security

#### [MODIFY] [middleware.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/middleware.ts)
* Update role-based redirection to remove redirects pointing to standard `/dashboard` routes.
* Ensure that if a standard user (non-admin and non-staff role) somehow logs in, they are immediately signed out and redirected to `/unauthorized` or `/` (the home page).

#### [DELETE] [signup folder](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/(auth)/signup)
* Remove the `/signup` page folder to prevent public user registrations.

---

## Verification Plan

### Automated Tests
* Run the Next.js development server to verify compilation:
  ```powershell
  npm run dev
  ```
* Run Next.js build command to verify that no static routes fail due to the removal of `/signup` or dashboard modifications:
  ```powershell
  npm run build
  ```

### Manual Verification
1. Open the homepage in an incognito browser tab.
2. Verify that there is **no** "Sign In" button visible in the top header (both desktop and mobile views).
3. Scroll to the footer bottom bar and verify that the "Sign In (Admin)" link is present and correctly styled.
4. Click the "Sign In (Admin)" link and log in with an admin or staff account.
5. Verify that upon successful login:
   * The page redirects to the correct admin console page.
   * The top header now displays the admin avatar dropdown menu containing access links and "Log Out".
6. Attempt to log in with a standard non-admin account (if one exists) and verify they are redirected to `/unauthorized` and logged out.
7. Verify that trying to access `/signup` directly returns a 404 page.
