'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  MapPin, 
  Package, 
  FileText,
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { BUSINESS_CONFIG } from '@/data/business'
import { getSellingOptionBadge, getPreferredContactBadge } from '@/lib/submissions'
import type { FormData } from './index'

interface InspectionResponseViewProps {
  referenceId: string
  formData: FormData
  isDashboard?: boolean
  onReset?: () => void
}

export function InspectionResponseView({
  referenceId,
  formData,
  isDashboard = false,
  onReset
}: InspectionResponseViewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyReference = () => {
    navigator.clipboard.writeText(referenceId)
    setCopied(true)
    toast.success('Valuation reference code copied to clipboard!')
    setTimeout(() => setCopied(false), 2500)
  }

  const sellingBadge = getSellingOptionBadge(formData.sellingOption || 'box_and_send')
  const contactBadge = getPreferredContactBadge(formData.preferredContact || 'phone')

  const isPhonePreferred = formData.preferredContact === 'phone' || formData.preferredContact === 'callback'
  const isEmailOnly = formData.preferredContact === 'email'

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* 1. Header Banner */}
      <Card className="bg-white dark:bg-slate-900 border-2 border-forest-green/20 shadow-xl overflow-hidden relative">
        <div className="h-2 bg-gradient-to-r from-forest-green via-gold to-forest-green" />
        <CardContent className="pt-8 pb-8 px-6 sm:px-10 text-center">
          {/* Animated Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black tracking-wider uppercase mb-5 select-none">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            Under Active Inspection
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-3">
            Your Stamps Are Now Under Expert Review
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Thank you, <strong>{formData.fullName}</strong>. We have securely logged your collection details and photos. Our senior philatelic appraisal team is examining them now.
          </p>

          {/* Reference Card with 1-Click Copy */}
          <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 p-3 sm:px-5 sm:py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Valuation Reference:
            </span>
            <span className="font-mono text-lg font-black text-slate-900 dark:text-white tracking-wide">
              {referenceId}
            </span>
            <button
              onClick={handleCopyReference}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-green hover:text-forest-green/80 bg-forest-green/10 hover:bg-forest-green/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Priority Contact & Call Notification Alert */}
      <div className="bg-gradient-to-br from-amber-50/90 to-yellow-50/60 dark:from-amber-950/20 dark:to-yellow-950/10 border-2 border-amber-300/80 dark:border-amber-700/50 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
            {isPhonePreferred ? (
              <Phone className="w-6 h-6 animate-bounce" />
            ) : isEmailOnly ? (
              <Mail className="w-6 h-6" />
            ) : (
              <MessageSquare className="w-6 h-6" />
            )}
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isPhonePreferred 
                  ? 'Our Senior Appraiser Will Call You Shortly' 
                  : isEmailOnly 
                  ? 'Valuation Report Arriving by Email' 
                  : 'We Will Call or Message You Shortly'}
              </h2>
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                Within 2 Hours
              </span>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {isPhonePreferred ? (
                <>
                  Because you requested a phone call, our senior specialist will ring you at{' '}
                  <strong className="text-slate-950 dark:text-white underline underline-offset-2">{formData.phone || 'your phone number'}</strong>{' '}
                  to walk you through our valuation breakdown, discuss any condition nuances, and finalize your shipping hand-off.
                </>
              ) : isEmailOnly ? (
                <>
                  Our appraisal team is calculating your itemized payout offer. A certified appraisal report will be delivered directly to{' '}
                  <strong className="text-slate-950 dark:text-white underline underline-offset-2">{formData.email}</strong>.
                </>
              ) : (
                <>
                  Our specialists are examining your submission. We will reach out via phone call or SMS/email to{' '}
                  <strong className="text-slate-950 dark:text-white underline underline-offset-2">{formData.phone || formData.email}</strong>{' '}
                  with your formal appraisal and purchase offer.
                </>
              )}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Mon–Fri 8:30 AM – 5:30 PM
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-green" /> 100% Free & No Obligation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 4-Stage What Happens Next Timeline */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-6">
            Valuation & Payout Process
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                  Step 1
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Details Received</h4>
              <p className="text-xs text-slate-600 leading-snug">
                Photos & collection notes securely logged in our appraisal system.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 space-y-2 ring-2 ring-amber-200/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                  Step 2 • Active
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Expert Inspection</h4>
              <p className="text-xs text-slate-600 leading-snug">
                Appraiser reviewing stamp condition, watermarks, and current market demand.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded-full">
                  Step 3
                </span>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Price Lock-In</h4>
              <p className="text-xs text-slate-600 leading-snug">
                You receive a guaranteed price quote with a 14-day lock-in & zero pressure.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded-full">
                  Step 4
                </span>
                <ShieldCheck className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Same-Day Payout</h4>
              <p className="text-xs text-slate-600 leading-snug">
                Disbursed by 2:00 PM on receipt directly into your UK bank account.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Logistics & Dispatch Instructions */}
      <Card className="bg-grainy-paper border border-gold/25 rounded-3xl shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-5">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-forest-green" />
              Postal Dispatch & Packaging Instructions
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Follow these simple steps to post your stamps safely to our Bournemouth inspection office.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            {/* Direct Official Address */}
            <div className="p-4.5 bg-white rounded-2xl border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                Verified Delivery Address
              </span>
              <p className="font-mono font-bold text-slate-800 text-xs leading-relaxed">
                UK Postage Stamps LTD<br />
                Office 214, Regus, Bournemouth Oxford Point<br />
                19 Oxford Road<br />
                Bournemouth, Dorset<br />
                BH8 8GS
              </p>
              <p className="text-[11px] text-slate-500 italic">
                (Deliveries accepted Mon–Fri 9am–5pm via Royal Mail Special Delivery, DPD, DHL, & ParcelForce)
              </p>
            </div>

            {/* Packaging Checklist */}
            <div className="p-4.5 bg-white rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-forest-green" />
                Parcel Packing Checklist
              </span>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5">
                  <span className="text-forest-green font-bold">✓</span>
                  <span>Enclose a slip of paper with reference: <strong className="font-mono">{referenceId}</strong> and your full name</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-forest-green font-bold">✓</span>
                  <span>Protect albums or sheets with waterproof envelope or bubble wrap</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-forest-green font-bold">✓</span>
                  <span>Post via Royal Mail Special Delivery or Tracked to ensure insurance coverage</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-forest-green font-bold">✓</span>
                  <span>Keep your postage tracking receipt until payment is verified</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Mobile Reassurance Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            asChild
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11 px-5 w-full sm:w-auto shadow-sm"
          >
            <a
              href={`https://wa.me/442012345678?text=${encodeURIComponent(`Hello, I have submitted stamps for valuation under reference ${referenceId}. Could you please update me on the inspection?`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              WhatsApp Appraisals Team
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-slate-300 font-bold rounded-xl h-11 px-5 w-full sm:w-auto bg-white"
          >
            <a href={`tel:${BUSINESS_CONFIG.phoneRaw}`}>
              <Phone className="w-4 h-4 mr-2 text-forest-green" />
              Call Desk Directly
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {onReset && (
            <Button
              type="button"
              variant="ghost"
              onClick={onReset}
              className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
            >
              Submit Another Collection
            </Button>
          )}

          <Button
            asChild
            variant="default"
            className="bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl h-11 px-6 w-full sm:w-auto"
          >
            <Link href={isDashboard ? "/dashboard" : "/"}>
              {isDashboard ? "Go to Dashboard" : "Return to Home"}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
