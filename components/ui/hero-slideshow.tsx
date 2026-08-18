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
  videoSrc?: string
}

export const HeroSlideshow = React.memo(function HeroSlideshow({
  images,
  title,
  subtitle,
  speed = 5000,
  minHeight = 'min-h-[60vh]',
  children,
  videoSrc = '/6657750-uhd_4096_2160_25fps.mp4',
}: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const totalSlides = videoSrc ? images.length + 1 : images.length

  // Handle the automatic slideshow rotation for images
  React.useEffect(() => {
    // If we are currently showing the video (always index 0 if videoSrc exists),
    // we let the video's onEnded event drive the transition rather than a timer.
    if (videoSrc && currentIndex === 0) return

    if (totalSlides <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, speed)

    return () => clearInterval(interval)
  }, [currentIndex, totalSlides, speed, videoSrc])

  // Play video from start when returning to the video slide
  React.useEffect(() => {
    if (videoSrc && currentIndex === 0 && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented or video load failed:', err)
        // Fallback: If video fails to play, auto-advance after speed duration
        const fallback = setTimeout(() => {
          setCurrentIndex(1)
        }, speed)
        return () => clearTimeout(fallback)
      })
    }
  }, [currentIndex, videoSrc, speed])

  const handleVideoEnded = React.useCallback(() => {
    setCurrentIndex(1)
  }, [])

  return (
    <section className={cn('relative flex items-center overflow-hidden', minHeight)}>
      {/* Background — Video and Images */}
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="metadata"
          onEnded={handleVideoEnded}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000',
            currentIndex === 0 ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
          )}
          aria-hidden="true"
        />
      )}

      {images.map((image, index) => {
        const slideIndex = videoSrc ? index + 1 : index
        const isActive = currentIndex === slideIndex

        return (
          <div
            key={`${image.src}-${index}`}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000',
              isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={slideIndex === 0}
              sizes="100vw"
              placeholder="blur"
              blurDataURL={getBlurPlaceholder(1920, 1080)}
            />
          </div>
        )
      })}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-navy/20 z-10" />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 pt-32 pb-20 sm:pt-36 w-full">
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
      {totalSlides > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {Array.from({ length: totalSlides }).map((_, index) => (
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
