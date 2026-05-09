# Implementation Plan: Enhancing "How to Sell" Page

This plan outlines the steps to improve the interactivity, trust, and structural flow of the "How to Sell" page, specifically focusing on converting static CTAs into buttons and adding supportive visual elements.

## 1. Convert "Purity Policy" Unsure CTA to Button
**File:** `components/sections/valuation-readiness.tsx`

- **Action:** Replace the static `div` (lines 133-136) with a UI `Button`.
- **Logic:** Use `asChild` with a `Link` component.
- **Destination:** `/sell-your-stamps` (targeting the appraisal form).
- **Styling:** 
    - Maintain the `forest-green` color.
    - Add a `hover:bg-forest-green/5` or similar ghost-style hover state.
    - Add a `transition-all` and `hover:gap-3` effect to the icon/text.

## 2. Add "Process Quick-View" Summary
**File:** `app/how-to-sell/page.tsx`

- **Action:** Insert a new "Quick-View" section immediately after the `HeroSlideshow` and before `Trust Points`.
- **Purpose:** Prime users with the 1-2-3 flow before they read the technical details.
- **Content:** Three simple icons (e.g., `ClipboardCheck`, `Truck`, `PoundSterling`) with brief labels: "Request", "Send", "Get Paid".

## 3. Implement Trust Reassurance Banner
**File:** `app/how-to-sell/page.tsx`

- **Action:** Add a slim, full-width banner between the `ValuationReadiness` and `ProcessTimeline` sections.
- **Design:** 
    - Background: `bg-oxford-blue` or a deep gradient.
    - Text: "Your collection is in safe hands. Fully insured up to £50,000 via specialized transit."
    - Icon: `ShieldCheck` in gold.

## 4. FAQ Contact CTA
**File:** `app/how-to-sell/page.tsx`

- **Action:** Add a "Still have questions?" footer to the FAQ section (line 141).
- **Design:** A centered, subtle text link: "Can't find what you're looking for? [Contact our expert team](/contact) for direct assistance."

## 5. Visual Consistency & Final Audit
- Ensure all new buttons use the `forest-green` or `oxford-blue` palette.
- Verify mobile responsiveness of the new "Quick-View" and "Trust Banner" sections.
- Test all links to ensure they point to the correct routes.
