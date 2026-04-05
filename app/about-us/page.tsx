import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Award, Shield, Users, CheckCircle } from 'lucide-react'
import { AboutNarrative } from '@/components/sections/about-narrative'
import { Testimonials } from '@/components/sections/testimonials'
import { getBlurPlaceholder } from '@/lib/image-utils'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about UK Stamp Valuations - over 25 years of expertise in stamp valuation and philately. Meet our team of expert valuers.',
}

const teamMembers = [
  {
    name: 'James Thornton',
    role: 'Founder & Lead Valuer',
    image: '/images/team/james-thornton.jpg',
    bio: 'With over 30 years in philately, James founded UK Stamp Valuations to provide fair, expert valuations to collectors across Britain.',
    credentials: 'Fellow of the Royal Philatelic Society London',
  },
  {
    name: 'Sarah Mitchell',
    role: 'Senior Philatelist',
    image: '/images/team/sarah-mitchell.jpg',
    bio: 'Sarah specialises in Victorian and Edwardian stamps, with particular expertise in GB line-engraved issues and surface-printed stamps.',
    credentials: 'Member of the Great Britain Philatelic Society',
  },
  {
    name: 'David Chambers',
    role: 'Commonwealth Specialist',
    image: '/images/team/david-chambers.jpg',
    bio: 'David brings 15 years of expertise in Commonwealth stamps, with deep knowledge of Australian, Canadian, and New Zealand issues.',
    credentials: 'British Philatelic Trust certified appraiser',
  },
]

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

        {/* Meet the Team */}
        <section className="py-16 lg:py-20" aria-labelledby="team-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 id="team-heading" className="text-primary">Meet Our Team</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our expert valuers bring decades of combined experience in philately.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.name} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      placeholder="blur"
                      blurDataURL={getBlurPlaceholder(400, 400)}
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-semibold text-primary">{member.name}</h3>
                    <p className="text-sm text-forest-green font-medium mt-1">{member.role}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
                    <p className="mt-3 text-xs text-muted-foreground italic">{member.credentials}</p>
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

        {/* CTA Section */}
        <section className="py-16 lg:py-20" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 id="cta-heading" className="text-primary">Ready to Work With Us?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get in touch today for a free, no-obligation valuation of your stamp collection.
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
