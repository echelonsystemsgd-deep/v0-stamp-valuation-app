# Brand Implementation Plan: Sell Your Stamps UK

This document outlines the strategic refactor of the "UK Stamp Valuations" website into the new **Sell Your Stamps UK** brand identity. The goal is to create a premium, heritage-inspired, and trust-focused experience that resonates with a mature audience.

---

## 🏛️ Brand Strategy & Tone

The new identity shifts from a generic service to an established, authoritative British institution.

*   **Core Message:** Expert heritage meeting fair commerce.
*   **Target Audience:** Mature collectors and individuals inheriting collections.
*   **Key Emotions:** Trust, Reliability, Ease, Authority.
*   **Visual Direction:** Philatelic heritage (postage marks, stamp edges) combined with modern premium UI.

---

## 🎨 Design System: "The Heritage Palette"

We are moving away from standard web blues to a curated, high-contrast, and warm palette.

### Primary Colors
| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Navy (Heritage Blue)** | `#0D1B2A` | Headlines, Body Text, Navigation, Footer background. |
| **Forest Green (Postal)** | `#1F6F50` | Primary CTAs, Success states, Trust badges, Icon accents. |
| **Soft Background (Parchment)** | `#F7F5F0` | Main site background, Card backgrounds (replacing pure white). |

### Supporting Accents
*   **Muted Gold:** `#B89352` (Borders, subtle dividers, secondary icons).
*   **Postal Grey:** `#E5E7EB` (Subtle UI borders, disabled states).
*   **Deep Charcoal:** `#1F2937` (Secondary text).

---

## ✍️ Typography & Hierarchy

Legibility for an older audience is paramount. All text will be upsized by ~10-15% compared to standard web defaults.

### Headings (The Serif Authority)
*   **Font:** `Playfair Display` or `Cormorant Garamond` (already configured in `layout.tsx`).
*   **Styling:** Semi-bold to Bold. Navy color (`#0D1B2A`).
*   **Hierarchy:**
    *   `h1`: 3.5rem+ (Desktop) / 2.5rem (Mobile)
    *   `h2`: 2.5rem (Desktop) / 1.875rem (Mobile)

### Body Text (The Readable Sans)
*   **Font:** `Inter` or `Geist` (already configured).
*   **Styling:** Regular to Medium weight. High contrast Navy (`#0D1B2A`).
*   **Size:** Base `18px` for desktop (scale up to `20px` for key narrative sections).
*   **Line Height:** `1.6` to `1.8` for maximum readability.

---

## 🧱 UI Refactor & Component Guidelines

### 1. Global Header
*   **Logo:** Replace text-based logo with the new "Sell Your Stamps UK" brand mark.
*   **Navigation:** Navy text with Forest Green active states.
*   **Contact Bar:** Bold Forest Green phone number for immediate trust/accessibility.

### 2. Buttons & CTAs
*   **Primary CTA:** Forest Green background, White text, **Large rounded corners** (`rounded-xl` or `rounded-2xl`).
    *   *Wording:* "Sell Your Stamps Today"
*   **Secondary CTA:** Navy outline or Ghost variant.
    *   *Wording:* "Request a Free Valuation"
*   **Interaction:** Soft hover elevation and subtle color shift (no aggressive scales).

### 3. Heritage Elements (The "Special Sauce")
*   **Stamp-Edge Borders:** Add subtle `mask-image` or CSS `border-image` inspired by stamp perforations to featured cards or images.
*   **Paper Texture:** Apply a soft grain/parchment texture to the main background (`#F7F5F0`).
*   **Postal Marks:** Use subtle svg-based "postmark" watermarks in the background of hero or footer sections.
*   **Thin Dividers:** Use Muted Gold (`#B89352`) 1px lines for section separation.

---

## 🧠 UX & Accessibility for Seniors

*   **No Placeholders:** All images must be high-quality, relevant stamp photography or generated premium assets.
*   **Contrast:** Maintain AAA contrast ratios between Navy text and Parchment background.
*   **Click Targets:** Minimum 48x48px for all interactive elements.
*   **Clarity:** Use explicit labeling for forms; avoid floating labels that can be confusing.

---

## 🚀 Implementation Strategy

### Phase 1: Design Token Overhaul
*   Update `app/globals.css` with the new color tokens.
*   Refactor Tailwind theme variables to use the Heritage Palette.
*   Update `radius` tokens for larger, softer corners.

### Phase 2: Core Layout Updates
*   Replace all "UK Stamp Valuations" text with "Sell Your Stamps UK" across Header, Footer, and Metadata.
*   Integrate the new Logo asset.
*   Apply the Parchment background and Paper texture globally.

### Phase 3: Component Re-styling
*   Update `Button` component variants.
*   Refactor the **Valuation Calculator** UI to feel like a premium tool rather than a generic form.
*   Update Tables (Buying Rates) with Navy headers and soft green highlights.

### Phase 4: Polish & Heritage Cues
*   Implement scroll-triggered fade-ins (`animate-fade-in-up`).
*   Add the "Stamp Edge" borders to key testimonials and hero images.
*   Final responsive audit for all breakpoints.

---

## 📑 Metadata & SEO Update

*   **Site Title:** Sell Your Stamps UK | Professional Stamp Valuations
*   **Keywords:** Sell stamps UK, stamp valuation heritage, British philately buyers.
*   **Description:** The UK's most trusted stamp valuation and buying service. Heritage-focused, expert-led, and committed to fair pricing.

---

> [!IMPORTANT]
> All future code changes must strictly adhere to the Navy/Forest Green/Parchment palette and prioritize high-legibility typography for a premium, established feel.
