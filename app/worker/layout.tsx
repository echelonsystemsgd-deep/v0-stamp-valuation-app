import React from 'react'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AdminSidebarWrapper } from '@/components/admin/admin-sidebar-wrapper'

export const dynamic = 'force-dynamic'

export default async function WorkerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'staff' && profile.role !== 'admin')) {
    redirect('/unauthorized')
  }

  return (
    <AdminSidebarWrapper user={{ id: user.id, email: user.email || '' }} profile={profile}>
      {children}
    </AdminSidebarWrapper>
  )
}
