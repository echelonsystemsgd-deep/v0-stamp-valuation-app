# Implementation Plan - Website Audit & Fixes

This plan outlines the steps to resolve issues identified during the comprehensive audit of the **UK Stamp Valuations** website. The focus is on accessibility, code quality, and navigation consistency.

---

## 1. Accessibility & Console Warnings
**Problem**: Missing `SheetDescription` in Radix UI / Shadcn `Sheet` components (used in the Mobile Menu). This triggers a console warning: *"Warning: Missing Description or aria-describedby={undefined} for {DialogContent}"*.

**Fix**:
- [ ] **Update `components/ui/sheet.tsx`**: Add `aria-describedby={undefined}` to `SheetContent` as a default if no description is provided, or ensure it's handled.
- [ ] **Update `components/layout/header.tsx`**: Add a `<SheetDescription className="sr-only">` to provide a screen-reader-only description of the mobile menu.

---

## 2. Code Quality (ESLint Warnings)
**Problem**: 20 warnings found during linting, including unused variables and potential hook cleanup issues.

**Fix**:
- [ ] **Fix `hooks/use-scroll-reveal.ts`**: Capture `ref.current` in a variable inside the `useEffect` to ensure correct cleanup.
- [ ] **Clean up unused variables**:
    - `components/valuation/buying-table.tsx`: Verify `getBuyingRateImageSrc` usage or suppress if it's a false positive.
    - `components/ui/card.tsx`: Remove or suppress `CardTitle` if it's truly unused (though it's an export).
    - `hooks/use-toast.ts`: Remove unused `actionTypes`.
- [ ] **Review `suppressHydrationWarning`**: Ensure these are only used where browser extensions or dynamic data truly necessitate them.

---

## 3. Navigation & Content Consistency
**Problem**: Minor terminology inconsistencies between "How to Sell" (Navigation) and "How It Works" (User Search).

**Fix**:
- [ ] **Standardise labels**: Ensure "How to Sell" is used consistently as the primary action label, as it's more descriptive for a buying service.
- [ ] **Check Sitemap/Metadata**: Ensure all pages have matching titles and descriptions in their respective `page.tsx` metadata exports.

---

## 4. Visual Polish & Performance
**Problem**: Check for any layout shifts or unoptimized assets.

**Fix**:
- [ ] **Responsive Check**: Double-check the `BuyingTable` on mobile to ensure no horizontal overflow.
- [ ] **Image Optimization**: Ensure all images in `public/images` have appropriate dimensions and formats.

---

## 🛠 Progress Checklist

### Diagnostics & Investigation
- [x] Run dev server and audit UI
- [x] Run `npm run lint`
- [x] Check for console errors/warnings

### Implementation
- [ ] Fix Accessibility (Sheet Description)
- [ ] Fix Linting (Hook Cleanup & Unused Vars)
- [ ] Standardise Navigation Labels
- [ ] Final Responsive Check

---

## Testing & Verification
1.  **Console Check**: Open browser dev tools and confirm no "Missing Description" warnings appear when opening the mobile menu.
2.  **Lint Check**: Run `npm run lint` and confirm 0 warnings (or only acceptable ones).
3.  **Cross-Browser Check**: Verify the fix for the `fdprocessedid` hydration mismatch (from previous plans) still holds.
