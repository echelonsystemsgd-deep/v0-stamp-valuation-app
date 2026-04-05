'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ImageComparisonProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

import Image from 'next/image'

export function ImageComparison({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className
}: ImageComparisonProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = React.useState(false)
  
  // Track position without triggering re-renders for the actual movement
  const positionRef = React.useRef(50)
  const rafId = React.useRef<number | null>(null)

  const updatePosition = (x: number, rect: DOMRect) => {
    const position = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100))
    positionRef.current = position
    
    if (rafId.current) return

    rafId.current = requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--slider-pos', `${positionRef.current}%`)
      }
      rafId.current = null
    })
  }

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isResizing && e.type !== 'touchmove') return
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    updatePosition(x, rect)
  }

  // Initial set
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--slider-pos', '50%')
    }
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full aspect-[4/3] overflow-hidden rounded-xl border-4 border-white shadow-2xl cursor-col-resize select-none", 
        "will-change-[--slider-pos]",
        className
      )}
      style={{ '--slider-pos': '50%' } as React.CSSProperties}
      onMouseMove={handleMove}
      onMouseDown={() => setIsResizing(true)}
      onMouseUp={() => setIsResizing(false)}
      onMouseLeave={() => setIsResizing(false)}
      onTouchMove={handleMove}
      onTouchStart={() => setIsResizing(true)}
      onTouchEnd={() => setIsResizing(false)}
    >
      {/* After Image (Background) */}
      <Image 
        src={afterImage} 
        alt="After" 
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest z-10">
        {afterLabel}
      </div>

      {/* Before Image (Foreground with Clip) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: 'inset(0 calc(100% - var(--slider-pos)) 0 0)' }}
      >
        <Image 
          src={beforeImage} 
          alt="Before" 
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute bottom-4 left-4 bg-forest-green/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest z-10">
          {beforeLabel}
        </div>
      </div>


      {/* Slider Line */}
      <div 
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
        style={{ left: 'var(--slider-pos)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-forest-green">
          <div className="flex gap-1">
             <div className="w-1 h-3 bg-slate-300 rounded-full" />
             <div className="w-1 h-3 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

