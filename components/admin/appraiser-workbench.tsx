'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Briefcase, 
  Inbox, 
  Coins, 
  ArrowRight, 
  ClipboardCheck, 
  Clock, 
  Loader2,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Submission {
  id: string
  collection_type: string
  approx_quantity: string
  estimated_era: string
  estimated_valuation: number
  status: string
  created_at: string
  assigned_appraiser_id: string | null
}

interface AppraiserWorkbenchProps {
  initialAssigned: Submission[]
  initialUnassigned: Submission[]
  currentUserId: string
  profileName: string
}

export function AppraiserWorkbench({
  initialAssigned,
  initialUnassigned,
  currentUserId,
  profileName
}: AppraiserWorkbenchProps) {
  const [assigned, setAssigned] = useState<Submission[]>(initialAssigned)
  const [unassigned, setUnassigned] = useState<Submission[]>(initialUnassigned)
  const [isPending, startTransition] = useTransition()
  const [showAssignedModal, setShowAssignedModal] = useState(false)
  const [showUnassignedModal, setShowUnassignedModal] = useState(false)
  
  const supabase = createClient()

  const handleClaim = async (subId: string) => {
    startTransition(async () => {
      try {
        const { error } = await supabase
          .from('submissions')
          .update({
            assigned_appraiser_id: currentUserId,
            status: 'under_review' // Auto-start audit on claim
          })
          .eq('id', subId)

        if (error) throw error

        toast.success('Appraisal claimed successfully!')
        
        // Find claimed item and move it to assigned list
        const claimedItem = unassigned.find(s => s.id === subId)
        if (claimedItem) {
          const updatedItem = { ...claimedItem, assigned_appraiser_id: currentUserId, status: 'under_review' }
          setUnassigned(prev => prev.filter(s => s.id !== subId))
          setAssigned(prev => [updatedItem, ...prev])
        }
      } catch (err: any) {
        toast.error('Failed to claim submission: ' + err.message)
      }
    })
  }

  const formatGBP = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return <span className="bg-indigo-50 text-indigo-750 border border-indigo-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Received</span>
      case 'under_review':
        return <span className="bg-amber-50 text-[#C5A059] border border-[#C5A059]/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase animate-pulse">Under Audit</span>
      default:
        return <span className="bg-slate-50 text-slate-650 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">{status.replace('_', ' ')}</span>
    }
  }

  let displayName = profileName
  if (profileName.includes('@')) {
    const part = profileName.split('@')[0]
    displayName = part.length > 12 ? 'Appraiser' : part
  } else {
    displayName = profileName.split(' ')[0]
  }
  const formattedGreetingName = displayName.charAt(0).toUpperCase() + displayName.slice(1)

  return (
    <div className="space-y-8">
      
      {/* Appraiser welcome banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 sm:p-6 md:p-8 bg-white text-[#0B1D2E] rounded-3xl border border-slate-150 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] block">
            Sorting Desk & Appraisal Station
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#0B1D2E]">
            Welcome, {formattedGreetingName}!
          </h1>
          <p className="text-sm text-slate-500 max-w-lg">
            This is your dedicated sorting desk. Scan arrivals, claim unassigned stamp parcels, and audit collection counts.
          </p>
        </div>
      </div>

      {/* Appraiser metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setShowAssignedModal(true)}
          className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:border-[#C5A059]/40 hover:shadow-md cursor-pointer transition-all duration-200"
          title="Click to view detailed assigned items"
        >
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">My Assigned Desk</span>
            <p className="text-2xl font-black text-[#0B1D2E] mt-0.5">{assigned.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#14452F]/10 flex items-center justify-center text-[#14452F]">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        <div 
          onClick={() => setShowUnassignedModal(true)}
          className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:border-[#C5A059]/40 hover:shadow-md cursor-pointer transition-all duration-200"
          title="Click to view detailed unassigned items"
        >
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unassigned Arrivals</span>
            <p className="text-2xl font-black text-[#0B1D2E] mt-0.5">{unassigned.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Inbox className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace Role</span>
            <p className="text-md font-bold text-slate-700 mt-1 uppercase tracking-wider">Staff Appraiser</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <ClipboardCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Queues grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: My Workstation (cols-span-2) */}
        <div id="my-active-workstation-queue" className="lg:col-span-2 bg-white rounded-3xl border border-slate-150 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0B1D2E]">My Active Workstation Queue</h2>
            <p className="text-xs text-slate-500 mt-1">Parcels currently checked out to your sorted desk. Complete audit worksheets here.</p>
          </div>

          <div className="overflow-x-auto -mx-6 sm:-mx-8">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-450 uppercase">
                  <th className="py-3 px-6">Valuation ID</th>
                  <th className="py-3 px-4">Collection Type</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Est. Value</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {assigned.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                      Your workstation queue is empty. Claim arriving parcels on the right to start appraising!
                    </td>
                  </tr>
                ) : (
                  assigned.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-all">
                      <td className="py-3.5 px-6 font-bold font-mono text-[#0B1D2E] text-xs">VAL-{sub.id.substring(0, 8).toUpperCase()}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-650 capitalize text-xs">{sub.collection_type.replace('_', ' ')}</td>
                      <td className="py-3.5 px-4 text-center">{getStatusBadge(sub.status)}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700 text-right text-xs">{formatGBP(sub.estimated_valuation)}</td>
                      <td className="py-3.5 px-6 text-right">
                        <Link
                          href={`/admin/submissions/${sub.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#14452F] hover:underline cursor-pointer"
                        >
                          Open Desk <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Unassigned Arrival Pool (cols-span-1) */}
        <div id="unassigned-arrivals-list" className="bg-white rounded-3xl border border-slate-150 shadow-sm p-6 sm:p-8 space-y-6 flex flex-col h-full">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#0B1D2E]">Unassigned Arrivals</h2>
            <p className="text-xs text-slate-500 mt-1">Parcels received at building sorting deck, awaiting appraisers.</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin max-h-[480px]">
            {unassigned.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs leading-normal">
                No new unassigned arrivals logged. All packages have been checked out.
              </div>
            ) : (
              unassigned.map((sub) => (
                <div key={sub.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black font-mono text-[#0B1D2E] uppercase">VAL-{sub.id.substring(0, 8).toUpperCase()}</h4>
                      <p className="text-[11px] font-bold text-slate-600 capitalize mt-0.5">{sub.collection_type.replace('_', ' ')}</p>
                    </div>
                    {getStatusBadge(sub.status)}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-250/20 pt-2">
                    <span>Est: {formatGBP(sub.estimated_valuation)}</span>
                    <button
                      onClick={() => handleClaim(sub.id)}
                      disabled={isPending}
                      className="px-4 py-2.5 sm:px-2.5 sm:py-1.5 bg-[#14452F] hover:bg-[#14452F]/90 text-white rounded-lg text-xs sm:text-[10px] font-bold uppercase transition-all shadow-sm flex items-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Claim'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Assigned Desk Details Modal */}
      {showAssignedModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-105 shadow-2xl max-w-2xl w-full overflow-hidden relative animate-in zoom-in-95 duration-150">
            <div className="h-1 bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#0B1D2E] flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#C5A059]" /> My Checked-Out Desk Queue ({assigned.length})
                </h3>
                <button 
                  onClick={() => setShowAssignedModal(false)} 
                  className="text-slate-450 hover:text-slate-750 p-1.5 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {assigned.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Your assigned desk is empty. Close this modal and claim unassigned arrivals to get started.
                  </div>
                ) : (
                  assigned.map(sub => (
                    <div key={sub.id} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200/60 rounded-2xl hover:bg-slate-100/60 transition-all gap-4">
                      <div>
                        <span className="text-xs font-bold font-mono text-[#0B1D2E] block">VAL-{sub.id.slice(0, 8).toUpperCase()}</span>
                        <span className="text-[11px] font-bold text-slate-500 block capitalize mt-0.5">{sub.collection_type.replace('_', ' ')} • Est: {formatGBP(sub.estimated_valuation)}</span>
                      </div>
                      <Link 
                        href={`/admin/submissions/${sub.id}`} 
                        onClick={() => setShowAssignedModal(false)}
                        className="px-4 py-2.5 bg-[#14452F] hover:bg-[#14452F]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md text-center"
                      >
                        Open Desk
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unassigned Arrivals Pool Details Modal */}
      {showUnassignedModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-105 shadow-2xl max-w-2xl w-full overflow-hidden relative animate-in zoom-in-95 duration-150">
            <div className="h-1 bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#0B1D2E] flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-[#C5A059]" /> Unassigned Arrived Parcels Pool ({unassigned.length})
                </h3>
                <button 
                  onClick={() => setShowUnassignedModal(false)} 
                  className="text-slate-450 hover:text-slate-750 p-1.5 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {unassigned.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    All arrived parcels have been checked out to active appraiser desks!
                  </div>
                ) : (
                  unassigned.map(sub => (
                    <div key={sub.id} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200/60 rounded-2xl hover:bg-slate-100/60 transition-all gap-4">
                      <div>
                        <span className="text-xs font-bold font-mono text-[#0B1D2E] block">VAL-{sub.id.slice(0, 8).toUpperCase()}</span>
                        <span className="text-[11px] font-bold text-slate-500 block capitalize mt-0.5">{sub.collection_type.replace('_', ' ')} • Est: {formatGBP(sub.estimated_valuation)}</span>
                      </div>
                      <button
                        onClick={async () => {
                          await handleClaim(sub.id)
                          setShowUnassignedModal(false)
                        }}
                        disabled={isPending}
                        className="px-4 py-2.5 bg-[#14452F] hover:bg-[#14452F]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                        Claim Appraisal
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
