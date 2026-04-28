# Implementation Plan: Website Metadata & Social Previews

This document outlines the step-by-step plan to implement robust metadata, search engine optimization (SEO), and social media preview images (Open Graph and Twitter Cards) for the UK Stamp Valuations web application.

## Phase 1: Generate Website Snapshots for Previews

Currently, the website does not have a preview image when links are shared on platforms like iMessage, Twitter, Facebook, or LinkedIn. 

**Steps:**
1. **Take Website Snapshot:** I will use my browser automation tools to load the local development server (which is already running) and capture a high-quality screenshot of the fully-rendered homepage.
2. **Format and Place Images:** The screenshot will be cropped and formatted to the recommended dimensions (typically 1200x630 pixels) for social sharing.
3. **Next.js Static Metadata:** I will save these images directly into the `app/` directory as:
   - `app/opengraph-image.png` (Used by Facebook, LinkedIn, iMessage, etc.)
   - `app/twitter-image.png` (Used specifically by X/Twitter)
   Next.js App Router automatically detects these filenames and injects the corresponding `<meta>` tags into the `<head>` of your website.

## Phase 2: Enhance Global Metadata in `app/layout.tsx`

The current metadata configuration provides a good foundation but lacks key elements for robust social media sharing.

**Steps:**
1. **Add `metadataBase`:** Next.js requires a `metadataBase` URL to resolve relative paths for images in production. We will configure this (e.g., `new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ukstampvaluations.co.uk')`).
2. **Expand OpenGraph:** Explicitly define the OpenGraph `title`, `description`, `url`, and `images` (though the static files in Phase 1 will automatically handle the images part, we will ensure it's structured correctly).
3. **Add Twitter Configuration:** Add a `twitter` node to the metadata object with:
   - `card: 'summary_large_image'` (to ensure the snapshot displays as a large banner).
   - `title` and `description` matching the global brand.
4. **Icons:** Ensure a proper `favicon.ico`, `icon.png`, and `apple-icon.png` exist in the `app/` directory for browser tabs and mobile home screens.

## Phase 3: Implement Page-Specific Metadata

Global metadata is great, but sharing specific pages should yield specific previews.

**Steps:**
1. **Sub-page Metadata:** For each key page (`/about`, `/contact`, `/valuation`, etc.), I will export a specific `metadata` object in their respective `page.tsx` files.
2. Next.js will automatically merge these page-specific titles and descriptions with the global `openGraph` and `twitter` structures defined in the layout, meaning the shared card will say "Contact Us | UK Stamp Valuations" rather than the default homepage title.

---

### Next Steps

If you approve of this plan, let me know to proceed. I will start by capturing the snapshot of the homepage and saving it as the OpenGraph image, followed by updating the `app/layout.tsx` file.
