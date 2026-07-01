'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Printer, MapPin } from 'lucide-react'

interface SubmissionItem {
  id: string
  quantity: number
  rate_at_submission: number
  face_value_at_submission: number
  calculated_value: number
  stamp_categories: {
    name: string
    group_name: string
  } | null
}

interface Submission {
  id: string
  created_at: string
  collection_type: string
  approx_quantity: string
  estimated_era: string
  description: string
  estimated_valuation: number
  guest_name: string | null
  guest_email: string | null
  user_id: string | null
}

interface Profile {
  full_name: string | null
  email: string
}

interface PayoutDetail {
  payout_method: string
  bank_account_name?: string
  bank_account_number?: string
  bank_sort_code?: string
  cheque_recipient_name?: string
}

export default function PrintPackingSlipPage() {
  const { id } = useParams() as { id: string }
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [items, setItems] = useState<SubmissionItem[]>([])
  const [seller, setSeller] = useState<Profile | null>(null)
  const [payout, setPayout] = useState<PayoutDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch submission details
        const { data: sub, error: subErr } = await supabase
          .from('submissions')
          .select('*')
          .eq('id', id)
          .single()

        if (subErr) throw subErr
        setSubmission(sub)

        // Fetch items breakdown
        const { data: itms } = await supabase
          .from('submission_items')
          .select('*, stamp_categories(name, group_name)')
          .eq('submission_id', id)

        setItems(itms || [])

        // Fetch seller details if registered
        if (sub.user_id) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', sub.user_id)
            .single()

          setSeller(prof)

          const { data: payDetails } = await supabase
            .from('profile_payout_details')
            .select('*')
            .eq('id', sub.user_id)
            .single()

          setPayout(payDetails)
        }
      } catch (err: any) {
        console.error('Failed to load print sheet:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Trigger print dialog once data is loaded
  useEffect(() => {
    if (!loading && submission) {
      const timer = setTimeout(() => {
        window.print()
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [loading, submission])

  const formatGBP = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
        <p className="text-sm text-slate-500 mt-2">Preparing printing document...</p>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="p-8 text-center bg-white text-slate-700">
        <h2 className="text-xl font-bold">Error: Valuation Packing Slip Not Found</h2>
      </div>
    )
  }

  const sellerName = seller?.full_name || submission.guest_name || 'Not provided'
  const sellerEmail = seller?.email || submission.guest_email || ''

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto text-slate-900 min-h-screen flex flex-col justify-between print:p-0">
      
      <div className="space-y-8">
        
        {/* Printable HUD Actions Header (Hidden during actual print) */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 print:hidden">
          <span className="text-xs text-slate-500 font-semibold">Print Preview Layout</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
          >
            <Printer className="h-4 w-4" /> Trigger Print
          </button>
        </div>

        {/* 1. Barcode ID Header */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Sell Your Stamps UK</h1>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500 block">Valuation Office Hub</span>
            <p className="text-xs text-slate-400 mt-1">Date Printed: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
          <div className="text-right border-2 border-slate-900 p-3 rounded-lg bg-slate-50">
            <span className="text-[10px] font-bold block uppercase tracking-widest text-slate-500">Valuation ID Barcode</span>
            <p className="font-mono text-lg font-black tracking-wider text-slate-900">VAL-{submission.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        {/* Highlight Callout Box */}
        <div className="border-4 border-slate-900 p-5 text-center space-y-1">
          <h2 className="font-black text-lg uppercase tracking-wider">PLACE THIS SHEET INSIDE YOUR PARCEL</h2>
          <p className="text-xs text-slate-500">This slip is required to identify your stamps upon arrival at our verification facility. Unlabeled packages may be delayed.</p>
        </div>

        {/* 2. Customer details & Ship-to Details Grid */}
        <div className="grid grid-cols-2 gap-8 border-b border-slate-200 pb-6 text-sm">
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Seller Details</h3>
            <div>
              <p className="font-black text-slate-900">{sellerName}</p>
              <p className="text-slate-600">{sellerEmail}</p>
              <p className="text-slate-500">Collection Type: <span className="font-bold capitalize">{submission.collection_type.replace('_', ' ')}</span></p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Ship To Address</h3>
            <div className="flex gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-slate-600" />
              <div className="font-mono text-xs leading-relaxed text-slate-900">
                <strong>Stamp Appraisal Department</strong><br />
                Sell Your Stamps UK HQ<br />
                14 Heritage Lane, London<br />
                EC1A 1BB, United Kingdom
              </div>
            </div>
          </div>
        </div>

        {/* 3. Items Breakdown Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Declared Stamp Items Breakdown</h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 font-bold">
                <th className="py-2">Stamp Category Details</th>
                <th className="py-2 text-right">Face Value</th>
                <th className="py-2 text-right">Buying Rate</th>
                <th className="py-2 text-right">Quantity</th>
                <th className="py-2 text-right">Estimated Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map(item => (
                <tr key={item.id}>
                  <td className="py-2.5">
                    <p className="font-bold text-slate-900">{item.stamp_categories?.name || 'Unknown'}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{item.stamp_categories?.group_name || 'Stamp Group'}</p>
                  </td>
                  <td className="py-2.5 text-right font-mono">{formatGBP(item.face_value_at_submission)}</td>
                  <td className="py-2.5 text-right font-mono">{(item.rate_at_submission * 100).toFixed(1)}%</td>
                  <td className="py-2.5 text-right font-bold font-mono">{item.quantity}</td>
                  <td className="py-2.5 text-right font-bold font-mono">{formatGBP(item.calculated_value)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-900 font-bold text-sm">
                <td colSpan={4} className="py-3 text-right uppercase tracking-wider">Estimated Valuation Total:</td>
                <td className="py-3 text-right font-mono">{formatGBP(submission.estimated_valuation)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 4. Payment Selected */}
        {payout && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-slate-500">Payout Preference Logged</h4>
            {payout.payout_method === 'bank_transfer' ? (
              <div className="grid grid-cols-2 gap-y-1">
                <span>Method:</span>
                <span className="font-bold">Bank Transfer</span>
                <span>Payee Name:</span>
                <span className="font-bold">{payout.bank_account_name || sellerName}</span>
                <span>Account details:</span>
                <span className="font-bold font-mono">Sort Code: {payout.bank_sort_code || '***'} • Account: {payout.bank_account_number || '***'}</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-y-1">
                <span>Method:</span>
                <span className="font-bold">Cheque Payout</span>
                <span>Payee Recipient:</span>
                <span className="font-bold">{payout.cheque_recipient_name || sellerName}</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer Branding details */}
      <div className="border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400 uppercase tracking-widest mt-12 print:mt-24">
        Thank you for choosing Sell Your Stamps UK • Support email: support@ukstampvaluations.co.uk
      </div>

    </div>
  )
}
