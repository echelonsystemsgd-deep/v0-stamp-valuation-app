'use client'

import React, { useEffect } from 'react'
import { Printer, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ReceiptItem {
  id: string
  quantity: number
  rate_at_submission: number
  face_value_at_submission: number
  calculated_value: number
  reviewed_quantity: number | null
  reviewed_value: number | null
  stamp_categories: {
    name: string
    group_name: string
  } | null
}

interface ReceiptPayout {
  id: string
  method: 'bank_transfer' | 'cheque'
  amount: number
  reference_number: string
  recipient_name: string
  recipient_details: any
  paid_at: string
}

interface ReceiptSubmission {
  id: string
  collection_type: string
  approx_quantity: string
  estimated_era: string
  description: string
  estimated_valuation: number
  final_reviewed_valuation: number | null
  created_at: string
}

interface ReceiptPrintClientProps {
  submission: ReceiptSubmission
  items: ReceiptItem[]
  payout: ReceiptPayout | null
  sellerName: string
  sellerEmail: string
}

export function ReceiptPrintClient({
  submission,
  items,
  payout,
  sellerName,
  sellerEmail
}: ReceiptPrintClientProps) {
  
  // Auto trigger print dialog on mount
  useEffect(() => {
    // Small delay to ensure styles are fully rendered
    const timer = setTimeout(() => {
      window.print()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const formatGBP = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val)
  }

  const totalValue = submission.final_reviewed_valuation ?? submission.estimated_valuation
  const payoutRef = payout?.reference_number || 'Pending Settlement'
  const paidDateStr = payout?.paid_at 
    ? new Date(payout.paid_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Pending Payout'

  return (
    <div className="min-h-screen bg-white text-slate-800 p-8 sm:p-12 md:max-w-4xl mx-auto font-sans relative">
      
      {/* Print Controls (hidden on print) */}
      <div className="print:hidden flex justify-between items-center pb-6 border-b border-slate-100 mb-8">
        <Link
          href={`/dashboard/submissions/${submission.id}`}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Appraisal
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#14452F] hover:bg-[#14452F]/90 text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
        >
          <Printer className="h-4 w-4" /> Print / Save as PDF
        </button>
      </div>

      {/* Invoice Receipt Branding Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b-2 border-slate-100">
        <div>
          <h1 className="font-serif text-3xl font-black tracking-wider text-[#0B1D2E]">
            SellYourStamps<span className="text-[#C5A059]">UK</span>
          </h1>
          <p className="text-xs font-bold text-[#C5A059] uppercase tracking-widest mt-1">
            Official Appraisal Settlement Receipt
          </p>
        </div>
        <div className="text-left sm:text-right text-xs text-slate-500 space-y-1">
          <p><strong>Receipt Date:</strong> {new Date().toLocaleDateString('en-GB')}</p>
          <p><strong>Valuation ID:</strong> VAL-{submission.id.toUpperCase()}</p>
          <p><strong>Payout Ref:</strong> {payoutRef}</p>
        </div>
      </div>

      {/* Bill To & Settlement Info Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 text-sm">
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Recipient Details</h3>
          <div className="space-y-1 text-slate-700">
            <p className="font-bold text-slate-800 text-md">{sellerName}</p>
            <p>{sellerEmail}</p>
            <p>Customer Account: {submission.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
        <div className="space-y-2 text-left sm:text-right">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Payment Information</h3>
          <div className="space-y-1 text-slate-700">
            <p><strong>Payout Status:</strong> Paid</p>
            <p><strong>Payout Method:</strong> {payout?.method === 'bank_transfer' ? 'Bank Transfer (BACS)' : 'Cheque'}</p>
            <p><strong>Settle Date:</strong> {paidDateStr}</p>
            <p className="text-md text-[#14452F] font-black">
              Total Payout: {formatGBP(totalValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Itemized Stamp Audit Table */}
      <div className="py-6">
        <h3 className="font-serif text-lg font-bold text-[#0B1D2E] mb-4">Itemized Stamp Audits</h3>
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-xs font-bold text-slate-400 uppercase">
              <th className="pb-3">Stamp Category</th>
              <th className="pb-3 text-center">Buy Rate</th>
              <th className="pb-3 text-center">Submitted Qty</th>
              <th className="pb-3 text-center">Audited Qty</th>
              <th className="pb-3 text-right">Settled Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const qty = item.reviewed_quantity ?? item.quantity
              const rate = item.rate_at_submission
              const settledAmount = item.reviewed_value ?? item.calculated_value

              return (
                <tr key={item.id} className="hover:bg-slate-50/30">
                  <td className="py-3.5">
                    <span className="font-bold text-slate-800 block">
                      {item.stamp_categories?.name || 'Unknown Stamp'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                      {item.stamp_categories?.group_name || 'General'}
                    </span>
                  </td>
                  <td className="py-3.5 text-center font-mono font-medium text-slate-500">
                    {(rate * 100).toFixed(0)}%
                  </td>
                  <td className="py-3.5 text-center font-mono text-slate-500">
                    {Number(item.quantity).toLocaleString()}
                  </td>
                  <td className="py-3.5 text-center font-mono font-bold text-slate-850">
                    {Number(qty).toLocaleString()}
                  </td>
                  <td className="py-3.5 text-right font-serif font-bold text-slate-900">
                    {formatGBP(Number(settledAmount))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Valuation Receipt Totals Summary */}
      <div className="border-t-2 border-slate-200 pt-6 mt-4 flex justify-end">
        <div className="w-full sm:w-80 space-y-2 text-sm text-slate-700">
          <div className="flex justify-between">
            <span>Subtotal Estimate:</span>
            <span>{formatGBP(submission.estimated_valuation)}</span>
          </div>
          {submission.final_reviewed_valuation !== null && (
            <div className="flex justify-between text-[#C5A059] font-bold">
              <span>Auditing Adjustment:</span>
              <span>
                {formatGBP(submission.final_reviewed_valuation - submission.estimated_valuation)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-100 pt-2 text-lg font-serif font-bold text-[#0B1D2E]">
            <span>Net Paid Out:</span>
            <span className="text-[#14452F]">{formatGBP(totalValue)}</span>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="border-t border-slate-150 pt-12 mt-16 text-center text-xs text-slate-400 space-y-2">
        <p>Thank you for selling your stamps with Sell Your Stamps UK.</p>
        <p>This is an automated receipt generated from your secure seller console. For inquiries, email support@ukstampvaluations.co.uk.</p>
        <p>© 2026 Sell Your Stamps UK. All rights reserved.</p>
      </div>

      {/* Print Specific CSS Overrides */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
