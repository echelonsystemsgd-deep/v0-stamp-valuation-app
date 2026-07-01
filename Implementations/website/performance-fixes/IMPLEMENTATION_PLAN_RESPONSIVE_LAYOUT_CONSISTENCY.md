# Implementation plan: responsive layout consistency (full screen vs split view)

## Problem (from your screenshots)

On a **wide** viewport, the site shows the **full desktop header** (inline nav, phone block, primary “Sell Your Stamps” button) and a **wide bottom sticky CTA bar** with copy on the left and actions on the right.

When you **split the browser** (narrower width), the experience **changes sharply**: the header collapses to the **hamburger + sheet** pattern, while other “desktop” chrome (notably the **bottom sticky bar**) may still behave like a desktop layout. The overall look and information density no longer feel like the same design system—more like two different sites at an arbitrary width.

You want this to **flow consistently across the whole site**, not only on the home page.

---

## Root causes (codebase-specific)

### 1. Mismatched breakpoints between global chrome components

| Component | “Desktop” behaviour starts at | Effect |
|-----------|------------------------------|--------|
| `components/layout/header.tsx` | **`lg` (1024px)** — `hidden lg:flex` for nav + phone + button | Below 1024px → **mobile header** (hamburger). |
| `components/layout/sticky-cta.tsx` | **`md` (768px)** — bottom bar `hidden md:block`; FAB `md:hidden` | From 768px upward → **desktop sticky bar** (unless scroll-hidden). |

So between **768px and 1023px** you get a **hybrid**: mobile-style header + desktop-style bottom bar. Split-screen windows often land in **~900–1100px**, which triggers the hamburger **while the page still feels “desktop”** to the user.

This is the single biggest explanation for “full screen vs split screen looks different.”

### 2. Sticky bar is a single horizontal row with `justify-between`

The desktop sticky bar uses a **flex row** with **left cluster** (icon + two lines of text) and **right cluster** (link + button). On **medium widths** (still “md desktop”), that row can:

- Leave a **large empty middle** (looks fine on ultrawide, odd when narrow).
- **Compress** text and buttons without a designed intermediate layout (wrap, stack, or shorten copy).
- Risk **overflow or tight tap targets** if not given `min-w-0`, wrapping rules, or a breakpoint-specific stack.

### 3. No documented “canonical” layout tier for the product

Different sections already use `md:`, `lg:`, and `max-w-7xl` in sensible ways for **content**, but **global UI** (header + sticky CTA + optional future bars) does not share one **named tier** (e.g. “compact desktop” vs “full desktop”). That makes drift likely as you add pages.

---

## Goals

1. **Predictable tiers**: At a given viewport width, header and sticky CTA (and similar global elements) should agree on whether the user is in **mobile**, **compact desktop**, or **full desktop**.
2. **Smooth degradation**: Narrowing the window should **progressively** simplify layout (e.g. stack sticky bar, shorten labels, or collapse nav)—not flip unrelated pieces at different widths.
3. **Site-wide**: Apply the same rules anywhere similar patterns exist (search for `md:hidden` / `lg:hidden` pairs on layout components).
4. **No horizontal scroll** on common split widths (e.g. half of 1920px, 1366px, small laptops).

---

## Recommended direction (choose one primary strategy)

### Strategy A — **Align sticky CTA to the header (`lg`)** (low risk, quick win)

- Show the **floating FAB** (or a compact mobile-style CTA) **below `lg`**, same as the mental model “no full desktop header yet.”
- Show the **full-width bottom bar** only at **`lg` and above** (1024px+), matching when the inline nav appears.

**Pros:** One clear rule: **1024px = full desktop chrome**. Matches your screenshots’ intuition.  
**Cons:** Users between 768–1023px lose the bottom bar; ensure the FAB (or in-content CTAs) is still strong enough.

### Strategy B — **Lower the header’s “full desktop” breakpoint to `md`** (higher risk)

- Expose inline nav + phone + CTA from **`md` upward**.

**Pros:** Split-screen widths might still see the full header.  
**Cons:** At **768px** the header can become **crowded** (many links + phone + button). Likely needs a **compact header variant** (smaller type, fewer visible links, “More” menu, or icon-only phone).

