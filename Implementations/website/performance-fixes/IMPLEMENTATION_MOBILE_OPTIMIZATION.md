# Mobile Optimization Implementation Plan & Specification

## 📱 Overview & Goals
This document specifies the mobile optimization enhancements across the Sell Your Stamps UK web application. The goal is to provide a fluid, app-like mobile experience with optimized touch targets, safe area handling for modern iOS/Android viewports, zero iOS input auto-zoom glitches, mobile camera upload support, and non-intrusive floating UI elements.

---

## 🛠 Target Areas & Technical Specifications

### 1. Sticky CTA & Viewport Safe Areas
* **Target File:** `components/layout/sticky-cta.tsx`
* **Enhancements:**
  - Add iOS safe area bottom padding `pb-[env(safe-area-inset-bottom,0px)]` to the mobile fixed bottom bar.
  - Optimize height and spacing for 375px+ screens so CTAs remain legible without consuming excessive screen real estate.
  - Ensure background elements and footer have clearance so the sticky CTA doesn't cover footer links or buttons.

### 2. Concierge Widget Mobile Ergonomics
* **Target File:** `components/layout/concierge-widget.tsx`
* **Enhancements:**
  - On mobile viewports (`<md`), render a compact, non-intrusive floating action trigger (FAB pill / icon) with a dismiss/expand toggle, rather than a bulky card that covers 40% of the screen.
  - Position it cleanly above the bottom sticky bar (`bottom-20 left-4 sm:left-6`).

### 3. Camera Capture & Mobile Image Uploads
* **Target File:** `components/forms/sell-form/image-upload.tsx`
* **Enhancements:**
  - Support direct smartphone camera capture by providing dual input options: "Take Photo" (with `capture="environment"`) and "Choose Files / Photo Library".
  - Large, thumb-friendly tap targets for file drop zone and upload buttons.

### 4. Form Keyboards & iOS Auto-Zoom Prevention
* **Target Files:**
  - `components/ui/select.tsx`
  - `components/forms/contact-form.tsx`
  - `components/forms/sell-form/contact-details.tsx`
* **Enhancements:**
  - Ensure all inputs, select triggers, and textareas enforce minimum 16px (`text-base md:text-sm`) to eliminate iOS Safari automatic viewport zooming on tap.
  - Add native input attributes: `inputMode="tel"`, `inputMode="email"`, `autoComplete="tel"`, `autoComplete="email"`, `autoComplete="name"`, `autoComplete="postal-code"`.

### 5. Media & Hero Performance on Mobile
* **Target File:** `components/ui/hero-slideshow.tsx`
* **Enhancements:**
  - Ensure `playsInline` and `preload="metadata"` are strictly set on the hero background video to prevent excessive cellular data usage and allow smooth background autoplay across mobile operating systems.
  - Ensure smooth fallback to optimized Next.js hero images.

### 6. Interactive Touch Targets (44px Rule)
* **Target Files:**
  - `components/valuation/buying-table.tsx`
  - `components/layout/header.tsx`
* **Enhancements:**
  - Increase hit target areas on popover icons, modal close triggers, and stepper actions to meet the WCAG 44×44px minimum touch recommendation.

---

## 🧪 Verification & Testing Strategy
1. **Responsive Viewport Testing:** Test at 375px (iPhone SE), 390px (iPhone 14/15), 412px (Pixel/Samsung), and 768px (iPad).
2. **Form Interaction Testing:** Verify virtual keyboard activations (numeric vs. text vs. email) and ensure iOS does not zoom in.
3. **Camera & Upload Verification:** Verify that mobile file selection and camera snap triggers operate as expected.
4. **Collision Testing:** Verify that Concierge Widget, Sticky CTA, and mobile navigation drawer never overlap or block primary actions.
