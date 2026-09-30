import Link from 'next/link'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Award, Shield, Users, CheckCircle } from 'lucide-react'
import { AboutNarrative } from '@/components/sections/about-narrative'
import { Testimonials } from '@/components/sections/testimonials'
import { HeroSlideshow } from '@/components/ui/hero-slideshow'
import { aboutSlideshow } from '@/data/slideshows'
import { InlineSellCTA } from '@/components/sections/sell-cta'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Sell Your Stamps UK - over 10 years of expertise in stamp valuation and purchasing. Meet our team of expert valuers.',
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
    description: 'Our team has decades of combined experience.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'We treat every sale with care and every customer with respect, regardless of the sale size.',
  },
]

const commitments = [
  'Free, no-obligation valuations',
  'Fair market prices based on current trends',
  'Fast payments within same day',
  'Expert advice at every stage',
  'UK-based team you can trust',
]

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 flex flex-col w-full">
        <HeroSlideshow 
          images={aboutSlideshow} 
          title="About Us &amp; Our Heritage"
          subtitle="For over 10 years, we have provided UK sellers with a transparent, direct, and hassle-free alternative to auction houses and online marketplaces."
        />

        <AboutNarrative />

        {/* Our Values */}
        <section className="py-20 md:py-28 lg:py-32 bg-secondary" aria-labelledby="values-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 id="values-heading" className="font-serif text-3xl md:text-4xl font-bold text-primary text-balance">Our Values</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                These principles guide everything we do at Sell Your Stamps UK.
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
        <section className="py-20 lg:py-24 bg-oxford-blue relative overflow-hidden" aria-labelledby="commitment-heading">
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-10 bg-grainy-paper pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-6">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  <span className="text-gold text-sm font-semibold tracking-wider uppercase">Our Promise</span>
                </div>
                <h2 id="commitment-heading" className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">Our Commitment to You</h2>
                <p className="text-xl text-slate-100 font-medium leading-relaxed max-w-xl">
                  When you choose Sell Your Stamps UK, you&apos;re working with a team that genuinely 
                  cares about buying your stamps and aims to purchase them as efficiently as possible.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 lg:p-10 border border-white/10 shadow-2xl">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {commitments.map((commitment) => (
                    <li key={commitment} className="flex items-start gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-gold/30 transition-colors">
                        <CheckCircle className="w-4 h-4 text-gold" aria-hidden="true" />
                      </div>
                      <span className="text-white/90 font-medium leading-snug">{commitment}</span>
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
            title="Get An Instant Price Today"
            description="Our expert team is standing by to provide a professional assessment of your stamps. Get started with a fair, no-obligation valuation today."
            showSecondaryActions={true}
            showContactAction={true}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
