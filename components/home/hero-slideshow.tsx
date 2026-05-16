'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroSlideshow as BaseHeroSlideshow } from '@/components/ui/hero-slideshow'
import { Magnetic } from '@/components/ui/magnetic'
import { Star } from 'lucide-react'

const heroImages = [
  {
    src: '/images/hero/stamps-collection.jpg',
    alt: 'Vintage stamp collection displayed on wooden surface',
  },
  {
    src: '/images/hero/magnifying-glass.jpg',
    alt: 'Expert examining rare stamp with magnifying glass',
  },
  {
    src: '/images/hero/stamp-album.jpg',
    alt: 'Elegant leather-bound stamp album with British stamps',
  },
]

export const HeroSlideshow = React.memo(function HeroSlideshow() {
  return (
    <BaseHeroSlideshow
      images={heroImages}
      title="Sell Your Stamps UK"
      subtitle="EXPERT VALUATIONS. FAIR PRICES. TRUSTED BUYERS. The UK's most trusted stamp valuation and buying service. Expert-led and heritage-focused."
      minHeight="min-h-[600px] lg:min-h-[700px]"
    >
      <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0 [animation-delay:600ms]">
        <Magnetic>
          <Button
            asChild
            size="lg"
            className="bg-forest-green hover:bg-forest-green/90 text-white font-semibold h-14 px-8 text-lg relative overflow-hidden group shadow-lg shadow-forest-green/20"
          >
            <Link href="/sell-your-stamps">
              <span className="relative z-10">Sell Your Stamps Today</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />
            </Link>
          </Button>
        </Magnetic>
        <Magnetic>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-heritage-gold/50 text-white hover:bg-heritage-gold/10 font-semibold h-14 px-8 text-lg bg-transparent backdrop-blur-sm transition-all duration-300"
          >
            <Link href="/sell-your-stamps">Request a Free Valuation</Link>
          </Button>
        </Magnetic>
      </div>

      {/* Floating Trust Badges */}
      <div className="absolute top-1/2 -right-4 lg:right-20 -translate-y-1/2 hidden md:flex flex-col gap-6 z-20">
        <div className="glassmorphism p-4 rounded-2xl flex items-center gap-3 animate-float [animation-delay:1s] shadow-xl border-white/20 bg-white/10">
          <div className="bg-heritage-gold/20 p-2 rounded-xl">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3 w-3 fill-heritage-gold text-heritage-gold" />
              ))}
            </div>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Rated 5/5 Stars</p>
            <p className="text-white/70 text-xs font-medium">For Fairness & Value</p>
          </div>
        </div>
      </div>
      <p className="mt-6 text-base text-white/70 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-forest-green" aria-hidden="true" />
        No obligation to sell
      </p>
    </BaseHeroSlideshow>
  )
})
