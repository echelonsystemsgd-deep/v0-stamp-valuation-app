import React from 'react'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/forms/profile-form'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
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
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-800 dark:text-white">Admin Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your administrator profile details and system preferences.
          </p>
        </div>
        <ProfileForm user={{ id: user.id, email: user.email! }} initialProfile={profile} />
      </div>
    </main>
  )
}
