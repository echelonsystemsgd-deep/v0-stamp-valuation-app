import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSlideshow } from '@/components/home/hero-slideshow'
import { AboutSummary } from '@/components/home/about-summary'
import { Testimonials } from '@/components/sections/testimonials'
import { StampTypesPreview } from '@/components/home/stamp-types-preview'
import { HowItWorks } from '@/components/home/how-it-works'
import { WhyChooseUs } from '@/components/home/why-choose-us'

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSlideshow />
        <AboutSummary />
        <Testimonials />
        <StampTypesPreview />
        <HowItWorks />
        <WhyChooseUs />
      </main>
      <Footer />
    </>
  )
}
