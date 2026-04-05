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
- [ ] Inspect existing `SellForm` schema for field compatibility
- [ ] Define standardized naming for URL parameters

### Phase 1: Homepage Calculator (Source)
- [ ] Update button link in `InteractivePriceCalculator` to dynamic template string
- [ ] Add URL encoding for safety (e.g., spaces to `%20`)

### Phase 2: Sell Page & Form Interaction (Destination)
- [ ] Implement `useSearchParams` in `app/sell-your-stamps/page.tsx`
- [ ] Add `useEffect` to trigger tab switching on load
- [ ] Create `SavedEstimateBanner` component
- [ ] Propagate URL data into `SellForm` initial state

### Phase 3: Tracking & Verification
- [ ] Add a hidden field in the form for "Lead Source: Homepage Calculator"
- [ ] Verify form submission still works with pre-filled content
- [ ] Test mobile responsiveness of the transition

---

## 🧪 Testing & Validation
1. **End-to-End Test**: Use the homepage calculator, click "Lock In", and confirm you land directly on the **Appraisal Form** with the correct numbers.
2. **Empty State Test**: Ensure navigation to `/sell-your-stamps` *without* parameters still defaults to the **Calculator Tab**.
3. **Data Integrity**: Confirm that refreshing the form doesn't lose the pre-filled data (by checking the interaction with existing `localStorage` logic).
