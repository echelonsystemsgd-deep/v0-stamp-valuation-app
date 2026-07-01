'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: string
  is_suspended: boolean
}

interface RecentUsersTableProps {
  initialUsers: UserProfile[]
}

export function RecentUsersTable({ initialUsers }: RecentUsersTableProps) {
  const [users] = useState<UserProfile[]>(initialUsers)
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase.channel('online-users')

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const onlineIds = new Set(Object.keys(state))
        setOnlineUserIds(onlineIds)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100">
        <thead>
          <tr>
            <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider pb-4">Email</th>
            <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider pb-4">Name</th>
            <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider pb-4">Role</th>
            <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider pb-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users && users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="py-3 text-sm font-semibold text-slate-700">{u.email}</td>
                <td className="py-3 text-sm text-slate-500">{u.full_name || 'Not provided'}</td>
                <td className="py-3 text-sm font-bold text-amber-600 capitalize">{u.role}</td>
                <td className="py-3 text-sm">
                  {u.is_suspended ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Suspended
                    </span>
                  ) : onlineUserIds.has(u.id) ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Offline
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-6 text-center text-sm text-slate-400">
                No users registered.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
