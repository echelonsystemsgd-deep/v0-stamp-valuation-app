# Implementation Plan: Brand Polish & Philatelic UI Refinements

This document outlines the next steps for elevating the "Sell Your Stamps UK" brand, focusing on philatelic-inspired design elements and technical asset optimizations.

## 1. Asset Optimization (The "SYS" Mark)

The current logo is horizontal and complex. For small-scale UI (favicons, mobile icons, sticky header), we need a simplified "Brand Mark."

- [ ] **Favicon Extraction**: Extract the "SYS" stamp motif from the main logo.
    - Save as `public/favicon-mark.svg`.
    - Update `app/layout.tsx` to use this mark for `icon` and `apple-touch-icon`.
- [ ] **Sticky Header Logo**: On scroll, transition from the full horizontal logo to just the "SYS" stamp mark to save vertical space and maintain a "Premium Minimalist" feel.

---

## 2. Philatelic Design System (Serrated Edges)

To create a unique "Heritage Philately" feel, we will implement custom CSS utilities that mimic stamp perforations.

- [ ] **Stamp Border Utility**: Create a CSS mask or background-image utility in `globals.css` that adds a serrated (scalloped) edge to containers.
    ```css
    .stamp-edge {
      mask-image: radial-gradient(circle at 10px 10px, transparent 10px, black 11px);
      mask-size: 20px 20px;
      /* etc */
    }
    ```
- [ ] **Component Application**:
    - Apply to **Testimonial Cards** to make them look like individual stamps.
    - Apply to **Featured Stamp Images** in the "What We Buy" section.
    - Use a subtle serrated separator for the **Footer** or **Hero** transition.

---

## 3. Footer Branding Polish

The current footer uses a white box for the logo. We should refine this for a more integrated, premium look.

- [ ] **Transparent/Inverse Logo**:
    - If a transparent SVG is available, replace the current JPEG.
    - Alternatively, apply a CSS filter (`brightness(0) invert(1)`) to the logo in the footer to create a "White Logo" effect that blends perfectly with the navy background.
- [ ] **Tagline Typography**: Style the footer tagline with increased letter-spacing (`tracking-widest`) and a lighter weight to match the logo's "EXPERT VALUATIONS..." text.

---

## 4. Typography & Depth Refinements

- [ ] **Letter Spacing**: Synchronize the site's heading letter-spacing with the logo (e.g., `-0.02em` for serif titles).
- [ ] **Subtle Textures**: Add a very subtle "paper grain" texture to the `--off-white` background to evoke the feel of high-quality stamp albums.

---

## Proposed Execution Order

1.  **CSS Utilities**: Implement `.stamp-border` and `.paper-texture` in `globals.css`.
2.  **Asset Update**: Prepare the `favicon-mark.svg`.
3.  **UI Component Update**: Apply stamp edges to 2-3 key components (Testimonials, Catalog Cards).
4.  **Final Typography Sync**: Polish the site-wide headings and tagline styles.

---

> [!TIP]
> Using the "SYS" stamp mark as a repeating pattern (watermark) at very low opacity in the background of certain sections can further enhance the "Heritage" brand feel.
