import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { 
  Users, 
  FileText, 
  LayoutGrid, 
  ShieldAlert, 
  Award, 
  Gift, 
  Megaphone, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Inbox
} from 'lucide-react'
import { RecentUsersTable } from '@/components/admin/recent-users-table'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  
  // Retrieve user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Retrieve user profile to confirm role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    redirect('/dashboard')
  }

  // Retrieve admin metrics
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .in('role', ['user', 'seller'])

  const { count: totalSubmissions } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })

  const { count: totalCategories } = await supabase
    .from('stamp_categories')
    .select('*', { count: 'exact', head: true })

  // Retrieve Shopify-style advanced module metrics
  const { count: activeBonuses } = await supabase
    .from('payout_bonus_codes')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: totalCampaigns } = await supabase
    .from('marketing_campaigns')
    .select('*', { count: 'exact', head: true })

  // Retrieve recent users list
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['user', 'seller'])
    .order('created_at', { ascending: false })
    .limit(5)

  // Get current hour for greeting
  const hour = new Date().getHours()
  let greeting = 'Good evening'
  if (hour < 12) greeting = 'Good morning'
  else if (hour < 17) greeting = 'Good afternoon'

  return (
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Shopify-Style Onboarding Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-white text-[#0B1D2E] rounded-3xl border border-slate-150 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
          
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] block">
              Control Panel Overview
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#0B1D2E]">
              {greeting}, {profile.full_name?.split(' ')[0] || 'Appraiser'}!
            </h1>
            <p className="text-sm text-slate-500 max-w-lg">
              Welcome back to your administration command deck. Your store processes are running smoothly. Let's get off to a great start today.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3 z-10 shrink-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold text-[#14452F] bg-[#14452F]/5 border border-[#14452F]/15 hover:bg-[#14452F]/10 rounded-xl transition-all"
            >
              Seller Dashboard <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Onboarding / Setup Walkthrough Checklist */}
        <div className="bg-white rounded-3xl border border-slate-150 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#0B1D2E] flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#C5A059]" /> Setup Guide Checklist
            </h2>
            <p className="text-xs text-slate-500 mt-1">Follow these simple steps to configure catalog values and run active outreach campaigns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/admin/categories" className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/60 border border-slate-200/60 transition-all flex flex-col justify-between group space-y-3">
              <div>
                <span className="text-[10px] font-black text-[#C5A569] uppercase font-mono block">Step 1</span>
                <h4 className="text-xs font-bold text-[#0B1D2E] mt-1 group-hover:text-[#14452F] transition-all">Configure Rates</h4>
                <p className="text-[11px] text-slate-450 mt-1 leading-normal">Update and adjust stamp catalog categories and buying margins.</p>
              </div>
              <span className="text-[10px] font-bold text-[#14452F] inline-flex items-center gap-1">Manage Rates <ArrowRight className="h-3 w-3" /></span>
            </Link>

            <Link href="/admin/sellers" className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/60 border border-slate-200/60 transition-all flex flex-col justify-between group space-y-3">
              <div>
                <span className="text-[10px] font-black text-[#C5A569] uppercase font-mono block">Step 2</span>
                <h4 className="text-xs font-bold text-[#0B1D2E] mt-1 group-hover:text-[#14452F] transition-all">Review Accounts</h4>
                <p className="text-[11px] text-slate-450 mt-1 leading-normal">Audit registered profiles, verify credentials, or restrict access.</p>
              </div>
              <span className="text-[10px] font-bold text-[#14452F] inline-flex items-center gap-1">Review Accounts <ArrowRight className="h-3 w-3" /></span>
            </Link>

            <Link href="/admin/bonuses" className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/60 border border-slate-200/60 transition-all flex flex-col justify-between group space-y-3">
              <div>
                <span className="text-[10px] font-black text-[#C5A569] uppercase font-mono block">Step 3</span>
                <h4 className="text-xs font-bold text-[#0B1D2E] mt-1 group-hover:text-[#14452F] transition-all">Payout Bonuses</h4>
                <p className="text-[11px] text-slate-450 mt-1 leading-normal">Create active promo codes to boost payouts and incentivize fast ship-ins.</p>
              </div>
              <span className="text-[10px] font-bold text-[#14452F] inline-flex items-center gap-1">Bonuses Panel <ArrowRight className="h-3 w-3" /></span>
            </Link>

            <Link href="/admin/marketing" className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/60 border border-slate-200/60 transition-all flex flex-col justify-between group space-y-3">
              <div>
                <span className="text-[10px] font-black text-[#C5A569] uppercase font-mono block">Step 4</span>
                <h4 className="text-xs font-bold text-[#0B1D2E] mt-1 group-hover:text-[#14452F] transition-all">Outreach Marketing</h4>
                <p className="text-[11px] text-slate-450 mt-1 leading-normal">Compose and dispatch campaign bulletins to re-engage sellers.</p>
              </div>
              <span className="text-[10px] font-bold text-[#14452F] inline-flex items-center gap-1">Outreach Console <ArrowRight className="h-3 w-3" /></span>
            </Link>
          </div>
        </div>

        {/* Quick Metrics Grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sellers</span>
              <p className="text-2xl font-black text-[#0B1D2E] mt-0.5">{totalUsers || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submissions</span>
              <p className="text-2xl font-black text-[#0B1D2E] mt-0.5">{totalSubmissions || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Catalog Items</span>
              <p className="text-2xl font-black text-[#0B1D2E] mt-0.5">{totalCategories || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50/50 flex items-center justify-center text-[#C5A059]">
              <LayoutGrid className="h-5 w-5" />
            </div>
          </div>

          {/* New Shopify Modules Metrics */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Bonuses</span>
              <p className="text-2xl font-black text-[#0B1D2E] mt-0.5">{activeBonuses || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Gift className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dispatched Emails</span>
              <p className="text-2xl font-black text-[#0B1D2E] mt-0.5">{totalCampaigns || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#14452F]/10 flex items-center justify-center text-[#14452F]">
              <Megaphone className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Detailed lists row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Users List */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-150 shadow-sm p-6 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-[#0B1D2E] mb-5">Recent Seller Registrations</h2>
            <RecentUsersTable initialUsers={recentUsers || []} />
          </div>

          {/* Quick Actions */}
          <div className="bg-[#0B1D2E] text-white rounded-3xl border border-[#C5A059]/20 shadow-xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-[-10%] top-[-20%] w-48 h-48 rounded-full bg-[#C5A059]/5 blur-[40px]" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
                <Award className="h-6 w-6 text-[#C5A059]" />
              </div>
              <h2 className="font-serif text-xl font-bold text-white mb-2">Access Credentials</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                You are currently accessing this workspace with full Administrative clearance. Remember to keep appraiser operations confidential.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Security Clearance:</span>
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Full Access
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
