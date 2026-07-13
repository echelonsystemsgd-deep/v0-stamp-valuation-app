'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export function AboutNarrative() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white" aria-labelledby="about-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-24 items-center">
          {/* Left Column: Narrative */}
          <div className="order-2 lg:order-1 space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <h2 id="about-heading" className="text-3xl md:text-5xl font-black tracking-tight text-primary">
                About Us
              </h2>
              <p className="text-lg md:text-2xl font-semibold text-forest-green">
                The UK’s leading choice for a straightforward, hassle-free service, with simple ways to help you sell your stamps.
              </p>
            </div>
            
            <div className="space-y-4 md:space-y-6 text-slate-700 leading-relaxed text-base md:text-lg lg:text-xl">
              <p>
                Our aim is to provide sellers with highly competitive rates for unused UK postage stamps. To do this, we’ve developed a process that is efficient and easy to follow for both our customers and our team.
              </p>
              <p>
                Providing precise counts, reviewing formats, issuing individual quotes, and offering tailored postage guidance can be time-intensive. As a result, this level of service is typically reserved for larger collections. For stamp quantities with a face value of £500 or less, we kindly ask sellers to follow the clear packaging and posting instructions available through our online forms.
              </p>
              <p>
                For collections exceeding £500 in face value, we still recommend using the online form, as it remains the quickest and most efficient way to proceed and receive payment. However, if you prefer to get in touch directly, you are welcome to email us, and we will respond as promptly as possible.
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

            <Button asChild size="lg" className="bg-forest-green hover:bg-forest-green/90 text-white font-bold h-12 md:h-14 px-6 md:px-10 text-base md:text-lg rounded-xl shadow-lg shadow-forest-green/20">
              <Link href="/sell-your-stamps">Sell Your Stamps Today</Link>
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
