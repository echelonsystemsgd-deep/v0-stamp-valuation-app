# Implementation Plan - Add Decimal Barcoded Stamp Values

This plan outlines the changes needed to integrate £1 - £5 and 5p - 50p barcoded stamp values into the stamp valuation app, paying the exact percentages shown in the client's screenshot.

## User Review Required

> [!NOTE]
> We will adapt the calculator UI specifically for these items. Instead of entering the count of sheets/booklets (integers with `+/-` buttons), users will type a total decimal face value directly. The input box for these items will feature a leading `£` symbol and a wider design to make this distinction visually clear.

## Proposed Changes

---

### Data Models & Rates

#### [MODIFY] [buying-rates.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/data/buying-rates.ts)
- Add `"Barcoded Values"` to the `BuyingRateGroup` type and `BUYING_RATE_ORDER` array.
- Add `allowDecimal?: boolean` to the `BuyingRateItem` interface.
- Add the following four new items to the `buyingRates` array:
  1. **£1 – £5 Barcoded, Complete Sheets 25** (55% rate, face value multiplier = 1, decimal-enabled)
  2. **£1 – £5 Barcoded, Incomplete Sheets, Individual Stamps** (50% rate, face value multiplier = 1, decimal-enabled)
  3. **5p – 50p Barcoded, Complete Sheets 25 (NOT 1p or 2p sorry!)** (50% rate, face value multiplier = 1, decimal-enabled)
  4. **5p – 50p Barcoded, Incomplete Sheets, Individual Stamps (NOT 1p or 2p sorry!)** (45% rate, face value multiplier = 1, decimal-enabled)

---

### Components & UI

#### [MODIFY] [buying-table.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/valuation/buying-table.tsx)
- Modify state type of `quantities` to be `Record<string, string | number>` so we can preserve raw text input (e.g. preserving a trailing `.` while the user is typing decimals).
- Update calculation utilities (`calculateSubtotal`, `totalValue`) to parse string inputs to floats on the fly.
- Update `handleInputChange` to check `allowDecimal` flag and validate inputs using a decimal-safe regex (`/^\d*\.?\d*$/`).
- Customize the input UI row for decimal items:
  - Remove the `+/-` buttons (since they don't apply well to arbitrary decimal amounts).
  - Prepend a static `£` indicator in the input block.
  - Widen the input box (`w-24` desktop / `w-32` mobile) and set placeholder to `0.00`.
- Update `onAction` trigger to parse quantities into clean numbers before submitting them to the parent view.

#### [MODIFY] [sell-your-stamps-view.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/sell-your-stamps/sell-your-stamps-view.tsx)
- Update `handleValuationAction` to format decimal-based items nicely in the form description (e.g. writing `- £12.50 Face Value of [Item]` instead of `- 12.5x [Item]`).

---

### Catalog & "What We Buy" page

#### [MODIFY] [what-we-buy-catalog.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/data/what-we-buy-catalog.ts)
- Add a new category object under `whatWeBuyCategories` for `"barcoded-values"` showing the rate "Up to 55%" and containing a description explaining what barcoded face values are accepted.

#### [MODIFY] [catalog-sections.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/what-we-buy/catalog-sections.tsx)
- Update `relatedProducts` filtering condition so that the new catalog section automatically filters and shows items belonging to the `"Barcoded Values"` group.

---

## Verification Plan

### Automated / Manual Verification
1. Run local development environment: `npm run dev`.
2. Navigate to the **Instant Calculator** and locate the new `"Barcoded Values"` group.
3. Test entry:
   - Type a decimal value (e.g., `12.50`) in the input for **£1 - £5 Barcoded, Complete Sheets 25** (55%).
   - Verify subtotal calculates: `12.50 * 0.55 = £6.88`.
   - Try typing letters or extra dots and verify validation prevents invalid input.
4. Verify other rows:
   - Click `+` on standard 1st class items and verify integer incrementing continues to work perfectly.
5. Click **Submit for Valuation** and inspect the pre-filled description on the Request Appraisal form to ensure clean formatting (e.g., `- £12.50 Face Value of £1 - £5 Barcoded, Complete Sheets 25`).
6. Navigate to `/what-we-buy` and check that the new category block renders nicely with list items and correct rate badges.
