'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  Search, 
  Users, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  FileSpreadsheet, 
  ArrowRight,
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'

interface CustomerSubmitter {
  email: string
  name: string
  phone: string
  postcode: string
  submissionCount: number
  lastSubmissionDate: string
}

export default function CustomerDirectoryPage() {
  const [customers, setCustomers] = useState<CustomerSubmitter[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  const fetchCustomerDirectory = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('guest_email, guest_name, guest_phone, guest_postcode, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group submissions by guest_email
      const groupedMap = new Map<string, CustomerSubmitter>()

      ;(data || []).forEach(sub => {
        const email = sub.guest_email || 'unknown@guest.com'
        if (!groupedMap.has(email)) {
          groupedMap.set(email, {
            email,
            name: sub.guest_name || 'Guest Submitter',
            phone: sub.guest_phone || 'N/A',
            postcode: sub.guest_postcode || 'N/A',
            submissionCount: 1,
            lastSubmissionDate: sub.created_at
          })
        } else {
          const existing = groupedMap.get(email)!
          existing.submissionCount += 1
          // Keep newest name/phone/postcode if available
          if (!existing.name && sub.guest_name) existing.name = sub.guest_name
          if (!existing.phone && sub.guest_phone) existing.phone = sub.guest_phone
          if (!existing.postcode && sub.guest_postcode) existing.postcode = sub.guest_postcode
        }
      })

      setCustomers(Array.from(groupedMap.values()))
    } catch (err: any) {
      console.error('Directory fetch error:', err)
      toast.error('Failed to load customer submitter directory.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomerDirectory()
  }, [])

  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase()
    return (
      c.email.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.postcode.toLowerCase().includes(q)
    )
  })

  return (
    <main className="flex-1 bg-[#FBFBF9] py-8 px-6 sm:px-8 overflow-y-auto min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] block mb-1">
              Customer CRM Directory
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#0B1D2E]">
              Guest Submitters Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Search and view past valuation request submitters aggregated by email address.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {customers.length} Unique Submitters
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-xs flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search submitter name, email, phone, or postcode..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-150 p-12 text-center flex flex-col items-center justify-center min-h-[250px]">
            <Loader2 className="animate-spin h-8 w-8 text-[#C5A059] mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading customer submitter directory...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-150 p-12 text-center min-h-[250px] flex flex-col items-center justify-center">
            <Users className="h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No Submitters Found</h3>
            <p className="text-xs text-slate-500 mt-1">No guest submitters matched your search filter.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-150 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Submitter Name</th>
                    <th className="py-3.5 px-6">Contact Info</th>
                    <th className="py-3.5 px-6">Postcode</th>
                    <th className="py-3.5 px-6 text-center">Submissions Count</th>
                    <th className="py-3.5 px-6">Last Active</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredCustomers.map((cust) => (
                    <tr key={cust.email} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#0B1D2E]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#14452F]/10 text-[#14452F] font-bold flex items-center justify-center shrink-0">
                            {cust.name[0]?.toUpperCase() || 'G'}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-800">{cust.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Guest Record</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <a 
                            href={`mailto:${cust.email}`} 
                            className="inline-flex items-center gap-1.5 font-mono text-slate-600 hover:text-[#C5A059] hover:underline"
                          >
                            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {cust.email}
                          </a>
                          {cust.phone && cust.phone !== 'N/A' && (
                            <a 
                              href={`tel:${cust.phone.replace(/\s/g, '')}`} 
                              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#0B1D2E] block"
                            >
                              <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              {cust.phone}
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-slate-600">
                        <div className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {cust.postcode}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                          <FileSpreadsheet className="h-3.5 w-3.5 text-slate-400" />
                          {cust.submissionCount} parcel{cust.submissionCount > 1 ? 's' : ''}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                        <div className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {new Date(cust.lastSubmissionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <Link
                          href={`/admin/submissions?search=${encodeURIComponent(cust.email)}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0B1D2E] hover:bg-[#0B1D2E]/90 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          View Submissions <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
