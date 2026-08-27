import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSlideshow } from '@/components/home/hero-slideshow'
import { AboutSummary } from '@/components/home/about-summary'
import { Testimonials } from '@/components/sections/testimonials'
import { StampTypesPreview } from '@/components/home/stamp-types-preview'
import { HowItWorks } from '@/components/home/how-it-works'
import { WhyChooseUs } from '@/components/home/why-choose-us'
import { InlineSellCTA } from '@/components/sections/sell-cta'
import { JsonLd } from '@/components/seo/json-ld'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sell Your Stamps UK | Expert Stamp Valuation & Buying',
  description: "The UK's most trusted stamp valuation and buying service. Heritage-focused, expert-led, and committed to fair market prices.",
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 flex flex-col w-full">
        <HeroSlideshow />
        <AboutSummary />
        <Testimonials />
        <StampTypesPreview />
        <HowItWorks />
        <WhyChooseUs />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24 mb-20 lg:mt-32 lg:mb-24">
          <InlineSellCTA 
            variant="featured" 
            title="Get An Instant Price Today"
            description="Our expert team is standing by to provide a professional assessment of your stamps. Get started with a fair, no-obligation valuation today."
            showSecondaryActions={true}
            showContactAction={true}
          />
        </div>
      </main>
      <JsonLd type="Service" data={{ name: 'Great Britain & Commonwealth Stamp Valuation Service' }} />
      <Footer />
    </>
  )
}
