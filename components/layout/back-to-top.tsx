'use client'

import * as React from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function BackToTop() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        'fixed right-6 z-50 h-10 w-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-forest-green',
        isVisible 
          ? 'bottom-24 lg:bottom-28 opacity-100' 
          : 'bottom-24 lg:bottom-28 opacity-0 pointer-events-none shadow-none'
      )}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
