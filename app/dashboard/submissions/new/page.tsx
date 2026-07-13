import React from 'react'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { SellForm } from '@/components/forms/sell-form'

export const dynamic = 'force-dynamic'

export default async function NewSubmissionPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0B1D2E]">Request New Stamp Valuation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Provide details of your stamp collection and upload photos to receive an appraisal.
          </p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <SellForm isDashboard={true} />
        </div>
      </div>
    </main>
  )
}
