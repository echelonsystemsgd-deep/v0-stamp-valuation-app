'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export function StickyCTA() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      const footerElement = document.querySelector('footer')
      const footerHeight = footerElement ? footerElement.offsetHeight : 400

      const scrolledPastHeader = scrollY > 96
      const hitFooter = docHeight - (scrollY + windowHeight) < footerHeight

      if (scrolledPastHeader && !hitFooter) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    toggleVisibility()

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  if (
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/unauthorized') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/sell-your-stamps')
  ) return null

  return (
    <>
      {/* Mobile Sticky Bar */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-navy/95 backdrop-blur-md border-t border-border shadow-xl pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-all duration-300 lg:hidden",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Button
            asChild
            variant="ghost"
            className="h-10 px-3 text-sm font-semibold text-primary hover:text-forest-green"
          >
            <Link href="/how-to-sell">How to Sell</Link>
          </Button>
          <Button
            asChild
            className="group h-10 px-4 text-sm font-bold bg-forest-green text-white hover:bg-forest-green/90"
            aria-label="Request a Free Valuation"
          >
            <Link href="/sell-your-stamps" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>Free Valuation</span>
            </Link>
          </Button>
        </div>
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
              <Link href="/how-to-sell">How to Sell</Link>
            </Button>
            <Button
              asChild
              className="group bg-forest-green px-6 font-bold text-white hover:bg-forest-green/90"
            >
              <Link href="/sell-your-stamps" className="flex items-center gap-2">
                <span className="xl:hidden">Valuation</span>
                <span className="hidden xl:inline">Request a Free Valuation</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
