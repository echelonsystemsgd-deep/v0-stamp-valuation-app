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
          "fixed bottom-24 right-4 z-40 transition-all duration-300 md:hidden",
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
          "fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border shadow-2xl py-3 px-4 transition-all duration-500 hidden md:block",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-forest-green/10 p-2 rounded-lg">
              <Tag className="h-5 w-5 text-forest-green" />
            </div>
            <div>
              <p className="font-bold text-primary leading-none">Ready to sell your collection?</p>
              <p className="text-sm text-muted-foreground leading-tight mt-1">Get an expert valuation from the UK's leading stamp buyers.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="font-semibold text-primary hover:text-forest-green"
            >
              <Link href="/how-to-sell">How it works</Link>
            </Button>
            <Button
              asChild
              className="bg-forest-green hover:bg-forest-green/90 text-white font-bold px-6 group"
            >
              <Link href="/sell-your-stamps" className="flex items-center gap-2">
                Sell Your Stamps Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
