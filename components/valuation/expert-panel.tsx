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
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)
  const [hasStickyCTA, setHasStickyCTA] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [isDismissed])

  useEffect(() => {
    const handleScroll = () => {
      setHasStickyCTA(window.scrollY > 300)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAction = () => {
    setIsMobilePanelOpen(false)
    setIsVisible(false)
    setTimeout(() => setIsDismissed(true), 800)
  }

  const handleDismiss = () => {
    setIsMobilePanelOpen(false)
    setIsVisible(false)
    setTimeout(() => setIsDismissed(true), 700)
  }

  if (isDismissed) return null

  return (
    <>
      <div
        className={cn(
          "fixed right-4 z-[60] hidden w-[340px] max-w-[calc(100vw-2.5rem)] transform transition-all duration-700 ease-in-out lg:block xl:right-6",
          hasStickyCTA ? "bottom-32 xl:bottom-36" : "bottom-6 xl:bottom-8",
          isVisible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-100 overflow-hidden ring-1 ring-slate-900/5">
          <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 ring-2 ring-white/10">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-black text-sm tracking-tight leading-tight uppercase italic">Expert Support</p>
                <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mt-0.5">Sell Your Stamps UK</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDismiss()
              }}
              onTouchEnd={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDismiss()
              }}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Dismiss expert support panel"
            >
              <X className="h-5 w-5 text-white/40" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-slate-600 font-medium text-base leading-relaxed pr-2">
              How can we help you today with your stamp collection?
            </p>

            <div className="space-y-3">
              <Button asChild onClick={handleAction} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold h-12 rounded-2xl justify-between group px-5">
                <Link href="/sell-your-stamps">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-4 w-4 text-primary" />
                    <span>Instant Estimate</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button asChild onClick={handleAction} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold h-12 rounded-2xl justify-between group px-5">
                <Link href="/how-to-sell">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-forest-green" />
                    <span>Selling Guide</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button asChild onClick={handleAction} className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-2xl gap-3 shadow-xl shadow-primary/20 mt-2">
                <Link href="/contact">
                  <MessageSquare className="h-5 w-5" /> Direct Inquiry
                </Link>
              </Button>

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

      <div
        className={cn(
          "fixed right-4 z-[60] lg:hidden transition-all duration-500 ease-out",
          hasStickyCTA ? "bottom-20 md:bottom-24" : "bottom-4 md:bottom-6",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "w-[min(22rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] origin-bottom-right transition-all duration-300",
            isMobilePanelOpen ? "scale-100" : "scale-95"
          )}
        >
          {isMobilePanelOpen ? (
            <div
              id="mobile-support-panel"
              className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-100 overflow-hidden ring-1 ring-slate-900/5"
            >
              <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 ring-2 ring-white/10">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-xs tracking-tight leading-tight uppercase italic">Expert Support</p>
                    <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mt-0.5">Sell Your Stamps UK</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  aria-label="Dismiss expert support panel"
                >
                  <X className="h-5 w-5 text-white/40" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <p className="text-sm leading-relaxed text-slate-600">
                  How can we help you today with your stamp collection?
                </p>

                <div className="space-y-3">
                  <Button asChild onClick={handleAction} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold h-11 rounded-2xl justify-between group px-4">
                    <Link href="/sell-your-stamps">
                      <div className="flex items-center gap-3">
                        <Calculator className="h-4 w-4 text-primary" />
                        <span>Instant Estimate</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  <Button asChild onClick={handleAction} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold h-11 rounded-2xl justify-between group px-4">
                    <Link href="/how-to-sell">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-forest-green" />
                        <span>Selling Guide</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  <Button asChild onClick={handleAction} className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-2xl gap-3 shadow-xl shadow-primary/20 mt-1">
                    <Link href="/contact">
                      <MessageSquare className="h-5 w-5" /> Direct Inquiry
                    </Link>
                  </Button>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <Button asChild variant="outline" onClick={handleAction} className="border-slate-200 hover:border-primary/50 text-slate-500 hover:text-primary h-11 rounded-2xl transition-all">
                      <Link href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>
                        <Phone className="h-4 w-4 mr-2" /> Call
                      </Link>
                    </Button>
                    <Button asChild variant="outline" onClick={handleAction} className="border-slate-200 hover:border-primary/50 text-slate-500 hover:text-primary h-11 rounded-2xl transition-all">
                      <Link href={`mailto:${contactInfo.email}`}>
                        <Mail className="h-4 w-4 mr-2" /> Email
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              onClick={() => setIsMobilePanelOpen(true)}
              className="h-14 rounded-full bg-slate-900 px-5 text-white shadow-[0_16px_38px_rgba(15,23,42,0.28)] hover:bg-slate-800"
              aria-expanded={false}
              aria-controls="mobile-support-panel"
            >
              <ShieldCheck className="h-5 w-5" />
              Expert Support
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
