'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroSlideshow as BaseHeroSlideshow } from '@/components/ui/hero-slideshow'

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
      subtitle="The UK's most trusted stamp valuation and buying service. Expert-led, heritage-focused, and committed to fair market prices."
      minHeight="min-h-[600px] lg:min-h-[700px]"
    >
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button
          asChild
          size="lg"
          className="bg-forest-green hover:bg-forest-green/90 text-white font-semibold h-14 px-8 text-lg"
        >
                <Link href="/sell-your-stamps">Sell Your Stamps Today</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-white text-white hover:bg-white hover:text-navy font-semibold h-14 px-8 text-lg bg-transparent"
        >
          <Link href="/sell-your-stamps">Request a Free Valuation</Link>
        </Button>
      </div>
      <p className="mt-6 text-base text-white/70 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-forest-green" aria-hidden="true" />
        No obligation to sell
      </p>
    </BaseHeroSlideshow>
  )
})
