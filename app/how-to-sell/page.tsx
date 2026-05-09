import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProcessTimeline } from '@/components/content/process-timeline'
import { FAQAccordion, shippingFAQs, generalFAQs } from '@/components/content/faq-accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Clock, Award, ClipboardCheck, Truck, PoundSterling, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react'
import { HeroSlideshow } from '@/components/ui/hero-slideshow'
import { howToSellSlideshow } from '@/data/slideshows'

export const metadata: Metadata = {
  title: 'How to Sell Your Stamps',
  description: 'Learn about our simple, secure process for selling your stamp collection. Free valuations, insured shipping, and payment within 7 days.',
}

const trustPoints = [
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'Your collection is protected up to £50,000 during transit and while in our care.',
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description: 'Valuations within 48 hours, payment within 7 days of collection receipt.',
  },
  {
    icon: Award,
    title: 'Expert Valuers',
    description: 'Our team includes members of leading philatelic societies with decades of experience.',
  },
]

import { InlineSellCTA } from '@/components/sections/sell-cta'
import { ValuationReadiness } from '@/components/sections/valuation-readiness'

export default function HowToSellPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 flex flex-col w-full">
        <HeroSlideshow 
          images={howToSellSlideshow}
          title="How to Sell Your Stamps"
          subtitle="Our straightforward process makes selling your stamp collection simple and stress-free. From free valuations to secure shipping and fast payment, we handle everything."
        >
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-forest-green hover:bg-forest-green/90 text-white font-semibold h-14 px-8 text-lg"
            >
              <Link href="/sell-your-stamps">Sell Your Stamps</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-oxford-blue font-semibold h-14 px-8 text-lg bg-transparent"
            >
              <Link href="/what-we-buy">View What We Buy</Link>
            </Button>
          </div>
          <p className="mt-6 text-base text-white/70 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-forest-green" aria-hidden="true" />
            No obligation to sell
          </p>
        </HeroSlideshow>
<section className="py-12 bg-white border-b border-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                { icon: ClipboardCheck, label: "1. Request", sub: "Expert Valuation" },
                { icon: Truck, label: "2. Send", sub: "Fully Insured" },
                { icon: PoundSterling, label: "3. Get Paid", sub: "Fast Payout" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center shrink-0 group-hover:bg-forest-green/10 transition-colors">
                    <item.icon className="w-8 h-8 text-oxford-blue group-hover:text-forest-green transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-oxford-blue">{item.label}</h3>
                    <p className="text-muted-foreground font-medium">{item.sub}</p>
                  </div>
                  {i < 2 && (
                    <ArrowRight className="hidden lg:block w-6 h-6 text-secondary ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Points */}
        <section className="py-12 bg-secondary/50" aria-labelledby="trust-points-heading">
          <h2 id="trust-points-heading" className="sr-only">Our Guarantees</h2>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trustPoints.map((point) => (
                <Card key={point.title} className="text-center border-none shadow-sm bg-white/60 backdrop-blur-sm">
                  <CardContent className="py-6">
                    <div className="w-12 h-12 rounded-full bg-forest-green/10 flex items-center justify-center mx-auto mb-4">
                      <point.icon className="w-6 h-6 text-forest-green" aria-hidden="true" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-primary">{point.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{point.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Readiness Guide */}
        <ValuationReadiness />

        {/* Trust Reassurance Banner */}
        <section className="relative overflow-hidden bg-oxford-blue py-8">
          <div className="absolute inset-0 bg-gradient-to-r from-forest-green/20 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7 text-gold" />
              </div>
              <p className="text-white text-lg md:text-xl font-medium">
                Your collection is in safe hands. <span className="text-gold font-bold">Fully insured up to £50,000</span> via specialized transit.
              </p>
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="py-16 lg:py-20 bg-secondary/30" aria-labelledby="process-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 id="process-heading" className="text-primary">The Selling Process</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Follow these simple steps to sell your stamp collection. Our team is here to guide you at every stage.
              </p>
            </div>
            <div className="max-w-4xl">
              <ProcessTimeline />
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 lg:py-20 bg-secondary" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 id="faq-heading" className="text-primary">Frequently Asked Questions</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Find answers to common questions about selling your stamps.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div>
                <h3 className="font-serif text-xl font-semibold text-primary mb-4">
                  Shipping & Safety
                </h3>
                <Card>
                  <CardContent className="py-4">
                    <FAQAccordion items={shippingFAQs} />
                  </CardContent>
                </Card>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-primary mb-4">
                  General Questions
                </h3>
                <Card>
                  <CardContent className="py-4">
                    <FAQAccordion items={generalFAQs} />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/50 backdrop-blur-sm border border-secondary shadow-sm">
                <MessageCircle className="w-5 h-5 text-forest-green" />
                <p className="text-charcoal font-medium">
                  Still have questions?{" "}
                  <Link href="/contact" className="text-forest-green hover:text-forest-green/80 font-bold underline decoration-2 underline-offset-4 transition-colors">
                    Contact our expert team
                  </Link>{" "}
                  for direct assistance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <InlineSellCTA 
              variant="featured"
              title="Ready to Start the Process?"
              description="Join thousands of UK collectors who have trusted us with their collections. Our expert team is ready to provide a fair, professional assessment today."
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
