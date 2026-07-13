import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { 
  Users, 
  FileText, 
  LayoutGrid, 
  Award, 
  Gift, 
  Megaphone, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  BarChart3,
  DollarSign,
  Activity
} from 'lucide-react'
import { RecentUsersTable } from '@/components/admin/recent-users-table'
import { AppraiserWorkbench } from '@/components/admin/appraiser-workbench'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    redirect('/dashboard')
  }

  // Staff view
  if (profile.role === 'staff') {
    const { data: unassignedData } = await supabase
      .from('submissions')
      .select('id, collection_type, approx_quantity, estimated_era, estimated_valuation, status, created_at, assigned_appraiser_id')
      .is('assigned_appraiser_id', null)
      .in('status', ['received', 'under_review'])
      .order('created_at', { ascending: false })

    const { data: assignedData } = await supabase
      .from('submissions')
      .select('id, collection_type, approx_quantity, estimated_era, estimated_valuation, status, created_at, assigned_appraiser_id')
      .eq('assigned_appraiser_id', user.id)
      .in('status', ['received', 'under_review'])
      .order('created_at', { ascending: false })

    return (
      <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <AppraiserWorkbench
            initialAssigned={assignedData as any || []}
            initialUnassigned={unassignedData as any || []}
            currentUserId={user.id}
            profileName={profile.full_name || user.email || 'Appraiser'}
          />
        </div>
      </main>
    )
  }

  // Admin metrics
  const { count: totalUsers } = await supabase
    .from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller')

  const { count: totalSubmissions } = await supabase
    .from('submissions').select('*', { count: 'exact', head: true })

  const { count: totalCategories } = await supabase
    .from('stamp_categories').select('*', { count: 'exact', head: true })

  const { count: activeBonuses } = await supabase
    .from('payout_bonus_codes').select('*', { count: 'exact', head: true }).eq('is_active', true)

  const { count: totalCampaigns } = await supabase
    .from('marketing_campaigns').select('*', { count: 'exact', head: true })

  const { data: recentUsers } = await supabase
    .from('profiles').select('*').eq('role', 'seller')
    .order('created_at', { ascending: false }).limit(5)

  // Analytics data
  const { data: allSubmissions } = await supabase
    .from('submissions')
    .select('status, estimated_valuation, final_reviewed_valuation, created_at, collection_type')
    .order('created_at', { ascending: false })

  const submissions_list = allSubmissions || []

  const statusBreakdown = {
    inPipeline: submissions_list.filter(s => ['received','under_review'].includes(s.status)).length,
    approved: submissions_list.filter(s => s.status === 'approved').length,
    paid: submissions_list.filter(s => s.status === 'paid').length,
    pending: submissions_list.filter(s => ['quote_requested','quote_given','awaiting_shipment','in_transit'].includes(s.status)).length,
  }

  const pipelineValue = submissions_list
    .filter(s => ['received','under_review','approved'].includes(s.status))
    .reduce((acc, s) => acc + (s.final_reviewed_valuation ?? s.estimated_valuation ?? 0), 0)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentSubmissionsCount = submissions_list.filter(s => new Date(s.created_at) >= sevenDaysAgo).length

  const collectionTypeCounts: Record<string, number> = {}
  submissions_list.forEach(s => {
    if (s.collection_type) {
      collectionTypeCounts[s.collection_type] = (collectionTypeCounts[s.collection_type] || 0) + 1
    }
  })
  const topCollectionType = Object.entries(collectionTypeCounts).sort((a, b) => b[1] - a[1])[0]

  const { data: staffMembers } = await supabase
    .from('profiles').select('id, full_name, email, role')
    .in('role', ['admin', 'staff']).order('role', { ascending: false })

  const { count: assignedCount } = await supabase
    .from('submissions').select('*', { count: 'exact', head: true })
    .not('assigned_appraiser_id', 'is', null)
    .in('status', ['received', 'under_review'])

  const hour = new Date().getHours()
  let greeting = 'Good evening'
  if (hour < 12) greeting = 'Good morning'
  else if (hour < 17) greeting = 'Good afternoon'

  return (
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* 1. Welcome Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 sm:p-6 md:p-8 bg-white text-[#0B1D2E] rounded-3xl border border-slate-150 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] block">Control Panel Overview</span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#0B1D2E]">
              {greeting}, {profile.full_name?.split(' ')[0] || 'Appraiser'}!
            </h1>
            <p className="text-sm text-slate-500 max-w-lg">
              Welcome back to your administration command deck. Your store processes are running smoothly.
            </p>
          </div>

        </div>

        {/* 2. Operations Snapshot */}
        <div className="bg-white rounded-3xl border border-slate-150 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0B1D2E] flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#C5A059]" /> Operations Snapshot
              </h2>
              <p className="text-xs text-slate-500 mt-1">Live pipeline health and submission activity overview.</p>
            </div>
            <Link href="/admin/reports" className="flex items-center gap-1 text-xs font-bold text-[#14452F] hover:underline">
              Full Reports <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-amber-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Pipeline Value</span>
              </div>
              <p className="text-xl font-black text-[#0B1D2E]">
                £{pipelineValue.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Active + approved</p>
            </div>

            <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Under Review</span>
              </div>
              <p className="text-xl font-black text-[#0B1D2E]">{statusBreakdown.inPipeline}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Awaiting appraisal</p>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Last 7 Days</span>
              </div>
              <p className="text-xl font-black text-[#0B1D2E]">{recentSubmissionsCount}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">New submissions</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <LayoutGrid className="h-4 w-4 text-slate-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Top Type</span>
              </div>
              <p className="text-sm font-black text-[#0B1D2E] capitalize leading-tight">
                {topCollectionType ? topCollectionType[0].replace(/_/g, ' ') : '—'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {topCollectionType ? `${topCollectionType[1]} submission${topCollectionType[1] !== 1 ? 's' : ''}` : 'No data yet'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>Submission Pipeline Breakdown</span>
              <span>{submissions_list.length} total</span>
            </div>
            {(() => {
              const total = submissions_list.length || 1
              const segments = [
                { label: 'Pending', count: statusBreakdown.pending, color: 'bg-blue-400' },
                { label: 'Appraising', count: statusBreakdown.inPipeline, color: 'bg-amber-400' },
                { label: 'Approved', count: statusBreakdown.approved, color: 'bg-emerald-400' },
                { label: 'Paid', count: statusBreakdown.paid, color: 'bg-[#14452F]' },
              ]
              return (
                <div className="space-y-2">
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex gap-px">
                    {segments.map(seg => (
                      <div key={seg.label} className={`${seg.color} transition-all duration-700`} style={{ width: `${(seg.count / total) * 100}%` }} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {segments.map(seg => (
                      <div key={seg.label} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                        <span className={`w-2 h-2 rounded-full ${seg.color}`} />
                        <span className="font-bold">{seg.label}</span>
                        <span className="text-slate-400">{seg.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        {/* 3. Quick Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <Link href="/admin/sellers" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:border-[#C5A059]/40 hover:shadow-md transition-all cursor-pointer">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sellers</span>
              <p className="text-2xl font-black text-[#0B1D2E] mt-0.5">{totalUsers || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
          </Link>

          <Link href="/admin/submissions" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:border-[#C5A059]/40 hover:shadow-md transition-all cursor-pointer">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submissions</span>
              <p className="text-2xl font-black text-[#0B1D2E] mt-0.5">{totalSubmissions || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
          </Link>

          <Link href="/admin/categories" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:border-[#C5A059]/40 hover:shadow-md transition-all cursor-pointer">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Catalog Items</span>
              <p className="text-2xl font-black text-[#0B1D2E] mt-0.5">{totalCategories || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50/50 flex items-center justify-center text-[#C5A059]">
              <LayoutGrid className="h-5 w-5" />
            </div>
          </Link>

          <Link href="/admin/bonuses" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:border-[#C5A059]/40 hover:shadow-md transition-all cursor-pointer">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Bonuses</span>
              <p className="text-2xl font-black text-[#0B1D2E] mt-0.5">{activeBonuses || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Gift className="h-5 w-5" />
            </div>
          </Link>

          <Link href="/admin/marketing" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:border-[#C5A059]/40 hover:shadow-md transition-all cursor-pointer">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dispatched Emails</span>
              <p className="text-2xl font-black text-[#0B1D2E] mt-0.5">{totalCampaigns || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#14452F]/10 flex items-center justify-center text-[#14452F]">
              <Megaphone className="h-5 w-5" />
            </div>
          </Link>
        </div>

        {/* 4. Staff Workload Roster */}
        <div className="bg-white rounded-3xl border border-slate-150 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0B1D2E] flex items-center gap-2">
                <Users className="h-5 w-5 text-[#C5A059]" /> Staff Workload Roster
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Current active appraisers and submission assignments.
                <span className="text-[#14452F] font-bold"> {assignedCount || 0} active assignments</span> across all staff.
              </p>
            </div>
            <Link href="/admin/submissions" className="flex items-center gap-1 text-xs font-bold text-[#14452F] hover:underline">
              Manage Queue <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {!staffMembers || staffMembers.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">No admin or staff members found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffMembers.map(member => (
                <div key={member.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#14452F]/10 flex items-center justify-center text-[#14452F] font-bold text-sm shrink-0">
                      {(member.full_name || member.email || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0B1D2E] truncate">{member.full_name || 'Unnamed'}</p>
                      <p className="text-[10px] text-slate-400 truncate">{member.email}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shrink-0 ${
                    member.role === 'admin'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/admin/submissions?tab=appraising"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B1D2E] hover:bg-[#0B1D2E]/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              <FileText className="h-3.5 w-3.5" /> Assign Submissions to Staff
            </Link>
          </div>
        </div>

        {/* 5. Recent Registrations + Access Credentials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-150 shadow-sm p-6 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-[#0B1D2E] mb-5">Recent Seller Registrations</h2>
            <RecentUsersTable initialUsers={recentUsers || []} />
          </div>

          <div className="bg-[#0B1D2E] text-white rounded-3xl border border-[#C5A059]/20 shadow-xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-[-10%] top-[-20%] w-48 h-48 rounded-full bg-[#C5A059]/5 blur-[40px]" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
                <Award className="h-6 w-6 text-[#C5A059]" />
              </div>
              <h2 className="font-serif text-xl font-bold text-white mb-2">Access Credentials</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                You are currently accessing this workspace with full Administrative clearance. Keep appraiser operations confidential.
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

        {/* 6. Setup Guide Checklist */}
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

      </div>
    </main>
  )
}
