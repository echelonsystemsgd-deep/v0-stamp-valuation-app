'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Search, 
  Users, 
  Loader2, 
  Check, 
  X, 
  ShieldAlert, 
  Ban,
  UserCheck,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'seller' | 'admin' | 'staff'
  is_suspended: boolean
  created_at: string
}

export default function SellerAccountsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'offline' | 'suspended'>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null)
  const [currentAdminRole, setCurrentAdminRole] = useState<'admin' | 'staff' | 'user' | null>(null)
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set())

  // Ban/Restrict Modal states
  const [showBanModal, setShowBanModal] = useState(false)
  const [banReason, setBanReason] = useState('')
  const [banType, setBanType] = useState<'restricted' | 'banned'>('restricted')

  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  // Track online/offline users via Presence channel
  useEffect(() => {
    const channel = supabase.channel('online-users')

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const onlineIds = new Set(Object.keys(state))
        setOnlineUserIds(onlineIds)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Fetch profiles list
  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentAdminId(user.id)
        const { data: prof } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        setCurrentAdminRole(prof?.role || 'staff')
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProfiles(data || [])
    } catch (err: any) {
      toast.error('Failed to load accounts list: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = 
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.full_name || '').toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false

    if (activeTab === 'all') return true
    if (activeTab === 'online') return !p.is_suspended && onlineUserIds.has(p.id)
    if (activeTab === 'offline') return !p.is_suspended && !onlineUserIds.has(p.id)
    if (activeTab === 'suspended') return p.is_suspended
    return true
  })

  // Select Row handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProfiles.map(p => p.id).filter(id => id !== currentAdminId))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id))
    }
  }

  // Bulk Status updates — toggle is_suspended on selected profiles
  const handleBulkStatusChange = async (suspend: boolean, reason?: string) => {
    if (selectedIds.length === 0) return

    startTransition(async () => {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ is_suspended: suspend })
          .in('id', selectedIds)

        if (error) throw error

        // Write audit log entries
        if (currentAdminId) {
          for (const targetId of selectedIds) {
            await supabase.from('admin_audit_logs').insert({
              admin_id: currentAdminId,
              action_type: suspend ? 'account_suspended' : 'account_activated',
              target_user_id: targetId,
              reason: reason || (suspend ? 'Suspended by admin' : 'Account reactivated by admin')
            })
          }
        }

        toast.success(`Successfully ${suspend ? 'suspended' : 'activated'} ${selectedIds.length} account(s).`)
        setSelectedIds([])
        setShowBanModal(false)
        setBanReason('')
        fetchProfiles()
      } catch (err: any) {
        toast.error('Bulk update failed: ' + err.message)
      }
    })
  }

  return (
    <main className="flex-1 bg-[#FBFBF9] overflow-y-auto min-h-screen pb-24">
      <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8 space-y-6">
        
        {/* Header Block */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0B1D2E]">Seller Accounts Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Audit profile status, restrict accounts, or manage security parameters.</p>
        </div>

        {currentAdminRole === 'staff' && (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/50 flex gap-3 text-amber-800 text-xs shadow-xs animate-in fade-in duration-200">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-bold text-sm">Read-Only Staff Account</span>
              <p className="text-xs text-slate-500 mt-1">
                Your account is logged in as staff. You can view registered profiles, joined dates, and restriction logs, but modification of account status (restrict, ban, activate) is restricted strictly to Administrator roles.
              </p>
            </div>
          </div>
        )}

        {/* Tab Filters */}
        {/* Tab Filters */}
        <div className="border-b border-slate-200/60 flex gap-4 scrollbar-none">
          {(['all', 'online', 'offline', 'suspended'] as const).map(tab => (
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
              {tab === 'all' ? 'All Accounts' : tab === 'online' ? 'Online' : tab === 'offline' ? 'Offline' : 'Suspended'}
            </button>
          ))}
        </div>

        {/* Grid Card */}
        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
          
          {/* Search Row */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-450" />
              <input
                type="text"
                placeholder="Search by full name or email address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm transition-all"
              />
            </div>
            <div className="ml-auto text-xs text-slate-450">
              Total {filteredProfiles.length} profiles listed
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-left">
                  <th className="py-4 px-6 text-center w-12">
                    <input
                      type="checkbox"
                      disabled={currentAdminRole === 'staff'}
                      checked={filteredProfiles.length > 0 && selectedIds.length === filteredProfiles.filter(p => p.id !== currentAdminId).length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-[#14452F] focus:ring-[#14452F] h-4 w-4 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider">Seller Profile</th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider">Joined Date</th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider">Account Role</th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider text-center">Status</th>
                  <th className="py-4 px-6 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider">Ban Reason / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-slate-400">
                      <Loader2 className="h-6 w-6 animate-spin text-[#C5A059] mx-auto mb-2" />
                      Loading accounts directory...
                    </td>
                  </tr>
                ) : filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-slate-450">
                      No accounts listed matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map(p => {
                    const isSelected = selectedIds.includes(p.id)
                    const isSelf = p.id === currentAdminId

                    return (
                      <tr 
                        key={p.id} 
                        className={cn(
                          'group hover:bg-[#FBFBF9]/80 transition-all cursor-pointer duration-100',
                          isSelected ? 'bg-amber-50/20' : '',
                          currentAdminRole === 'staff' ? 'cursor-default hover:bg-white' : ''
                        )}
                        onClick={() => !isSelf && currentAdminRole !== 'staff' && handleSelectRow(p.id, !isSelected)}
                      >
                        <td className="py-4 px-6 text-center w-12" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            disabled={isSelf || currentAdminRole === 'staff'}
                            checked={isSelected}
                            onChange={e => handleSelectRow(p.id, e.target.checked)}
                            className="rounded border-slate-300 text-[#14452F] focus:ring-[#14452F] h-4 w-4 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          />
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <p className="font-bold text-[#0B1D2E]">{p.full_name || 'Not provided'}</p>
                          <p className="text-xs text-slate-405">{p.email} {isSelf && <span className="text-[10px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded font-bold uppercase">(You)</span>}</p>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-500 font-medium">
                          {new Date(p.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-4 text-xs font-bold text-amber-600 capitalize">
                          {p.role}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {p.is_suspended ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border bg-red-50 text-red-700 border-red-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              Suspended
                            </span>
                          ) : onlineUserIds.has(p.id) ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Online
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border bg-slate-50 text-slate-600 border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Offline
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 italic max-w-xs truncate">
                          {p.is_suspended ? 'Account suspended by admin' : '-'}
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

      {/* Floating Bulk Actions Sticky Footer Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0B1D2E] text-white border border-[#C5A059]/30 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="text-sm font-semibold border-r border-slate-700/60 pr-4">
            <span className="text-[#C5A059] font-black">{selectedIds.length}</span> selected
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange(false)}
              disabled={isPending}
              className="flex items-center gap-1.5 bg-[#14452F] hover:bg-[#14452F]/90 text-white text-xs font-bold uppercase tracking-wider px-4.5 py-2.5 rounded-xl border border-[#14452F]/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
              Activate
            </button>

            <button
              onClick={() => {
                setBanType('restricted')
                setShowBanModal(true)
              }}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider px-4.5 py-2.5 rounded-xl border border-amber-600/30 transition-all cursor-pointer"
            >
              <AlertTriangle className="h-3.5 w-3.5" /> Suspend
            </button>

            <button
              onClick={() => {
                setBanType('banned')
                setShowBanModal(true)
              }}
              className="flex items-center gap-1.5 bg-red-650 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-4.5 py-2.5 rounded-xl border border-red-650/30 transition-all cursor-pointer"
            >
              <Ban className="h-3.5 w-3.5" /> Ban Accounts
            </button>
          </div>

          <button
            onClick={() => setSelectedIds([])}
            className="p-1 rounded hover:bg-white/5 text-slate-450 hover:text-white transition-all cursor-pointer"
            title="Deselect all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Ban / Restriction Modal Dialog */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden relative animate-in zoom-in-95 duration-150">
            <div className={cn('h-1', banType === 'restricted' ? 'bg-amber-500' : 'bg-red-500')} />
            
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0B1D2E]">
                  {banType === 'restricted' ? 'Restrict Accounts' : 'Ban Seller Accounts'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  This will change the status of {selectedIds.length} profiles to {banType}. They will be notified of the restriction.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Reason for restriction / ban</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain why this action is taken (e.g. spamming fake listings, payment disputes)..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="w-full p-3.5 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowBanModal(false)
                    setBanReason('')
                  }}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-slate-650 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPending || !banReason.trim()}
                  onClick={() => handleBulkStatusChange(true, banReason)}
                  className={cn(
                    'flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50',
                    banType === 'restricted' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-650 hover:bg-red-750'
                  )}
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Confirm Actions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
