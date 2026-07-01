import React from 'react'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ResponsiveSidebarWrapper } from '@/components/dashboard/responsive-sidebar-wrapper'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
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

  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    redirect('/dashboard')
  }

  return (
    <ResponsiveSidebarWrapper user={{ id: user.id, email: user.email || '' }} profile={profile}>
      {children}
    </ResponsiveSidebarWrapper>
  )
}
