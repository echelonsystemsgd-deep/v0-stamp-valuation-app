# Implementation Plan: Payout Badge Visibility Fix

**File:** `IMPLEMENTATION_PAYOUT_BADGE_VISIBILITY.md`
**Status:** ✅ Completed
**Priority:** Low — UX Polish
**Scope:** Single component, no structural changes

---

## Problem

On the `/sell-your-stamps` page, when a user has added quantities to the calculator, a floating payout badge appears at the bottom of the viewport (the "Total Est. Payout" pill with the "Submit for Valuation" button).

- ✅ **Full screen:** The badge sits visibly above the `StickyCTA` footer, which is `z-40`. The badge is `z-50`, so it renders on top.
- ❌ **Split screen (~768–1024px width):** The `StickyCTA` footer wraps to a taller two-line layout, which increases its height and pushes the badge out of view — or causes it to overlap and get obscured.

---

## Root Cause

The payout badge is positioned with:
```
fixed bottom-4 left-1/2 -translate-x-1/2
```
`bottom-4` = `1rem` (16px) from the bottom of the viewport.

The `StickyCTA` footer has a dynamic height — it wraps to two lines at mid-range widths — but the badge's `bottom` offset is **static**. When the footer grows taller, the badge doesn't compensate.

**File to edit:** `components/valuation/buying-table.tsx`
**Lines:** 260–277 (the `{/* Sticky Floating Action Bar */}` block)

---

## Proposed Fix

Apply a **responsive `bottom` offset** to the payout badge using Tailwind breakpoint utilities. The goal is:

- Keep the existing `bottom-4` for very small screens and full-screen desktop (where the footer is single-line or hidden).
- Increase the `bottom` offset at mid-range widths (split-screen territory: `sm:` to `lg:`) to clear the taller footer.

### Current class (line 260):
```
"fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-auto max-w-lg z-50 animate-fade-in-up"
```

### Proposed class:
```
"fixed bottom-20 sm:bottom-24 lg:bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-auto max-w-lg z-50 animate-fade-in-up"
```

### Breakdown of the change:

| Breakpoint | Class | Approx. `bottom` | Reason |
|---|---|---|---|
| Default (mobile) | `bottom-20` | 80px | Clears the mobile sticky bar (py-2 + two buttons) |
| `sm:` (≥640px) | `sm:bottom-24` | 96px | Clears the split-screen footer at its tallest wrapping point |
| `lg:` (≥1024px) | `lg:bottom-4` | 16px | At full desktop width the footer is single-line; restore compact offset |

> **Note:** The `StickyCTA` mobile bar uses `lg:hidden` (hidden at ≥1024px) and the desktop bar uses `hidden lg:block`. So at `lg:` and above, the desktop bar is single-line and shorter, justifying the return to `bottom-4`.

---

## Acceptance Criteria

- [ ] In full-screen browser, payout badge remains at its current compact position near the footer.
- [ ] In split-screen (approx. 500–900px width), payout badge is fully visible above the sticky footer at all times.
- [ ] Badge does not overlap or obscure the sticky footer in any tested viewport.
- [ ] No other components or pages are affected (this change is scoped entirely to `buying-table.tsx`).

---

## Files Modified

| File | Change |
|---|---|
| `components/valuation/buying-table.tsx` | Update `bottom` Tailwind classes on the sticky floating action bar div (line ~260) |

---

## Notes

- No changes to `sticky-cta.tsx` are required.
- No new components, state, or logic changes required.
- This is a pure CSS class change — zero risk of regression in functionality.
- The `z-50` on the badge (vs `z-40` on the sticky footer) is already correct and does not need changing.
