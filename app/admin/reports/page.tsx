'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  FileText, 
  Download, 
  Loader2, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Percent
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts'
import { toast } from 'sonner'

interface ReportMetric {
  date: string
  submissions: number
  payoutAmount: number
}

interface PaymentLog {
  id: string
  amount: number
  method: string
  paid_at: string
}

export default function ReportsDashboard() {
  const [metrics, setMetrics] = useState<ReportMetric[]>([])
  const [payments, setPayments] = useState<PaymentLog[]>([])
  const [loading, setLoading] = useState(true)

  // Totals
  const [totalSubmissions, setTotalSubmissions] = useState(0)
  const [totalPayoutVolume, setTotalPayoutVolume] = useState(0)
  const [averagePayout, setAveragePayout] = useState(0)
  const [bankPayoutsCount, setBankPayoutsCount] = useState(0)
  const [chequePayoutsCount, setChequePayoutsCount] = useState(0)

  const supabase = createClient()

  const fetchReportsData = async () => {
    try {
      // 1. Fetch total submissions count
      const { count: subCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
      setTotalSubmissions(subCount || 0)

      // 2. Fetch payments/payouts logs
      const { data: payLogs, error: payErr } = await supabase
        .from('payouts')
        .select('id, amount, method, paid_at')
        .order('paid_at', { ascending: true })

      if (payErr) throw payErr
      setPayments(payLogs || [])

      // Calculate totals
      let totalVolume = 0
      let bankCount = 0
      let chequeCount = 0
      
      payLogs?.forEach(pay => {
        totalVolume += pay.amount
        if (pay.method === 'bank_transfer') bankCount++
        if (pay.method === 'cheque') chequeCount++
      })

      setTotalPayoutVolume(totalVolume)
      setAveragePayout(payLogs && payLogs.length > 0 ? totalVolume / payLogs.length : 0)
      setBankPayoutsCount(bankCount)
      setChequePayoutsCount(chequeCount)

      // 3. Compile Recharts Monthly Data (Grouped by Month/Year)
      // Get last 6 months list dynamically
      const monthlyDataMap: Record<string, { submissions: number; payoutAmount: number }> = {}
      
      // Seed last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const key = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
        monthlyDataMap[key] = { submissions: 0, payoutAmount: 0 }
      }

      // Populate submissions counts
      const { data: allSubs } = await supabase.from('submissions').select('created_at')
      allSubs?.forEach(sub => {
        const key = new Date(sub.created_at).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
        if (monthlyDataMap[key]) {
          monthlyDataMap[key].submissions++
        }
      })

      // Populate payout amounts
      payLogs?.forEach(pay => {
        const key = new Date(pay.paid_at).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
        if (monthlyDataMap[key]) {
          monthlyDataMap[key].payoutAmount += pay.amount
        }
      })

      const chartData: ReportMetric[] = Object.keys(monthlyDataMap).map(key => ({
        date: key,
        submissions: monthlyDataMap[key].submissions,
        payoutAmount: monthlyDataMap[key].payoutAmount
      }))

      setMetrics(chartData)

    } catch (err: any) {
      toast.error('Failed to load reports data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportsData()
  }, [])

  // Export CSV
  const handleExportPayoutsCSV = () => {
    if (payments.length === 0) {
      toast.error('No payments recorded to export.')
      return
    }

    const headers = ['Payout ID', 'Amount (£)', 'Method', 'Paid Date']
    const rows = payments.map(p => [
      p.id,
      p.amount.toFixed(2),
      p.method,
      new Date(p.paid_at).toLocaleDateString('en-GB')
    ])

    const csvContent = 
      'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `financial_payouts_report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Payout report CSV downloaded.')
  }

  const formatGBP = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val)
  }

  const pieData = [
    { name: 'Bank Transfer', value: bankPayoutsCount, color: '#14452F' }, // Heritage Green
    { name: 'Cheque', value: chequePayoutsCount, color: '#C5A059' }      // Warm Gold
  ]

  return (
    <main className="flex-1 bg-[#FBFBF9] overflow-y-auto min-h-screen pb-16">
      <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8 space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#0B1D2E]">Valuations & Financial Reports</h1>
            <p className="text-sm text-slate-500 mt-1">Audit payout volumes, submissions scale, and payout options trends.</p>
          </div>
          
          <button
            onClick={handleExportPayoutsCSV}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Download className="h-4 w-4 text-slate-500" /> Export Financials CSV
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#C5A059] mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-semibold">Generating reports...</p>
          </div>
        ) : (
          <>
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Valuation Submissions</span>
                  <p className="text-3xl font-black text-[#0B1D2E] mt-1">{totalSubmissions}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#0B1D2E]">
                  <FileText className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Payouts Logged</span>
                  <p className="text-3xl font-black text-[#14452F] mt-1">{formatGBP(totalPayoutVolume)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#14452F]/5 flex items-center justify-center text-[#14452F]">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Average Payout Amount</span>
                  <p className="text-3xl font-black text-[#C5A059] mt-1">{formatGBP(averagePayout)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Payout Conversion</span>
                  <p className="text-3xl font-black text-[#0B1D2E] mt-1">
                    {totalSubmissions > 0 ? ((payments.length / totalSubmissions) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-655">
                  <Percent className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Submission Volume Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0B1D2E]">Submissions Trend</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Total valuation requests received over the past 6 months.</p>
                </div>

                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics}>
                      <defs>
                        <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="submissions" name="Submissions" stroke="#C5A059" strokeWidth={2} fillOpacity={1} fill="url(#colorSub)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payout breakdown pie list */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0B1D2E]">Payment Methods Split</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Distribution count between Bank Transfers and Cheques.</p>
                </div>

                <div className="py-8 space-y-4 flex flex-col justify-center h-full">
                  {pieData.map(item => {
                    const total = bankPayoutsCount + chequePayoutsCount
                    const percent = total > 0 ? (item.value / total) * 100 : 0
                    return (
                      <div key={item.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-[#0B1D2E]">{item.value} payouts</p>
                          <p className="text-[10px] text-slate-450 font-bold">{percent.toFixed(1)}%</p>
                        </div>
                      </div>
                    )
                  })}
                  {bankPayoutsCount === 0 && chequePayoutsCount === 0 && (
                    <p className="text-xs text-slate-400 text-center py-12">No payouts recorded to analyze.</p>
                  )}
                </div>
              </div>

              {/* Payout Volumes Bar Chart */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0B1D2E]">Financial Payout Volumes</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Total GBP valuation payout funds disbursed monthly.</p>
                </div>

                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics}>
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(val) => `£${val}`} />
                      <Tooltip formatter={(value) => [`£${parseFloat(value as string).toFixed(2)}`, 'Payouts Volume']} />
                      <Bar dataKey="payoutAmount" fill="#14452F" radius={[4, 4, 0, 0]}>
                        {metrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#14452F" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </main>
  )
}
