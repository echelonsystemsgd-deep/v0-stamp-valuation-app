'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show after scrolling 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <>
      {/* Mobile Sticky Bar */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.08)] py-3 sm:py-4 transition-all duration-300 lg:hidden",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Button
            asChild
            variant="ghost"
            className="h-11 px-3 sm:px-4 text-sm sm:text-base font-semibold text-primary hover:text-forest-green"
          >
            <Link href="/how-to-sell">How it works</Link>
          </Button>
          <Button
            asChild
            className="group h-11 px-5 sm:px-6 text-sm sm:text-base font-bold bg-forest-green text-white hover:bg-forest-green/90 shadow-md shadow-forest-green/20"
            aria-label="Sell Your Stamps"
          >
            <Link href="/sell-your-stamps" className="flex items-center gap-2">
              <Tag className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Sell Your Stamps</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Desktop Sticky Bar (Bottom) */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-20px_50px_rgba(0,0,0,0.12)] py-5 xl:py-6 transition-all duration-500 hidden lg:block",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
          <div className="flex min-w-0 items-start gap-5 xl:items-center">
            <div className="shrink-0 rounded-xl bg-forest-green/10 p-3 shadow-inner shadow-forest-green/5">
              <Tag className="h-7 w-7 xl:h-8 xl:w-8 text-forest-green" />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <p className="font-bold leading-tight text-primary text-lg xl:text-xl">
                <span className="xl:hidden">Ready to sell?</span>
                <span className="hidden xl:inline">Ready to sell your collection?</span>
              </p>
              <p className="mt-1.5 text-base leading-snug text-muted-foreground font-medium">
                Get an expert valuation from the UK&apos;s leading stamp buyers.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 xl:shrink-0">
            <Button
              asChild
              variant="ghost"
              className="h-12 px-5 text-base font-semibold text-primary hover:text-forest-green transition-colors"
            >
              <Link href="/how-to-sell">How it works</Link>
            </Button>
            <Button
              asChild
              className="group h-14 px-8 bg-forest-green text-base font-bold text-white hover:bg-forest-green/90 shadow-lg shadow-forest-green/20 transition-all hover:-translate-y-0.5"
            >
              <Link href="/sell-your-stamps" className="flex items-center gap-2">
                <span className="xl:hidden">Sell now</span>
                <span className="hidden xl:inline">Sell Your Stamps Now</span>
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
