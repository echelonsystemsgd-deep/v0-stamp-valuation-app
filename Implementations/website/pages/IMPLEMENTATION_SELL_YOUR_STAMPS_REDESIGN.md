# Implementation Plan: Valuation Workspace Redesign

This plan outlines the layout redesign of the **Sell Your Stamps** page (`/sell-your-stamps`) to use a 2-column format on desktop. This places the critical eligibility and sorting guidelines (Important Information) side-by-side with the interactive Calculator and Appraisal Request form, optimizing user experience and preventing invalid submissions.

## 1. Objectives
- **Aesthetic Excellence**: Introduce a premium, structured 2-column grid layout on viewports over `lg` (1024px).
- **Sticky Notice Sidebar**: Keep the eligibility checklist in view as a sticky card on the left while users scroll the calculator or request forms on the right.
- **Mobile Responsiveness**: Stack elements vertically on mobile viewports with a collapsible notice alert toggle to preserve vertical space above the fold.

---

## 2. Proposed Changes

### Component Design

#### [MODIFY] [important-notice.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/components/sections/important-notice.tsx)
- Redesign `ImportantNotice` to support a collapsible toggle for mobile viewports.
- Restructure the UI to render as a single high-trust card:
  - Background: Premium light rose gradient (`bg-rose-50/60` to `bg-white`).
  - Border: Soft rose border (`border-rose-150`).
  - Heading: Serif Playfair Display title with a Shield Alert icon indicator.
  - Notice cards replaced with a clean list of notice points featuring green/red check icons.
  - Expand/Collapse toggle button visible only on mobile/tablet viewports (`lg:hidden`).

---

### Page Layout

#### [MODIFY] [sell-your-stamps-view.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/sell-your-stamps/sell-your-stamps-view.tsx)
- Remove `<ImportantNotice />` from the bottom of the page.
- Wrap the workspace content inside a `grid grid-cols-1 lg:grid-cols-12 gap-8 items-start` layout:
  - **Left Sidebar Column** (`lg:col-span-4 lg:sticky lg:top-24`): Render the redesigned `<ImportantNotice />` component.
  - **Right Workspace Column** (`lg:col-span-8`): Render the `Tabs` containing the Calculator and appraisal request form.

---

## 3. Verification Plan

### Manual Verification
- Open the `/sell-your-stamps` page in a desktop browser.
  - Verify that the layout splits into two columns: the guidelines notice card on the left, and the calculator on the right.
  - Scroll the page and verify that the notice card sticks to the top of the viewport.
- Switch to the Request Appraisal tab and verify the layout remains in 2 columns.
- Resize the viewport to mobile sizes:
  - Verify the layout stacks vertically with the Notice card rendered first.
  - Verify a "Collapse Guidelines" button is present to toggle visibility.
