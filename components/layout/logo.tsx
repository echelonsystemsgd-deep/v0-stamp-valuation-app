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
      {/* Icon/Mark - The "SYS" Stamp */}
      <div className={cn(
        "relative transition-all duration-500 ease-in-out flex-shrink-0",
        size === 'sm' ? "w-8 h-8 md:w-10 md:h-10" : 
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
        <div className="flex items-baseline gap-1.5">
          <span className={cn(
            "font-serif font-bold leading-none tracking-tight transition-all duration-500",
            size === 'sm' ? "text-lg md:text-xl" :
            scrolled ? "text-lg md:text-xl" : "text-lg sm:text-xl md:text-2xl lg:text-3xl",
            variant === 'light' ? "text-white drop-shadow-sm" : "text-navy"
          )}>
            Sell Your Stamps
          </span>
          <span className={cn(
            "font-sans font-black leading-none transition-all duration-500",
            size === 'sm' ? "text-base md:text-lg" :
            scrolled ? "text-base md:text-lg" : "text-base sm:text-lg md:text-xl lg:text-2xl",
            variant === 'light' ? "text-white/90" : "text-forest-green"
          )}>
            UK
          </span>
        </div>
        
        {/* Secondary Typography with horizontal dividers */}
        <div className={cn(
          "flex items-center gap-2 mt-1 transition-all duration-500 whitespace-nowrap",
          "hidden xl:flex", // Hide on smaller screens
          variant === 'light' ? "text-white/70" : "text-muted-foreground"
        )}>
          <div className={cn("h-[1px] w-4 bg-current opacity-30", scrolled && "w-2")} />
          <span className={cn(
            "font-serif uppercase tracking-[0.1em] font-medium",
            size === 'sm' ? "text-[6px] md:text-[7px]" :
            scrolled ? "text-[6px] md:text-[7px]" : "text-[8px] md:text-[10px]"
          )}>
            Expert Valuations • Fair Prices • Trusted Buyers
          </span>
          <div className={cn("h-[1px] w-4 bg-current opacity-30", scrolled && "w-2")} />
        </div>
      </div>
    </div>
  )
}
