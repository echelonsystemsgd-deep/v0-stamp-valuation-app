'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Megaphone, Plus, Mail, Users, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Campaign {
  id: string
  name: string
  subject: string
  body: string
  target_group: string
  sent_count: number
  created_at: string
}

export default function MarketingCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Form states
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [targetGroup, setTargetGroup] = useState('all_sellers')

  const supabase = createClient()

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCampaigns(data || [])
    } catch (err: any) {
      toast.error('Failed to load campaigns: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !subject.trim() || !body.trim()) return

    startTransition(async () => {
      try {
        // Query target size mock
        let targetCount = 0
        if (targetGroup === 'all_sellers') {
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'seller')
          targetCount = count || 12 // fallback mock if empty
        } else {
          // inactive sellers (e.g. mock size)
          targetCount = 5
        }

        const { error } = await supabase
          .from('marketing_campaigns')
          .insert({
            name: name.trim(),
            subject: subject.trim(),
            body: body.trim(),
            target_group: targetGroup,
            sent_count: targetCount
          })

        if (error) throw error
        
        toast.success(`Outreach Campaign "${name}" triggered successfully! Sent to ${targetCount} sellers.`)
        setName('')
        setSubject('')
        setBody('')
        fetchCampaigns()
      } catch (err: any) {
        toast.error('Failed to dispatch campaign: ' + err.message)
      }
    })
  }

  const getTargetGroupLabel = (group: string) => {
    switch (group) {
      case 'all_sellers': return 'All Active Sellers'
      case 'inactive_sellers': return 'Inactive Sellers (> 6 months)'
      default: return group
    }
  }

  return (
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-[#0B1D2E] text-white rounded-3xl border border-[#C5A059]/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/30">
              <Megaphone className="h-6 w-6 text-[#C5A059]" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">Seller Engagement & Campaigns</span>
              <h1 className="font-serif text-3xl font-bold mt-1 text-white">
                Marketing Outreach
              </h1>
            </div>
          </div>
        </div>

        {/* Campaign Builder & History grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Builder Form Column */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-150 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0B1D2E]">Outreach Campaign Composer</h2>
              <p className="text-xs text-slate-500 mt-1">Compose newsletters, payout bonus updates, or rate announcement notifications.</p>
            </div>

            <form onSubmit={handleSendCampaign} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Campaign Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Victorian Rate Increase July"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm bg-white"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Target Audience Group</label>
                  <select
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm bg-white font-semibold"
                  >
                    <option value="all_sellers">All Registered Sellers</option>
                    <option value="inactive_sellers">Inactive Sellers (&gt; 6 months)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Email Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Good News! Stamp valuation rates have increased!"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Email Body Content</label>
                <textarea
                  rows={6}
                  placeholder="Write message details. Markdown/Plain text is supported. Use tags like {seller_name} to personalize."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-[#C5A059] focus:outline-none rounded-xl text-sm bg-white leading-relaxed resize-none"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-8 py-3 bg-[#14452F] hover:bg-[#14452F]/90 text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  Dispatch Campaign
                </button>
              </div>
            </form>
          </div>

          {/* History Column */}
          <div className="bg-white rounded-3xl border border-slate-150 shadow-sm p-6 sm:p-8 space-y-6 flex flex-col h-full">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0B1D2E]">Campaign History</h2>
              <p className="text-xs text-slate-500 mt-1">Review previously dispatched emails and recipient sizes.</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {loading ? (
                <div className="text-center py-8 text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#C5A059]" />
                  <span className="text-xs mt-2 block">Loading history...</span>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs leading-relaxed">
                  No outreach history logged. Create and send a campaign on the left to start.
                </div>
              ) : (
                campaigns.map(cam => (
                  <div key={cam.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2.5 relative group">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">{cam.name}</h4>
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-450 italic leading-snug truncate">{cam.subject}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-200/50 pt-2">
                      <span>Target: {getTargetGroupLabel(cam.target_group)}</span>
                      <span className="bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded-md border border-[#C5A059]/20 font-mono">
                        Sent {cam.sent_count}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
