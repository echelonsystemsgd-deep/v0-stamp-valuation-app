# Implementation Plan: Calculator UX & Data Persistence

## 1. Goal
Improve the Instant Calculator UX by making the total valuation persistently visible, and ensure any data entered by the customer in the calculator carries over when they proceed to Request Appraisal.

## 2. Visually Appealing Persistent Valuation
To solve the scrolling issue, I suggest a **Sticky "Floating Action Bar"**. 
Instead of forcing users to scroll all the way to the bottom to see their total, a sleek, premium-looking sticky bar will appear at the bottom of their screen the moment they add their first item.

**Modifications to `BuyingTable` Component:**
- Keep the current large summary section at the bottom for closure, but introduce a fixed widget (`fixed bottom-4 left-1/2 -translate-x-1/2` or full-width on mobile).
- **Design:** Ensure high aesthetics with a glassmorphism (blurred) background, dropping a dynamic shadow.
- **Content:** It will display `"Total: £XX.XX"` alongside the `"Submit for Valuation"` button. It dynamically updates as the user clicks `+` or `-`.

## 3. Passing Data to the Appraisal Form
Currently, clicking submit just switches tabs. We need to pass the calculator state smoothly into the `SellForm`.

**Modifications to `BuyingTable` Component:**
- Update the `onAction` callback so it returns the exact items and total: `onAction?: (quantities: Record<string, number>, totalValue: number) => void`.

**Modifications to `SellYourStampsView` Component:**
- Introduce a new state: `const [calculatorData, setCalculatorData] = useState<{quantities, total} | null>(null)`.
- Update `handleValuationAction` so it receives the data and saves it to state before transitioning to the form tab.
- Build a helper routine that maps the submitted `quantities` against the standard catalog `buyingRates`, to auto-generate a structured message.
  - *Example output:*
    `Calculated via tool:`
    `- 5x 1st Class Barcoded Purple Complete Sheets`
    `- 2x 2nd Class Barcoded Green Booklets`
    `Total Est. Payout: £XX.XX`
- Inject this auto-formatted text into the `SellForm`'s `initialDescription` text area automatically, drastically saving the user time.

## 4. Approval
Once you confirm this plan makes sense and handles the user issues adequately, I can execute the code changes.
