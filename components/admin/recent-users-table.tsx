'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, Phone, Calendar, ArrowRight } from 'lucide-react'

interface GuestSubmitterItem {
  id: string
  email: string
  name: string
  phone: string
  createdAt: string
}

interface RecentUsersTableProps {
  initialUsers: GuestSubmitterItem[]
}

export function RecentUsersTable({ initialUsers }: RecentUsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100 text-left">
        <thead>
          <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-4">
            <th className="pb-3 px-2">Submitter Name</th>
            <th className="pb-3 px-2">Email Address</th>
            <th className="pb-3 px-2">Phone</th>
            <th className="pb-3 px-2 text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {initialUsers && initialUsers.length > 0 ? (
            initialUsers.map((u) => (
              <tr 
                key={u.id} 
                className="hover:bg-slate-50 transition-all"
              >
                <td className="py-3 px-2 font-bold text-slate-800">{u.name}</td>
                <td className="py-3 px-2 font-mono text-slate-600">
                  <a href={`mailto:${u.email}`} className="hover:text-[#C5A059] hover:underline flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-slate-400" />
                    {u.email}
                  </a>
                </td>
                <td className="py-3 px-2 text-slate-500">
                  {u.phone !== 'N/A' ? (
                    <a href={`tel:${u.phone.replace(/\s/g, '')}`} className="hover:text-slate-800 flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-slate-400" />
                      {u.phone}
                    </a>
                  ) : (
                    <span className="text-slate-400 font-mono">N/A</span>
                  )}
                </td>
                <td className="py-3 px-2 text-right text-slate-400 font-mono text-[11px]">
                  {new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-6 text-center text-xs text-slate-400">
                No guest submitters recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
