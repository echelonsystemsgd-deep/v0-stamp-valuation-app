# Implementation plan: sell-page rates catalog, What We Buy imagery, and primary navigation

## Context

Three related gaps were identified:

1. **Sell Your Stamps** (`/sell-your-stamps`, tab “Instant Calculator”) shows **`BuyingTable`**, which reads **`buyingRates`** from [`data/buying-rates.ts`](data/buying-rates.ts). The current rows and grouping do **not** match the business list below (purple/green/turquoise barcoded lines, XMAS split into complete vs incomplete, and a **nested Large Letter** structure with separate 1st vs 2nd blocks).
2. **`/what-we-buy`** renders text-only category cards via [`components/what-we-buy/catalog-sections.tsx`](components/what-we-buy/catalog-sections.tsx) and [`data/what-we-buy-catalog.ts`](data/what-we-buy-catalog.ts), while the **home** page shows visual tiles in [`components/home/stamp-types-preview.tsx`](components/home/stamp-types-preview.tsx) backed by [`data/stamps.ts`](data/stamps.ts) (`featuredProducts` + `next/image`).
3. **Primary nav** ([`data/navigation.ts`](data/navigation.ts) → `mainNavigation`) lists Home, How to Sell, About Us, Contact only. **What We Buy** exists in **footer** `footerNavigation.services` and is reachable from the home “View All Categories” button, but not from the header.

**Note:** The same `buyingRates` array is also consumed by **`StampBuyingTable`** on **`/buying-rates`**. Any change to rate rows or IDs affects **both** surfaces unless you deliberately split data sources later.

---

## Canonical product list (requirements)

Use these as the **display names** (fix obvious typos in UI copy, e.g. “1st Ckass” → “1st Class”). Confirm with the business whether any line that combines “booklets” and “sheets” in one label should be **one row** or **two rows** in the calculator.

### 1st Class Rates

| # | Label |
|---|--------|
| 1 | 1st Class Barcoded Purple, Complete Sheet 25/50 |
| 2 | 1st Class Barcoded Purple, Complete Booklets 4/8 |
| 3 | 1st Class Barcoded Purple, Incomplete Sheets & Booklets |
| 4 | 1st Class Barcoded XMAS, Complete Sheets and Booklets |
| 5 | 1st Class Barcoded XMAS, Incomplete Sheets and Booklets |

### 2nd Class Rates

| # | Label |
|---|--------|
| 1 | 2nd Class Barcoded Green, Complete Sheets 25/50 |
| 2 | 2nd Class Barcoded Green, Complete Booklets 8 |
| 3 | 2nd Class Barcoded Green, Incomplete Sheets & Booklets |
| 4 | 2nd Class Barcoded XMAS, Complete Sheets and Booklets |
| 5 | 2nd Class Barcoded XMAS, Incomplete Sheets and Booklets |

### Large Letter Rates

#### 1st Class (under Large Letter)

| # | Label |
|---|--------|
| 1 | 1st Class Commemorative & Xmas, Non Barcoded Self Adhesive Stamps |
| 2 | 1st Class Commemorative & Xmas, Non Barcoded Gummed Stamps |
| 3 | 1st Class Large Letter Barcoded Turquoise, Complete Sheets 25/50 |
| 4 | 1st Class Large Letter Barcoded Turquoise, Complete Booklets 4 |
| 5 | 1st Class Large Letter Barcoded Turquoise, Incomplete Sheets & Booklets |

#### 2nd Class (under Large Letter)

| # | Label |
|---|--------|
| 1 | 2nd Class Large Letter Barcoded Green, Complete Booklets & Complete Sheets 25/50 |
| 2 | 2nd Class Large Letter Barcoded Green, Incomplete Sheets & Booklets |

*(Suggested clarification of the long green line: treat as **one row** covering both booklets and sheets **or** split into two calculator rows—decide before implementation.)*

---

## Workstream A — Buying rates data and UI grouping

### A1. Decide pricing source of truth

- For each new row, confirm **`faceValue`**, **`rate`** (buy %), and whether **`isBarcoded`** flags are still meaningful for filters or badges.
- Today’s file mixes approximate face values (e.g. 1.35, 0.85, 1.15) with legacy rows (e.g. “1st Class Non-Barcoded” under plain “1st Class”). **Replacing** the array must preserve **sensible defaults** or explicit “TBD” workflow so the site never shows empty or zero rates without intent.

### A2. Extend or replace the data model

**Problem:** `BuyingTable` and `StampBuyingTable` group only by `item.category` ([`components/valuation/buying-table.tsx`](components/valuation/buying-table.tsx)). “Large Letter” must show **two sub-headings** (1st Class / 2nd Class), which a flat `category` string cannot express cleanly.

**Recommended approach:**

- Add optional fields to `BuyingRateItem`, for example:
  - `group: "1st Class" | "2nd Class" | "Large Letter"` (top-level section), and
  - `subgroup?: string` (e.g. `"1st Class"` / `"2nd Class"` **only when** `group === "Large Letter"`).
- Or use a **stable `sectionId`** and derive headings from a small config map.

**Migration:**

