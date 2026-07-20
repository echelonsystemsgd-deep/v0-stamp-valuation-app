# Landing Page & Copy Adjustments (UK English)

This implementation plan covers copy adjustments and refinements requested by the client for the Stamp Valuation Web Application. The changes align all terminology with UK English conventions (e.g., spelling, phrasing), resolve structural inconsistencies, and fix desktop viewport overflows.

---

## Completed Changes

The following changes have been successfully implemented, compiled, and verified:

### 1. Headline & Subtitle Adjustments
* **About Summary Component** ([about-summary.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/home/about-summary.tsx)):
  * Changed `"turn your stamps into value"` ➡️ `"turn your stamps into cash"`.
* **Testimonials Component** ([testimonials.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/sections/testimonials.tsx)):
  * Changed `"valuations for their heritage collections"` ➡️ `"valuations for their stamps"`.
* **About Us Page Banner** ([about-us/page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/about-us/page.tsx)):
  * Updated subtitle banner to: `"For over 10 years, we have been buying postage stamps across the United Kingdom and getting sellers paid out fast and discreetly."`
  * Updated page metadata and layout metadata to `"over 10 years"` for consistency.

### 2. Service Speed & Timelines (Results within 1-12 Hours)
* **Sell CTA Card** ([sell-cta.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/sections/sell-cta.tsx)):
  * Changed Homepage Featured CTA title to `"Get An Instant Price Today"`.
  * Changed `"Results within 48h"` ➡️ `"Results within 1-12 hours"`.
* **How to Sell Page** ([how-to-sell/page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/how-to-sell/page.tsx)):
  * Changed `"Valuations within 48 hours"` ➡️ `"Valuations within 1-12 hours"`.
* **Appraisal Page** ([sell-your-stamps-view.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/sell-your-stamps/sell-your-stamps-view.tsx)):
  * Changed `"appraisal within 48 hours"` ➡️ `"appraisal within 1-12 hours"`.
* **Sell Form Submission Thank You** ([sell-form/index.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/forms/sell-form/index.tsx)):
  * Changed `"valuation within 48 hours"` ➡️ `"valuation within 1-12 hours"`.
* **Sell Form Timeline** ([sell-form/what-happens-next.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/forms/sell-form/what-happens-next.tsx)):
  * Changed `"within 48 hours"` ➡️ `"within 1-12 hours"`.
* **Process Timeline** ([process-timeline.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/content/process-timeline.tsx)):
  * Changed `"within 48 hours"` ➡️ `"within 1-12 hours"`.
* **FAQ Page** ([faq-accordion.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/content/faq-accordion.tsx)):
  * Changed `"within 48 hours"` ➡️ `"within 1-12 hours"`.

### 3. Shipping & Methods
* **How It Works Component** ([how-it-works.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/home/how-it-works.tsx)):
  * Changed `"Royal Mail Special Delivery"` ➡️ `"Royal Mail Special Delivery / Signed For Service"`.

### 4. Why Choose Us Grid
* **Why Choose Us Component** ([why-choose-us.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/home/why-choose-us.tsx)):
  * Changed introduction subtitle to: `"Clarity and security matter—especially when selling stamps."`
  * Updated Payment Speed to: `"Fast — once received payment same day"`.
  * Updated last bullet point to: `"10+ years experience, UK-based"`.
  * Added a fifth row: `"Discreet Service"` with Us: `"100% private, confidential transaction"` and Them: `"Public auction rooms and online listings"`.

### 5. Content Removal & Trust Checks
* **About Narrative Component** ([about-narrative.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/sections/about-narrative.tsx)):
  * Removed the two paragraphs detailing counts and £500 face-value guidelines.
  * Updated trust check block to: `"All stamps are carefully checked by our head buyer before any purchase."`
  * Updated float badge from `"25+"` to `"10+"` years experience.

### 6. Team Experience & Value Cards
* **About Us Page** ([about-us/page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/about-us/page.tsx)):
  * Changed description for *Expert Knowledge* card to: `"Our team has decades of combined experience."`
  * Changed description for *Customer First* card to: `"We treat every sale with care and every customer with respect, regardless of the sale size."`
  * Updated `"Our Commitment to You"` description paragraph to correct typos/grammar (*"...working with a team that genuinely cares about buying your stamps and aims to purchase them as efficiently as possible."*) and styled with `text-slate-100 font-medium` to solve low-contrast issues.
  * Removed `"Fully insured collection and shipping"` from the commitments array.
  * Changed `"Fast payment within 7 days"` to `"Fast payments within same day"`.
* **How To Sell Page** ([how-to-sell/page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/how-to-sell/page.tsx)):
  * Changed description for *Expert Valuers* card to: `"Our team has decades of combined experience."`.

### 7. Consistent Same-Day Payout Alignment
Updated all references to the 7-day payment window to **same day** across the entire website for absolute message consistency:
* [how-to-sell/page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/how-to-sell/page.tsx)
* [what-happens-next.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/forms/sell-form/what-happens-next.tsx)
* [valuation-readiness.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/sections/valuation-readiness.tsx)
* [process-timeline.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/content/process-timeline.tsx)
* [faq-accordion.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/content/faq-accordion.tsx)

### 8. Featured CTA Card Propagation
Updated all pages (Home, About Us, How to Sell, What We Buy, Contact) to consistently render the `"Get An Instant Price Today"` CTA card layout:
* `/app/page.tsx`
* `/app/about-us/page.tsx`
* `/app/how-to-sell/page.tsx`
* `/app/what-we-buy/page.tsx`
* `/app/contact/page.tsx`

