'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export function AboutNarrative() {
  return (
    <section className="py-14 md:py-20 lg:py-32 bg-white" aria-labelledby="about-heading text-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-24 items-center">
          {/* Left Column: Narrative */}
          <div className="order-2 lg:order-1 space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <h2 id="about-heading" className="text-3xl md:text-5xl font-black tracking-tight text-primary">
                About Us
              </h2>
              <p className="text-lg md:text-2xl font-semibold text-forest-green italic">
                A quiet standard of expertise, built in Britain
              </p>
            </div>
            
            <div className="space-y-4 md:space-y-6 text-slate-700 leading-relaxed text-base md:text-lg lg:text-xl">
              <p>
                For over twenty-five years, we have helped families and collectors across the UK understand the true value of their stamp collections—without pressure, jargon, or obligation.
              </p>
              <p>
                Our aim is simple: to provide a clear, reliable, and efficient way to have your stamps valued and, if you choose, sold. We combine traditional philatelic expertise with a straightforward modern process, designed to remove the uncertainty often associated with selling.
              </p>
              <p>
                For most collections, the easiest way to begin is through our online valuation form. By sharing a few details and, where possible, photographs, we can provide an initial assessment and guide you on the next steps.
              </p>
              <p>
                For larger or more significant collections, we offer a more tailored approach, ensuring each item is carefully reviewed and handled with the attention it deserves.
              </p>
              <p>
                Unlike online marketplaces, there are no listing fees, no negotiations with unknown buyers, and no unnecessary delays. We provide clear guidance, secure handling, and transparent offers—allowing you to make an informed decision at every stage.
              </p>
              <p>
                Our approach remains consistent throughout: professional, respectful, and entirely without obligation.
              </p>
            </div>

            {/* Trust Highlight Block */}
            <div className="bg-primary/5 border-l-4 border-primary p-4 md:p-6 rounded-r-2xl shadow-sm">
              <div className="flex gap-4">
                <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-primary shrink-0" />
                <p className="font-bold text-primary leading-tight text-sm md:text-base">
                  All collections are carefully checked and professionally assessed by our lead philatelists before any purchase.
                </p>
              </div>
            </div>

            <Button asChild size="lg" className="bg-forest-green hover:bg-forest-green/90 text-white font-bold h-11 md:h-14 px-6 md:px-10 text-base md:text-lg rounded-xl shadow-lg shadow-forest-green/20">
              <Link href="/sell-your-stamps">Start Your Free Appraisal</Link>
            </Button>
          </div>

          {/* Right Column: Visual */}
          <div className="order-1 lg:order-2">
            <div className="relative group">
              {/* Decorative background element */}
              <div className="absolute -inset-4 bg-slate-100 rounded-[2.5rem] -rotate-2 transition-transform group-hover:rotate-0 duration-700" />
              
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
                <Image
                  src="/images/about/expertise-desk.jpg"
                  alt="Expert stamp evaluation desk with magnifying glass"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Float Badge */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-2xl border border-slate-50 hidden md:block">
                <div className="text-center">
                  <p className="text-3xl font-black text-primary">25+</p>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
