# Implementation Plan: Seamless Offer 'Lock-In' Path

The primary objective is to create a high-trust, unified journey for users who calculate a valuation on the homepage and want to "lock in" that offer. This involves passing data across pages and pre-filling the final appraisal request to eliminate redundancy.

---

## 🚀 1. Data Transmission Strategy
Instead of a simple link, the "Lock In This Offer" button will carry calculation metadata across the URL.

- **Source**: `components/valuation/price-calculator.tsx`
- **Destination**: `/sell-your-stamps`
- **Parameters**:
  - `offer_low`: The lower bound of the estimate.
  - `offer_high`: The upper bound of the estimate.
  - `face_value`: The face value input by the user.
  - `condition`: The selected condition (MNH, MH, FU, GU).
  - `rarity`: The multiplier used (Standard, Limited, etc.).

---

## 🧠 2. Page Intelligence (Detection & Tab Logic)
The "Sell Your Stamps" page must become context-aware by reading these parameters during the initial render.

- **Hook**: Use `useSearchParams` from `next/navigation`.
- **Action**:
  - If `offer_low` is detected, override the default `activeTab("calculate")` and set it to `activeTab("form")`.
  - Trigger a scroll to the specific "Appraisal Request" section to guide the user.

---

## 📝 3. Form Pre-filling & Data Hydration
The `SellForm` will be updated to accept default values, removing the need for users to re-enter data they've already provided.

- **Quantity Field**: Map the `face_value` from the URL.
- **Description Field**: Pre-populate with a formatted string: 
  > *"Calculation from homepage: £{face_value} Face Value, {condition} Condition. Estimated at £{offer_low} - £{offer_high}."*
- **Visual Feedback**: Implement a **"Returning Offer Banner"** at the top of the form:
  > ✅ **Verified Estimate**: £450 - £520 saved. Complete the form to lock in this offer.

---

## 🛠 Progress Checklist

### Diagnostics & Setup
- [x] Inspect existing `SellForm` schema for field compatibility (`quantity`, `description`, `leadSource` aligned with flow)
- [x] Define standardized naming for URL parameters (`offer_low`, `offer_high`, `face_value`, `condition`, `rarity`)

### Phase 1: Homepage Calculator (Source)
- [x] Update button link in `InteractivePriceCalculator` to dynamic URL (`URLSearchParams` + `useMemo` in `price-calculator.tsx`)
- [x] Add URL encoding for safety (handled by `URLSearchParams.toString()`)

### Phase 2: Sell Page & Form Interaction (Destination)
- [x] Implement `useSearchParams` (in `app/sell-your-stamps/sell-your-stamps-view.tsx`; `page.tsx` wraps with `Suspense` for Next.js)
- [x] Add `useEffect` to trigger tab switching on load (`offer_low` → `form` tab + scroll to `#appraisal-form-header`)
- [x] Create `SavedEstimateBanner` component (`components/sell/saved-estimate-banner.tsx`)
- [x] Propagate URL data into `SellForm` initial state (`initialQuantity`, `initialDescription`, `isLockInOffer`)

### Phase 3: Tracking & Verification
- [x] Add a hidden field in the form for lead source (`leadSource`; value `homepage_calculator` when from lock-in URL)
- [x] Verify form submission still works with pre-filled content (JSON `POST` to `/api/sell` unchanged; payload includes `leadSource`)
- [x] Test mobile responsiveness of the transition (responsive tabs/grid/banner; spot-check on a real device recommended)

---

## 🧪 Testing & Validation
1. **End-to-End Test**: Use the homepage calculator, click "Lock In", and confirm you land directly on the **Appraisal Form** with the correct numbers.
2. **Empty State Test**: Ensure navigation to `/sell-your-stamps` *without* parameters still defaults to the **Calculator Tab**.
3. **Data Integrity**: Confirm that refreshing the form doesn't lose the pre-filled data (by checking the interaction with existing `localStorage` logic).

---

## ✅ Implementation notes (completed)

- **Next.js `useSearchParams`**: The client view lives in `sell-your-stamps-view.tsx`. `app/sell-your-stamps/page.tsx` is a server component that wraps it in `<Suspense>` so production builds succeed.
- **Lead source**: Stored as `homepage_calculator` in form state and submitted with the same JSON field name `leadSource`.
- **Automated checks**: Run `npx tsc --noEmit` and `npm run build` locally after a clean `.next` if the build hits file-lock errors (e.g. OneDrive).
