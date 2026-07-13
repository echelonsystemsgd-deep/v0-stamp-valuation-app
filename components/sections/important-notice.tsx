'use client'

import React, { useState } from 'react'
import { ShieldAlert, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ImportantNotice() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div 
      className="bg-[#FBFBF9] dark:bg-navy/20 border border-rose-100 dark:border-rose-900/30 rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-900/5 relative overflow-hidden transition-all duration-300"
      aria-labelledby="notice-heading"
    >
      {/* Decorative top strip */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C5A059]" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 text-rose-900 dark:text-rose-450">
          <div className="bg-rose-900 dark:bg-rose-950 p-2.5 rounded-xl shadow-md shrink-0">
            <ShieldAlert className="h-5 w-5 text-white" />
          </div>
          <h2 id="notice-heading" className="font-serif text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Important Info
          </h2>
        </div>

        {/* Mobile/Tablet Collapse Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-50 text-rose-900 border border-rose-100 hover:bg-rose-100/50 transition-all cursor-pointer dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30"
        >
          {isOpen ? (
            <>
              Hide <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Show <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      </div>

      {/* Content wrapper */}
      <div className={cn(
        "transition-all duration-300 space-y-6 lg:block",
        isOpen ? "block animate-fade-in-up" : "hidden"
      )}>
        <div className="space-y-4">
          <NoticePoint 
            title="British Decimal Stamps Only"
            description="We focus exclusively on the purchase of British decimal stamps. Our expertise ensures we provide the best valuation for modern UK issues."
          />
          <NoticePoint 
            title="Pre-sorted Collections Required"
            description="Collections must be pre-sorted for an accurate valuation. This allows us to provide you with the most precise and competitive rate."
          />
          <NoticePoint 
            title="Non-decimal Restrictions"
            description="We are currently not accepting foreign or pre-decimal stamps. We maintain high standards by focusing on our specialisation."
            isWarning
          />
        </div>

        {/* Footer advisory */}
        <p className="pt-5 border-t border-slate-100 dark:border-slate-805/50 text-xs font-bold text-rose-900/60 dark:text-rose-450/60 leading-relaxed text-center">
          If you have specialised collections or high-archive value lots, please contact our experts directly before proceeding.
        </p>
      </div>
    </div>
  )
}

function NoticePoint({ 
  title, 
  description, 
  isWarning = false 
}: { 
  title: string
  description: string
  isWarning?: boolean 
}) {
  return (
    <div className="space-y-1.5 p-1">
      <div className="flex items-center gap-2">
        <div className={cn(
          "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
          isWarning ? "bg-rose-100/60 dark:bg-rose-950/40" : "bg-emerald-100/60 dark:bg-emerald-950/40"
        )}>
          <CheckCircle className={cn(
            "h-3 w-3",
            isWarning ? "text-rose-700 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"
          )} />
        </div>
        <h3 className="font-serif text-base font-black text-rose-950 dark:text-slate-200">
          {title}
        </h3>
      </div>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs pl-7">
        {description}
      </p>
    </div>
  )
}
