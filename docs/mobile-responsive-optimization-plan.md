# Mobile Responsive Optimization Plan

## Goal
Improve the mobile and split-screen experience without regressing desktop quality, with specific focus on sticky CTA behavior, typography scale, spacing rhythm, and touch usability.

## Scope
- Mobile: 320px to 767px
- Tablet: 768px to 1023px
- Desktop: 1024px and above (regression check only)
- Key pages: homepage, about page, sell flow, and other top-traffic marketing pages

## 1) Establish Mobile Baseline
- Confirm target breakpoints and treat mobile as primary.
- Keep desktop visuals largely unchanged unless a shared fix is required.
- Define a lightweight type and spacing scale for mobile, then progressively enhance at larger breakpoints.

## 2) Fix Sticky CTA Behavior Across Widths
- Current behavior intentionally hides the desktop bottom bar below `lg` and shows a floating action button.
- Decide one clear mobile pattern:
  - Option A (recommended): compact sticky bottom bar on mobile/tablet.
  - Option B: keep floating button, but reduce visual weight and improve context.
- Ensure behavior is consistent in:
  - fullscreen desktop
  - split-screen desktop
  - mobile portrait and landscape
- Validate no overlap with critical content and support safe-area insets.

## 3) Typography Pass for Mobile Readability
- Reduce the base mobile text size to avoid an oversized feel.
- Apply responsive typography so headings and paragraphs scale up only at `md` and `lg`.
- Maintain comfortable line height and readable line length for long paragraphs.

## 4) Spacing and Layout Rhythm
- Reduce excessive vertical spacing on mobile sections (for example, very large `py-*` and `mb-*` values).
- Tighten gaps around hero, about, testimonials, and CTA blocks.
- Preserve visual breathing room while improving scan speed on phones.

## 5) Component-Level Mobile Tuning
- Buttons: reduce default mobile height/padding/font size; keep larger desktop call-to-action style.
- Cards and carousel items: prevent clipping, oversized content blocks, and awkward whitespace.
- Header and nav: validate logo size, phone block, menu trigger spacing, and first viewport composition.
- Forms and interactive elements: keep accessible tap targets while avoiding oversized UI chrome.

## 6) Consistency and Hierarchy
- Normalize mobile shadow depth, border radii, and card density.
- Keep one clear primary action per viewport section.
- Retain brand tone while reducing visual heaviness.

## 7) QA Matrix and Validation
- Test viewport widths: 320, 360, 375, 390, 414, 768, 820, 1024.
- Test split-screen widths where regressions commonly appear.
- Verify:
  - no clipped or hidden section headings
  - no unintended CTA disappearance
  - no horizontal scrolling
  - comfortable tap targets and readable text
  - stable layout during orientation changes

## 8) Acceptance Criteria
- Mobile experience feels balanced, readable, and modern.
- Sticky CTA behavior is intentional and consistent by breakpoint.
- Desktop remains visually stable.
- No major responsive regressions in top-traffic pages.

## Suggested Delivery Order
1. Sticky CTA breakpoint logic and mobile pattern decision
2. Global type scale adjustments for mobile
3. Section spacing reductions (high-impact pages first)
4. Component-level tuning (buttons, cards, carousel, header)
5. QA sweep and polish
