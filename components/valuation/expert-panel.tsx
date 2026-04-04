'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, MessageSquare, Phone, Mail, Calculator, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { contactInfo } from '@/data/navigation'

export function SupportPanel() {
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

  const handleAction = () => {
    setIsVisible(false)
    setTimeout(() => setIsDismissed(true), 800)
  }

  if (isDismissed) return null

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[60] w-[340px] transition-all duration-700 ease-in-out transform",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
      )}
    >
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-100 overflow-hidden ring-1 ring-slate-900/5">
        {/* Header - Service Focused */}
        <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 ring-2 ring-white/10">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-black text-sm tracking-tight leading-tight uppercase italic">Expert Support</p>
              <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mt-0.5">UK Stamp Valuations</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => setIsDismissed(true), 700)
            }}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-white/40" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-slate-600 font-medium text-base leading-relaxed pr-2">
            How can we help you today with your stamp collection?
          </p>
          
          <div className="space-y-3">
            {/* Action 1: Valuation */}
            <Button asChild onClick={handleAction} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold h-12 rounded-2xl justify-between group px-5">
              <Link href="/sell-your-stamps">
                <div className="flex items-center gap-3">
                  <Calculator className="h-4 w-4 text-primary" />
                  <span>Instant Estimate</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Action 2: Guide */}
            <Button asChild onClick={handleAction} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold h-12 rounded-2xl justify-between group px-5">
              <Link href="/how-to-sell">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-forest-green" />
                  <span>Selling Guide</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Action 3: Contact */}
            <Button asChild onClick={handleAction} className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-2xl gap-3 shadow-xl shadow-primary/20 mt-2">
              <Link href="/contact">
                <MessageSquare className="h-5 w-5" /> Direct Inquiry
              </Link>
            </Button>

            {/* Secondary Contacts */}
            <div className="flex gap-3 pt-2">
              <Button asChild variant="outline" onClick={handleAction} className="flex-1 border-slate-200 hover:border-primary/50 text-slate-500 hover:text-primary h-12 rounded-2xl transition-all">
                <Link href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>
                  <Phone className="h-4 w-4 mr-2" /> Call
                </Link>
              </Button>
              <Button asChild variant="outline" onClick={handleAction} className="flex-1 border-slate-200 hover:border-primary/50 text-slate-500 hover:text-primary h-12 rounded-2xl transition-all">
                <Link href={`mailto:${contactInfo.email}`}>
                  <Mail className="h-4 w-4 mr-2" /> Email
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
