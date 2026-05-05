# Implementation Plan: About Us Landing Page Copy Update

## Objective
Update the text within the "About Us" summary section on the landing page to reflect the new, expanded copy provided by the client.

## Target File
`components/home/about-summary.tsx`

## Scope of Changes

1. **Locate Text Container:** Find the `div` containing the `<p>` tags within `AboutSummary` (lines 20-29).
2. **Replace Content:** Replace the existing two `<p>` tags with four new `<p>` tags containing the updated copy.
3. **Preserve Structure & Styling:** Maintain the existing Tailwind typography and spacing classes (`mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed text-left md:text-center md:text-balance`) on the parent container to ensure the new text is styled consistently with the rest of the page.
4. **Formatting:** Ensure the text is properly formatted within React JSX (handling any special characters if necessary).

## New Content to Inject

```tsx
<p>
  For over twenty-five years, we have helped families and collectors across the UK
  understand the true value of their stamp collections—without pressure, jargon, or obligation.
</p>
<p>
  We are an independent UK-based valuation and buying service, offering a straightforward and reliable way to sell unwanted postage stamps. Whether you have a single album or a lifetime collection, our approach remains the same: careful assessment, clear communication, and fair market-based offers.
</p>
<p>
  Unlike online marketplaces, there are no listing fees, no uncertainty, and no dealing with unknown buyers. We handle the process from start to finish—simply, securely, and professionally.
</p>
<p>
  Our valuers combine deep philatelic knowledge with a practical, no-nonsense service: transparent pricing, fully insured handling, and the respect your collection deserves.
</p>
```

## Potential Design Impact
The new copy is significantly longer (four paragraphs compared to two). The current `md:text-center md:text-balance` styling might feel a bit heavy with this much text centered. 

*Recommendation:* After implementing the text replacement, we will review the visual appearance on both desktop and mobile. If it looks like a "wall of text", we may want to consider adjusting the text alignment on desktop to `text-left` or increasing the max-width slightly for better readability. For now, we will stick to the plan of a direct 1:1 replacement.
