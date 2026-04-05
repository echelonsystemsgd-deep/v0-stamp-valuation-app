'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getBlurPlaceholder } from '@/lib/image-utils'

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
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={image.src}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={getBlurPlaceholder(1920, 1080)}
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-oxford-blue/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
            Professional Stamp Valuations
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-white/90 leading-relaxed">
            Expert UK-based valuations for your collection. 
            Receive fair market prices from trusted specialists with over 25 years of experience.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
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
              className="border-white text-white hover:bg-white hover:text-oxford-blue font-semibold h-14 px-8 text-lg bg-transparent"
            >
              <Link href="/what-we-buy">View What We Buy</Link>
            </Button>
          </div>
          <p className="mt-6 text-base text-white/70 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-forest-green" aria-hidden="true" />
            No obligation to sell
          </p>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'w-3 h-3 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
              index === currentIndex
                ? 'bg-gold w-8'
                : 'bg-white/50 hover:bg-white/70'
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div>
    </section>
  )
})

