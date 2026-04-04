'use client'

import React, { useState, useEffect } from 'react'
import { X, MessageSquare, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ExpertPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Show after 5 seconds
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [isDismissed])

  if (isDismissed) return null

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[60] w-[320px] transition-all duration-700 ease-in-out transform",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
      )}
    >
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden ring-1 ring-slate-900/5">
        {/* Header with Close */}
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-xl border-2 border-white/20">
              A
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Arthur Westbrook</p>
              <p className="text-primary-foreground/60 text-[10px] uppercase font-black tracking-widest">Lead Specialist</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => setIsDismissed(true), 700)
            }}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-slate-600 text-sm leading-relaxed">
            "Hello! I'm here if you have any questions about your collection or the valuation process. No collection is too large for us to review."
          </p>
          
          <div className="space-y-2">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-xl gap-2 shadow-lg shadow-primary/20">
              <MessageSquare className="h-4 w-4" /> Message Arthur
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-slate-200 text-slate-700 h-10 rounded-xl px-0">
                <Phone className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" className="flex-1 border-slate-200 text-slate-700 h-10 rounded-xl px-0">
                <Mail className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
