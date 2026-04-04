'use client'

import React from 'react'
import { ShieldAlert, CheckCircle } from 'lucide-react'

export function ImportantNotice() {
  return (
    <section className="py-20 lg:py-24 bg-rose-50/50 border-y border-rose-100" aria-labelledby="notice-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10">
          {/* Header */}
          <div className="flex items-center gap-5 text-rose-900 animate-fade-in-up">
            <div className="bg-rose-900 p-3 rounded-2xl shadow-xl shadow-rose-900/20">
              <ShieldAlert className="h-8 w-8 text-white" />
            </div>
            <h2 id="notice-heading" className="text-4xl lg:text-5xl font-black tracking-tight">
              Important Information
            </h2>
          </div>

          {/* Notice Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <NoticeCard 
              title="British Decimal Stamps"
              description="We focused exclusively on the purchase of British decimal stamps. Our expertise ensures we provide the best valuation for modern UK issues."
              delay="100ms"
            />
            <NoticeCard 
              title="Pre-sorted Collections"
              description="Collections must be pre-sorted for an accurate valuation. This allows us to provide you with the most precise and competitive rate."
              delay="300ms"
            />
            <NoticeCard 
              title="Non-decimal Restrictions"
              description="Please note: We are currently not accepting non-UK or older non-decimal stamps. We maintain the highest standards by focusing on our specialization."
              delay="500ms"
              isWarning
            />
          </div>

          <p className="max-w-2xl text-center text-rose-900/60 font-medium text-base lg:text-lg animate-fade-in-up" style={{ animationDelay: '700ms' }}>
            If you have specialized collections or high-archive value lots, please contact our experts directly before proceeding with the valuation tool.
          </p>
        </div>
      </div>
    </section>
  )
}

function NoticeCard({ title, description, delay, isWarning = false }: { title: string, description: string, delay: string, isWarning?: boolean }) {
  return (
    <div 
      className={`bg-white p-8 lg:p-10 rounded-[2rem] shadow-2xl shadow-rose-900/5 border border-rose-100 animate-fade-in-up reveal-hidden`}
      style={{ animationDelay: delay }}
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isWarning ? "bg-rose-100/50" : "bg-emerald-100/50"}`}>
            <CheckCircle className={`h-4 w-4 ${isWarning ? "text-rose-900" : "text-emerald-700"}`} />
          </div>
          <h3 className="font-serif text-xl font-black text-rose-950">{title}</h3>
        </div>
        <p className="text-rose-900/80 leading-relaxed text-lg">
          {description}
        </p>
      </div>
    </div>
  )
}
