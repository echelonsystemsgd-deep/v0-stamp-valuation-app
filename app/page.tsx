import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSlideshow } from '@/components/home/hero-slideshow'
import { HowItWorks } from '@/components/home/how-it-works'
import { StampTypesPreview } from '@/components/home/stamp-types-preview'
import { TrustIndicators } from '@/components/home/trust-indicators'
import { CTASection } from '@/components/home/cta-section'
import { Testimonials } from '@/components/sections/testimonials'
import { RecentValuations } from '@/components/sections/recent-valuations'
import { GradingGuide } from '@/components/sections/grading-guide'
import { InteractivePriceCalculator } from '@/components/valuation/price-calculator'

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSlideshow />
        <InteractivePriceCalculator />
        <HowItWorks />
        <StampTypesPreview />
        <RecentValuations />
        <TrustIndicators />
        <GradingGuide />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
