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

  React.useEffect(() => {
    const handleScroll = () => {
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
    <div 
      className={cn(
        "fixed bottom-24 lg:bottom-32 left-8 z-[60] transition-all duration-700 transform",
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
  )
}
