import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSlideshow } from '@/components/home/hero-slideshow'
import { HowItWorks } from '@/components/home/how-it-works'
import { StampTypesPreview } from '@/components/home/stamp-types-preview'
import { TrustIndicators } from '@/components/home/trust-indicators'
import { CTASection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSlideshow />
        <HowItWorks />
        <StampTypesPreview />
        <TrustIndicators />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
