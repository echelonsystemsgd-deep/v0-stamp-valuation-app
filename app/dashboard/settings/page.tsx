import React from 'react'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PayoutForm } from '@/components/forms/payout-form'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: payDetails } = await supabase
    .from('profile_payout_details')
    .select('*')
    .eq('id', user.id)
    .single()

  const payoutDetails = payDetails ? {
    bank_name: payDetails.bank_name || '',
    account_holder_name: payDetails.bank_account_name || '',
    sort_code: payDetails.bank_sort_code || '',
    account_number: payDetails.bank_account_number || ''
  } : {}

  return (
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0B1D2E]">Payout Configuration</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure your disbursements details to secure swift payments.
          </p>
        </div>
        <PayoutForm 
          user={{ id: user.id, email: user.email! }} 
          initialPayoutDetails={payoutDetails} 
        />
      </div>
    </main>
  )
}
