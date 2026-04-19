# Floating Support Widget Position Plan

## Goal
Lower the floating support widget so it feels intentional, avoids competing with hero content, and remains accessible across desktop, tablet, and mobile breakpoints.

## Current Issue
The support widget appears too high in the viewport on larger screens, which creates visual competition with primary hero messaging and can feel misaligned with surrounding layout rhythm.

## Recommended Direction
Use a bottom-right anchored pattern with responsive offsets and size behavior:

- Desktop (`>= 1024px`): full widget panel, positioned lower with consistent bottom and right spacing.
- Tablet (`768px to 1023px`): slightly reduced widget scale and spacing to preserve content visibility.
- Mobile (`< 768px`): compact trigger/FAB by default, expand panel on tap.

This keeps utility high while reducing visual clutter in the first screen.

## Implementation Scope
Primary updates should stay limited to widget container positioning, responsive sizing, and overlap safeguards.

Likely areas to update:

- Floating widget component file (where fixed positioning and dimensions are defined)
- Shared layout/style utilities if offsets are centralized

No API, routing, or business logic changes are required.

## Positioning Specifications (Proposed)
Use these values as the first implementation pass:

- Desktop:
  - bottom offset: `24px to 32px`
  - right offset: `20px to 28px`
- Tablet:
  - bottom offset: `16px to 24px`
  - right offset: `16px to 20px`
  - optional width reduction by `5-10%`
- Mobile:
  - compact trigger above bottom safe area
  - expanded panel constrained to avoid clipping and keyboard overlap

## Functional Requirements
- Widget must not overlap critical hero CTAs or block key text at common viewport sizes.
- Tap/click targets remain accessible (minimum `44px` control targets).
- Keyboard and screen-reader navigation remains intact.
- Expanded/collapsed behavior remains stable during resize and orientation changes.
- Respect device safe-area insets where applicable.

## Responsive QA Checklist
Validate on widths:

- 320
- 360
- 375
- 390
- 414
- 768
- 820
- 1024
- 1280

Expected outcomes:

- Widget appears visually lower and less intrusive.
- No overlap with primary CTAs, nav controls, or legal/cookie bars.
- No off-screen clipping on open state.
- No horizontal scrolling introduced.

## Acceptance Criteria
The change is accepted when:

- The widget sits lower and feels visually balanced on desktop.
- Tablet and mobile behavior stays usable and unobtrusive.
- All widget actions remain clear and easy to tap/click.
- No regressions are introduced in hero readability or navigation flow.

## Suggested Delivery Order
1. Identify current widget container and positioning source of truth.
2. Apply responsive bottom/right offset rules by breakpoint.
3. Tune tablet/mobile size and open-state constraints.
4. Run viewport QA sweep and adjust edge-case overlap.
5. Final visual polish (shadow/transition only if needed).
