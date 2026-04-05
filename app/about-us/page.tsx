import Link from 'next/link'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Award, Shield, Users, CheckCircle } from 'lucide-react'
import { AboutNarrative } from '@/components/sections/about-narrative'
import { Testimonials } from '@/components/sections/testimonials'
import { InlineSellCTA } from '@/components/sections/sell-cta'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about UK Stamp Valuations - over 25 years of expertise in stamp valuation and philately. Meet our team of expert valuers.',
}

const values = [
  {
    icon: Shield,
    title: 'Fair & Transparent',
    description: 'We provide honest valuations based on current market prices. No hidden fees, no pressure tactics.',
  },
  {
    icon: Award,
    title: 'Expert Knowledge',
    description: 'Our team includes members of leading philatelic societies with decades of combined experience.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'We treat every collection with care and every customer with respect, regardless of collection size.',
  },
]

const commitments = [
  'Free, no-obligation valuations',
  'Fair market prices based on current trends',
  'Fully insured collection and shipping',
  'Fast payment within 7 days',
  'Expert advice at every stage',
  'UK-based team you can trust',
]

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {/* Page Header */}
        <section className="bg-oxford-blue py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 transform translate-x-1/2 hidden md:block" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.1]">About Us</h1>
              <p className="mt-4 text-xl md:text-2xl text-white/80 leading-relaxed font-medium">
                For over 25 years, we have been helping collectors across the United Kingdom 
                discover the value of their stamp collections and receive fair prices.
              </p>
            </div>
          </div>
        </section>

        <AboutNarrative />

        {/* Our Values */}
        <section className="py-16 lg:py-20 bg-secondary" aria-labelledby="values-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 id="values-heading" className="text-primary">Our Values</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                These principles guide everything we do at UK Stamp Valuations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value) => (
                <Card key={value.title} className="text-center">
                  <CardContent className="py-8">
                    <div className="w-14 h-14 rounded-full bg-forest-green/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-forest-green" aria-hidden="true" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-primary">{value.title}</h3>
                    <p className="mt-3 text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="py-16 lg:py-20 bg-oxford-blue" aria-labelledby="commitment-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 id="commitment-heading" className="text-white">Our Commitment to You</h2>
                <p className="mt-4 text-lg text-white/80 leading-relaxed">
                  When you choose UK Stamp Valuations, you&apos;re working with a team that genuinely 
                  cares about philately and respects the effort that goes into building a collection.
                </p>
              </div>
              <div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {commitments.map((commitment) => (
                    <li key={commitment} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-white/90">{commitment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Testimonials />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 lg:mb-24">
          <InlineSellCTA 
            variant="featured" 
            title="Is your collection the next we value?"
            description="Our expert team is ready to provide a fair, professional assessment of your stamp collection. No matter the size, we treat every collector with respect."
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