- Assign **new stable `id` strings** per row (kebab-case, unique) so URL state, analytics, or saved quantities are not silently remapped.
- Remove or remap rows that are **not** in the new spec (e.g. current generic “XMAS/Commem” single row) so the sell page and buying desk stay aligned with the new taxonomy.

### A3. Update both table UIs

| File | Change |
|------|--------|
| [`components/valuation/buying-table.tsx`](components/valuation/buying-table.tsx) | Render **section title** (`group`), then optional **subheading** (`subgroup`) for Large Letter, then rows. Adjust `getImageForProduct` (or per-item `imageUrl`) so purple / green / turquoise / XMAS can map to **correct** assets where available. |
| [`components/buying-desk/StampBuyingTable.tsx`](components/buying-desk/StampBuyingTable.tsx) | If it still tabs by flat `category`, refactor tabs or inner layout to match the same **group + subgroup** hierarchy so behaviour matches `/sell-your-stamps`. |

### A4. Imagery for rate rows

- Today, images are inferred from coarse `category` only. New labels imply **colourways** (purple, green, turquoise) and **product shapes** (sheets vs booklets).
- **Options:** (1) add **`imageUrl`** per `BuyingRateItem` and place files under `public/images/…`; (2) extend `getImageForProduct` with rules on `name`/`id`; (3) reuse existing placeholder images until real photography exists.
- Ensure **`next/image`** `alt` text reflects the **product name** (already partly true) and that new assets are listed in any image allowlist if the project uses one.

### A5. QA checklist (rates)

- [ ] Row count and labels match the tables above (after business sign-off on combined vs split lines).
- [ ] Totals on `/sell-your-stamps` match `/buying-rates` for the same quantities.
- [ ] Mobile card layout in `BuyingTable` (if present) still scrolls and does not overflow horizontally.
- [ ] No broken `id` references in tests or docs.

---

## Workstream B — What We Buy page imagery

### B1. Choose content strategy

Align with marketing/stock:

- **Option 1 — Reuse home grid:** Import the same `featuredProducts` slice (or a dedicated `whatWeBuyPreview` export) and render **`next/image`** cards similar to [`components/home/stamp-types-preview.tsx`](components/home/stamp-types-preview.tsx), either **above** the white content panel or **inside** each category card.
- **Option 2 — Data-driven catalog:** Extend `WhatWeBuyCategory` in [`data/what-we-buy-catalog.ts`](data/what-we-buy-catalog.ts) with optional `image?: string` and `imageAlt?: string` per category, then update [`WhatWeBuyCategoryGrid`](components/what-we-buy/catalog-sections.tsx) to show a leading image (responsive aspect ratio, consistent with design system).
- **Option 3 — Hybrid:** Hero or top strip of 3–4 images + text cards below.

### B2. Implementation notes

- Prefer **one** source of truth for image paths to avoid drift between home and `/what-we-buy`.
- Respect existing **`quality`** / sizing patterns from the home section for visual parity.
- Add **`loading` / priority** only for above-the-fold images if needed for LCP.

### B3. QA checklist (images)

- [ ] Images load on `/what-we-buy` in light/dark if applicable.
- [ ] Alt text is meaningful; decorative images use `alt=""` and `aria-hidden` where appropriate.
- [ ] Layout still works on narrow viewports (grid → single column).

---

## Workstream C — Primary navigation: “What We Buy”

### C1. Add to `mainNavigation`

In [`data/navigation.ts`](data/navigation.ts):

- Insert `{ label: 'What We Buy', href: '/what-we-buy' }` in a position that matches business priority (often after **How to Sell** or before **Contact**).

**Effects:**

- Desktop header ([`components/layout/header.tsx`](components/layout/header.tsx)) iterates `mainNavigation` — link appears automatically.
- Mobile sheet uses the same array — **no duplicate edit** required.

### C2. Consistency and discovery

- Confirm **footer** still makes sense (avoid redundant wording unless intentional).
- Optional: add **`PageBreadcrumbs`** or meta title/description for `/what-we-buy` if SEO matters (`app/what-we-buy/layout.tsx` or `page.tsx` metadata).

### C3. QA checklist (nav)

- [ ] Link visible desktop + mobile; focus order and keyboard access OK.
- [ ] Active state styling matches other items when pathname is `/what-we-buy`.

---

## Suggested implementation order

1. **Business approval** — Final row list, split vs combined lines, face values, and percentages.
2. **Data model + `buyingRates` rewrite** — Single source for both tables.
3. **BuyingTable + StampBuyingTable** — Grouping and images.
4. **What We Buy images** — Data or shared component approach.
5. **Navigation** — One-line change in `mainNavigation` plus quick regression on header/sheet.

---

## Out of scope (unless requested later)

- Real-time Royal Mail tariff API integration.
- Per-user saved carts or server-persisted quantities.
- Full redesign of `/buying-rates` tabs if a different IA is preferred.

---

## Document history

- **2026-04-05:** Initial plan from user requirements; codebase paths verified (`buying-rates`, `BuyingTable`, `StampBuyingTable`, `what-we-buy` catalog, `mainNavigation`).
