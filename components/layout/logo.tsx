import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'light' | 'dark'
  scrolled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ variant = 'light', scrolled = false, className, size }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 md:gap-4 group", className)}>
      <div className={cn(
        "relative transition-all duration-500 ease-in-out flex-shrink-0 bg-white p-1 rounded-sm shadow-sm",
        size === 'sm' ? "h-10 md:h-12" : 
        scrolled ? "h-12 md:h-14" : "h-16 md:h-24",
        "aspect-[2/1]" // The logo is wide
      )}>
        <Image
          src="/SellYourStampsUK-logo.jpeg"
          alt="Sell Your Stamps UK Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}
