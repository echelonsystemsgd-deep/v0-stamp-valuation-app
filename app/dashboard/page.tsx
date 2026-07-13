import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ShieldAlert } from 'lucide-react'
import { OnboardingBanner } from '@/components/dashboard/onboarding-banner'
import { SubmissionsDashboard } from '@/components/dashboard/submissions-dashboard'

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

  // Retrieve user submissions matching permissions (RLS handles filtering)
  const { data: submissionsData } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })

  const submissions = (submissionsData || []).map(sub => ({
    ...sub,
    estimated_valuation: Number(sub.estimated_valuation),
    final_reviewed_valuation: sub.final_reviewed_valuation ? Number(sub.final_reviewed_valuation) : null,
  }))

  const isProfileIncomplete = !profile?.full_name || !profile?.phone || !profile?.postcode

  return (
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Onboarding Alert Banner */}
        <OnboardingBanner isProfileIncomplete={isProfileIncomplete} />


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

        {/* Main Submissions Dashboard */}
        <SubmissionsDashboard initialSubmissions={submissions as any} userId={user.id} />
      </div>
    </main>
  )
}
