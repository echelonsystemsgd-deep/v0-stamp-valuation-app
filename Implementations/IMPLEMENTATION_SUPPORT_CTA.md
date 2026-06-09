# Implementation Plan - Trust & Support CTA Integration

This document outlines the steps to replace the technical text-size adjustment tool with a high-trust, human-centric "Expert Advice" telephone CTA in the global header.

---

## 1. Cleanup Phase
To maintain a clean codebase, we will remove the previous accessibility scaling logic:
- **[ ] Remove `TextSizeToggle` from `Header.tsx`**: Strip out the component usage and its import statement.
- **[ ] Delete `components/layout/text-size-toggle.tsx`**: Remove the unused component file.
- **[ ] Clean `globals.css`**: Remove the `.text-size-large` classes and root scaling rules to restore default typography behavior.

---

## 2. Support CTA Implementation

### A. New Header Component Structure
Replace the toggle area in `components/layout/header.tsx` with a dedicated Support Action group:
- **Icon**: Use the `PhoneCall` icon from `lucide-react`.
- **Label**: Add a small, elegant "Need Expert Advice?" label above the phone number.
- **Phone Link**: Implement a bold, high-contrast telephone number using the `forest-green` accent color.
- **Functional Link**: Ensure the number is wrapped in a `tel:+44...` href for mobile users to call with one tap.

### B. Styling Details
- **Font**: Use `font-bold` and slightly increased tracking for the telephone number to ensure it is the most readable "static" text in the header.
- **Desktop/Mobile Logic**: While the full number and label will show on desktop, we will ensure that on smaller screens, there is a clear, tap-to-call icon available in the mobile menu or a simplified sticky version.

---

## 🛠 Progress Checklist

- [ ] Remove `TextSizeToggle` and related imports from `Header.tsx`
- [ ] Remove text-scaling CSS from `globals.css`
- [ ] Implement the `PhoneCall` support group in the Header action area
- [ ] Configure `tel:` link and accessibility labels for the number
- [ ] Test the responsiveness of the phone CTA on mobile devices

---

## Next Steps
1.  **Execute Cleanup**: Remove the accessibility toggle immediately.
2.  **CSS Reset**: Revert the font-scaling rules in `globals.css`.
3.  **CTA Build**: Code the new phone support link into the header next to the primary CTA button.
