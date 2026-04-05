# Implementation Plan: “What We Buy” as a Reference Catalog (Not a Second Valuation Tool)

## 1. Problem statement

Today, **`/what-we-buy`** is implemented as an **interactive “Professional Acquisition Desk”**: live quantity inputs, running totals, a sticky summary bar, and a “lock in” style action (`StampBuyingTable`, `GlobalValuationSummary`, etc.).  

At the same time, the **homepage hero** and other entry points invite users to **“View What We Buy”**, while **selling / valuation** is handled on **`/sell-your-stamps`** (calculator tab, appraisal form, buying table there).

**Customer confusion is predictable**: two different pages can feel like *two ways to “get a price”*, with overlapping language (“rates”, “offer”, “lock in”) and overlapping interaction patterns.  

**Desired direction**: **`/what-we-buy` should answer one question only** — *“Do you purchase the kind of material I have?”* — as a **non-interactive catalog**. Pricing detail can still be **readable** (e.g. indicative percentages or “from” copy) but **not** a second mini-checkout or calculator.

---

## 2. Product recommendation (what we should do)

### 2.1 Single clear role for each URL

| Route | Primary job | Interaction level |
|--------|-------------|-------------------|
| **`/what-we-buy`** | **Trust + clarity**: show **categories of stock we buy**, typical examples, and **how to proceed** (e.g. link to sell / contact). | **Read-only** catalog (optional anchor links, FAQ accordion *if* needed — not a valuation engine). |
| **`/sell-your-stamps`** | **Action**: calculator and/or **request appraisal** — the place to **start a sale or formal valuation**. | **Interactive** (as designed). |

Hero CTA **“View What We Buy”** then lands on a page that **matches expectations**: a **browseable list**, not another desk.

### 2.2 Visual parity with “Sell Your Stamps” (without copying the flow)

Reuse **the same page grammar** as `sell-your-stamps` so the brand feels consistent:

- **Dark hero** (`#0b1b3d` / oxford-blue family — align with whichever token the sell page uses).
- **Eyebrow badge**, **large H1**, **short supporting line** (catalog positioning, not “calculate now”).
- **Light content band** below (white / slate cards, rounded containers, subtle borders/shadows).
- **One primary CTA** after the catalog: e.g. **“Get a valuation”** → `/sell-your-stamps` (or anchor to calculator if you prefer).

Do **not** reuse sticky “total offer” bars or quantity widgets on this page.

### 2.3 What to do with the existing interactive buying desk

You have three coherent options (pick one in Phase 0):

**Option A — Relocate (recommended if the desk is still valuable)**  
- Move the current interactive experience to a **different path**, e.g. **`/buying-rates`** or **`/stamp-buying-rates`**, and link it only from **Sell** (e.g. “See detailed rate sheet”) or footer.  
- **`/what-we-buy`** becomes the **catalog** only.

**Option B — Consolidate**  
- Remove the standalone desk page entirely if **`BuyingTable` / sell tab** already covers the same need; keep **one** interactive rates surface.

**Option C — Keep desk behind a tab on Sell only**  
- No public URL for the full desk; embed or link from **`/sell-your-stamps`** “Instant Calculator” context only.

*Document the chosen option in this file when you decide so future work does not fork.*

---

## 3. Content model: the catalog (non-interactive)

### 3.1 Structure

- **Intro block** (2–3 sentences): we buy X; we do not buy Y (if applicable); next step = valuation / photos / contact.
- **Categories** (examples — adjust to real business rules):
  - Modern definitives (barcoded / non-barcoded) — sheets, booklets, coils.
  - Commemoratives / special issues.
  - First Day Covers (if purchased).
  - Collections / albums / mixtures (with “we assess on merit” copy).
  - **Explicit exclusions** (e.g. heavily damaged, certain territories, cinderellas) if you want to reduce unsuitable enquiries.

Each category should be a **card or section** with:

