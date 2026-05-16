# IMPLEMENTATION PLAN: Typography Scale Standardisation

## Goal
Eliminate inconsistent font sizes across the site by introducing a centralised type scale via CSS custom properties in `styles/globals.css`, and applying it consistently across all components.

---

## Approach: Option A — CSS Variables

Define semantic font size tokens in `:root`, set global heading/body defaults in `@layer base`, then clean up ad-hoc overrides in individual components.

---

## Phase 1 — Define the Type Scale in `globals.css`

**File:** `styles/globals.css`

### Step 1.1 — Add font size tokens to `:root`

Add the following inside the existing `:root {}` block:

```css
/* === Typography Scale === */
--font-size-xs: 0.75rem;       /* 12px — badges, eyebrow labels, fine print */
--font-size-sm: 0.875rem;      /* 14px — captions, meta, footer bottom bar */
--font-size-base: 1rem;        /* 16px — body text, nav links, footer links */
--font-size-lg: 1.125rem;      /* 18px — lead paragraphs, prominent body copy */
--font-size-xl: 1.25rem;       /* 20px — card titles, sub-headings (h4) */
--font-size-2xl: 1.5rem;       /* 24px — section sub-headings (h3) */
--font-size-3xl: 1.875rem;     /* 30px — section headings (h2) mobile */
--font-size-4xl: 2.25rem;      /* 36px — section headings (h2) desktop */
--font-size-display: clamp(2.5rem, 5vw, 4rem); /* Hero h1 — fluid scaling */
```

### Step 1.2 — Set global element defaults in `@layer base`

Add to the existing `@layer base {}` block beneath `body`:

```css
h1    { font-size: var(--font-size-display); font-weight: 700; line-height: 1.1; }
h2    { font-size: var(--font-size-3xl); font-weight: 700; line-height: 1.2; }
h3    { font-size: var(--font-size-2xl); font-weight: 600; line-height: 1.3; }
h4    { font-size: var(--font-size-xl);  font-weight: 600; line-height: 1.4; }
p     { font-size: var(--font-size-base); line-height: 1.7; }
small { font-size: var(--font-size-sm); }
```

> Note: `sm:text-4xl` responsive bumps on h2 elements can be kept in Tailwind where needed — the global default handles the mobile base size.

---

## Phase 2 — Fix Arbitrary Values (High Priority)

These are hardcoded pixel values that must be replaced immediately.

### `components/layout/header.tsx`

| Location | Current | Replace with |
|---|---|---|
| Line 99 — "Need Expert Advice?" label | `text-[10px]` | `text-xs` |

### `components/sections/testimonials.tsx`

| Location | Current | Replace with |
|---|---|---|
| Line 98 — testimonial location text | `text-[12px]` | `text-xs` |

---

## Phase 3 — Align Section Headings (Medium Priority)

Ensure every `h2` across all sections uses a consistent size class pair.

**Target class:** `text-3xl sm:text-4xl font-bold` (or let the global default handle it and just ensure `font-bold` and `tracking-tight` are set).

### Files to update:

| File | Element | Current | Action |
|---|---|---|---|
| `components/home/how-it-works.tsx` | `h2#how-it-works-heading` | No `text-*` class at all | Add `text-3xl sm:text-4xl font-bold tracking-tight` |
| `components/sections/testimonials.tsx` | `h2#testimonials-heading` | No `text-*` class | Add `text-3xl sm:text-4xl font-bold tracking-tight` |
| `components/sections/sell-cta.tsx` | `h2` (dark variant) | `text-2xl sm:text-3xl` | Change to `text-3xl sm:text-4xl` to match featured variant |

---

## Phase 4 — Standardise Card & Feature Text (Medium Priority)

### `components/home/why-choose-us.tsx`

| Element | Current | Change to |
|---|---|---|
| "Them" card `h3` | `text-xl font-semibold` | `text-2xl font-bold` (match "Us" card) |
| Feature label `h4` (both cards) | `text-sm font-semibold` / `text-sm font-medium` | `text-base font-semibold` |
| Feature body `p` | `text-sm text-muted-foreground` | `text-base text-muted-foreground` |

---

## Phase 5 — Minor Polish (Low Priority)

### `components/layout/header.tsx`

| Element | Current | Change to |
|---|---|---|
| Mobile phone number | `text-sm font-bold` | `text-base font-bold` |

### `components/layout/footer.tsx`

| Element | Current | Change to |
|---|---|---|
| Bottom bar copyright `p` | `text-base` | `text-sm` |
| Bottom bar links | `text-base` | `text-sm` |

### `components/sections/testimonials.tsx`

| Element | Current | Change to |
|---|---|---|
| Quote text | `text-sm md:text-base italic` | `text-base italic` (drop responsive variant) |
| Reviewer name | `font-serif font-bold text-navy text-sm` | `text-base font-serif font-bold text-navy` |
| Section intro | `text-lg md:text-xl` | `text-lg` (drop responsive bump — keep it uniform) |

---

## Summary of Files Changed

| File | Phases |
|---|---|
| `styles/globals.css` | Phase 1 |
| `components/layout/header.tsx` | Phase 2, Phase 5 |
| `components/home/how-it-works.tsx` | Phase 3 |
| `components/sections/testimonials.tsx` | Phase 2, Phase 3, Phase 5 |
| `components/sections/sell-cta.tsx` | Phase 3 |
| `components/home/why-choose-us.tsx` | Phase 4 |
| `components/layout/footer.tsx` | Phase 5 |

**Total files: 7**

---

## What This Does NOT Change

- Font families (`font-serif`, `font-sans`, `font-mono`) — untouched
- Font weights — only adjusted where explicitly noted above
- Colours — untouched
- Spacing/padding — untouched
- Component structure/layout — untouched

---

## Acceptance Criteria

- [ ] No `text-[Xpx]` arbitrary values remain anywhere in the codebase
- [ ] All `h2` section headings use `text-3xl sm:text-4xl` (or inherit from global default)
- [ ] All `h3` card/sub-headings use `text-2xl` consistently
- [ ] Body paragraphs use `text-base` as the baseline
- [ ] Lead/intro paragraphs use `text-lg`
- [ ] Badge/eyebrow labels use `text-xs uppercase tracking-widest`
- [ ] Footer bottom bar uses `text-sm`
