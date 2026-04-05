# Implementation plan: UK stamp buying landing page (streamlined journey)

This document records what was implemented to reorder the home page, remove specified sections, and add a clearer “Why choose us” block with a simple comparison table for an older UK audience.

## Goals

1. **Strict vertical flow** on `/` (home):
   - Hero (slideshow + primary CTA)
   - About us summary (short, editorial)
   - What our clients say (testimonials)
   - What we buy (category grid)
   - How it works (1–2–3)
   - Why choose us (pillars + comparison table)

2. **Remove** from the codebase:
   - Advanced price calculator (homepage `InteractivePriceCalculator`)
   - “Is my collection worth valuing?” quiz (`ValuationQuiz`)
   - Condition & grading guide (`GradingGuide`)

3. **Why choose us**: prefer a **plain HTML table** with checkmarks / crosses and “Varies” where appropriate—no charts.

## Files added

| File | Role |
|------|------|
| `components/home/about-summary.tsx` | Brief heritage/expertise copy + link to `/about-us`. |
| `components/home/why-choose-us.tsx` | Four value pillars + accessible comparison table. |
| `IMPLEMENTATION_PLAN_LANDING_PAGE_UK_STAMPS.md` | This plan. |

## Files changed

| File | Change |
|------|--------|
| `app/page.tsx` | Imports and section order only; removed calculator, quiz, grading, recent valuations, trust strip, and bottom CTA section to match the requested flow. |
| `components/home/hero-slideshow.tsx` | Primary CTA label set to **Sell Your Stamps** (still links to `/sell-your-stamps`). |
| `components/home/stamp-types-preview.tsx` | `quality={90}` on grid images for sharper previews. |
| `components/sections/testimonials.tsx` | One testimonial copy updated (removed reference to the deleted homepage calculator). |

## Files removed

| File | Reason |
|------|--------|
| `components/valuation/price-calculator.tsx` | Homepage advanced calculator removed per brief. |
| `components/sections/valuation-quiz.tsx` | “Worth valuing?” section removed. |
| `components/sections/grading-guide.tsx` | Condition & grading guide removed. |
| `components/home/trust-indicators.tsx` | Superseded by `WhyChooseUs` with richer copy and table. |

## Behaviour notes

- **Sell your stamps** (`/sell-your-stamps`) still offers the **instant calculator** tab using `BuyingTable` and related UI. Only the **homepage** calculator was removed.
- **Lock-in query params** (`offer_low`, `offer_high`, etc.) previously documented for the homepage calculator no longer apply from `/`; deep links with those params may still be opened manually if needed.
- **Removed from home (not deleted in repo)**:
  - `RecentValuations` and `CTASection` were dropped from `/` so the page matches the six-section sequence. They remain available as components if you want them on another route later.

## Follow-up ideas (optional)

- Refresh older implementation notes (`IMPLEMENTATION_LOCK_IN_OFFER.md`, etc.) that still mention `price-calculator.tsx`.
- Add a short legal line under the comparison table if compliance wants disclaimers tightened.
- If SEO requires a strong bottom CTA, reintroduce `CTASection` **after** `WhyChooseUs` without disturbing the six core sections.
