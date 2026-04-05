'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Type, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TextSizeToggle() {
  const [size, setSize] = React.useState<'normal' | 'large'>('normal')

  React.useEffect(() => {
    const root = document.documentElement
    if (size === 'large') {
      root.classList.add('text-size-large')
    } else {
      root.classList.remove('text-size-large')
    }
  }, [size])

  return (
    <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
      <button
        onClick={() => setSize('normal')}
        className={cn(
          "h-8 px-3 rounded-full text-xs font-bold transition-all flex items-center gap-1.5",
          size === 'normal' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-800"
        )}
        title="Normal text size"
      >
        <Minus className="w-3 h-3" /> A
      </button>
      <button
        onClick={() => setSize('large')}
        className={cn(
          "h-8 px-3 rounded-full text-xs font-bold transition-all flex items-center gap-1.5",
          size === 'large' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-800"
        )}
        title="Large text size"
      >
        <Plus className="w-3 h-3" /> A
      </button>
    </div>
  )
}
