import React from 'react'
import Link from 'next/link'
import { Compass, Award } from 'lucide-react'

export function SellerPromotionBanner() {
  return (
    <div className="relative overflow-hidden bg-[#14452F] border border-[#C5A059]/20 rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300">
      {/* Decorative Gold Accent Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#C5A059]" />
      
      {/* Decorative background glow */}
      <div className="absolute right-[-10%] top-[-20%] w-72 h-72 rounded-full bg-[#C5A059]/5 blur-[50px] pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pl-2 relative z-10">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
            <Award className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Seller Promotion Offer</span>
            <h3 className="font-serif text-xl font-bold text-white">
              Get Your Free Stamp Valuation
            </h3>
            <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
              Request an appraisal for your stamp collection today. Submitting your first appraisal automatically promotes your account to a <strong className="text-white">Seller</strong> account, unlocking advanced tracking for quotes, valuations, and payouts.
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0 md:pl-16">
          <Link
            href="/dashboard/submissions/new"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-[#0B1D2E] bg-[#C5A059] hover:bg-[#C5A059]/90 transition-all text-center shadow-lg hover:shadow-[#C5A059]/10"
          >
            <Compass className="h-4 w-4" /> Start Your Valuation
          </Link>
        </div>
      </div>
    </div>
  )
}
