import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'light' | 'dark'
  scrolled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ variant: _variant = 'light', scrolled = false, className, size }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 md:gap-4 group", className)}>
      <div className={cn(
        "relative transition-all duration-500 ease-in-out flex-shrink-0 bg-white p-1 rounded-xl border border-slate-100 shadow-sm hover:shadow-md",
        size === 'sm' ? "h-9 md:h-10" : 
        scrolled ? "h-10 md:h-11" : "h-12 md:h-14",
        "aspect-[2.2/1]" // The logo is wide
      )}>
        <Image
          src="/SellYourStampsUK-logo.jpeg"
          alt="Sell Your Stamps UK Logo"
          fill
          className="object-contain p-0.5 rounded-lg"
          priority
        />
      </div>
    </div>
  )
}
