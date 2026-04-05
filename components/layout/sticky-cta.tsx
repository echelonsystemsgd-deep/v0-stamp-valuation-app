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
      {/* Mobile Floating Action Button */}
      <div 
        className={cn(
          "fixed bottom-24 right-4 z-40 transition-all duration-300 lg:hidden",
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-90 pointer-events-none"
        )}
      >
        <Button
          asChild
          size="lg"
          className="rounded-full h-14 w-14 p-0 bg-forest-green hover:bg-forest-green/90 text-white shadow-xl border-2 border-white/20"
          aria-label="Sell Your Stamps"
        >
          <Link href="/sell-your-stamps">
            <Tag className="h-6 w-6" />
          </Link>
        </Button>
      </div>

      {/* Desktop Sticky Bar (Bottom) */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border shadow-2xl py-3 transition-all duration-500 hidden lg:block",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
          <div className="flex min-w-0 items-start gap-4 xl:items-center">
            <div className="shrink-0 rounded-lg bg-forest-green/10 p-2">
              <Tag className="h-5 w-5 text-forest-green" />
            </div>
            <div className="min-w-0">
              <p className="font-bold leading-tight text-primary">
                <span className="xl:hidden">Ready to sell?</span>
                <span className="hidden xl:inline">Ready to sell your collection?</span>
              </p>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">
                Get an expert valuation from the UK&apos;s leading stamp buyers.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 xl:shrink-0">
            <Button
              asChild
              variant="ghost"
              className="font-semibold text-primary hover:text-forest-green"
            >
              <Link href="/how-to-sell">How it works</Link>
            </Button>
            <Button
              asChild
              className="group bg-forest-green px-6 font-bold text-white hover:bg-forest-green/90"
            >
              <Link href="/sell-your-stamps" className="flex items-center gap-2">
                <span className="xl:hidden">Sell now</span>
                <span className="hidden xl:inline">Sell Your Stamps Now</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
