# Implementation Plan: Selling Process Timeline CTAs

## Goal
The client has requested a "Sell Your Stamps" button at each step of the "Selling Process" section (timeline) so users have a clear call-to-action (CTA) whenever they finish reading a step.

## UX/UI Design Approach

1. **Placement**: Place the CTA button directly inside the `<CardContent>` of each step in the `ProcessTimeline`, below the bullet points.
2. **Styling**: To avoid overwhelming the page with 6 heavy, identical primary buttons, we will use a **Secondary Button Style** (e.g., outline or secondary colors) for the timeline steps. The exact style can be tuned during implementation.
3. **Contextual Text**: Instead of repeating "Sell Your Stamps" on every step, we will use contextual text that matches the stage of the timeline, making the journey feel personalized.

## Changes Required

### 1. Update `components/content/process-timeline.tsx`

#### Step 1: Import Components
Import the `Button` component and `Link` from `next/link`.
```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
```

#### Step 2: Add `ctaText` to `timelineSteps` Data
Enhance the existing `timelineSteps` array by adding a `ctaText` field to each step object. This provides a tailored message for each stage of the journey.

*Example data update:*
```ts
const timelineSteps = [
  {
    icon: ClipboardList,
    title: 'Submit Your Collection Details',
    // ...existing data
    ctaText: 'Start Your Submission',
  },
  {
    icon: Search,
    title: 'Receive Your Free Valuation',
    // ...existing data
    ctaText: 'Request Your Valuation',
  },
  {
    icon: MessageSquare,
    title: 'Review & Decide',
    // ...existing data
    ctaText: 'Sell Your Stamps',
  },
  {
    icon: Truck,
    title: 'Arrange Secure Collection',
    // ...existing data
    ctaText: 'Arrange Collection',
  },
  {
    icon: ShieldCheck,
    title: 'Expert Verification',
    // ...existing data
    ctaText: 'Sell Your Stamps',
  },
  {
    icon: Banknote,
    title: 'Receive Payment',
    // ...existing data
    ctaText: 'Start Selling Today',
  },
]
```

#### Step 3: Update the Component Render Loop
Within the `.map()` loop that renders each `Card`, add a new `div` below the `<ul>` for the bullet points to render the new contextual button.

```tsx
<Card className="flex-1">
  <CardContent className="p-6">
    {/* existing title, description, and list mapping */}
    <ul className="flex flex-col gap-2">
      {step.tips.map((tip) => (
        // ...
      ))}
    </ul>
    
    {/* NEW CTA BUTTON */}
    <div className="mt-6 pt-6 border-t border-border/50">
      <Button asChild variant="outline" className="w-full sm:w-auto">
        <Link href="/sell-your-stamps">
          {step.ctaText}
        </Link>
      </Button>
    </div>
  </CardContent>
</Card>
```

## Review and Next Steps

Please review the plan. Once approved, I will implement and test these changes!
