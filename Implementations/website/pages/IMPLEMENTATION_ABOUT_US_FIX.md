# Implementation Plan: About Us Page Section Enhancement

The "Our Commitment to You" section is currently invisible because the `oxford-blue` color is not defined in the design system, causing the background to default to transparent/white while the text remains white. This plan outlines the steps to fix the visibility and upgrade the section to a premium, "Heritage Palette" aesthetic.

## Phase 1: Design System Correction
1. **Define Oxford Blue**: Add the `--oxford-blue` CSS variable to the `:root` section in `app/globals.css`.
   - Suggested Value: `#001C3D` (a deep, premium navy).
2. **Register Theme Color**: Add `--color-oxford-blue: var(--oxford-blue);` within the `@theme inline` block in `app/globals.css` to enable Tailwind utility classes like `bg-oxford-blue`.

## Phase 2: Visual Enhancements (Premium Aesthetics)
1. **Background Depth**:
   - Instead of a flat color, apply a subtle radial gradient: `bg-radial-[at_top_right] from-oxford-blue to-navy`.
   - Add the `bg-grainy-paper` utility to provide a premium, tactile texture to the section.
2. **Typography & Layout**:
   - Enhance the heading with a "Premium Service" badge above it.
   - Adjust the grid spacing to ensure the text has breathing room.
3. **Commitment Items**:
   - Wrap the commitment list in a subtle glassmorphic container (`bg-white/5 backdrop-blur-sm border border-white/10`).
   - Use the `gold` color for `CheckCircle` icons to make them pop.

## Phase 3: Accessibility & Polish
1. **Contrast Ratio**: Ensure the text colors are readable against the new background.
2. **Micro-animations**: Add a subtle hover lift effect to the list items for interactivity.

## Proposed Code Changes (Conceptual)

### 1. `app/globals.css`
```css
:root {
  --oxford-blue: #001C3D; 
}

@theme inline {
  --color-oxford-blue: var(--oxford-blue);
}
```

### 2. `app/about-us/page.tsx`
```tsx
<section className="py-20 bg-oxford-blue relative overflow-hidden" aria-labelledby="commitment-heading">
  <div className="absolute inset-0 opacity-10 bg-grainy-paper pointer-events-none" />
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <span className="text-gold font-semibold tracking-wider uppercase text-sm mb-4 block">Our Promise</span>
        <h2 id="commitment-heading" className="text-white text-4xl font-bold mb-6">Our Commitment to You</h2>
        <p className="text-xl text-white/80 leading-relaxed">
          When you choose Sell Your Stamps UK, you&apos;re working with a team that genuinely 
          cares about philately and respects the effort that goes into building a collection.
        </p>
      </div>
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {commitments.map((commitment) => (
            <li key={commitment} className="flex items-start gap-4 group">
              <CheckCircle className="w-6 h-6 text-gold shrink-0 mt-0.5 transition-transform group-hover:scale-110" aria-hidden="true" />
              <span className="text-white/90 font-medium">{commitment}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</section>
```
