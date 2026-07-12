'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Gift, Plus, Calendar, Percent, Check, Trash, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface BonusCode {
  id: string
  code: string
  description: string | null
  percentage_bonus: number
  is_active: boolean
  expires_at: string | null
  created_at: string
}

export default function PayoutBonusesPage() {
  const [codes, setCodes] = useState<BonusCode[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  
  // Form states
  const [newCode, setNewCode] = useState('')
  const [description, setDescription] = useState('')
  const [percentage, setPercentage] = useState('10')
  const [expiresAt, setExpiresAt] = useState('')

  const supabase = createClient()

  const fetchCodes = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('payout_bonus_codes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCodes(data || [])
    } catch (err: any) {
      toast.error('Failed to load bonus codes: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCodes()
  }, [])

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode.trim()) return

    startTransition(async () => {
      try {
        const { error } = await supabase
          .from('payout_bonus_codes')
          .insert({
            code: newCode.trim().toUpperCase(),
            description: description.trim() || null,
            percentage_bonus: parseFloat(percentage) || 0,
            expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
            is_active: true
          })

        if (error) throw error
        toast.success(`Promo code ${newCode.toUpperCase()} created successfully!`)
        setNewCode('')
        setDescription('')
        setPercentage('10')
        setExpiresAt('')
        fetchCodes()
      } catch (err: any) {
        toast.error('Failed to create promo code: ' + err.message)
      }
    })
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('payout_bonus_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      toast.success('Promo code status updated.')
      fetchCodes()
    } catch (err: any) {
      toast.error('Failed to update code: ' + err.message)
    }
  }

  const handleDeleteCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return
    try {
      const { error } = await supabase
        .from('payout_bonus_codes')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Promo code deleted successfully.')
      fetchCodes()
    } catch (err: any) {
      toast.error('Failed to delete code: ' + err.message)
    }
  }

  const formatGBP = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val)
  }

  return (
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-[#0B1D2E] text-white rounded-3xl border border-[#C5A059]/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/30">
              <Gift className="h-6 w-6 text-[#C5A059]" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">Discounts & Valuation Incentives</span>
              <h1 className="font-serif text-3xl font-bold mt-1 text-white">
                Payout Bonuses Manager
              </h1>
            </div>
          </div>
        </div>

        {/* Dynamic Overview & Creator Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Creator Drawer Form (Right sidebar equivalent) */}
          <div className="bg-white rounded-3xl border border-slate-150 shadow-sm p-6 sm:p-8 space-y-6 h-fit">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0B1D2E]">Create Promo Code</h2>
              <p className="text-xs text-slate-500 mt-1">Configure payout boosters to encourage fast shipping or reward valued sellers.</p>
            </div>

            <form onSubmit={handleCreateCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Promo Code Name</label>
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm font-black tracking-wider uppercase bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Description</label>
                <input
                  type="text"
                  placeholder="e.g. First-time seller 10% bonus"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Bonus Percentage (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm font-bold font-mono bg-white"
                    required
                  />
                  <span className="absolute right-4 top-3 text-slate-400 font-bold"><Percent className="h-4 w-4" /></span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Expiration Date (Optional)</label>
                <div className="relative">
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm font-medium bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-[#14452F] hover:bg-[#14452F]/90 text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Generate Code
              </button>
            </form>
          </div>

          {/* List Table Grid (Left column) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-150 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0B1D2E]">Active Promotion Campaigns</h2>
              <p className="text-xs text-slate-500 mt-1">Review active, expired, or paused valuation booster codes.</p>
            </div>

            <div className="overflow-x-auto -mx-6 sm:-mx-8">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-450 uppercase">
                    <th className="py-3 px-6">Promo Code</th>
                    <th className="py-3 px-4 text-center">Bonus Boost</th>
                    <th className="py-3 px-4">Expires At</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#C5A059]" />
                        <span className="text-xs mt-2 block">Loading codes...</span>
                      </td>
                    </tr>
                  ) : codes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-450">
                        No active bonus payout promo codes generated yet.
                      </td>
                    </tr>
                  ) : (
                    codes.map((item) => {
                      const isExpired = item.expires_at ? new Date(item.expires_at).getTime() < Date.now() : false
                      
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/20 transition-all">
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 rounded bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/25 font-mono font-black text-xs block w-fit">
                              {item.code}
                            </span>
                            {item.description && (
                              <span className="text-[11px] text-slate-400 mt-1 block font-medium">
                                {item.description}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-center font-bold font-mono text-emerald-700">
                            +{item.percentage_bonus}%
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-500">
                            {item.expires_at ? (
                              new Date(item.expires_at).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            ) : (
                              <span className="text-slate-350 italic">Never</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleToggleActive(item.id, item.is_active)}
                              className={cn(
                                'px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider transition-all cursor-pointer',
                                item.is_active && !isExpired
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : 'bg-red-50 text-red-600 border-red-100'
                              )}
                              title={item.is_active ? 'Pause Code' : 'Activate Code'}
                            >
                              {isExpired ? 'Expired' : (item.is_active ? 'Active' : 'Paused')}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteCode(item.id)}
                              className="p-2 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                              title="Delete Code"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
