# Implementation Plan: Mobile Header 'Click-to-Call' Button

## Objective
Enhance the mobile user experience and satisfy the client's request by adding a highly visible "Click-to-Call" phone button directly in the mobile header, adjacent to the hamburger menu.

## Strategy: The Hybrid Approach
To balance the client's literal request ("put a phone sign and a number beside it") with the reality of limited mobile screen real estate, we will take a **Responsive Hybrid Approach**:

1.  **On Ultra-Small Mobile Screens (e.g., iPhone SE):** We will display **only the Phone Icon**. This prevents the header from wrapping into two lines or looking cluttered (matching the competitor's design).
2.  **On Slightly Larger Mobile Screens (e.g., iPhone Max / 'sm' breakpoint):** We will display **the Phone Icon AND the Phone Number**. This fulfills the client's exact request when there is enough physical space to allow it.

## Target File
`components/layout/header.tsx`

## Implementation Steps

### step 1: Identify the Mobile Navigation Container
Locate the `div` with `className="lg:hidden"` inside the main `<nav>` element. This `div` currently only houses the hamburger menu (`<Sheet>`).

### step 2: Restructure the Mobile Container
Change the mobile container from a simple wrapper into a flexbox container to hold both the new calling button and the existing hamburger menu side-by-side.
*   **Update:** Apply `className="flex items-center gap-2 lg:hidden"`

### step 3: Inject the Click-to-Call Link
Insert a new anchor (`<a>`) tag just before the `<Sheet>` component. This anchor will:
*   Use the `tel:` protocol populated by `contactInfo.phone` to instantly dial the number when tapped.
*   Feature the `PhoneCall` icon from `lucide-react`.
*   Include the phone number text, using tailwind classes to hide it on the smallest screens but reveal it on slightly larger ones (e.g., `hidden sm:inline-block`).
*   Be styled to stand out without clashing with the primary theme (e.g., applying a subtle `bg-forest-green/10` background or maintaining the `text-forest-green` color).

### Design Output Expectation
```tsx
<div className="flex items-center gap-2 lg:hidden">
  <a 
    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
    className="flex items-center gap-1.5 text-forest-green hover:text-forest-green/80 bg-forest-green/10 px-3 py-2 rounded-md transition-colors"
    aria-label="Call us"
  >
    <PhoneCall className="h-4 w-4" />
    {/* Text visible only on 'sm' screens and up, hidden on tiny devices */}
    <span className="text-xs font-bold hidden sm:inline-block tracking-tight">
      {contactInfo.phone}
    </span>
  </a>
  <Sheet open={isOpen} onOpenChange={setIsOpen}>
    {/* Existing Menu Trigger */}
  </Sheet>
</div>
```
