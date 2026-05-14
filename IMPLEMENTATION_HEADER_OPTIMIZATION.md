# Implementation Plan: Sticky Header & Logo Optimization

**Objective:** Enhance the visibility of the logo in the sticky state while maintaining a premium aesthetic and intentional spacing.

---

## Phase 1: Visual Foundation (CSS & Glassmorphism)
1. **Enhance Backdrop Blur**:
   - Upgrade from `backdrop-blur-sm` (4px) to `backdrop-blur-md` (12px) or `backdrop-blur-lg` (16px) for a more premium "frosted glass" look.
   - Adjust the background opacity in the sticky state to `bg-background/80` or `bg-white/70` to allow content colors to bleed through elegantly.
2. **Elevation & Depth**:
   - Refine the shadow in the sticky state to be larger but more subtle (e.g., `shadow-md` with reduced opacity) to create a distinct layer separation.

## Phase 2: Dynamic Header Scaling
1. **Responsive Height Transition**:
   - Modify the `<nav>` height to transition smoothly based on the `isScrolled` state.
   - **Initial**: `h-20` (Desktop) / `h-16` (Mobile).
   - **Scrolled**: `h-16` (Desktop) / `h-14` (Mobile).
2. **Logo Scaling**:
   - Implement a scale transition for the logo image.
   - **Initial**: `scale-100` / `h-12`.
   - **Scrolled**: `scale-90` / `h-10`.
   - Ensure the transition is smooth using `transition-all duration-300`.

## Phase 3: Logo Visibility & Asset Optimization
1. **Asset Migration (Optional but Recommended)**:
   - Check for a high-quality SVG version of the "Sell Your Stamps UK" logo.
   - If using a PNG/JPEG, ensure it has a transparent background to avoid the "white box" effect against the blurred header.
2. **Contrast Enhancement**:
   - In the sticky state, if the logo text is too thin, consider applying a subtle `brightness(1.1)` or a very soft `drop-shadow(0 0 1px white)` filter if the background becomes too dark.

## Phase 4: Spacing & Alignment
1. **Breathable Spacing**:
   - Adjust internal padding (`px-4 sm:px-6 lg:px-8`) to ensure that even when the header height shrinks, the elements don't feel "cramped."
   - Maintain vertical centering using `items-center`.
2. **Refined Navigation Links**:
   - Ensure navigation link spacing remains consistent so the menu doesn't feel like it's shifting horizontally when the height changes.

---

## Technical Details
- **Target File**: `components/layout/header.tsx`
- **Logic**: Utilize the existing `isScrolled` boolean to toggle Tailwind classes.
- **Classes to Add/Modify**:
  - `backdrop-blur-md`
  - `transition-all duration-300`
  - `shadow-[0_4px_30px_rgba(0,0,0,0.03)]` (Custom premium shadow)
