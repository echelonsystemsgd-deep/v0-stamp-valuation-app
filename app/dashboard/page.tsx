import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { CheckCircle2, FileText, Banknote, ShieldAlert, Compass } from 'lucide-react'
import { OnboardingBanner } from '@/components/dashboard/onboarding-banner'
import { SellerPromotionBanner } from '@/components/dashboard/seller-promotion-banner'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  
  // Retrieve user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Retrieve user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Retrieve user submissions stats
  const { count: submissionCount } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: paidCount } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'paid')

  const isProfileIncomplete = !profile?.full_name || !profile?.phone || !profile?.postcode

  return (
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Onboarding Alert Banner */}
        <OnboardingBanner isProfileIncomplete={isProfileIncomplete} />

        {/* Seller Promotion Banner */}
        {profile?.role === 'user' && <SellerPromotionBanner />}

        {/* Dashboard Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-[#0B1D2E] text-white rounded-3xl border border-[#C5A059]/20 shadow-xl relative overflow-hidden">
          {/* Decorative Gold Border Line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059] to-[#14452F]" />
          <div className="absolute right-[-10%] top-[-20%] w-72 h-72 rounded-full bg-[#C5A059]/5 blur-[50px]" />
          
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">Valuation Console</span>
            <h1 className="font-serif text-3xl font-bold mt-1 text-white">
              Welcome back, {profile?.full_name || (user.email || '').split('@')[0]}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Manage your appraisals, check valuations, and secure payouts.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-3">
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#14452F] hover:bg-[#14452F]/90 rounded-xl transition-all shadow-md"
              >
                <ShieldAlert className="h-4 w-4" /> Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Submissions</span>
              <p className="text-3xl font-black text-[#0B1D2E] mt-1">{submissionCount || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#0B1D2E]">
              <FileText className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed Payouts</span>
              <p className="text-3xl font-black text-[#14452F] mt-1">{paidCount || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#14452F]/5 flex items-center justify-center text-[#14452F]">
              <Banknote className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Role</span>
              <p className="text-3xl font-black text-[#C5A059] mt-1 capitalize">{profile?.role || 'user'}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50/50 flex items-center justify-center text-[#C5A059]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Audit details */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <h2 className="font-serif text-2xl font-bold text-[#0B1D2E] mb-6">Security & Account Verification</h2>
            
            <div className="divide-y divide-slate-100">
              <div className="py-4 flex justify-between">
                <span className="text-sm font-semibold text-slate-500">Registered Email Address</span>
                <span className="text-sm font-bold text-[#0B1D2E]">{user.email}</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-sm font-semibold text-slate-500">Account Owner Name</span>
                <span className="text-sm font-bold text-[#0B1D2E]">{profile?.full_name || 'Not provided'}</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-sm font-semibold text-slate-500">Postcode</span>
                <span className="text-sm font-bold text-[#0B1D2E]">{profile?.postcode || 'Not provided'}</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-sm font-semibold text-slate-500">System Role ID</span>
                <span className="text-sm font-bold text-[#C5A059] capitalize">{profile?.role || 'user'}</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-sm font-semibold text-slate-500">Account Status</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full capitalize">
                  {profile?.status || 'active'}
                </span>
              </div>
            </div>
          </div>

          {/* Next Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#0B1D2E] mb-4">Start Valuation</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Ready to sell your stamp collection? Use our instant rate calculator or upload high-resolution images for a formal appraisal.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/sell-your-stamps"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#14452F] hover:bg-[#14452F]/90 transition-all text-center"
              >
                <Compass className="h-4 w-4" /> Request Appraisal Form
              </Link>
              
              <Link
                href="/"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all text-center"
              >
                Back to Home Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
