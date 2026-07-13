# Inner Page Slideshow Implementation Plan

Based on the strategic recommendation to use **Hero Banner Slideshows** (rather than full-page backgrounds) to maintain readability and conversion rates, here is the phased implementation plan. 

Please review the checklists below. Once approved, we can begin executing these steps.

## Phase 1: Preparation & Component Reusability
Currently, the homepage slideshow is likely built specifically for the landing page. We need to create a reusable component that can be dropped into any page with customized images.

- [ ] **Extract Slideshow Logic:** Identify the existing homepage slideshow component (e.g., `HeroSlideshow.tsx`).
- [ ] **Make Component Reusable:** Refactor the component to accept props such as:
  - `images`: An array of image objects (url, alt text).
  - `title`: The main H1 text for the hero.
  - `subtitle`: Optional subtext.
  - `speed`: (Optional) Transition speed, allowing us to slow it down on certain pages.
  - `height`: (Optional) e.g., `100vh` for homepage, `50vh` or `60vh` for inner page heroes.
- [ ] **Define Image Content Arrays:** Create data arrays for the specific images to be used on each page to ensure relevance (e.g., in a `data/slideshows.ts` file).

## Phase 2: Implement Informational Pages
These pages benefit most from dynamic, storytelling imagery. We will add a Hero Slideshow to the top of these pages.

- [ ] **"About Us" Page:**
  - [ ] Import the new `HeroSlideshow` component.
  - [ ] Configure with images representing heritage, team, or the office.
  - [ ] Ensure content below the hero has a solid, readable background (dark or light theme).
- [ ] **"What We Buy" Page:**
  - [ ] Import the `HeroSlideshow` component.
  - [ ] Configure with high-quality macro shots of stamps and collections.
- [ ] **"How to Sell Your Stamps" Page:**
  - [ ] Import the `HeroSlideshow` component.
  - [ ] Configure with process-oriented images (appraisal, packaging).

## Phase 3: Implement Conversion Pages
For pages with user input forms, we must minimize distraction. We will use the slideshow component but configure it for minimal friction.

- [ ] **"Contact Us" Page:**
  - [ ] Import the `HeroSlideshow` component.
  - [ ] *Decision Required:* Do we use a **Single Static Image** (Recommended) or a **Very Slow Slideshow** (e.g., 10+ seconds per slide)? 
  - [ ] Implement the chosen option at the top of the page.
  - [ ] Ensure the contact form sits entirely below the hero section on a clean background.
- [ ] **"Sell Your Stamps" Page:**
  - [ ] Import the `HeroSlideshow` component.
  - [ ] *Decision Required:* Static Image vs. Very Slow Slideshow.
  - [ ] Implement the chosen option.
  - [ ] Ensure the multi-step valuation/selling form is completely undisturbed by background movement.

## Phase 4: Quality Assurance & Review
- [ ] **Mobile Responsiveness:** Verify the hero slideshows resize gracefully on mobile and tablet views.
- [ ] **Performance Check:** Ensure loading multiple images on these pages does not severely impact PageSpeed. Implement lazy loading for images not on the first slide.
- [x] **Contrast Check:** Verify that the page titles over the slideshows are perfectly readable against all images in the rotation (adjusting the dark overlay if necessary).

## Phase 5: Cinematic Video Integration
We have integrated a cinematic background video (using a high-quality philately asset) directly into the slideshow cycle to instantly captivate visitors and establish premium credibility.

- [x] **Video Support in Base Component:** Integrated a background HTML5 video player into `@/components/ui/hero-slideshow.tsx`.
- [x] **Seamless Transition to Images:** Programmed an `onEnded` event on the video to smoothly fade the video out and start the standard image slideshow.
- [x] **Unified Continuous Loop:** Unified the slide index count to include the video (as slide 0) and the image sequence. Once the final image slide completes, the system resets and plays the video again.
- [x] **Global Application:** Defaulted the `videoSrc` property inside the base component to `/6657750-uhd_4096_2160_25fps.mp4`. This ensures the video automatically reflects on all pages utilizing the component:
  - Homepage (`/`)
  - About Us (`/about-us`)
  - How to Sell (`/how-to-sell`)
  - What We Buy (`/what-we-buy`)
  - Contact Us (`/contact`)
  - Sell Your Stamps (`/sell-your-stamps`)

