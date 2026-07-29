import React from 'react'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AppraiserWorkbench } from '@/components/admin/appraiser-workbench'

export const dynamic = 'force-dynamic'

export default async function WorkerDashboardPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'staff' && profile.role !== 'admin')) {
    redirect('/unauthorized')
  }

  // Unassigned arrivals queue
  const { data: unassignedData } = await supabase
    .from('submissions')
    .select('id, collection_type, approx_quantity, estimated_era, estimated_valuation, status, created_at, assigned_appraiser_id')
    .is('assigned_appraiser_id', null)
    .in('status', ['received', 'under_review', 'quote_requested'])
    .order('created_at', { ascending: false })

  // Active workstation queue assigned to this appraiser
  const { data: assignedData } = await supabase
    .from('submissions')
    .select('id, collection_type, approx_quantity, estimated_era, estimated_valuation, status, created_at, assigned_appraiser_id')
    .eq('assigned_appraiser_id', user.id)
    .in('status', ['received', 'under_review', 'quote_requested'])
    .order('created_at', { ascending: false })

  return (
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto min-h-screen">
      <div className="max-w-7xl mx-auto">
        <AppraiserWorkbench
          initialAssigned={assignedData as any || []}
          initialUnassigned={unassignedData as any || []}
          currentUserId={user.id}
          profileName={profile.full_name || user.email || 'Staff Appraiser'}
        />
      </div>
    </main>
  )
}
