# Implementation Plan: Professional Acquisition Desk (Buying Rates)

> **Update:** The interactive desk now lives at **`/buying-rates`**. **`/what-we-buy`** is a read-only catalog (see `IMPLEMENTATION_WHAT_WE_BUY_CATALOG.md`). This document still describes the desk components and data (`StampBuyingTable`, `buying-rates` data).

The goal is to transform the functional purchase tables provided in the client images into a premium, interactive "Buying Rates" component that matches the existing high-trust aesthetic of the UK Stamp Valuations platform.

## Performance Audit & Suggestion (Modernizing the Table)
Instead of a static, generic table, we will implement the **"Stamp Acquisition Desk"**. This component will:
- Use **Tabs or Accordions** to group by Class (1st, 2nd, Large Letter).
- Feature **Interactive Quantity Inputs** that calculate subtotals in real-time.
- Use **Glassmorphism & Forest Green Accents** for a premium "Expert" feel.
- Include a **Sticky Summary Bar** for "Total Purchase Offer".

---

## Phase 1: Data Architecture & Strategy
Focus on structuring the client's pricing data for dynamic use.

### 1.1 Data Object Mapping
- [ ] **Create `data/buying-rates.ts`**: Define all items seen in images:
    - **1st Class Barcoded**: 25/50 Sheets (55%), 4/8 Booklets (55%), Incomplete (52.5%).
    - **1st Class XMAS/Commem**: Barcoded (45%), Non-Barcoded (32.5%), part sheets.
    - **2nd Class Barcoded**: 25/50 Sheets (75%), 8 Booklets (72.5%), Incomplete (70%).
    - **2nd Class Large Letter**: Barcoded Sheets (70%), Booklets (70%), Incomplete (67.5%).
- [ ] **Calculation Utility**: Create `calculatePurchaseTotal(faceValue, quantity, rate)` logic.

---

## Phase 2: Component Engineering
Build the "Acquisition Desk" using the project's current design system.

### 2.1 The "Rate Table" Component (`StampBuyingTable`)
- [ ] **Responsive Grid**: Use a flexible grid that becomes "Valuation Cards" on mobile.
- [ ] **Row Design**:
    - **Visual**: Optimized thumbnail of the specific stamp sheet/booklet.
    - **Detail**: Product name and sub-description (e.g., "Non-Xmas, Barcoded").
    - **Price/Rate**: Clear display of Face Value vs Buy Rate percentage.
    - **Inputs**: Custom number inputs with +/- buttons for easier mobile use.
- [ ] **Subtotal Animation**: Use a small `CountUp` or smooth transition for the subtotal column.

### 2.2 Global Valuation Summary
- [ ] **Sticky Total Bar**: Create a bar at the bottom of the screen (on this page only) showing:
    - Total Face Value.
    - Final Offer Price.
    - "Lock In This Offer" Call-to-Action.

---

## Phase 3: Integration & Content
Connect the list to the main user journey.

### 3.1 Routing & Navigation
- [x] **Page**: Host the full acquisition desk at **`/buying-rates`** (moved from `/what-we-buy`).
- [ ] **Header Update**: Ensure the "Sell Your Stamps" or "Valuation" flow links here.
- [ ] **SEO Prep**: Title: "Current Stamp Buying Rates | UK Stamp Valuation Service".

### 3.2 Visual Polish
- [ ] **Class Styling**: Apply `.glassmorphism` to the table container.
- [ ] **Interaction Hints**: Add hover effects on rows to highlight the active line.
- [ ] **Loading States**: Add skeleton loaders while the pricing data initializes.

---

## Progress Checklist

- [ ] **Data Entry**
    - [ ] Encode all "1st Class" entries with correct rates.
    - [ ] Encode all "2nd Class" entries with correct rates.
    - [ ] Encode Large Letter & Special Commemoratives.
- [ ] **Component Build**
    - [ ] Responsive table/grid layout.
    - [ ] Real-time calculator logic.
    - [ ] Sticky summary footer.
- [ ] **Integration**
    - [x] Layout in `/app/buying-rates/page.tsx`.
    - [ ] Metadata & Metadata images.
- [ ] **Validation**
    - [ ] Verify arithmetic against client provided PNG tables.
    - [ ] Test mobile responsiveness (no horizontal scroll).

---

> [!TIP]
> **Priority Focus**: Focus on the **1st Class Barcoded** section first. Since these are the most common items, the UX must be perfect here before duplicating to 2nd Class and Large Letter.
