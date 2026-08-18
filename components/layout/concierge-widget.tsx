'use client'

import * as React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

export function ConciergeWidget() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = React.useState(false)
  const [isDismissed, setIsDismissed] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  React.useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const docHeight = document.documentElement.scrollHeight
          const windowHeight = window.innerHeight
          const footerElement = document.querySelector('footer')
          const footerHeight = footerElement ? footerElement.offsetHeight : 400

          const scrolledPastHeader = scrollY > 96
          const hitFooter = docHeight - (scrollY + windowHeight) < footerHeight

          if (scrolledPastHeader && !hitFooter) {
            if (!isDismissed) setIsVisible(true)
          } else {
            setIsVisible(false)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])

  if (
    isDismissed || 
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
      {/* Mobile Compact FAB (Screens < md) */}
      <div
        className={cn(
          "fixed bottom-20 left-4 z-[45] transition-all duration-500 transform-gpu md:hidden",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
        )}
      >
        {isMobileOpen ? (
          <div className="relative glassmorphism p-4 rounded-2xl border border-white/20 shadow-2xl bg-white/95 dark:bg-navy/95 max-w-[280px]">
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="absolute -top-2 -right-2 bg-white dark:bg-navy border border-border rounded-full p-1.5 shadow-md hover:bg-muted transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
              aria-label="Close concierge preview"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="bg-heritage-gold/20 p-2 rounded-xl shrink-0">
                <Sparkles className="h-4 w-4 text-heritage-gold" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-primary text-sm">Expert Valuation</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Discover what your collection is worth in minutes.
                </p>
                <Button 
                  asChild 
                  size="sm"
                  className="mt-2.5 h-8 text-xs font-bold bg-forest-green text-white hover:bg-forest-green/90 px-3 rounded-lg"
                >
                  <Link href="/sell-your-stamps" className="flex items-center gap-1">
                    Start Now
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex items-center gap-2 bg-white/95 dark:bg-navy/95 backdrop-blur-md border border-heritage-gold/40 shadow-lg px-3.5 py-2.5 rounded-full text-xs font-bold text-primary hover:border-heritage-gold transition-all duration-200"
              aria-label="Open valuation concierge"
            >
              <Sparkles className="h-4 w-4 text-heritage-gold animate-pulse shrink-0" />
              <span>Valuation Guide</span>
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-full bg-white/80 dark:bg-navy/80 border border-border shadow text-muted-foreground hover:text-foreground"
              aria-label="Dismiss guide"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Desktop Rich Card (Screens >= md) */}
      <div 
        className={cn(
          "fixed bottom-24 lg:bottom-32 left-8 z-[60] transition-all duration-700 transform hidden md:block",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
        )}
      >
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-heritage-gold via-forest-green to-heritage-gold rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse" />
          
          <div className="relative glassmorphism p-5 rounded-2xl border border-white/20 shadow-2xl bg-white/90 dark:bg-navy/90 max-w-[280px]">
            <button 
              onClick={() => setIsDismissed(true)}
              className="absolute -top-2 -right-2 bg-white dark:bg-navy border border-border rounded-full p-1 shadow-md hover:bg-muted transition-colors"
              aria-label="Dismiss valuation concierge"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="flex items-start gap-4">
              <div className="bg-heritage-gold/20 p-2 rounded-xl shrink-0">
                <Sparkles className="h-5 w-5 text-heritage-gold" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-primary text-sm">Expert Valuation</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Ready to find out what your collection is worth? Start your premium valuation today.
                </p>
                <Button 
                  asChild 
                  variant="link" 
                  className="p-0 h-auto mt-3 text-xs font-bold text-forest-green hover:text-heritage-gold group/link transition-colors"
                >
                  <Link href="/sell-your-stamps" className="flex items-center gap-1">
                    Start Now
                    <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
