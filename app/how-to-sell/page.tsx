import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProcessTimeline } from '@/components/content/process-timeline'
import { FAQAccordion, shippingFAQs, generalFAQs } from '@/components/content/faq-accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Clock, Award } from 'lucide-react'

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

export default function HowToSellPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {/* Page Header */}
        <section className="bg-oxford-blue py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-white">How to Sell Your Stamps</h1>
              <p className="mt-4 text-lg text-white/80 leading-relaxed">
                Our straightforward process makes selling your stamp collection simple and stress-free. 
                From free valuations to secure shipping and fast payment, we handle everything.
              </p>
            </div>
          </div>
        </section>

        {/* Trust Points */}
        <section className="py-12 bg-secondary" aria-labelledby="trust-points-heading">
          <h2 id="trust-points-heading" className="sr-only">Our Guarantees</h2>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trustPoints.map((point) => (
                <Card key={point.title} className="text-center">
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

        {/* Process Timeline */}
        <section className="py-16 lg:py-20" aria-labelledby="process-heading">
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
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 id="cta-heading" className="text-primary">Ready to Get Started?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get your free, no-obligation valuation today. Our team is ready to help you discover the value of your collection.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-forest-green hover:bg-forest-green/90 text-white font-semibold h-14 px-8 text-lg"
                >
                  <Link href="/sell-your-stamps">Get Your Free Valuation</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold h-14 px-8 text-lg"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                No obligation to sell. Valuations typically provided within 48 hours.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
