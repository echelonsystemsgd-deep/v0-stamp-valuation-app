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
import { HeroSlideshow } from "@/components/ui/hero-slideshow"
import { sellYourStampsHero } from "@/data/slideshows"
import { buyingRates } from "@/data/buying-rates"

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

  const [calculatorData, setCalculatorData] = useState<string | null>(null)

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

  const handleValuationAction = useCallback((quantities?: Record<string, number>, totalValue?: number) => {
    if (quantities && totalValue && totalValue > 0) {
      let calculationText = `Calculated via tool:\n`
      for (const [id, qty] of Object.entries(quantities)) {
        if (qty > 0) {
          const item = buyingRates.find((b) => b.id === id)
          if (item) {
            if (item.allowDecimal) {
              calculationText += `- £${qty.toFixed(2)} Face Value of ${item.name}\n`
            } else {
              calculationText += `- ${qty}x ${item.name}\n`
            }
          }
        }
      }
      calculationText += `Total Est. Payout: £${totalValue.toFixed(2)}`
      setCalculatorData(calculationText)
    }

    setActiveTab("form")
    setTimeout(() => {
      const formSection = document.getElementById("appraisal-form-header")
      formSection?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }, [])

  const initialDescription = calculatorData
    ? calculatorData
    : hasFullEstimate && offerLow && offerHigh
      ? formatLockInDescription(faceValue, condition, offerLow, offerHigh)
      : undefined

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 flex flex-col w-full bg-slate-50/50 dark:bg-slate-950/50">
        <HeroSlideshow 
          images={sellYourStampsHero}
          title="Sell Your Stamps UK"
          subtitle="The fastest way to de-stash your collection. Calculate an instant estimate or request a professional appraisal from our heritage experts."
        >
          <div className="mt-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs font-black uppercase tracking-widest backdrop-blur-sm shadow-sm">
              <Verified className="h-4 w-4 text-gold" /> Trusted British Stamp Dealer
            </span>
          </div>
        </HeroSlideshow>

        <section className="py-12 lg:py-20 -mt-10 md:-mt-16 relative z-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col items-center mb-12">
                <TabsList className="h-14 sm:h-16 p-1 bg-white shadow-2xl shadow-indigo-100/50 border border-slate-100 rounded-2xl w-full max-w-xl">
                  <TabsTrigger
                    value="calculate"
                    className="flex-1 h-full rounded-xl gap-2 sm:gap-3 text-sm sm:text-base font-bold data-[state=active]:bg-navy data-[state=active]:text-white transition-all"
                  >
                    <Calculator className="h-4 w-4 sm:h-5 sm:w-5" /> Instant Calculator
                  </TabsTrigger>
                  <TabsTrigger
                    value="form"
                    className="flex-1 h-full rounded-xl gap-2 sm:gap-3 text-sm sm:text-base font-bold data-[state=active]:bg-navy data-[state=active]:text-white transition-all"
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
                    </div>
                    <span className="text-sm font-bold text-slate-400 shrink-0">UPDATED: APRIL 2024</span>
                  </div>
                  <BuyingTable onAction={handleValuationAction} />
                </div>
              </TabsContent>

              <TabsContent value="form" className="mt-0 outline-none focus-visible:ring-0">
                <div
                  id="appraisal-form-header"
                  className="max-w-4xl mx-auto bg-grainy-paper p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-gold/10 ring-1 ring-gold/5 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gold/30" />
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

        <ImportantNotice />
      </main>
      <Footer />
    </>
  )
}
