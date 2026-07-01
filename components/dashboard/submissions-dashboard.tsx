'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  FileText, 
  Banknote, 
  Clock, 
  ArrowRight, 
  Inbox, 
  HelpCircle,
  TrendingUp,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Submission {
  id: string
  user_id: string | null
  guest_name: string | null
  guest_email: string | null
  collection_type: string
  approx_quantity: string
  estimated_era: string
  description: string
  estimated_valuation: number
  final_reviewed_valuation: number | null
  status: 
    | 'quote_requested' 
    | 'quote_given' 
    | 'awaiting_shipment' 
    | 'in_transit' 
    | 'received' 
    | 'under_review' 
    | 'approved' 
    | 'paid' 
    | 'rejected' 
    | 'cancelled'
  tracking_reference: string | null
  created_at: string
  updated_at: string
}

interface SubmissionsDashboardProps {
  initialSubmissions: Submission[]
  userId: string
}

const statusConfig: Record<Submission['status'], { label: string; className: string }> = {
  quote_requested: { label: 'Quote Requested', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  quote_given: { label: 'Quote Given - Action Required', className: 'bg-yellow-50 text-yellow-800 border-yellow-250/30' },
  awaiting_shipment: { label: 'Awaiting Shipment', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_transit: { label: 'In Transit', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  received: { label: 'Received', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  under_review: { label: 'Under Review', className: 'bg-amber-50 text-[#C5A059] border-[#C5A059]/30' },
  approved: { label: 'Approved', className: 'bg-emerald-50 text-[#14452F] border-[#14452F]/30' },
  paid: { label: 'Paid & Disbursed', className: 'bg-emerald-100 text-emerald-800 border-emerald-350/30' },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-200' },
  cancelled: { label: 'Cancelled', className: 'bg-slate-100 text-slate-650 border-slate-200' },
}

export function SubmissionsDashboard({ initialSubmissions, userId }: SubmissionsDashboardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)

  // Realtime Subscriptions
  useEffect(() => {
    const channel = supabase
      .channel(`submissions-dashboard-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSubmissions((prev) => [payload.new as Submission, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setSubmissions((prev) =>
              prev.map((s) => (s.id === payload.new.id ? (payload.new as Submission) : s))
            )
          } else if (payload.eventType === 'DELETE') {
            setSubmissions((prev) => prev.filter((s) => s.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  // Stats calculation
  const totalSubmissions = submissions.length
  const awaitingAction = submissions.filter(
    (s) => s.status === 'quote_given' || s.status === 'awaiting_shipment'
  ).length
  const completedPayouts = submissions.filter((s) => s.status === 'paid').length

  const formatGBP = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(value)
  }

  return (
    <div className="space-y-8">
      {/* SLA Turnaround Banner */}
      <div className="bg-[#14452F]/5 border border-[#14452F]/15 rounded-3xl p-6 flex flex-col sm:flex-row gap-4 items-start relative overflow-hidden shadow-sm">
        <div className="absolute left-0 top-0 h-full w-1 bg-[#14452F]" />
        <div className="p-3 bg-[#14452F]/10 rounded-2xl text-[#14452F] shrink-0">
          <Clock className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold text-[#0B1D2E]">Processing Turnaround Guarantee</h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
            Our valuation desk operates on strict service SLAs: Initial appraisals are generated <strong>within 24 hours</strong>. Physical inspections, audit verifications, and payout processing take <strong>2 to 3 business days</strong> from the moment your package is registered as received at our facility.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Valuations</span>
            <p className="text-3xl font-black text-[#0B1D2E] mt-1">{totalSubmissions}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#0B1D2E]">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Awaiting Action</span>
            <p className="text-3xl font-black text-[#C5A059] mt-1">{awaitingAction}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50/50 flex items-center justify-center text-[#C5A059]">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed Payouts</span>
            <p className="text-3xl font-black text-[#14452F] mt-1">{completedPayouts}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#14452F]/5 flex items-center justify-center text-[#14452F]">
            <Banknote className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Submissions Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0B1D2E]">My Appraisals</h2>
            <p className="text-sm text-slate-500 mt-1">Track the review status and payouts of your stamp collections.</p>
          </div>
          {totalSubmissions > 0 && (
            <Link
              href="/sell-your-stamps"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#14452F] hover:bg-[#14452F]/90 rounded-xl transition-all shadow-md animate-fade-in"
            >
              Request New Appraisal
            </Link>
          )}
        </div>

        {submissions.length === 0 ? (
          /* Premium Empty State */
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-[#C5A059]/30 rounded-2xl bg-[#FBFBF9]/40 max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
              <Inbox className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#0B1D2E]">No Appraisals Yet</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                Ready to value and sell your stamp collection? Request a free estimate from our expert UK stamp buyers in just 3 easy steps.
              </p>
            </div>

            {/* Stepper Steps Graphic */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-lg py-4 border-t border-b border-slate-100 my-2 text-center">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#C5A059] uppercase">Step 1</span>
                <p className="text-xs font-bold text-[#0B1D2E]">Submit Estimate</p>
                <p className="text-[10px] text-slate-400">Fill in the appraisal form with details & photos.</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#C5A059] uppercase">Step 2</span>
                <p className="text-xs font-bold text-[#0B1D2E]">Accept Quote & Ship</p>
                <p className="text-[10px] text-slate-400">Ship stamps securely using prepaid/tracked courier.</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#C5A059] uppercase">Step 3</span>
                <p className="text-xs font-bold text-[#0B1D2E]">Verification & Payout</p>
                <p className="text-[10px] text-slate-400">We inspect and disburse funds to your bank.</p>
              </div>
            </div>

            <Link
              href="/sell-your-stamps"
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#14452F] hover:bg-[#14452F]/90 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Start Free Appraisal Request <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          /* Submissions List Container */
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="pb-4 font-serif text-[#0B1D2E] font-bold text-sm">Valuation ID</th>
                    <th className="pb-4 font-serif text-[#0B1D2E] font-bold text-sm">Submitted Date</th>
                    <th className="pb-4 font-serif text-[#0B1D2E] font-bold text-sm">Collection Type</th>
                    <th className="pb-4 font-serif text-[#0B1D2E] font-bold text-sm text-right">Est. Valuation</th>
                    <th className="pb-4 font-serif text-[#0B1D2E] font-bold text-sm text-center">Status</th>
                    <th className="pb-4 font-serif text-[#0B1D2E] font-bold text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => {
                    const status = statusConfig[sub.status] || { label: sub.status, className: 'bg-slate-50 text-slate-700' }
                    return (
                      <tr 
                        key={sub.id} 
                        className="group hover:bg-[#FBFBF9]/70 transition-all duration-150 cursor-pointer"
                        onClick={() => router.push(`/dashboard/submissions/${sub.id}`)}
                      >
                        <td className="py-4 text-sm font-bold text-[#0B1D2E] group-hover:text-[#14452F] font-mono">
                          VAL-{sub.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-4 text-sm text-slate-500">
                          {new Date(sub.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 text-sm text-slate-600 capitalize font-medium">
                          {sub.collection_type.replace('_', ' ')}
                        </td>
                        <td className="py-4 text-sm text-[#0B1D2E] font-black text-right">
                          {formatGBP(sub.final_reviewed_valuation ?? sub.estimated_valuation)}
                        </td>
                        <td className="py-4 text-center">
                          <span className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border",
                            status.className
                          )}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#14452F] group-hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/dashboard/submissions/${sub.id}`)
                            }}
                          >
                            Details <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
              {submissions.map((sub) => {
                const status = statusConfig[sub.status] || { label: sub.status, className: 'bg-slate-50 text-slate-700' }
                return (
                  <div 
                    key={sub.id}
                    className="p-5 rounded-2xl border border-slate-105 bg-[#FBFBF9]/30 hover:bg-white hover:border-[#C5A059]/30 transition-all duration-205 cursor-pointer space-y-4 shadow-sm"
                    onClick={() => router.push(`/dashboard/submissions/${sub.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 font-mono block">VALUATION ID</span>
                        <span className="text-sm font-black text-[#0B1D2E] font-mono">
                          VAL-{sub.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider",
                        status.className
                      )}>
                        {status.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">DATE</span>
                        <span className="font-semibold text-slate-700">
                          {new Date(sub.created_at).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">COLLECTION</span>
                        <span className="font-semibold text-slate-700 capitalize">
                          {sub.collection_type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">VALUE</span>
                        <span className="text-sm font-black text-[#0B1D2E]">
                          {formatGBP(sub.final_reviewed_valuation ?? sub.estimated_valuation)}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#14452F] flex items-center gap-1">
                        View <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
