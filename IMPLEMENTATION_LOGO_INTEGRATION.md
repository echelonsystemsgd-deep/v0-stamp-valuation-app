# Implementation Plan: New Logo Integration & Brand Elevation

This document outlines the strategy for integrating the new "Sell Your Stamps UK" logo across the platform, ensuring brand consistency and a premium philatelic aesthetic.

## 1. Visual Analysis & Brand Alignment

The new logo introduces a sophisticated identity with the following key elements:
- **Logo Motif**: A classic serrated stamp edge containing the "SYS" initials.
- **Color Palette**: Deep Forest Green and Midnight Navy.
- **Typography**: A balanced mix of refined Serif ("Sell Your Stamps") and bold Sans-Serif ("UK").
- **Tagline**: "EXPERT VALUATIONS. FAIR PRICES. TRUSTED BUYERS."

### Suggestions for Brand Elevation:
- **Exact Color Sync**: Refine the site's CSS variables to match the logo's specific hex codes.
- **Stamp Motif Design System**: Incorporate the "stamp edge" (serrated) border style into UI components like image cards, testimonial blocks, or CTA sections.
- **Tagline Consistency**: Use the logo's tagline as the primary value proposition throughout the site's metadata and hero sections.

---

## 2. Asset Preparation

| Task | Description | File Format |
| :--- | :--- | :--- |
| **Full Logo (Standard)** | The main horizontal logo for the header and footer. | `logo-full.svg` or `logo-full.webp` |
| **Logo (White/Inverse)** | For use on dark backgrounds or transparent headers. | `logo-white.svg` |
| **Brand Mark (SYS Stamp)** | Simplified "SYS" stamp icon for the favicon and sticky header. | `logo-mark.svg` |
| **Favicon Extraction** | Multi-size favicon generated from the SYS stamp motif. | `favicon.ico`, `apple-touch-icon.png` |

---

## 3. Implementation Steps

### Phase 1: Global Theme Update
- [ ] **Color Palette Refinement**:
    - Update `app/globals.css` with the exact colors from the logo.
    - `---forest-green`: (Match logo green)
    - `--navy`: (Match logo navy)
- [ ] **Typography Audit**: Ensure `Playfair Display` (Serif) and `Inter` (Sans) are used in a hierarchy that mirrors the logo's balance.

### Phase 2: Header & Navigation Integration
- [ ] **Main Header**:
    - Replace the current `Landmark` icon and text-based logo in `components/layout/header.tsx` with the new `<Image />` component.
    - Implement a smooth transition for the logo size when the user scrolls (Sticky Header).
- [ ] **Mobile Navigation**:
    - Update the logo inside the `Sheet` (Mobile Menu) to ensure brand visibility on smaller screens.
- [ ] **Favicon**:
    - Update the site favicon and metadata icons in the `app/layout.tsx` or `public` directory.

### Phase 3: Footer & Global Branding
- [ ] **Footer Redesign**:
    - Update the footer branding in `components/layout/footer.tsx`.
    - Use the full logo or the brand mark + tagline combination.
- [ ] **Metadata Update**:
    - Ensure the "EXPERT VALUATIONS. FAIR PRICES. TRUSTED BUYERS." tagline is reflected in SEO metadata.

### Phase 4: Brand-Inspired UI Refinements
- [ ] **Serrated Edges**: Add a CSS utility for `stamp-border` to give certain images or sections a "philatelic" feel.
- [ ] **Iconography**: Gradually align custom icons to use the brand green/navy consistently.

---

## 4. Proposed Timeline & Deliverables

1. **Asset Upload**: Save provided logo variants to `/public/brand/`.
2. **CSS Update**: Sync theme colors in `app/globals.css`.
3. **Component Update**: Refactor `Header` and `Footer`.
4. **Final Polish**: Update favicon and metadata.

---

> [!IMPORTANT]
> The new logo should be implemented as an **SVG** where possible to ensure maximum clarity on high-resolution displays and to allow for easy color manipulation (e.g., changing to white for dark mode).