### 9. Responsiveness Refinements (Workstation Grid)
* **Buying Table Component** ([buying-table.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/valuation/buying-table.tsx)):
  * Shifted the desktop table breakpoint from `lg` (1024px) to `xl` (1280px) so that mid-size tablets and small laptops render the clean, responsive card layout.
  * Decreased the desktop table minimum width from `min-w-[1000px]` to `min-w-[800px]` and adjusted the grid columns to `[1.2fr_1.6fr_80px_90px_120px_110px]` to ensure it fits perfectly inside the parent workstation columns without horizontal scroll overflows.

---

## Part 2: Layout & Sizing Audit Fixes (Pending Implementation)

The following layout, sizing, and accessibility fixes have been identified during a comprehensive audit and are being implemented:

### 1. Element Sizing & Overflow Issues
* **Buying Table Component** ([buying-table.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/valuation/buying-table.tsx)):
  * **Issue:** Inside `renderMobileCards`, the quantity controls and subtotal output are displayed side-by-side. The controls require a fixed width of `192px`. On mobile screens below `375px`, this leaves less than `60px` for the subtotal. High payouts will wrap awkwardly or bleed.
  * **Fix:** Refactor the flex layout to wrap/stack vertically on mobile screens (`flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-4`).
* **Submission Detail Client** ([submission-detail-client.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/dashboard/submission-detail-client.tsx)):
  * **Issue:** In the mobile/tablet vertical stepper, future pending steps are collapsed. The connector line loop continues anyway, leaving a stray vertical line hanging under the last visible step.
  * **Fix:** Update the connector line condition to only render if the next step is actually visible.

### 2. Touch Targets Audit (Minimum ~44x44px)
* **Product Card Component** ([product-card.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/catalog/product-card.tsx)):
  * **Issue:** The increment and decrement quantity buttons are sized to `h-9 w-9` (36px), which is too small for mobile touch controls.
  * **Fix:** Upgrade button sizes to `h-11 w-11` (44px) on mobile viewports using responsive utilities: `h-11 w-11 sm:h-9 sm:w-9`.
* **Contact Details Form** ([contact-details.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/forms/sell-form/contact-details.tsx)):
  * **Issue:** The preferred contact radio inputs are `w-5 h-5` with small inline text labels, offering narrow clickable areas.
  * **Fix:** Style the radio options as modern interactive card buttons with `p-3.5 border rounded-xl hover:bg-slate-50/50 flex items-center gap-3 w-full sm:w-auto cursor-pointer`.
* **Collection Info Form** ([collection-info.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/forms/sell-form/collection-info.tsx)):
  * **Issue:** The description quick-helper chips have small dimensions (`px-2.5 py-0.5 text-xs`, height ~22px) and are packed tightly.
  * **Fix:** Increase chip padding to `px-4 py-2` (height ~36px) and increase the flex layout gap (`gap-2.5`).
* **Appraiser Workbench** ([appraiser-workbench.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/admin/appraiser-workbench.tsx)):
  * **Issue:** The Claim button on the arrivals list uses `px-2.5 py-1.5 text-[10px]` resulting in a height of ~24px.
  * **Fix:** Change to responsive padding: `px-4 py-2.5 sm:px-2.5 sm:py-1.5`.

### 3. Responsive Layout & Sticky Collisions
* **Sticky CTA Component** ([sticky-cta.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/layout/sticky-cta.tsx)):
  * **Issue:** Redundant sticky bar overlay on `/sell-your-stamps` which is the destination page itself, competing with the payout sticky bar on mobile.
  * **Fix:** Update route check to return `null` on `/sell-your-stamps`.
* **Back To Top Component** ([back-to-top.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/layout/back-to-top.tsx)):
  * **Issue:** The BackToTop button (`bottom-24`) collides with the calculator sticky bar on mobile.
  * **Fix:** Shift the bottom position of `BackToTop` to `bottom-36` on mobile screens when on `/sell-your-stamps`.

### 4. Spacing, Whitespace, & Typography
* **Vertical Spacing on Sections** (How It Works, Why Choose Us, About Summary, About Narrative, CTA Section):
  * **Issue:** Section paddings use `py-20 md:py-28 lg:py-32` which creates excessive vertical blank space on small mobile screens.
  * **Fix:** Standardise to `py-12 md:py-24 lg:py-32` across these components.
* **Important Notice Component** ([important-notice.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/sections/important-notice.tsx)):
  * **Issue:** Layout has too much padding on small devices (`p-6 sm:p-8`).
  * **Fix:** Reduce mobile padding to `p-4 sm:p-6 lg:p-8`.
* **Global Typography Scale** ([globals.css](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/globals.css)):
  * **Issue:** Large `h1` headings scale to `text-4xl` (36px) on mobile, which is oversized for small mobile viewports (e.g. 320px/360px width) and causes word wrapping issues.
  * **Fix:** Change `h1` to scale down to `text-3xl` (30px) below the `sm` (640px) breakpoint.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify there are no compilation or TypeScript errors.
- Run `npm run lint` to verify that there are no linter/ESLint errors or warnings.

### Manual Verification
- Verify site layout responsiveness locally.
- Confirm all button and input touch targets are at least 44x44px on mobile viewports.
- Confirm no element overlap or stray connector lines in the vertical stepper.

