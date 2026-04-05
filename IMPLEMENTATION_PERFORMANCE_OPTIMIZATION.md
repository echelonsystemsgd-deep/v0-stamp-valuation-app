# Implementation Plan: Website Performance & Interaction Optimization

The user has reported a delay (lag) when interacting with sliders (valuation calculator, image comparison) and other areas of the website. This document outlines the strategy to eliminate input lag and ensure a smooth, high-premium user experience.

## Performance Audit Results (Potential Issues)
1.  **High-Frequency State Updates**: Sliders in `InteractivePriceCalculator` and `ImageComparison` update state on every pixel move (`onValueChange` / `onMouseMove`), triggering full component re-renders.
2.  **Expensive Animations**: The `CountUp` component in the calculator restarts its animation on every state update during a slider drag, causing layout thrashing.
3.  **CSS Filter Overhead**: Use of `backdrop-filter: blur()` (glassmorphism) and SVG `feTurbulence` (grainy paper background) are computationally expensive and can cause "jank" during high-frequency repaints.
4.  **Redundant Re-renders**: Frequent state updates in one component may be causing performance bottlenecks in sibling components if not properly memoized.

---

## Phase 1: Slider & Interaction Optimization
Focus on reducing the work done during active dragging.

### 1.1 Calculator Optimization
- [ ] **State Splitting**: Split the `faceValue` state into `displayValue` (updates instantly) and `calculationValue` (debounced or updated on commit).
- [ ] **Throttled Calculations**: Wrap the `calculateEstimate` logic in a throttled function to prevent it from running 60+ times per second.
- [ ] **CountUp Control**: Update `CountUp` values only when the user stops dragging or at a reduced frequency (e.g., every 100ms).
- [ ] **Input Debouncing**: For manual input fields in the calculator, use a debounce (e.g., 300ms) before triggering a re-calculation.

### 1.2 Image Comparison Optimization
- [ ] **CSS Variable Driven**: Instead of React state triggering a re-render for `clipPath`, use a CSS Variable (e.g., `--slider-pos`) and update it via a `ref` for direct DOM manipulation.
- [ ] **Throttled Mouse Events**: Use `requestAnimationFrame` within the `handleMove` function to ensure updates align with the browser's refresh rate.

---

## Phase 2: Rendering & Layout Optimization
Focus on preventing unnecessary work across the DOM tree.

### 2.1 Component Memoization
- [ ] **React.memo**: Wrap heavy sibling components (like `HeroSlideshow`, `ValuationQuiz`, `RecentValuations`) in `React.memo` to ensure they don't re-render when a slider state changes.
- [ ] **Stable Callbacks**: Ensure all event handlers passed to sliders are wrapped in `useCallback`.

### 2.2 CSS Performance Tweak
- [ ] **Interaction-Safe CSS**: Consider disabling `backdrop-filter` or high-complexity filters on the section while a "dragging" state is active.
- [ ] **Will-Change Property**: Apply `will-change: transform, clip-path` to elements that move frequently to hint the browser to promote them to their own compositor layer.

---

## Phase 3: Asset & Logic Refinement
Final polish for perceived speed.

### 3.1 Image Sizes
- [ ] **Optimization**: Ensure images in `ImageComparison` and `HeroSlideshow` are using Next.js `Image` component with optimized `sizes` and quality settings to reduce GPU memory pressure.

### 3.2 Logic Simplification
- [ ] **Pre-calculation**: If possible, simplify the valuation formula or move it to a `useMemo` that only depends on high-level state changes.

---

## Progress Checklist

- [ ] **Audit & Baseline**
    - [ ] Measure TBT (Total Blocking Time) during slider interaction.
    - [ ] Identify which components are re-rendering using React DevTools.
- [ ] **Immediate Fixes (The "Quick Wins")**
    - [ ] Implement `requestAnimationFrame` for `ImageComparison`.
    - [ ] Add `React.memo` to the main navigation and footer.
- [ ] **Calculator Overhaul**
    - [ ] Implement debounced valuation updates.
    - [ ] Simplify `CountUp` triggers.
- [ ] **Visual Polish**
    - [ ] Test performance without `bg-grainy-paper` to confirm impact.
    - [ ] Apply `will-change` where applicable.
- [ ] **Validation**
    - [ ] Verify 60FPS interaction on mobile and desktop.
    - [ ] Confirm no regression in valuation accuracy.

---

> [!TIP]
> **Priority Tooling**: Use the **Chrome DevTools Performance Tab** to look for "Long Tasks" (red flags) while dragging the sliders. This will pinpoint exactly which function is blocking the main thread.
