'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getBlurPlaceholder } from '@/lib/image-utils'

export interface HeroImage {
  src: string
  alt: string
}

export interface HeroSlideshowProps {
  images: HeroImage[]
  title: string
  subtitle?: string
  speed?: number
  minHeight?: string
  children?: React.ReactNode
}

export const HeroSlideshow = React.memo(function HeroSlideshow({
  images,
  title,
  subtitle,
  speed = 5000,
  minHeight = 'min-h-[60vh]',
  children,
}: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, speed)
    return () => clearInterval(interval)
  }, [images.length, speed])

  return (
    <section className={cn("relative flex items-center overflow-hidden", minHeight)}>
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
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
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-transparent" />
      <div className="absolute inset-0 bg-navy/20" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.1] text-balance animate-fade-in-up opacity-0 [animation-delay:200ms]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-8 text-xl md:text-2xl text-white/90 leading-relaxed animate-fade-in-up opacity-0 [animation-delay:400ms]">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>

      {/* Slide Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {images.map((_, index) => (
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
      )}
    </section>
  )
})
