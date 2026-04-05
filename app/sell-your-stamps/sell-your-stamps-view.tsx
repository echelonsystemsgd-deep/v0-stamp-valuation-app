"use client"

import React, { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SellForm } from "@/components/forms/sell-form"
import { BuyingTable } from "@/components/valuation/buying-table"
import { ImportantNotice } from "@/components/sections/important-notice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, FileText, Verified } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { SavedEstimateBanner } from "@/components/sell/saved-estimate-banner"

const CONDITION_LABEL: Record<string, string> = {
  mnh: "MNH",
  mh: "MH",
  fu: "FU",
  gu: "GU",
}

function formatLockInDescription(
  faceValue: string | null,
  condition: string | null,
  offerLow: string,
  offerHigh: string
): string {
  const key = condition?.toLowerCase() ?? ""
  const condLabel = CONDITION_LABEL[key] ?? (condition ? condition.toUpperCase() : "Unknown")
  const fv = faceValue ?? ""
  return `Calculation from homepage: £${fv} Face Value, ${condLabel} Condition. Estimated at £${offerLow} - £${offerHigh}.`
}

export function SellYourStampsView() {
  const [activeTab, setActiveTab] = useState("calculate")
  const searchParams = useSearchParams()

  const offerLow = searchParams.get("offer_low")
  const offerHigh = searchParams.get("offer_high")
  const faceValue = searchParams.get("face_value")
  const condition = searchParams.get("condition")

  const isLockInOffer = Boolean(offerLow?.trim())
  const hasFullEstimate = Boolean(offerLow?.trim() && offerHigh?.trim())

  useEffect(() => {
    if (isLockInOffer) {
      setActiveTab("form")
      const t = window.setTimeout(() => {
        const formSection = document.getElementById("appraisal-form-header")
        formSection?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 300)
      return () => window.clearTimeout(t)
    }
  }, [isLockInOffer])

  const handleValuationAction = useCallback(() => {
    setActiveTab("form")
    setTimeout(() => {
      const formSection = document.getElementById("appraisal-form-header")
      formSection?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }, [])

  const initialDescription =
    hasFullEstimate && offerLow && offerHigh
      ? formatLockInDescription(faceValue, condition, offerLow, offerHigh)
      : undefined

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
        <section className="bg-[#0b1b3d] py-16 md:py-24 lg:py-32 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 transform translate-x-1/2 hidden md:block" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto lg:mx-0 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-sm">
                <Verified className="h-4 w-4 text-gold" /> Trusted UK Stamp Dealer
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.1] sm:max-w-3xl text-white">
                Sell Your Modern <span className="text-gold italic">Stamps</span>
              </h1>
              <p className="mt-4 text-lg sm:text-xl md:text-2xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The fastest way to de-stash your collection. Calculate an instant estimate below or request a full
                appraisal for large lots.
              </p>
            </div>
          </div>
        </section>

        <ImportantNotice />

        <section className="py-12 lg:py-20 -mt-10 md:-mt-16 relative z-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col items-center mb-12">
                <TabsList className="h-14 sm:h-16 p-1 bg-white shadow-2xl shadow-indigo-100/50 border border-slate-100 rounded-2xl w-full max-w-xl">
                  <TabsTrigger
                    value="calculate"
                    className="flex-1 h-full rounded-xl gap-2 sm:gap-3 text-sm sm:text-base font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all"
                  >
                    <Calculator className="h-4 w-4 sm:h-5 sm:w-5" /> Instant Calculator
                  </TabsTrigger>
                  <TabsTrigger
                    value="form"
                    className="flex-1 h-full rounded-xl gap-2 sm:gap-3 text-sm sm:text-base font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all"
                  >
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5" /> Request Appraisal
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="calculate" className="mt-0 outline-none focus-visible:ring-0">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800">1. Instant Buying Rates</h2>
                      <p className="mt-2 text-sm text-slate-500">
                        For the full line-by-line acquisition desk with sticky totals, open the{" "}
                        <Link href="/buying-rates" className="font-semibold text-forest-green hover:underline underline-offset-4">
                          buying rates desk
                        </Link>
                        .
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-400 shrink-0">UPDATED: APRIL 2024</span>
                  </div>
                  <BuyingTable onAction={handleValuationAction} />
                </div>
              </TabsContent>

              <TabsContent value="form" className="mt-0 outline-none focus-visible:ring-0">
                <div
                  id="appraisal-form-header"
                  className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-100"
                >
                  <div className="mb-10 text-center">
                    <h2 className="text-3xl font-black text-slate-900 mb-3">Professional Stamp Valuation</h2>
                    <p className="text-slate-500 text-lg">
                      Upload photos of your collection and our experts will provide a detailed appraisal within 48 hours.
                    </p>
                  </div>
                  <SavedEstimateBanner lowOffer={offerLow} highOffer={offerHigh} />
                  <SellForm
                    key={hasFullEstimate ? `${offerLow}-${offerHigh}-${faceValue}-${condition}` : "default"}
                    initialQuantity={faceValue ?? undefined}
                    initialDescription={initialDescription}
                    isLockInOffer={isLockInOffer}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
