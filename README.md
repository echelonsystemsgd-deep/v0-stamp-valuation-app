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

### 4. Admin Console & Appraiser Workflows
A fully integrated, role-protected administrator back-office suite at `/admin` designed to manage submissions, valuations, and payouts:
*   **Appraiser Workbench:** Interactive valuation desk allowing staff to review uploaded photos, run line-item payout calculators, add appraisal notes, and update status.
*   **Submissions Queue:** Real-time searchable and filterable datagrid displaying all submissions.
*   **Rates Manager:** Allows adjusting rates percentage dynamically for stamp categories.
*   **Seller Accounts & Live Presence:** Directory of registered collectors showing account statuses (`is_suspended`) and live online presence statuses.
*   **Payout Bonuses & Marketing Panels:** Tools for creating custom promo codes, active campaigns, and payout bonus increments.
*   **Real-time Activity & Chat:** Secure realtime messaging interface between sellers and appraisers.

### 5. Hero Slideshow & Cinematic Video Integration
The site features a reusable, responsive `HeroSlideshow` component configured across all consumer-facing landing and informational pages:
*   **HTML5 Video Loop (Slide 0):** Auto-plays a high-quality philately asset (`/6657750-uhd_4096_2160_25fps.mp4`) as the hero slide to drive institutional trust.
*   **Seamless Transition & Loop:** Fades out the video to initiate an image rotation before returning back to the video upon loop completion.

---

## 🗺️ Website Structure & Routing

### Consumer Facing
*   **`[`/` (Home Page)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/page.tsx)**: High-impact hero slideshow with video background, magnetic CTAs, testimonials, and stamp type previews.
*   **`[`/about-us` (About Us Page)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/about-us/page.tsx)**: Heritage narrative detailing over 25 years of philatelic expertise, core values, and testimonial carousel.
*   **`[`/how-to-sell` (Selling Guide Page)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/how-to-sell/page.tsx)**: Detailed timeline of transit safety, valuation readiness guidelines, and FAQs.
*   **`[`/what-we-buy` (Stamp Catalog Page)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/what-we-buy/page.tsx)**: Visual grid of accepted and excluded stamp types.
*   **`[`/sell-your-stamps` (Valuation Workspace)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/sell-your-stamps/page.tsx)**: Calculator and request form.
*   **`[`/contact` (Contact Us Page)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/contact/page.tsx)**: Address maps, helpline numbers, and email forms.
*   **`[`/dashboard` (Seller Portal)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/dashboard/page.tsx)**: Seller dashboard to track active valuation requests, payouts, and chat with appraisers.

### Staff / Admin Back-office (`/admin`)
*   **`[`/admin` (Overview Board)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/admin/page.tsx)**: Operational metrics (total payout, active submissions) and recent users with presence indicators.
*   **`[`/admin/submissions` (Queue List)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/admin/submissions/page.tsx)**: Complete table of submitted files, filters, and searches.
*   **`[`/admin/submissions/[id]` (Workstation)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/admin/submissions/[id]/page.tsx)**: Form for entering appraisal values, shipping weight, and status updates.
*   **`[`/admin/categories` (Rates Panel)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/admin/categories/page.tsx)**: Rate manager for stamp classifications.
*   **`[`/admin/sellers` (Accounts Panel)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/admin/sellers/page.tsx)**: Users listing with online status and suspension toggles.
*   **`[`/admin/bonuses` (Payout Boosts)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/admin/bonuses/page.tsx)**: Manage extra payout perks.
*   **`[`/admin/marketing` (Campaign Controller)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/admin/marketing/page.tsx)**: Lead campaigns configuration.
*   **`[`/admin/profile` (Appraiser Profile)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/admin/profile/page.tsx)**: Staff personal details.
*   **`[`/admin/settings` (System Control)](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-stamp-valuation-app/app/admin/settings/page.tsx)**: Core system flags and thresholds.

---

## 🧠 Backend & Database Schema Blueprint (Supabase SQL)

The application utilizes Supabase PostgreSQL for authentication, database, real-time sync, and file storage:
*   `profiles`: Custom table linked to Supabase Auth containing roles (`admin`, `staff`, `user`), presence metadata, and contact/payout credentials.
*   `stamp_categories`: Stores active rates (percentage payouts), grouping types, barcode requirements, and limits.
*   `submissions`: Main log for requests, valuation states, and tracking numbers.
*   `submission_items`: Lines itemizing stamp valuations computed inside the appraiser workbench.
*   `submission_images`: Storage reference paths for user-uploaded photography.
*   `payouts`: Realized cash transfers, dates, and methods (`bank_transfer`, `cheque`).
*   **Real-time Presence Sync:** Tracks active user statuses using Supabase Presence over the global `online-users` channel.
*   **Database Triggers:** Automatically bridges new auth profiles with submissions initiated during anonymous/guest session stages via PostgreSQL functions.

---

## 🛠️ Technology Stack

*   **Framework:** [Next.js](https://nextjs.org) (App Router, React 19)
*   **Styling:** Tailwind CSS (v4) with custom heritage-palette variables
*   **Components:** Radix UI primitives (Accordion, Tabs, Dialog, Sheets, etc.)
*   **Real-time Engine:** Supabase Broadcast & Presence Client
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
