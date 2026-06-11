# UI Improvements based on Feedback

We are implementing two main UI refinements based on the recent client feedback, while preserving the existing "Sell Your Stamps" copy as requested.

## Proposed Changes

### 1. Tone Down Hero Button Effects
**File:** `components/home/hero-slideshow.tsx`

We will tone down the animations on the buttons in the hero section to make them feel more premium and less distracting.
- **"Sell Your Stamps Today" button**: Remove the `shimmer` animation block that continuously plays on hover. Replace it with a subtle scale or brightness change (e.g., `hover:scale-105` or standard `hover:bg-forest-green/90`).
- **"Request a Free Valuation" button**: Ensure the hover transition remains elegant and smooth without excessive glowing effects.

### 2. Reorder Sell Your Stamps Flow (Simulator First)
**File:** `app/sell-your-stamps/sell-your-stamps-view.tsx`

We will adjust the flow of the page so that the interactive valuation tool (the "Simulator") is immediately accessible before the user has to scroll past notes.
- **Reorder Layout**: Move the `<ImportantNotice />` component from above the Tabs section (the Calculator / Appraisal form) to directly below it.
- **Result**: The layout order will be `HeroSlideshow` -> `Simulator (Tabs)` -> `ImportantNotice`, allowing users to start the valuation process immediately upon landing on the page.
