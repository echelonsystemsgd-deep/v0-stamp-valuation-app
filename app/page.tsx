import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSlideshow } from '@/components/home/hero-slideshow'
import { AboutSummary } from '@/components/home/about-summary'
import { Testimonials } from '@/components/sections/testimonials'
import { StampTypesPreview } from '@/components/home/stamp-types-preview'
import { HowItWorks } from '@/components/home/how-it-works'
import { WhyChooseUs } from '@/components/home/why-choose-us'
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
      </main>
      <Footer />
    </>
  )
}