- **Title**  
- **Short description** (plain English)  
- **Optional**: bullet “examples we see often”  
- **Optional**: **indicative** buy policy text (e.g. “typically up to X% of face for …”) — **static text**, not inputs.

### 3.2 Data source

- Prefer a **single content file** (e.g. `data/what-we-buy-catalog.ts` or MDX) so marketing can edit categories without touching layout code.
- Keep **rates** in one place: either static strings in the catalog or imported constants shared with the sell calculator **read-only** (no duplicate calculators).

---

## 4. UX, accessibility, and SEO

- **Page title / meta**: shift from “interactive desk” to **“What We Buy | UK Stamp Valuations”** (or similar) and a description that says **reference / catalog**, not “calculate in real time”.
- **H1**: e.g. **“What we buy”** or **“Stamps & collections we purchase”** — avoid “Current buying rates” as the main headline if the page is no longer a calculator.
- **Keyboard / screen readers**: semantic headings per category; if you use accordions for long lists, ensure proper `aria-expanded` patterns.
- **Internal links**: hero and `stamp-types-preview` already point to `/what-we-buy` — no change to URL required if behavior is fixed.

---

## 5. Implementation phases (checklist)

### Phase 0 — Decision (required)

- [ ] Choose **Option A, B, or C** for the **existing** `StampBuyingTable` / `GlobalValuationSummary` experience.
- [ ] Update **site map intent** in writing (this doc + any nav labels): “What we buy” = catalog; “Sell” = action.

### Phase 1 — Content

- [ ] Finalize **category list** and **exclusions** with the business.
- [ ] Draft **static** indicative copy (percentages or ranges) where legally/operationally acceptable — no user inputs.
- [ ] Add **primary CTA** copy pointing to **`/sell-your-stamps`** (and optional secondary **Contact**).

### Phase 2 — Page rebuild (`/what-we-buy`)

- [ ] Replace current client-only “desk” page with a **server-first page** where possible (static catalog = good for SEO and simplicity).
- [ ] Implement layout **aligned with sell-your-stamps**: hero → optional notice strip → catalog sections → CTA band (reuse `InlineSellCTA` or sell-style section if appropriate).
- [ ] **Remove** sticky valuation summary and **remove** interactive totals from this route (per Phase 0 relocation).

### Phase 3 — Navigation & cross-links

- [ ] Review **header/footer** labels so “What we buy” is not confused with “Sell”.
- [ ] If the desk moves to a new URL, add **one** clear link from the catalog (“See detailed rate breakdown”) — optional.

### Phase 4 — Cleanup & legacy docs

- [ ] Update **`IMPLEMENT_BUYING_LIST.md`** (or archive it) so it does not contradict this plan for `/what-we-buy`.
- [ ] Remove dead imports and unused components **after** relocation (or delete if consolidated).

### Phase 5 — Validation

- [ ] **Mental model test**: new user reads hero → “View What We Buy” → expects a **list**, not a calculator.  
- [ ] **Empty-state test**: user opens `/sell-your-stamps` without visiting catalog — still works.  
- [ ] **Mobile**: long catalog scrolls cleanly; no horizontal scroll from fake “tables”.  
- [ ] **Build / Lighthouse**: static page should score well; fewer client bundles on this route if server-rendered.

---

## 6. Relationship to existing planning docs

- **`IMPLEMENT_BUYING_LIST.md`** described building an **interactive acquisition desk** on `/what-we-buy`.  
- **This plan** intentionally **redefines `/what-we-buy`** as a **catalog** to reduce confusion. The interactive desk remains valid **only** if it lives elsewhere (Phase 0) or is merged into the sell journey only.

---

## 7. Summary

**Recommendation**: Make **`/what-we-buy` a read-only, sell-page-styled catalog** of purchased material plus clear next steps; **relocate or retire** the interactive buying desk so there is **one** primary place to “do maths” and **one** place to “see what you buy.”  

**No code in this step** — use this file as the single source of truth before implementation.
