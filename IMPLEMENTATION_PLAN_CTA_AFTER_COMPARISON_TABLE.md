# Implementation plan: CTA after “What we pay versus typical routes”

## Recommendation (before you build)

**Yes—add a secondary CTA there, but treat it as a “next step,” not a duplicate of the hero.**

- **Why it helps:** Readers who reach the comparison table have already invested attention in *why* your offer differs. A clear button at that moment turns “I understand” into “I’ll try this”—especially for users who scroll past the hero without clicking.
- **Why not identical to the hero:** The hero sells the *idea* of selling; this spot sells *action after trust*. Use the same destination (`/sell-your-stamps`) but slightly different supporting text (e.g. emphasis on “no obligation” or “free valuation”) so it does not feel copy-pasted.
- **Risk if you skip it:** Users finish the table and naturally look for “what now?”—the footer or a long scroll back to the hero adds friction.
- **Risk if you overdo it:** Multiple identical “Sell your stamps” blocks on one page can feel pushy. One well-placed CTA after the table is usually enough; avoid adding the same primary label in three places without variation.

**Suggested pattern:** One button (primary) + one line of reassurance (e.g. no obligation, UK-based, free valuation). Optional: text link to `/what-we-buy` for browsers not ready to sell.

---

## Decision checklist

- [x] Confirm you want a **single** extra CTA after the comparison table (not also mid-table).
- [x] Decide **label**: “Get a free valuation” (primary); hero remains “Sell your stamps” for differentiation.
- [x] Decide **link target**: `/sell-your-stamps` only.
- [x] Decide if you need a **secondary** text link — yes: “See what we buy” → `/what-we-buy`.
- [x] Align tone with **older UK audience**: short sentence, plain English, no jargon.

---

## Implementation checklist (when you code)

- [x] Open `components/home/why-choose-us.tsx` (section that contains “What we pay versus typical routes”).
- [x] Add a **contained block** immediately below the table wrapper (inside the same card or just below the card—pick one for visual consistency).
- [x] Use existing **Button** + **Link** pattern (match `hero-slideshow` or `about-summary` styling).
- [x] Ensure **keyboard and screen reader** flow: heading → table caption/headers → CTA is logical; CTA has visible focus styles.
- [x] Check **mobile**: CTA full-width or centered; no horizontal scroll from new layout.
- [x] Verify **contrast** of button on `bg-card` / `bg-secondary` background.
- [x] Update this file with a one-line “done” note and date when shipped — see **Shipped** below.

---

## QA checklist

- [x] Home page: scroll from hero to comparison table; CTA appears once in the right place.
- [x] Click CTA → correct route loads (`/sell-your-stamps`).
- [x] No duplicate **identical** hero+table CTAs without differing subtext (unless product owner explicitly wants repetition).
- [ ] Lighthouse / axe (optional): no new accessibility regressions on the section.

---

## Shipped

- **2026-04-05:** CTA block added inside the comparison card in `components/home/why-choose-us.tsx` (reassurance copy, “Get a free valuation” → `/sell-your-stamps`, “See what we buy” → `/what-we-buy`).
- **2026-04-05 (update):** That simple single-block CTA was **replaced** by the dual-band follow-up described in `IMPLEMENTATION_PLAN_DUAL_BAND_CTA_AFTER_COMPARISON.md` (centred hook + muted detail band, catalog-aligned disclaimer, primary + outline secondaries).

---

## Out of scope (unless requested later)

- [ ] Sticky footer CTA bar changes.
- [ ] A/B testing or analytics events on the new button.
- [ ] Replacing or removing the hero CTA.

---

## Summary

| Option | Suggestion |
|--------|------------|
| Add CTA under comparison table? | **Recommended** — one clear next step after trust-building content. |
| Same wording as hero? | **Prefer slight variation**; same destination is fine. |
| Also add elsewhere? | **Not by default** — avoid CTA fatigue on the same page. |
