'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Search, 
  Coins, 
  Loader2, 
  Check, 
  X, 
  History,
  Lock,
  Pause,
  Play
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  group_name: string
  description: string | null
  face_value: number
  rate: number
  is_active: boolean
  paused_reason: string | null
  paused_at: string | null
  updated_at: string
}

interface RateHistory {
  id: string
  category_id: string
  old_rate: number
  new_rate: number
  changed_at: string
  profiles: {
    full_name: string | null
    email: string
  } | null
}

export default function RatesManagerPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [history, setHistory] = useState<RateHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'paused'>('all')
  const [userRole, setUserRole] = useState<'admin' | 'staff' | 'user'>('user')
  const [userId, setUserId] = useState<string | null>(null)

  // Drawer / Editing Modal State
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [editRate, setEditRate] = useState('')
  const [editIsActive, setEditIsActive] = useState(true)
  const [pausedReason, setPausedReason] = useState('')
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState<RateHistory[]>([])

  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  // Fetch initial categories & audit logs
  const fetchData = async () => {
    try {
      // Fetch user role
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        setUserRole(prof?.role || 'user')
      }

      // Fetch categories
      const { data: cats, error: catsErr } = await supabase
        .from('stamp_categories')
        .select('*')
        .order('group_name', { ascending: true })

      if (catsErr) throw catsErr
      setCategories(cats || [])

      // Fetch rate changes history
      const { data: hist, error: histErr } = await supabase
        .from('rate_changes_history')
        .select('*, profiles:changed_by(full_name, email)')
        .order('changed_at', { ascending: false })

      if (!histErr) setHistory(hist || [])

    } catch (err: any) {
      toast.error('Failed to load rates data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = 
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.group_name.toLowerCase().includes(search.toLowerCase()) ||
      (cat.description || '').toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false

    if (activeTab === 'all') return true
    if (activeTab === 'active') return cat.is_active
    if (activeTab === 'paused') return !cat.is_active
  })

  // Open edit modal
  const handleOpenEdit = (cat: Category) => {
    setSelectedCategory(cat)
    setEditRate(cat.rate.toString())
    setEditIsActive(cat.is_active)
    setPausedReason(cat.paused_reason || '')
  }

  // Open specific history modal for a category
  const handleOpenHistory = (catId: string) => {
    const catHist = history.filter(h => h.category_id === catId)
    setSelectedHistory(catHist)
    setShowHistoryModal(true)
  }

  // Save changes (restricted to Admin)
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory || !userId) return

    if (userRole !== 'admin') {
      toast.error('Access Denied: Only Admins can modify buying rates.')
      return
    }

    const nextRate = parseFloat(editRate)
    if (isNaN(nextRate) || nextRate <= 0) {
      toast.error('Please enter a valid rate greater than zero.')
      return
    }

    startTransition(async () => {
      try {
        const hasRateChanged = selectedCategory.rate !== nextRate
        const hasStatusChanged = selectedCategory.is_active !== editIsActive

        // 1. Write audits if rate changed
        if (hasRateChanged) {
          const { error: histErr } = await supabase
            .from('rate_changes_history')
            .insert({
              category_id: selectedCategory.id,
              changed_by: userId,
              old_rate: selectedCategory.rate,
              new_rate: nextRate
            })

          if (histErr) throw histErr
        }

        // 2. Perform updates
        const updates: Partial<Category> = {
          rate: nextRate,
          is_active: editIsActive,
          paused_reason: editIsActive ? null : (pausedReason.trim() || 'Suspended by admin'),
          paused_at: editIsActive ? null : new Date().toISOString()
        }

        const { error: catErr } = await supabase
          .from('stamp_categories')
          .update(updates)
          .eq('id', selectedCategory.id)

        if (catErr) throw catErr

        toast.success(`Successfully updated category: ${selectedCategory.name}`)
        setSelectedCategory(null)
        fetchData()
      } catch (err: any) {
        toast.error('Failed to update rates: ' + err.message)
      }
    })
  }

  const formatGBP = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val)
  }

  return (
    <main className="flex-1 bg-[#FBFBF9] overflow-y-auto min-h-screen pb-16">
      <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8 space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#0B1D2E]">Stamp Rates Manager</h1>
            <p className="text-sm text-slate-500 mt-1">Configure face values, payout percentages, and suspend categories.</p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="border-b border-slate-200/60 flex gap-4 scrollbar-none">
          {(['all', 'active', 'paused'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap capitalize',
                activeTab === tab 
                  ? 'border-[#C5A059] text-[#0B1D2E]' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              )}
            >
              {tab} Categories
            </button>
          ))}
        </div>

        {/* Grid Container */}
        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
          
          {/* Search Row */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-450" />
              <input
                type="text"
                placeholder="Search category name, group or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm transition-all"
              />
            </div>
            <div className="ml-auto text-xs text-slate-450">
              Total {filteredCategories.length} categories configured
            </div>
          </div>

          {/* Grid list */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-left">
                  <th className="py-4 px-6 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider">Stamp Category</th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider">Group</th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider text-right">Face Value</th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider text-right">Payout Rate</th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider text-center">Status</th>
                  <th className="py-4 px-6 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-slate-400">
                      <Loader2 className="h-6 w-6 animate-spin text-[#C5A059] mx-auto mb-2" />
                      Loading rates data...
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-slate-450">
                      No categories found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map(cat => (
                    <tr 
                      key={cat.id} 
                      className="group hover:bg-[#FBFBF9]/80 transition-all cursor-pointer duration-100"
                      onClick={() => handleOpenEdit(cat)}
                    >
                      <td className="py-4 px-6 text-sm">
                        <p className="font-bold text-[#0B1D2E]">{cat.name}</p>
                        <p className="text-xs text-slate-450 leading-relaxed mt-0.5">{cat.description || 'No description provided.'}</p>
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-600 capitalize">
                        {cat.group_name}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-500 text-right font-mono">
                        {formatGBP(cat.face_value)}
                      </td>
                      <td className="py-4 px-4 text-sm font-black text-[#0B1D2E] text-right font-mono">
                        {(cat.rate * 100).toFixed(1)}% <span className="text-xs text-slate-400 font-normal">({cat.rate.toFixed(3)})</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border',
                          cat.is_active 
                            ? 'bg-emerald-50 text-[#14452F] border-[#14452F]/15'
                            : 'bg-red-50 text-red-700 border-red-200'
                        )}>
                          {cat.is_active ? 'Active' : 'Paused'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleOpenHistory(cat.id)}
                            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-700 border border-slate-200 transition-all cursor-pointer"
                            title="View history"
                          >
                            <History className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="px-3 py-1.5 border border-slate-200 hover:border-slate-350 bg-white text-xs font-bold text-[#0B1D2E] rounded-lg transition-all cursor-pointer"
                          >
                            Configure
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Configure Rates Drawer / Edit Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden relative animate-in zoom-in-95 duration-150">
            <div className="h-1 bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
            
            <form onSubmit={handleSaveChanges} className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0B1D2E]">Configure Stamp Rate</h3>
                <p className="text-xs text-slate-500 mt-1 font-semibold">{selectedCategory.name}</p>
              </div>

              {userRole !== 'admin' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/50 flex gap-2.5 items-start text-amber-800 text-xs">
                  <Lock className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-bold">Read-Only Staff Account</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Your profile is registered as staff. Rates adjustments can only be updated by admin roles.</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Payout rate value (decimal)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    max="1"
                    disabled={userRole !== 'admin'}
                    required
                    value={editRate}
                    onChange={(e) => setEditRate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm font-bold font-mono transition-all disabled:bg-slate-50"
                  />
                  <p className="text-[10px] text-slate-400">Current Payout Value: <span className="font-bold font-mono text-slate-600">{(parseFloat(editRate || '0') * 100).toFixed(1)}%</span></p>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Category Status</label>
                  <div className="flex gap-4 items-center">
                    <label className="inline-flex items-center text-sm font-semibold text-slate-650 cursor-pointer">
                      <input
                        type="radio"
                        name="cat-status"
                        disabled={userRole !== 'admin'}
                        checked={editIsActive}
                        onChange={() => setEditIsActive(true)}
                        className="rounded-full border-slate-350 text-[#14452F] focus:ring-[#14452F] h-4 w-4 cursor-pointer"
                      />
                      <span className="ml-2 flex items-center gap-1 text-emerald-700">
                        <Play className="h-3 w-3 fill-emerald-600 stroke-none" /> Active
                      </span>
                    </label>

                    <label className="inline-flex items-center text-sm font-semibold text-slate-650 cursor-pointer">
                      <input
                        type="radio"
                        name="cat-status"
                        disabled={userRole !== 'admin'}
                        checked={!editIsActive}
                        onChange={() => setEditIsActive(false)}
                        className="rounded-full border-slate-350 text-red-650 focus:ring-red-650 h-4 w-4 cursor-pointer"
                      />
                      <span className="ml-2 flex items-center gap-1 text-red-650">
                        <Pause className="h-3 w-3 fill-red-600 stroke-none" /> Suspended
                      </span>
                    </label>
                  </div>
                </div>

                {!editIsActive && (
                  <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-150">
                    <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Suspension Reason</label>
                    <input
                      type="text"
                      disabled={userRole !== 'admin'}
                      required={!editIsActive}
                      placeholder="e.g. Stock levels full, postal updates"
                      value={pausedReason}
                      onChange={(e) => setPausedReason(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm transition-all disabled:bg-slate-50"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer text-center"
                >
                  Close
                </button>
                {userRole === 'admin' && (
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#14452F] hover:bg-[#14452F]/90 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Save Config
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Log Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden relative animate-in zoom-in-95 duration-150">
            <div className="h-1 bg-[#C5A059]" />
            
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0B1D2E]">Rates Adjustments Log</h3>
                <p className="text-xs text-slate-500 mt-1">Audit log of rate corrections on this category.</p>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {selectedHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No rate adjustments logged for this category.</p>
                ) : (
                  <div className="relative border-l border-slate-100 pl-4 ml-2 space-y-4">
                    {selectedHistory.map(h => (
                      <div key={h.id} className="relative text-xs space-y-1">
                        <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#C5A059] border-2 border-white ring-2 ring-amber-100" />
                        <p className="font-semibold text-slate-700">
                          Rate altered from <span className="font-mono">{(h.old_rate * 100).toFixed(1)}%</span> to <span className="font-bold text-[#14452F] font-mono">{(h.new_rate * 100).toFixed(1)}%</span>
                        </p>
                        <span className="text-[9px] font-bold text-slate-450 uppercase block">
                          By: {h.profiles?.full_name || 'Admin'} • {new Date(h.changed_at).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowHistoryModal(false)
                  setSelectedHistory([])
                }}
                className="w-full py-3 text-xs font-bold uppercase tracking-wider text-slate-650 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
