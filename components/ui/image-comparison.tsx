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

export function ImageComparison({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = React.useState(50)
  const [isResizing, setIsResizing] = React.useState(false)

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isResizing && e.type !== 'touchmove') return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    const relativeX = x - rect.left
    const position = Math.max(0, Math.min(100, (relativeX / rect.width) * 100))
    setSliderPosition(position)
  }

  return (
    <div 
      className={cn("relative w-full aspect-[4/3] overflow-hidden rounded-xl border-4 border-white shadow-2xl cursor-col-resize select-none", className)}
      onMouseMove={handleMove}
      onMouseDown={() => setIsResizing(true)}
      onMouseUp={() => setIsResizing(false)}
      onMouseLeave={() => setIsResizing(false)}
      onTouchMove={handleMove}
      onTouchStart={() => setIsResizing(true)}
      onTouchEnd={() => setIsResizing(false)}
    >
      {/* After Image (Background) */}
      <img 
        src={afterImage} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
        {afterLabel}
      </div>

      {/* Before Image (Foreground with Clip) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={beforeImage} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-forest-green/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Line */}
      <div 
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
        style={{ left: `${sliderPosition}%` }}
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