### Strategy C — **Three tiers: `md` compact desktop, `lg` full desktop** (most polished, more work)

- **`md`–`lg`:** Compact header (e.g. logo + shortened nav or priority links + menu) **and** compact sticky CTA (stacked row, shorter headline, or single primary button).
- **`lg+`:** Current full header + current full sticky bar.

**Pros:** Best UX across tablets and split screen.  
**Cons:** More design and implementation; must define Figma-level rules for the middle tier.

**Suggestion:** Start with **Strategy A**, then evolve toward **Strategy C** if you still want inline nav on mid widths without cramping.

---

## Sticky CTA bar — layout refinements (whichever strategy you pick)

Apply at **`lg`+** (if using Strategy A) or refine for all desktop widths:

- [ ] Add an intermediate layout: e.g. **`lg:flex-row`** but **`flex-col gap-4`** at **`lg` only when** `max-width` is tight—prefer **CSS container queries** on a wrapper (`@container` + `@lg:`) *or* a **`xl:`** breakpoint to switch from stack to row.
- [ ] Give the text column **`min-w-0`** and allow **sensible line breaks**; avoid fixed min-widths on buttons.
- [ ] Consider **shorter headline** on narrow desktop (same semantic message, fewer words) via responsive classes or two spans with `hidden`/`block` at breakpoints.
- [ ] Align **horizontal padding** with the header: both use `max-w-7xl` + similar `px-*`; verify the sticky bar’s outer `px-4` plus inner container **matches** the main grid visually.

---

## Site-wide audit (before or during implementation)

- [ ] Grep for **`lg:hidden`**, **`md:hidden`**, **`hidden lg:`**, **`hidden md:`** under `components/layout/` and any **fixed/sticky** UI.
- [ ] Check **`BackToTop`**, **`SupportPanel`**, and **`PageBreadcrumbs`** for overlap with sticky bar / FAB at **768–1024px** after breakpoint changes.
- [ ] Verify **focus order** and **keyboard** behaviour when sticky bar switches between FAB and bar.

---

## Testing matrix (manual QA)

Test at least:

| Width (px) | Intent |
|------------|--------|
| 360–390 | Mobile |
| 768 | `md` boundary |
| 900–1024 | **Split-screen / small laptop** (current pain zone) |
| 1024 | `lg` boundary |
| 1280+ | Full desktop |

For each width: home + one inner page (e.g. `/about-us`, `/how-to-sell`). Confirm **no horizontal scroll**, **no clipped buttons**, and **header + sticky CTA “tier” matches**.

Optional: run **axe** or Lighthouse on a split width after changes.

---

## Implementation checklist (when you code)

- [ ] Decide **Strategy A, B, or C** (recommend **A** first).
- [ ] Update **`components/layout/sticky-cta.tsx`** breakpoint(s) and responsive layout per strategy.
- [ ] Update **`components/layout/header.tsx`** only if pursuing **B** or **C**.
- [ ] Re-test **FAB vs bar** transition and z-index stacking with **hero / footer**.
- [ ] Run **`npx tsc --noEmit`** and a quick responsive pass in DevTools.

---

## Out of scope (unless you ask later)

- Redesigning brand colours or typography.
- Replacing the hamburger with a completely different navigation paradigm.
- Container-query adoption across every card on the site (focus global chrome first).

---

## Summary

| Issue | Likely cause | Primary fix |
|-------|----------------|-------------|
| Split screen “looks like a different site” | Header flips at **`lg`**, sticky bar at **`md`** | **Align breakpoints** (e.g. sticky bar only from **`lg`+**) |
| Sticky bar feels empty or cramped | Single `justify-between` row at all desktop widths | **Stack or wrap** at mid widths; **`min-w-0`** on text |
| Inconsistent feel site-wide | No shared “layout tier” | **Audit** layout components; document **one rule** for mobile / compact / full desktop |

---

## Document history

- **2026-04-05:** Initial plan from full-screen vs split-screen screenshots and review of `header.tsx` + `sticky-cta.tsx`.
