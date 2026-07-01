import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Users, FileText, LayoutGrid, ShieldAlert, Award } from 'lucide-react'
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

  const { count: totalSubmissions } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })

  const { count: totalCategories } = await supabase
    .from('stamp_categories')
    .select('*', { count: 'exact', head: true })

  // Retrieve recent users list
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Admin Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-[#0B1D2E] text-white rounded-3xl border border-[#C5A059]/20 shadow-xl relative overflow-hidden">
          {/* Decorative Gold Border Line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
          <div className="absolute right-[-10%] top-[-20%] w-72 h-72 rounded-full bg-[#C5A059]/5 blur-[50px]" />
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/30">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">Administrative Control Panel</span>
              <h1 className="font-serif text-3xl font-bold mt-1 text-white">
                Admin Console Overview
              </h1>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#14452F] hover:bg-[#14452F]/90 rounded-xl transition-all shadow-md"
            >
              Seller Dashboard View
            </Link>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Registered Accounts</span>
              <p className="text-3xl font-black text-[#0B1D2E] mt-1">{totalUsers || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Valuation Submissions</span>
              <p className="text-3xl font-black text-[#0B1D2E] mt-1">{totalSubmissions || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FileText className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Stamp Categories</span>
              <p className="text-3xl font-black text-[#0B1D2E] mt-1">{totalCategories || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50/50 flex items-center justify-center text-[#C5A059]">
              <LayoutGrid className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Users List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <h2 className="font-serif text-2xl font-bold text-[#0B1D2E] mb-6">Recent Registered Users</h2>
            
            <RecentUsersTable initialUsers={recentUsers || []} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50/50 flex items-center justify-center text-[#C5A059] mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#0B1D2E] mb-2">Admin Tools</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                You are logged in with the <strong>admin</strong> role. This allows you to manage buying rates, audit physical collections, and execute payouts.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Level</span>
                <span className="text-sm font-bold text-[#0B1D2E] flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Full Access (Admin)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
