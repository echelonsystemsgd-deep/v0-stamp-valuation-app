# Implementation Plan - UI/UX Refinements

This plan details the implementation of UI/UX improvements to enhance user clarity and conversion, particularly for older or less tech-savvy users.

## Scope of Modifications

### 1. Interactive Glossary for Stamp Conditions in Rates Table
* **Target File:** `components/valuation/buying-table.tsx`
* **Changes:**
  * Import `Popover`, `PopoverTrigger`, and `PopoverContent` from `@/components/ui/popover`.
  * Wrap the `Buy Rate %` header on desktop and `Our Rate` badge on mobile in a Popover explaining the stamp condition grades:
    * **MNH (Mint Never Hinged):** Pristine gum, no hinge marks.
    * **MH (Mint Hinged):** Unused, has hinge marks/remnants.
    * **FU (Fine Used):** Light, clean cancellation mark.
    * **GU (Good Used):** Heavier cancel mark or slight imperfections.

### 2. Description helper chips in Appraisal Form
* **Target File:** `components/forms/sell-form/collection-info.tsx`
* **Changes:**
  * Render a set of clickable badge chips below the description textarea to allow quick appending of description details (e.g. "Inherited Collection 👥", "Stored in Albums 📘", etc.).

### 3. Visual Photo Guide in Image Upload Step
* **Target File:** `components/forms/sell-form/image-upload.tsx`
* **Changes:**
  * Display side-by-side green and red visual cards detailing "Good Practices" vs "Avoid These" guidelines for uploading stamp images.

### 4. Trust Reassurances & Contact Options in Contact Step
* **Target File:** `components/forms/sell-form/contact-details.tsx`
* **Changes:**
  * Insert a dedicated "Our Guarantees" box summarizing our key safety promises (no obligation, free returns, fully insured).
  * Add "Request Call Back" as an option under the Preferred Contact Method radio buttons.
