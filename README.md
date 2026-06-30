# Sell Your Stamps UK - Stamp Valuation & Buying Web Application

Welcome to the **Sell Your Stamps UK** web application, a premium, expert-led, and heritage-focused platform designed to help philatelists and collectors across the United Kingdom discover the value of their stamp collections and receive fair, transparent payouts.

Built with modern web technologies, this project combines a sophisticated, trust-evoking design system with interactive tools to provide a seamless selling funnel.

---

## 🎨 Design System & Branding

The platform employs a premium, high-end editorial aesthetic to establish immediate institutional trust:
*   **Colors (Tailwind CSS v4):**
    *   `Midnight Navy` (`#0B1D2E` / `text-navy` / `bg-navy`): Conveys stability, authority, and professionalism. Used for primary sidebars, headers, and dark background blocks.
    *   `Forest / Heritage Green` (`#14452F` / `text-forest-green` / `bg-forest-green`): Evokes premium quality and acts as the primary Call-To-Action (CTA) color.
    *   `Warm Gold` (`#C5A059` / `text-gold` / `bg-gold`): Accent color representing value, security, and prestige. Used for rating stars, badges, borders, and status highlighting.
    *   `Soft Smoke Grey` (`#E8EBE9`): Used for backgrounds, input borders, and light section fills to structure pages cleanly.
    *   `Parchment Off-White` (`#FBFBF9`): Evokes high-end stationery and trust.
*   **Typography:**
    *   **Serif Headers:** `Playfair Display` - represents history, expertise, and heritage.
    *   **Sans-Serif UI & Body:** `Inter` - provides excellent modern readability across all viewport sizes.
*   **Interactive Visuals:** Soft gradients, glassmorphism overlays (white/10 background blur with white/20 borders), magnetic button components, and smooth page transitions.

---

## 🚀 Core Features & Website Aspects

### 1. Interactive Valuation & Estimation Tools
Located in `/sell-your-stamps`, users have access to a workspace split into two workflows:
*   **Instant Buying Calculator:** An interactive table of active buying rates (grouped by stamp types e.g., 1st Class, 2nd Class, Barcoded Values).
    *   Supports decimal/fractional input (e.g., face value totals) or integer counts.
    *   Computes real-time estimated payout dynamically as quantities are adjusted.
    *   One-click action transfers calculated items directly into the formal appraisal request.
*   **Lock-in Offer Funnel:** Users can be directed from the homepage or external campaigns with pre-calculated parameters (`offer_low`, `offer_high`, `face_value`, `condition`). The system captures these parameters and displays a persistent banner locking in the offer while auto-populating the details in the request form.

### 2. Multi-Step Appraisal Request Form
*   **Step 1: Collection Details:** Allows selecting collection types, approximate quantities, era, and custom descriptions of valuable stamps.
*   **Step 2: Photographic Evidence Upload:** High-quality drag-and-drop file interface for uploading photographs of the stamp albums.
*   **Step 3: Contact & Postcode Details:** Collects name, email, phone number, postcode, and preferred contact channel.
*   **Persistence & UX:** 
    *   Form progress is automatically saved to the browser's `localStorage` on every keystroke, allowing users to return and finish their draft request if they reload or navigate away.
    *   Form submissions POST asynchronously to `/api/sell` with active request state feedback and custom error boundaries.

### 3. Safety, Logistics, & Help Systems
*   **Insured Shipping Guarantees:** Boldly communicates specialized transit coverage up to £50,000.
*   **Chronological Selling Timeline:** A step-by-step progress timeline outlining Request, Insured Shipping, Expert Valuation, and Fast Payment (within 7 days).
*   **Valuation Readiness Indicator:** A customized guide built to help collectors assess if their collection is ready for appraisal (sorting, mounting, etc.).
*   **Categorized FAQs:** Interactive Accordions dividing questions between "Shipping & Safety" and "General Questions".

---

## 🗺️ Website Structure & Routing

*   **`[`/` (Home Page)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/page.tsx)**: High-impact hero slideshow with magnetic CTAs, about summaries, testimonials, stamp type previews, how-it-works overview, and featured Inline Sell CTAs.
*   **`[`/about-us` (About Us Page)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/about-us/page.tsx)**: Heritage narrative detailing over 25 years of philatelic expertise, core values, company commitments, and testimonial carousel.
*   **`[`/how-to-sell` (Selling Guide Page)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/how-to-sell/page.tsx)**: Deep-dive timeline of the transit process, valuation readiness checklist, transit safety details, and comprehensive shipping FAQs.
*   **`[`/what-we-buy` (Stamp Catalog Page)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/what-we-buy/page.tsx)**: Visual grid of accepted stamp categories (e.g., Penny Blacks, Queen Victoria issues, Modern Commemoratives), explicit list of exclusions, and next-step guides.
*   **`[`/sell-your-stamps` (Valuation Workspace)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/sell-your-stamps/page.tsx)**: Tabbed interface housing the instant rates calculator and the multi-step appraisal request form.
*   **`[`/contact` (Contact Us Page)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/contact/page.tsx)**: Direct inquiry form, customer helpline, office coordinates, and operational hours.

---

## 🧠 Backend & Database Schema Blueprint (Supabase SQL)

The application has been prepared for Supabase PostgreSQL database integration and user authentication. The database schema includes:
*   `profiles`: Table linked to Supabase Auth mapping users, emails, phone numbers, and encrypted bank/cheque payout credentials.
*   `stamp_categories`: Stores active rates (percentage payouts), names, groupings, barcode statuses, and limits.
*   `submissions`: Records all guest/registered valuation requests, statuses, tracking details, and final appraisals.
*   `submission_items`: Specific line items generated by the calculator/appraisers for a submission.
*   `submission_images`: Storage paths and URLs for collection photos.
*   `payouts`: Tracks completed transaction sums, dates, and payout methods (`bank_transfer`, `cheque`).

---

## 🛠️ Technology Stack

*   **Framework:** [Next.js](https://nextjs.org) (App Router, React 19)
*   **Styling:** Tailwind CSS (v4) with Custom Variables
*   **Components:** Radix UI primitives (Accordion, Tabs, Dialog, etc.)
*   **Icons:** Lucide React
*   **Error Monitoring & Telemetry:** Sentry Next.js SDK Integration
*   **Form Validation:** React Hook Form & Zod Schema Validation

---

## 💻 Getting Started

First, install the package dependencies:
```bash
npm install
```

Run the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

To build the static/production output:
```bash
npm run build
```
