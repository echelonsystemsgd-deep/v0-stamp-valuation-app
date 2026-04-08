# Implementation Plan: Unified "Us vs. Them" Comparison Section

## Objective
Refactor the `WhyChooseUs` component to merge the existing "Why Choose Us" text pillars and the "What we pay versus typical routes" table into a single, highly visual, and modern comparison component. This will provide a premium feel and clearly contrast the benefits of our service against traditional alternatives.

## Target File
`components/home/why-choose-us.tsx`

## Step-by-Step Implementation

### Step 1: Data Consolidation
Replace the distinct `pillars` and `comparisonRows` variables with a unified data structure, e.g., `comparisonFeatures`.

```typescript
const comparisonFeatures = [
  {
    title: 'Selling & Listing Fees',
    us: 'None — 100% free appraisal',
    usIcon: true, // green tick
    them: 'Up to 30% commission + hidden fees',
    themIcon: false, // red cross
  },
  {
    title: 'Payment Speed',
    us: 'Fast — typically within ~7 days',
    usIcon: true,
    them: 'Weeks to months (hammer + fees + settlement)',
    themIcon: false,
  },
  {
    title: 'Valuation Model',
    us: 'Fair market price tied to active buyer demand',
    usIcon: true,
    them: 'Varies heavily by auction room audience',
    themIcon: 'partial', // exclamation or neutral mark
  },
  {
    title: 'Expertise & Security',
    us: '25+ years experience, UK-based & fully insured',
    usIcon: true,
    them: 'Varies — Risk often left to the seller',
    themIcon: 'partial',
  },
]
```

### Step 2: Structural Refactoring
Remove the standard `<table>` element and the `.grid grid-cols-2` block used for the pillars. Replace them with a two-column grid layout for desktop, and a stacked layout for mobile.

**Mobile Layout Strategy:**
- Stack the components. Display "Typical Auction / Dealer" first (muted, pointing out pain points).
- Follow immediately with "UK Stamp Valuations" (elevated, bright, solving the pain points).

**Desktop Layout Strategy:**
- Side-by-side comparison.
- "UK Stamp Valuations" column:
  - Elevated appearance (e.g., `shadow-xl`, subtle border `border-forest-green/20`).
  - Maybe a slight negative top margin or scale up `scale-105` to break the mold and draw the eye.
  - Features vibrant green checkmarks (`<Check className="text-forest-green" />`).
- "Typical Routes" column:
  - Flattened appearance (e.g., `bg-muted/50`).
  - Uses red crosses (`<X className="text-destructive" />`) or warning triangles.

### Step 3: Implement Micro-Interactions (Optional but recommended)
Add `group-hover` effects to the rows so that when a user hovers over a specific feature (e.g., "Selling Fees"), the contrast between the two sides becomes even more obvious (e.g., our side highlights slightly, their side dims). 

### Step 4: Retain the Bottom Hook
Keep the existing CTA section (`"Ready to sell your UK stamps?"` and the buttons) untouched, as it seamlessly follows the new comparison. Ensure paddings and margins transition smoothly from the new cards to the hook.

## Acceptance Criteria
1. The new layout eliminates the old separated blocks for "Pillars" and "Table".
2. The UI is significantly more modern—utilizing cards, icons, and contrasting colors rather than flat text and standard table rows.
3. The component is fully responsive, logically stacking on mobile devices.
4. No core structural changes are made to the page outside of `why-choose-us.tsx`.
