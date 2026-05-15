# Implementation Plan: New Logo & Branding Integration

This document outlines the strategy for integrating the provided "Sell Your Stamps UK" logo into the platform. This plan focuses on ensuring the new visual identity is applied consistently across all touchpoints while elevating the "Heritage Luxury" aesthetic.

## 1. Visual Identity Analysis

The new logo establishes a strong, professional, and heritage-inspired brand:
- **Logo Mark**: A deep green postage stamp icon with "SYS" initials and modern wavy cancellation lines.
- **Primary Typography**: "Sell Your Stamps" in a sophisticated Serif font (Dark Navy) paired with "UK" in a bold Sans-Serif (Deep Green).
- **Secondary Typography**: "EXPERT VALUATIONS. FAIR PRICES. TRUSTED BUYERS." in a clean, all-caps serif, framed by horizontal dividers.
- **Color Palette**:
    - **Heritage Green**: Used for the stamp background and "UK".
    - **Midnight Navy**: Used for the primary "Sell Your Stamps" text.
    - **Smoke Gray**: Used for the wavy cancellation lines.

---

## 2. Suggestions for Brand Elevation

Beyond simply placing the logo, I suggest the following to deeply integrate the brand:
1. **Dynamic CSS Variables**: Update the global theme to use the exact Green and Navy from the logo for all buttons, primary links, and accent elements.
2. **"Cancellation Mark" Motifs**: Use the wavy lines as a subtle background pattern for section dividers or hero background overlays to reinforce the philatelic theme.
3. **Stamp-Edge UI Components**: Implement a `stamp-border` CSS class for image frames and testimonial cards, mirroring the serrated edge in the logo.
4. **Typographic Hierarchy**: Align the site's heading styles with the logo's serif/sans-serif balance to create a cohesive reading experience.
5. **Favicon & App Icon**: Extract the "SYS" stamp icon (without text) to use as the site's favicon and mobile home screen icon.

---

## 3. Implementation Strategy

### Phase 1: Asset Preparation (Non-Destructive)
- **Asset Extraction**: Split the logo into high-quality variants:
    - `logo-full.webp`: The complete logo for the main header.
    - `logo-full-white.webp`: An inverted version for dark background sections.
    - `brand-mark.svg`: The "SYS" stamp icon for the favicon and mobile navigation.
- **Favicon Generation**: Update the `public/favicon.ico` and related manifest files.

### Phase 2: Theme & Layout Synchronization
- **Color Sync**: Update `app/globals.css` with the new primary brand colors.
- **Header Component**:
    - Update `components/layout/header.tsx` to use the new logo asset.
    - Ensure the logo scales gracefully in the "Sticky Header" state.
- **Footer Component**:
    - Update `components/layout/footer.tsx` with the full logo and tagline.
- **SEO & Metadata**: Update the site's global metadata in `app/layout.tsx` to use the new tagline.

### Phase 3: Global Branding Rollout
- **CTA Buttons**: Transition primary buttons to use the "Heritage Green" from the logo.
- **Background Elements**: Introduce the "Smoke Gray" wavy lines as a subtle texture in sections with heavy whitespace.
- **Component Polish**: Review all existing components (Concierge widget, Sticky CTA) to ensure they align with the new color palette.

---

## 4. Next Steps

1. **Confirmation**: User to approve this plan.
2. **Asset Upload**: Save the provided logo to `/public/brand/logo-original.png`.
3. **Execution**: Systematically update the CSS variables and Layout components as described.

---

> [!IMPORTANT]
> No changes will be made to the live website code until this plan is approved and the assets are ready.
