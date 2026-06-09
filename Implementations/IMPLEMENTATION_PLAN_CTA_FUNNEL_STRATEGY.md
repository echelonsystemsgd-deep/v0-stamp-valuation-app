# Implementation Plan: Hybrid CTA Funnel Strategy

## Objective
Transition from a uniform CTA approach to a targeted, multi-stage funnel. This strategy is precisely designed for high trust and stronger conversions, specifically catering to an older, cautious demographic. We will map CTAs based on the user's intent level at specific touchpoints across the website.

## Strategy Overview
*   **Top of Funnel (Low friction, High curiosity):** "Get a Free Valuation" 
*   **Middle of Funnel (Educational, Trust-building):** "Start Your Free Appraisal" / "See What They Are Worth"
*   **Bottom of Funnel (Transactional, Action-ready):** "Sell Your Stamps" / "Lock In Your Offer"

---

## Step-by-Step Implementation

### Phase 1: Top of Funnel (Hero & Main Headers)
**Files to Review/Update:**
- `components/layout/header.tsx`
- `components/home/hero-slideshow.tsx`

**Action:**
- Ensure the primary, highly visible buttons at the very top of the page (and primary navigation) maintain the **"Get a Free Valuation"** text.
- *Reasoning:* When users first land on the site, we must capture their curiosity with zero implied transaction commitment.

### Phase 2: Middle of Funnel (Informational Sections)
**Files to Review/Update:**
- `components/sections/about-narrative.tsx`
- `components/home/why-choose-us.tsx`

**Action:**
- Update CTAs within these educational/trust-building sections from purely informational to transitional language, such as **"Start Your Free Appraisal"**.
- *Reasoning:* Softly introduces the appraisal process while they are engaged with the trust-building content. It acts as a bridge.

### Phase 3: Bottom of Funnel & Action Areas
**Files to Review/Update:**
- `components/what-we-buy/catalog-sections.tsx`
- `components/sections/sell-cta.tsx`
- `components/layout/sticky-cta.tsx`
- `app/how-to-sell/page.tsx`

**Action:**
- Convert buttons in these direct "what we buy" areas, dedicated sales pages, and sticky conversion bars strictly to **"Sell Your Stamps"**.
- *Reasoning:* By the time the user is interacting with direct pricing tables, "how to sell" instructions, or persistent action bars, their intent is much higher. A direct, clear call-to-action here maximizes conversions for those ready to proceed.

---

## Developer Check-Off & Next Steps
- [ ] Review implementation plan.
- [ ] User provides approval to proceed.
- [ ] Execute changes across headers, body components, and sticky interfaces.
- [ ] Verify functionality and visual consistency.
