# Implementation Plan: Header & Logo Refinement

This plan outlines the steps to resolve the logo outline interruption in the slideshow and improve the visibility of the brand subheading.

## 1. Problem Analysis
- **Logo Interruption:** The current logo is a JPEG with a solid white background, creating a visual "cut-out" in the hero slideshow.
- **Low Legibility:** The subheading ("EXPERT VALUATIONS. FAIR PRICES. TRUSTED BUYERS.") is baked into the image, making it blurry and unreadable at header scale.
- **Color Conflict:** A single logo version doesn't work well across both the dark hero section and the light scrolled header.

## 2. Proposed Solution
Transition from an image-based logo to a dynamic, code-driven **Logo Component** that adapts to the header's scroll state.

## 3. Implementation Steps

### Phase 1: Logo Component Creation
Create a new `Logo` component (or integrate directly into `Header.tsx`) that:
- Uses the `brand-mark.svg` as the icon.
- Renders "Sell Your Stamps UK" using high-quality typography.
- Renders the subheading as separate, responsive text.
- Supports a `variant` prop (`light` for hero, `dark` for sticky).

### Phase 2: Header Logic Update (`components/layout/header.tsx`)
- **State Management:** Ensure `isScrolled` triggers the transition between "Light" and "Brand" modes.
- **Dynamic Classes:** 
    - **Top State:** Transparent background, white text, subtle text-shadow.
    - **Scrolled State:** `bg-white/80 backdrop-blur-xl`, `forest-green` text.
- **Transitions:** Use CSS transitions for height, opacity, and color to ensure a premium feel.

### Phase 3: Visual Polish
- **Subheading Styling:** Use `tracking-wider` and `uppercase` for the subheading to give it a "luxury" stamp-mark aesthetic.
- **Backdrop Enhancement:** Increase the `backdrop-blur` intensity to ensure navigation remains readable even when passing over busy text or images.

## 4. Technical Specifications
- **Component:** `Header.tsx`
- **Icon:** `public/brand-mark.svg`
- **Fonts:** Utilize the project's serif font for the brand name and sans-serif for the tagline.
- **Animations:** Tailwind `transition-all duration-500`.

## 5. Success Criteria
- [ ] No white box visible around the logo over the slideshow.
- [ ] Subheading is sharp and clearly readable on both Desktop and Mobile.
- [ ] Smooth color transition when scrolling.
- [ ] Header feels integrated rather than "floating on top".
