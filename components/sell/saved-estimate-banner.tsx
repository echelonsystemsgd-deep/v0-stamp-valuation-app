"use client"

import React from "react"
import { CheckCircle2 } from "lucide-react"

interface SavedEstimateBannerProps {
  lowOffer: string | null
  highOffer: string | null
}

export function SavedEstimateBanner({ lowOffer, highOffer }: SavedEstimateBannerProps) {
  if (!lowOffer?.trim() || !highOffer?.trim()) return null

  return (
    <div
      role="status"
      className="mb-8 p-4 bg-forest-green/5 border border-forest-green/10 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500"
    >
      <div className="bg-forest-green/10 p-2 rounded-full shrink-0" aria-hidden>
        <CheckCircle2 className="w-5 h-5 text-forest-green" />
      </div>
      <p className="text-sm text-slate-700 leading-relaxed font-medium pt-0.5 min-w-0">
        <span className="mr-1.5" aria-hidden>
          ✅
        </span>
        <strong className="text-slate-900">Verified Estimate</strong>:{" "}
        <span className="text-forest-green font-bold">
          £{lowOffer} - £{highOffer}
        </span>{" "}
        saved. Complete the form to lock in this offer.
      </p>
    </div>
  )
}
