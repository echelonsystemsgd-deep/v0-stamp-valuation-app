'use client'

import React, { useTransition } from 'react'
import { signOut } from '@/app/auth/actions'
import { LogOut, Loader2 } from 'lucide-react'

export function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition-all shadow-md cursor-pointer shrink-0"
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin h-4 w-4" /> Signing out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" /> Sign Out
        </>
      )}
    </button>
  )
}
