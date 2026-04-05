# Implementation plan: dual-band CTA (reference-inspired, business-tailored)

## Purpose

Add a **two-part horizontal CTA block** (similar in *structure* to your reference: centred “hook” band + detailed action band) **directly under** the comparison table inside **“What we pay versus typical routes”** on the home page (`components/home/why-choose-us.tsx`).

This replaces or subsumes the **current** centred CTA under the table (“Get a free valuation” + “See what we buy”) so the page does not carry **two** competing conversion blocks in the same card.

---

## Reference vs your business (do not copy blindly)

| Reference pattern | Your site / data source |
|-------------------|-------------------------|
| All-caps “sell today” headline | Use **sentence case** or **title case** to match existing home typography (`text-primary`, serif headings elsewhere). |
| “Bank Transfer, Paypal & Cash” | **Confirm** actual settlement methods with the business owner before publishing. If not finalised, use neutral copy: e.g. “Secure payment once we agree your offer” or list only what is contractually true. |
| Long italic “we do not buy…” list (unsorted, non-GB, non-decimal, used, counterfeit) | **Do not lift this list.** Your catalogue (`data/what-we-buy-catalog.ts`) states you **specialise in British decimal/modern UK** and exclusions are **damaged/incomplete**, **non-UK/doubtful**, **uncertain provenance**—not “we never buy used” (your buying desk handles condition). Draft a **short** italic disclaimer that matches **that** data, plus a link to `/what-we-buy` for full detail. |
| Bright red button + red vertical rule | Your UI already uses **forest-green** primary actions and **gold**/navy accents. **Recommendation:** use **brand colours** for the accent bar and primary button for cohesion. Optional later: A/B a stronger accent—document as out of scope unless approved. |

---

## Proposed content (draft for sign-off)

**Band 1 — centred (white or `bg-card` continuation)**  
- **Headline (example):** “Ready to sell your stamps?” or “Sell your UK stamps with confidence”  
- **Subline (example):** Payment line **only after** methods are confirmed; otherwise use value-led subline: “Free valuation · No obligation · UK-based specialists”

**Band 2 — muted panel (`bg-muted/50` or `bg-slate-50` style, left-aligned)**  
- **Heading (example):** “Send an enquiry—we’re happy to help if you have questions.”  
- **Italic disclaimer (example, must align with catalog):**  
  *“We focus on British decimal and modern UK material. Heavily damaged, non-UK, or unverifiable lots may be declined—see what we buy for full detail.”*  
- **Accent quote (left border):** e.g. forest-green or primary: “We aim for a fair, clear process and prompt payment once we agree a price on material that fits our buying profile.”  
- **Primary button:** e.g. “Sell your stamps” or “Get a free valuation” → `/sell-your-stamps`  
- **Secondary:** keep “See what we buy” → `/what-we-buy` and/or “Contact” → `/contact` as text or outline button

All final strings should be reviewed against legal/compliance and the live **What we buy** page.

---

## Layout & structure

- [ ] **Placement:** Inside the existing comparison **card**, **after** the `<table>` wrapper, **before** closing the card (or split card into two visual bands with shared outer padding).
- [ ] **Band 1:** Full width of card; centred text; comfortable vertical padding (`py-10`–`py-12` range—tune to match).
- [ ] **Band 2:** Distinct background from Band 1; internal max-width for text (`max-w-3xl`) so lines do not stretch too wide on large screens; left-aligned body.
- [ ] **Accent block:** Flex row: narrow vertical bar (`border-l-4` or fixed `w-1` div) + paragraph; match pattern used elsewhere (e.g. `about-narrative` / catalog indicative notes).
- [ ] **Responsive:** Stack button row on small screens; full-width primary button on `xs` if consistent with current CTA pattern.
- [ ] **Semantics:** Band 2 heading as `<h3>` or `<p className="...">` depending on heading hierarchy (avoid skipping levels from parent `h3` “What we pay…” — prefer **one** visible `h3` per card or demote inner titles to styled `<p>` with `role="presentation"` only if needed; **prefer** promoting comparison title to `h3` and this block’s titles to strong paragraphs if hierarchy gets noisy—decide in implementation).

---

## Design system

- [ ] Reuse `Button`, `Link` from Next.js as elsewhere.
- [ ] Primary CTA: `bg-forest-green` (existing pattern), not reference red unless explicitly requested.
- [ ] Accent bar: `border-forest-green` or `border-primary` with sufficient contrast on muted background.
- [ ] Typography: `text-primary` / `text-muted-foreground` / `italic` for disclaimer; avoid all-caps wall of text for older readers—optional small-caps label only if it stays readable.

---

## Relationship to existing CTA (important)

- [ ] **Remove** the current centred block (reassurance paragraph + “Get a free valuation” + link) in favour of this dual-band block **or** merge its reassurance sentence into Band 1/2 so nothing valuable is lost.
- [ ] **Single** primary conversion path in this card after the table (no duplicate primary buttons stacked without reason).

---

## Accessibility

- [ ] Focus order: table → Band 1 → Band 2 → buttons → secondary links.
- [ ] Buttons are real `<a>` or `Button asChild` with visible focus rings (default UI components).
- [ ] Italic disclaimer remains readable (colour contrast on muted background).
- [ ] If Band 1 headline is decorative repetition, ensure one clear accessible name for the region (`aria-labelledby` on a wrapper `<section>` or `role="region"` with label).

---

## Content & data checklist

- [ ] Lock **payment methods** subline with stakeholder.
- [ ] Finalise **exclusion** one-liner from `whatWeBuyIntro` + `whatWeBuyExclusions` (do not contradict `/what-we-buy`).
- [ ] Add inline or trailing link: “Full detail on what we buy” → `/what-we-buy`.

---

## Implementation checklist (when coding)

- [ ] Edit `components/home/why-choose-us.tsx` only (unless you extract a small `ComparisonFollowupCta` component in the same folder for readability).
- [ ] Implement Band 1 + Band 2 markup and Tailwind classes.
- [ ] Remove/replace previous table-footer CTA block.
- [ ] Run `npx tsc --noEmit` and a quick responsive check (375px / 768px / 1280px).
- [ ] Update `IMPLEMENTATION_PLAN_CTA_AFTER_COMPARISON_TABLE.md` with a note that this design **supersedes** the simple CTA if fully replaced—or cross-link both docs.

---

## QA checklist

- [ ] Visual: two bands clearly distinct; no accidental double border with card edge.
- [ ] Copy: no claims about payment types unless verified.
- [ ] Links: primary → `/sell-your-stamps`; secondary → `/what-we-buy` and/or `/contact`.
- [ ] No horizontal scroll on mobile.
- [ ] Heading hierarchy makes sense with screen readers.

---

## Out of scope (unless requested)

- [ ] Stock photography or icons in this block.
- [ ] Red “competitor-style” styling variant.
- [ ] Analytics events on new buttons.
- [ ] Duplicating this block elsewhere on the site.

---

## Summary

| Item | Decision |
|------|----------|
| Location | Under the comparison **table**, inside the same card, **replacing** the current simple CTA. |
| Look | Two bands: centred hook + left-aligned detail, **brand** colours—not a pixel copy of the reference. |
| Disclaimer | **Tailored** to `what-we-buy-catalog.ts`, not the reference’s non-GB/non-decimal list. |
| Payments | **Stakeholder-confirmed** wording only. |
