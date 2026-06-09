# Implementation Plan: Navigation Update & About Us Page Cleanup

## Overview
This plan addresses the requests to:
1. Reorder the main navigation links to exactly: **Home, About Us, How to Sell, What We Buy, Contact Us, Sell Your Stamps**.
2. Remove the "Meet Our Team" section from the "About Us" page.

## Detailed Implementation Steps

### Task 1: Reorder Navigation Links
- **Target File**: `data/navigation.ts`
- **Current State**: Navigation is ordered as Home, How to Sell, What We Buy, About Us, Contact.
- **Planned Changes**: 
  - Edit the `mainNavigation` array to reorder the items.
  - Update the label for the contact page from `Contact` to `Contact Us`.
  - The final array will look like this:
    ```typescript
    export const mainNavigation = [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about-us' },
      { label: 'How to Sell', href: '/how-to-sell' },
      { label: 'What We Buy', href: '/what-we-buy' },
      { label: 'Contact Us', href: '/contact' },
    ] as const
    ```
  - *(Note: The "Sell Your Stamps" button is located in the global header component and follows this mapped list by default, ensuring it stays at the end of the navigation).*

### Task 2: Remove "Meet Our Team" from About Us Page
- **Target File**: `app/about-us/page.tsx`
- **Planned Changes**:
  1. **Clean up Imports**: 
     - Remove `import Image from 'next/image'` as it will no longer be used on this page after the team section is gone.
     - Remove `import { getBlurPlaceholder } from '@/lib/image-utils'`.
  2. **Remove Team Data**:
     - Delete the `const teamMembers = [...]` array (lines 19-41) containing member bios and images.
  3. **Remove the UI Section**:
     - Remove the entire `<section>` block labeled with `{/* Meet the Team */}` (lines 116-150), which maps over the `teamMembers` data and renders the cards.

## Post-Implementation Verification
Once the code changes are made, we will run `npm run dev` and check:
- The navigation bar visually reflects the new order on all device sizes.
- the `/about-us` route no longer displays the "Meet Our Team" section and renders without errors.
