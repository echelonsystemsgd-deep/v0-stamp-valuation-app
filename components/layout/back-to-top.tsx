'use client'

import * as React from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export function BackToTop() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    let ticking = false

    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 300)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    toggleVisibility()

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/unauthorized') ||
    pathname.startsWith('/auth')
  ) return null

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        'fixed right-4 sm:right-6 z-50 h-10 w-10 rounded-full shadow-lg transition-all duration-300 transform-gpu hover:scale-110 focus-visible:ring-2 focus-visible:ring-forest-green cursor-pointer',
        isVisible 
          ? pathname === '/sell-your-stamps'
            ? 'bottom-36 lg:bottom-28 opacity-100'
            : 'bottom-20 md:bottom-24 lg:bottom-28 opacity-100'
          : 'bottom-20 md:bottom-24 lg:bottom-28 opacity-0 pointer-events-none shadow-none'
      )}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
