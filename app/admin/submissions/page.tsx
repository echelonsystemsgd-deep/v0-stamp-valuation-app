'use client'

import React, { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  Search, 
  FileText, 
  Download, 
  Printer, 
  Check, 
  X, 
  Loader2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  DollarSign,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Profile {
  full_name: string | null
  email: string
}

interface Submission {
  id: string
  created_at: string
  collection_type: string
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
  guest_name: string | null
  guest_email: string | null
  user_id: string | null
  profiles: Profile | null
}

const statusConfig: Record<Submission['status'], { label: string; className: string }> = {
  quote_requested: { label: 'Quote Requested', className: 'bg-amber-50 text-amber-700 border-amber-250/20' },
  quote_given: { label: 'Quote Given', className: 'bg-yellow-50 text-yellow-800 border-yellow-250/20' },
  awaiting_shipment: { label: 'Awaiting Shipment', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_transit: { label: 'In Transit', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  received: { label: 'Received', className: 'bg-indigo-50 text-indigo-750 border-indigo-200' },
  under_review: { label: 'Under Review', className: 'bg-amber-50 text-[#C5A059] border-[#C5A059]/25' },
  approved: { label: 'Approved', className: 'bg-emerald-50 text-[#14452F] border-[#14452F]/25' },
  paid: { label: 'Paid & Disbursed', className: 'bg-emerald-100 text-emerald-800 border-emerald-350/20' },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-200' },
  cancelled: { label: 'Cancelled', className: 'bg-slate-100 text-slate-650 border-slate-200' },
}

// 7 Tabs: All, Requests, Awaiting Shipment, Appraising, Approved, Paid, Closed
type TabType = 'all' | 'requests' | 'awaiting_shipment' | 'appraising' | 'approved' | 'paid' | 'closed'

const tabConfig: Record<TabType, { label: string; statuses: Submission['status'][] }> = {
  all: { label: 'All Submissions', statuses: [] },
  requests: { label: 'Requests', statuses: ['quote_requested', 'quote_given'] },
  awaiting_shipment: { label: 'Awaiting Shipment', statuses: ['awaiting_shipment', 'in_transit'] },
  appraising: { label: 'Appraising', statuses: ['received', 'under_review'] },
  approved: { label: 'Approved', statuses: ['approved'] },
  paid: { label: 'Paid', statuses: ['paid'] },
  closed: { label: 'Closed', statuses: ['rejected', 'cancelled'] }
}

export default function SubmissionsPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Bulk Payment Modal State
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [payoutMethod, setPayoutMethod] = useState<'bank_transfer' | 'cheque'>('bank_transfer')
  const [payoutReference, setPayoutReference] = useState('')

  // Bulk Assign Modal State
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [staffMembers, setStaffMembers] = useState<{id: string; full_name: string | null; email: string; role: string}[]>([])
  const [selectedStaffId, setSelectedStaffId] = useState<string>('')
  const [staffLoading, setStaffLoading] = useState(false)

  const supabase = createClient()

  // Fetch submissions from Database
  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*, profiles!user_id(full_name, email)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (err: any) {
      toast.error('Failed to load submissions queue: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    
    const fetchWithGuard = async () => {
      if (!isMounted) return
      await fetchSubmissions()
    }
    
    fetchWithGuard()

    // Realtime changes listener
    const instanceId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const channel = supabase
      .channel(`admin-submissions-queue-${instanceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        () => {
          if (isMounted) {
            fetchSubmissions()
          }
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  // Filter Submissions based on Search and Tab
  const filteredSubmissions = submissions.filter(sub => {
    // 1. Search filter
    const ref = `VAL-${sub.id.slice(0, 8)}`.toLowerCase()
    const name = (sub.profiles?.full_name || sub.guest_name || '').toLowerCase()
    const email = (sub.profiles?.email || sub.guest_email || '').toLowerCase()
    const tracking = (sub.tracking_reference || '').toLowerCase()
    const matchesSearch = 
      ref.includes(search.toLowerCase()) ||
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      tracking.includes(search.toLowerCase())

    if (!matchesSearch) return false

    // 2. Tab filter
    if (activeTab === 'all') return true
    return tabConfig[activeTab].statuses.includes(sub.status)
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage)
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
    setSelectedIds([])
  }, [activeTab, search])

  // Count helper for tabs
  const getTabCount = (tab: TabType) => {
    if (tab === 'all') return submissions.length
    return submissions.filter(sub => tabConfig[tab].statuses.includes(sub.status)).length
  }

  // Checkbox interactions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedSubmissions.map(s => s.id))
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

  // Open assign modal and load staff list
  const handleOpenAssignModal = async () => {
    setShowAssignModal(true)
    setStaffLoading(true)
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('role', ['admin', 'staff'])
        .order('role', { ascending: false })
      setStaffMembers(data || [])
    } finally {
      setStaffLoading(false)
    }
  }

  // Bulk assign selected submissions to a staff member
  const handleBulkAssign = async () => {
    if (!selectedStaffId) {
      toast.error('Please select a staff member to assign.')
      return
    }
    startTransition(async () => {
      try {
        const { error } = await supabase
          .from('submissions')
          .update({ assigned_appraiser_id: selectedStaffId })
          .in('id', selectedIds)
        if (error) throw error
        const member = staffMembers.find(m => m.id === selectedStaffId)
        toast.success(`${selectedIds.length} submission${selectedIds.length > 1 ? 's' : ''} assigned to ${member?.full_name || member?.email || 'Staff'}.`)
        setShowAssignModal(false)
        setSelectedIds([])
        setSelectedStaffId('')
        fetchSubmissions()
      } catch (err: any) {
        toast.error('Assignment failed: ' + err.message)
      }
    })
  }

  // Bulk Actions
  const handleBulkMarkReceived = async () => {
    if (selectedIds.length === 0) return
    startTransition(async () => {
      try {
        const { error } = await supabase
          .from('submissions')
          .update({ status: 'received' })
          .in('id', selectedIds)

        if (error) throw error
        toast.success(`Successfully marked ${selectedIds.length} submissions as Received.`)
        setSelectedIds([])
        fetchSubmissions()
      } catch (err: any) {
        toast.error('Bulk update failed: ' + err.message)
      }
    })
  }

  const handleBulkMarkPaid = async () => {
    if (selectedIds.length === 0 || !payoutReference.trim()) {
      toast.error('Please enter a payout transaction reference.')
      return
    }

    startTransition(async () => {
      try {
        const { data: authData } = await supabase.auth.getUser()
        const adminId = authData.user?.id
        if (!adminId) throw new Error('No active admin session found.')

        // Loop through each selected submission to perform update and create payouts
        for (const subId of selectedIds) {
          const sub = submissions.find(s => s.id === subId)
          if (!sub) continue

          const amount = sub.final_reviewed_valuation ?? sub.estimated_valuation
          const recipientName = sub.profiles?.full_name || sub.guest_name || 'Seller'

          // 1. Log payout record
          const { error: payoutErr } = await supabase
            .from('payouts')
            .upsert({
              submission_id: subId,
              method: payoutMethod,
              amount: amount,
              reference_number: payoutReference,
              issued_by: adminId,
              recipient_name: recipientName
            }, { onConflict: 'submission_id' })

          if (payoutErr) throw payoutErr

          // 2. Transition status of submission to 'paid'
          const { error: subErr } = await supabase
            .from('submissions')
            .update({ status: 'paid' })
            .eq('id', subId)

          if (subErr) throw subErr
        }

        toast.success(`Successfully logged payouts and marked ${selectedIds.length} submissions as Paid.`)
        setShowPayoutModal(false)
        setPayoutReference('')
        setSelectedIds([])
        fetchSubmissions()
      } catch (err: any) {
        toast.error('Bulk payout logging failed: ' + err.message)
      }
    })
  }

  // CSV Export Utility
  const handleExportCSV = (idsToExport?: string[]) => {
    const targets = idsToExport 
      ? submissions.filter(s => idsToExport.includes(s.id))
      : filteredSubmissions

    if (targets.length === 0) {
      toast.error('No records available to export.')
      return
    }

    // Define CSV Headers
    const headers = [
      'Submission ID',
      'Date Created',
      'Seller Name',
      'Seller Email',
      'Collection Type',
      'Estimated Valuation (£)',
      'Final Audited Valuation (£)',
      'Status',
      'Tracking Reference'
    ]

    const rows = targets.map(sub => [
      `VAL-${sub.id.slice(0, 8).toUpperCase()}`,
      new Date(sub.created_at).toLocaleDateString('en-GB'),
      sub.profiles?.full_name || sub.guest_name || 'Not provided',
      sub.profiles?.email || sub.guest_email || '',
      sub.collection_type,
      sub.estimated_valuation.toFixed(2),
      sub.final_reviewed_valuation !== null ? sub.final_reviewed_valuation.toFixed(2) : '',
      sub.status,
      sub.tracking_reference || ''
    ])

    const csvContent = 
      'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `submissions_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Exported ${targets.length} submissions.`)
  }

  const formatGBP = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val)
  }

  return (
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto min-h-screen">
      {/* Overview Container */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#0B1D2E]">Submissions Queue</h1>
            <p className="text-sm text-slate-500 mt-1">Manage and audit incoming stamp collection appraisals.</p>
          </div>
          
          <button
            onClick={() => handleExportCSV()}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Download className="h-4 w-4 text-slate-500" /> Export List
          </button>
        </div>

        {/* Shopify-Style Tabs Navigation */}
        <div className="border-b border-slate-200/60 overflow-x-auto flex gap-1 scrollbar-none">
          {(Object.keys(tabConfig) as TabType[]).map(tab => {
            const count = getTabCount(tab)
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2',
                  isActive 
                    ? 'border-[#C5A059] text-[#0B1D2E]' 
                    : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300'
                )}
              >
                {tabConfig[tab].label}
                <span className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full border',
                  isActive 
                    ? 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20' 
                    : 'bg-slate-50 text-slate-450 border-slate-100'
                )}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search & Grid Card */}
        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
          
          {/* Search Row */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-450" />
              <input
                type="text"
                placeholder="Search VAL ID, seller email, name, or tracking reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm transition-all"
              />
            </div>
            <div className="ml-auto text-xs text-slate-450 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Showing {filteredSubmissions.length} results
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-left">
                  <th className="py-4 px-6 text-center w-12">
                    <input
                      type="checkbox"
                      checked={paginatedSubmissions.length > 0 && selectedIds.length === paginatedSubmissions.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-[#14452F] focus:ring-[#14452F] h-4 w-4 cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider">Valuation ID</th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider">Date</th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider">Seller</th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider">Collection</th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider text-right">Est. Value</th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider text-right">Audited Value</th>
                  <th className="py-4 px-4 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider text-center">Status</th>
                  <th className="py-4 px-6 font-serif text-[#0B1D2E] font-bold text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-sm text-slate-400">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-[#C5A059]" />
                        Loading submissions...
                      </div>
                    </td>
                  </tr>
                ) : paginatedSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-sm text-slate-450">
                      No submissions found matching filters.
                    </td>
                  </tr>
                ) : (
                  paginatedSubmissions.map(sub => {
                    const status = statusConfig[sub.status] || { label: sub.status, className: 'bg-slate-50 text-slate-700 border-slate-200' }
                    const isSelected = selectedIds.includes(sub.id)
                    const sellerName = sub.profiles?.full_name || sub.guest_name || 'Not provided'
                    const sellerEmail = sub.profiles?.email || sub.guest_email || ''

                    return (
                      <tr 
                        key={sub.id}
                        className={cn(
                          'group hover:bg-[#FBFBF9]/80 transition-all cursor-pointer duration-100',
                          isSelected ? 'bg-amber-50/20' : ''
                        )}
                        onClick={() => router.push(`/admin/submissions/${sub.id}`)}
                      >
                        <td className="py-4 px-6 text-center w-12" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={e => handleSelectRow(sub.id, e.target.checked)}
                            className="rounded border-slate-300 text-[#14452F] focus:ring-[#14452F] h-4 w-4 cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-4 text-sm font-bold font-mono text-[#0B1D2E] group-hover:text-[#14452F]">
                          VAL-{sub.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-left">
                          <p className="text-xs font-semibold text-slate-700">
                            {new Date(sub.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                          {['quote_requested', 'received', 'under_review'].includes(sub.status) ? (
                            (() => {
                              const ageHours = (Date.now() - new Date(sub.created_at).getTime()) / (1000 * 60 * 60)
                              let text = ''
                              let colorClass = ''
                              
                              if (ageHours < 24) {
                                text = ageHours < 1 ? 'Just now' : `${Math.round(ageHours)}h ago`
                                colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              } else if (ageHours < 72) {
                                const days = Math.floor(ageHours / 24)
                                text = `${days}d ago`
                                colorClass = 'bg-amber-50 text-[#C5A059] border-[#C5A059]/20 font-bold'
                              } else {
                                const days = Math.floor(ageHours / 24)
                                text = `${days}d overdue`
                                colorClass = 'bg-red-50 text-red-600 border-red-100 font-extrabold animate-pulse'
                              }

                              return (
                                <span className={cn("inline-flex items-center gap-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border mt-1 select-none", colorClass)}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                  {text}
                                </span>
                              )
                            })()
                          ) : (
                            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-1 block">Completed</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm max-w-[200px] truncate">
                          <p className="font-semibold text-slate-750">{sellerName}</p>
                          <p className="text-xs text-slate-450 truncate">{sellerEmail}</p>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-600 capitalize">
                          {sub.collection_type.replace('_', ' ')}
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-slate-500 text-right font-mono">
                          {formatGBP(sub.estimated_valuation)}
                        </td>
                        <td className="py-4 px-4 text-sm font-black text-[#0B1D2E] text-right font-mono">
                          {sub.final_reviewed_valuation !== null 
                            ? formatGBP(sub.final_reviewed_valuation)
                            : '-'
                          }
                        </td>
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize',
                            status.className
                          )}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <Link
                            href={`/admin/submissions/${sub.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-350 bg-white text-xs font-bold text-[#0B1D2E] rounded-lg transition-all"
                          >
                            Appraise <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-450">
                Page {currentPage} of {totalPages} (Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredSubmissions.length)} of {filteredSubmissions.length})
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-650" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4 text-slate-650" />
                </button>
              </div>
            </div>
          )}
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
              onClick={handleBulkMarkReceived}
              disabled={isPending}
              className="flex items-center gap-1.5 bg-[#14452F] hover:bg-[#14452F]/90 text-white text-xs font-bold uppercase tracking-wider px-4.5 py-2.5 rounded-xl border border-[#14452F]/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Mark Received
            </button>

            <button
              onClick={handleOpenAssignModal}
              disabled={isPending}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider px-4.5 py-2.5 rounded-xl border border-indigo-500/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Users className="h-3.5 w-3.5" /> Assign to Staff
            </button>

            <button
              onClick={() => setShowPayoutModal(true)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider px-4.5 py-2.5 rounded-xl border border-white/10 transition-all cursor-pointer"
            >
              <DollarSign className="h-3.5 w-3.5 text-[#C5A059]" /> Log Payouts
            </button>

            <button
              onClick={() => handleExportCSV(selectedIds)}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider px-4.5 py-2.5 rounded-xl border border-white/5 transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" /> Export CSV
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

      {/* Bulk Payout Logger Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden relative animate-in zoom-in-95 duration-150">
            {/* Top Border Accent */}
            <div className="h-1 bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
            
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0B1D2E]">Log Bulk Payments</h3>
                <p className="text-xs text-slate-500 mt-1">This will mark all {selectedIds.length} selected items as Paid and save payout details.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('bank_transfer')}
                      className={cn(
                        'py-3 border text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center',
                        payoutMethod === 'bank_transfer'
                          ? 'border-[#14452F] bg-[#14452F]/5 text-[#14452F]'
                          : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                      )}
                    >
                      Bank Transfer
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('cheque')}
                      className={cn(
                        'py-3 border text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center',
                        payoutMethod === 'cheque'
                          ? 'border-[#14452F] bg-[#14452F]/5 text-[#14452F]'
                          : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                      )}
                    >
                      Cheque
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Transaction Reference / Cheque #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TXN9876543210 or CHQ-1001"
                    value={payoutReference}
                    onChange={(e) => setPayoutReference(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPayoutModal(false)
                    setPayoutReference('')
                  }}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPending || !payoutReference.trim()}
                  onClick={handleBulkMarkPaid}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#14452F] hover:bg-[#14452F]/90 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Bulk Assign to Staff Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden relative animate-in zoom-in-95 duration-150">
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-[#14452F]" />
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0B1D2E]">Assign to Staff Appraiser</h3>
                  <p className="text-xs text-slate-500 mt-1">Select who to assign the {selectedIds.length} selected submission{selectedIds.length > 1 ? 's' : ''} to.</p>
                </div>
                <button onClick={() => { setShowAssignModal(false); setSelectedStaffId('') }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-all cursor-pointer text-slate-450">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {staffLoading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-slate-400 text-xs">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading staff members...
                </div>
              ) : staffMembers.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">No admin or staff members found.</div>
              ) : (
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {staffMembers.map(member => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedStaffId(member.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer',
                        selectedStaffId === member.id
                          ? 'border-[#14452F] bg-[#14452F]/5'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
                      )}
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#14452F]/10 flex items-center justify-center text-[#14452F] font-bold text-sm shrink-0">
                        {(member.full_name || member.email || '?')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#0B1D2E] truncate">{member.full_name || 'Unnamed'}</p>
                        <p className="text-[10px] text-slate-400 truncate">{member.email}</p>
                      </div>
                      <span className={cn(
                        'text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shrink-0',
                        member.role === 'admin'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      )}>
                        {member.role}
                      </span>
                      {selectedStaffId === member.id && (
                        <Check className="h-4 w-4 text-[#14452F] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAssignModal(false); setSelectedStaffId('') }}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPending || !selectedStaffId}
                  onClick={handleBulkAssign}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#14452F] hover:bg-[#14452F]/90 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
