'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export function AboutNarrative() {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-white overflow-hidden" aria-labelledby="about-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-24 items-center">
          {/* Left Column: Narrative */}
          <div className="order-2 lg:order-1 space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-forest-green">
                Our Story &amp; Heritage
              </span>
              <h2 id="about-heading" className="text-3xl md:text-5xl font-black tracking-tight text-primary">
                A Fairer, Faster Way to Sell Stamps in the UK
              </h2>
              <p className="text-lg md:text-xl font-semibold text-forest-green">
                Founded to remove the stress, delays, and hidden fees from selling unused postage and stamp collections.
              </p>
            </div>
            
            <div className="space-y-4 md:space-y-5 text-slate-700 leading-relaxed text-base md:text-lg">
              <p>
                For over a decade, selling postage stamps in the UK meant choosing between two frustrating options: waiting months for traditional auction houses that take 20% to 30% in seller commissions, or dealing with the unpredictability, returns, and buyer disputes of online marketplaces like eBay and Amazon.
              </p>
              <p>
                We founded <strong>Sell Your Stamps UK</strong> with a simple, transparent alternative: <em>we buy your stamps directly from you in one single transaction</em>. No waiting for prospective buyers, no unpredictable bids, and zero hidden seller deductions. What we quote is 100% what you receive.
              </p>
              <p>
                Whether you have inherited a family collection, are downsizing a personal accumulation, or need to liquidate surplus office postage, our team provides an efficient, insured, and expert-led selling experience from start to finish.
              </p>
            </div>

            {/* Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="h-5 w-5 text-forest-green shrink-0" />
                <span className="text-sm font-semibold text-slate-800">0% Commission &amp; No Fees</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="h-5 w-5 text-forest-green shrink-0" />
                <span className="text-sm font-semibold text-slate-800">Same-Day Payout After Verification</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="h-5 w-5 text-forest-green shrink-0" />
                <span className="text-sm font-semibold text-slate-800">Up to £50k Insured Transit</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="h-5 w-5 text-forest-green shrink-0" />
                <span className="text-sm font-semibold text-slate-800">UK Physical Inspection Desk</span>
              </div>
            </div>

            {/* Trust Highlight Block */}
            <div className="bg-primary/5 border-l-4 border-primary p-4 md:p-6 rounded-r-2xl shadow-sm">
              <div className="flex gap-4">
                <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-primary shrink-0" />
                <p className="font-bold text-primary leading-tight text-sm md:text-base">
                  All stamps are carefully checked by our head buyer before any purchase, ensuring complete accuracy and peace of mind.
                </p>
              </div>
            </div>

            <Button asChild size="lg" className="w-full sm:w-auto bg-forest-green hover:bg-forest-green/90 text-white font-bold h-12 md:h-14 px-6 md:px-10 text-base md:text-lg rounded-xl shadow-lg shadow-forest-green/20">
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
                  <p className="text-3xl font-black text-primary">10+</p>
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
