import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'light' | 'dark'
  scrolled?: boolean
  className?: string
}

export function Logo({ variant = 'light', scrolled = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 md:gap-4 group", className)}>
      {/* Icon/Mark */}
      <div className={cn(
        "relative transition-all duration-500 ease-in-out flex-shrink-0",
        scrolled ? "w-10 h-10 md:w-12 md:h-12" : "w-12 h-12 md:w-16 md:h-16"
      )}>
        <Image
          src="/brand-mark.svg"
          alt="Sell Your Stamps UK Mark"
          fill
          className={cn(
            "object-contain transition-all duration-500",
            variant === 'light' ? "brightness-0 invert" : ""
          )}
          priority
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center">
        <span className={cn(
          "font-serif font-bold leading-none tracking-tight transition-all duration-500",
          scrolled ? "text-lg md:text-xl" : "text-xl md:text-2xl lg:text-3xl",
          variant === 'light' ? "text-white drop-shadow-sm" : "text-primary"
        )}>
          Sell Your Stamps UK
        </span>
        <span className={cn(
          "font-sans uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold transition-all duration-500 whitespace-nowrap",
          scrolled ? "text-[6px] md:text-[8px] mt-0.5 tracking-[0.2em]" : "text-[9px] md:text-[11px] mt-1.5",
          variant === 'light' ? "text-white/70" : "text-muted-foreground"
        )}>
          Expert Valuations • Fair Prices • Trusted Buyers
        </span>
      </div>
    </div>
  )
}
