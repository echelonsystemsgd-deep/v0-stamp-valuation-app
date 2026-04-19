# Header Mobile Call Action Plan

## Goal

Improve the mobile header so it feels less plain and avoids the empty visual gap, while preserving clarity, trust, and clean spacing.

## Current Issue

On smaller mobile widths, the phone number text is hidden and only the phone icon is visible. This creates an unbalanced area between the logo and menu icon and makes the header feel incomplete.

## Recommended Direction

Use an adaptive mobile call action that keeps the phone icon visible at all sizes, and progressively reveals text when space allows:

- `>= 390px`: show full phone number next to icon.
- `360px to 389px`: show compact label (`Call Us`) next to icon.
- `< 360px`: keep icon-only state to protect layout spacing.

This keeps the header practical on all widths while improving perceived polish.

## Visual Enhancement (Low Clutter)

Add one subtle trust cue to reduce the plain look without crowding the top bar:

- Preferred: mobile-only microcopy near logo (for example: `25+ years expertise`).
- Alternative: thin accent divider/underline in brand color.

Do not add multiple decorative elements in the header; the hero should remain the main focal area.

## Implementation Scope

Primary file to update:

- `components/layout/header.tsx`

No routing, data, or API changes are required. This is a UI-only refinement.

## Functional Requirements

- Keep one consistent `tel:` target for all mobile states.
- Maintain accessible labeling for icon-only mode (clear `aria-label`).
- Preserve touch target size (minimum 44px for call and menu controls).
- Keep existing menu behavior unchanged.

## Responsive Behavior Checklist

Validate at these widths:

- 320
- 360
- 375
- 390
- 414
- 768

Expected outcomes:

- No overlap between logo and right-side actions.
- No awkward empty space in the header.
- Call action remains obvious and tappable.
- Menu icon alignment remains stable.

## QA and Acceptance Criteria

The change is accepted when:

- The header looks balanced on small mobile screens.
- Users can identify and tap the call action quickly.
- Trust cue is visible but not visually noisy.
- No regressions occur in menu open/close behavior.

## Notes

- Keep changes minimal and focused on mobile header usability.
- Prefer utility-class adjustments over broad global style changes.
