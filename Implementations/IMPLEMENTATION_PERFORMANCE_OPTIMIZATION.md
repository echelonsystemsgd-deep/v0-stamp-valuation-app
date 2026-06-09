# Implementation Plan: Website Performance & Interaction Optimization

The user has reported a delay (lag) when interacting with sliders (valuation calculator, image comparison) and other areas of the website. This document outlines the strategy to eliminate input lag and ensure a smooth, high-premium user experience.

## Performance Audit Results (Potential Issues)
1.  **High-Frequency State Updates**: Sliders in `InteractivePriceCalculator` and `ImageComparison` update state on every pixel move (`onValueChange` / `onMouseMove`), triggering full component re-renders. (RESOLVED)
2.  **Expensive Animations**: The `CountUp` component in the calculator restarts its animation on every state update during a slider drag, causing layout thrashing. (RESOLVED)
3.  **CSS Filter Overhead**: Use of `backdrop-filter: blur()` (glassmorphism) and SVG `feTurbulence` (grainy paper background) are computationally expensive and can cause "jank" during high-frequency repaints. (OPTIMIZED)
4.  **Redundant Re-renders**: Frequent state updates in one component may be causing performance bottlenecks in sibling components if not properly memoized. (RESOLVED)

---

## Phase 1: Slider & Interaction Optimization
Focus on reducing the work done during active dragging.

### 1.1 Calculator Optimization
- [x] **State Splitting**: Split the `faceValue` state into `displayValue` (updates instantly) and `calculationValue` (debounced or updated on commit).
- [x] **Throttled Calculations**: Wrap the `calculateEstimate` logic in a throttled function to prevent it from running 60+ times per second.
- [x] **CountUp Control**: Update `CountUp` values only when the user stops dragging or at a reduced frequency (e.g., every 100ms).
- [x] **Input Debouncing**: For manual input fields in the calculator, use a debounce (e.g., 300ms) before triggering a re-calculation.

### 1.2 Image Comparison Optimization
- [x] **CSS Variable Driven**: Instead of React state triggering a re-render for `clipPath`, use a CSS Variable (e.g., `--slider-pos`) and update it via a `ref` for direct DOM manipulation.
- [x] **Throttled Mouse Events**: Use `requestAnimationFrame` within the `handleMove` function to ensure updates align with the browser's refresh rate.

---

## Phase 2: Rendering & Layout Optimization
Focus on preventing unnecessary work across the DOM tree.

### 2.1 Component Memoization
- [x] **React.memo**: Wrap heavy sibling components (like `HeroSlideshow`, `ValuationQuiz`, `RecentValuations`) in `React.memo` to ensure they don't re-render when a slider state changes.
- [x] **Stable Callbacks**: Ensure all event handlers passed to sliders are wrapped in `useCallback`.

### 2.2 CSS Performance Tweak
- [x] **Interaction-Safe CSS**: Consider disabling `backdrop-filter` or high-complexity filters on the section while a "dragging" state is active.
- [x] **Will-Change Property**: Apply `will-change: transform, clip-path` to elements that move frequently to hint the browser to promote them to their own compositor layer.

---

## Phase 3: Asset & Logic Refinement
Final polish for perceived speed.

### 3.1 Image Sizes
- [x] **Optimization**: Ensure images in `ImageComparison` and `HeroSlideshow` are using Next.js `Image` component with optimized `sizes` and quality settings to reduce GPU memory pressure.

### 3.2 Logic Simplification
- [x] **Pre-calculation**: If possible, simplify the valuation formula or move it to a `useMemo` that only depends on high-level state changes.

---

## Progress Checklist

- [x] **Audit & Baseline**
    - [x] Measure TBT (Total Blocking Time) during slider interaction.
    - [x] Identify which components are re-rendering using React DevTools.
- [x] **Immediate Fixes (The "Quick Wins")**
    - [x] Implement `requestAnimationFrame` for `ImageComparison`.
    - [x] Add `React.memo` to the main navigation and footer.
- [x] **Calculator Overhaul**
    - [x] Implement debounced valuation updates.
    - [x] Simplify `CountUp` triggers.
- [x] **Visual Polish**
    - [x] Test performance without `bg-grainy-paper` to confirm impact.
    - [x] Apply `will-change` where applicable.
- [x] **Validation**
    - [x] Verify 60FPS interaction on mobile and desktop.
    - [x] Confirm no regression in valuation accuracy.

---

> [!TIP]
> **Priority Tooling**: Use the **Chrome DevTools Performance Tab** to look for "Long Tasks" (red flags) while dragging the sliders. This will pinpoint exactly which function is blocking the main thread.
