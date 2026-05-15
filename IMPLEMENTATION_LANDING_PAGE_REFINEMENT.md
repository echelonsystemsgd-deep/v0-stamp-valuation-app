# Implementation Plan: Landing Page Structural Refinement

This plan outlines the steps to improve the visual spacing, responsiveness, and structural integrity of the landing page, specifically targeting the header and footer issues observed in split-screen modes.

## Objective
Elevate the "Heritage Luxury" brand identity by increasing "breathability" (whitespace), resolving component collisions in narrow viewports, and refining the responsive behavior of the header and footer.

---

## 1. Logo & Header Optimization
**File:** `components/layout/logo.tsx`, `components/layout/header.tsx`

### Adaptive Logo Scaling
- [ ] **Tagline Visibility:** Implement a breakpoint-based visibility for the logo tagline ("Expert Valuations • Fair Prices..."). Hide it when the viewport width is between `1024px` and `1280px` to prevent crowding the navigation.
- [ ] **Fluid Typography:** Use smaller font sizes for the "Sell Your Stamps UK" title on narrow desktop views.
- [ ] **Refined Scaling:** Ensure the logo mark (stamp icon) scales smoothly between its large (home) and small (scrolled) states without causing layout jumps.

### Header Navigation Spacing
- [ ] **Dynamic Gaps:** Update the navigation container to use a responsive gap (e.g., `lg:gap-8 xl:gap-14`) instead of a single large fixed value.
- [ ] **Breakpoint Adjustment:** Evaluate shifting the mobile menu (hamburger) trigger to `1100px` to maintain a premium feel when horizontal space is limited.

---

## 2. Footer Structural Fixes
**File:** `components/layout/footer.tsx`

### Grid & Column Management
- [ ] **Collision Prevention:** Apply `max-w-xs` or `max-w-[280px]` to the Brand column description to ensure it never overlaps with the "Our Services" column.
- [ ] **Flexible Grid:** Adjust the grid from `lg:grid-cols-5` to a more robust structure that handles narrow widths better (e.g., using `md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5`).
- [ ] **Logo Presentation:** Replace `scale-75` on the footer logo with a dedicated `variant="footer"` or smaller size props to ensure text clarity and consistent alignment.

### Contact Section Polish
- [ ] **Icon Alignment:** Ensure Lucide icons (Phone, Mail, Clock) are perfectly centered vertically with their respective text lines.
- [ ] **Increased Padding:** Increase the vertical gap between contact methods for better legibility on mobile and split-screen.

---

## 3. Global Section Breathability
**Files:** `app/page.tsx`, `components/home/*.tsx`

### Standardized Vertical Spacing
- [ ] **Section Padding:** Update `AboutSummary`, `HowItWorks`, and `WhyChooseUs` to use a consistent, generous vertical padding (e.g., `py-20 md:py-28 lg:py-32`).
- [ ] **Content Centering:** Ensure all landing page sections maintain a consistent `max-w-7xl` container with appropriate side padding to prevent text from hitting the edges in split-screen.

### CTA & Transition Refinement
- [ ] **Inline CTA Spacing:** Increase the margin between the final page section and the `InlineSellCTA` to clearly delineate the "Ready to Sell?" phase.
- [ ] **Background Shifts:** Use very subtle background color shifts (e.g., from `white` to a very light `slate-50` or `navy-950/20`) to separate sections without using hard borders.

---

## Success Criteria
1. **No Overlap:** Brand elements and navigation links do not collide or wrap awkwardly in split-screen mode (~1024px width).
2. **Premium Feel:** The landing page feels more "expensive" and spacious due to increased whitespace.
3. **Legibility:** All footer information is easily scannable and icons are properly aligned.
4. **Responsive Integrity:** The transition from desktop to mobile navigation is seamless and occurs before the layout breaks.
