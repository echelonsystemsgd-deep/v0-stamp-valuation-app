'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  LayoutGrid, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Briefcase,
  Globe,
  ShieldAlert
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AdminSidebarWrapperProps {
  user: { id: string; email: string }
  profile: { full_name?: string | null; role: 'admin' | 'staff' | 'seller' | 'user' }
  children: React.ReactNode
}

export function AdminSidebarWrapper({ user, profile, children }: AdminSidebarWrapperProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out successfully.')
    router.push('/')
  }

  const isAdmin = profile.role === 'admin'

  const navItems = isAdmin
    ? [
        { label: 'Command Deck', href: '/admin', icon: LayoutDashboard },
        { label: 'Submissions Queue', href: '/admin/submissions', icon: FileSpreadsheet },
        { label: 'Rates Manager', href: '/admin/categories', icon: LayoutGrid },
        { label: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
        { label: 'Customer Directory', href: '/admin/sellers', icon: Users },
        { label: 'System Settings', href: '/admin/settings', icon: Settings },
      ]
    : [
        { label: 'My Workstation', href: '/worker', icon: Briefcase },
        { label: 'Submissions Queue', href: '/admin/submissions', icon: FileSpreadsheet },
      ]

  return (
    <div className="min-h-screen flex bg-[#FBFBF9] text-slate-800">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0B1D2E] text-white px-4 py-3 flex items-center justify-between border-b border-[#C5A059]/20 shadow-md">
        <Link href={isAdmin ? '/admin' : '/worker'} className="font-serif text-lg font-bold tracking-wider text-white">
          Stamp Valuations <span className="text-[#C5A059]">{isAdmin ? 'Admin' : 'Worker'}</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop + Mobile Menu */}
      <aside className={cn(
        "fixed lg:sticky lg:top-0 lg:h-screen lg:self-start inset-y-0 left-0 z-50 w-64 bg-[#0B1D2E] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-[#C5A059]/20 shadow-xl shrink-0 overflow-y-auto",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-white/10">
            <Link href={isAdmin ? '/admin' : '/worker'} className="font-serif text-xl font-black tracking-wider text-white block">
              UK Stamp <span className="text-[#C5A059]">Valuations</span>
            </Link>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] block mt-1">
              {isAdmin ? 'Management Control Deck' : 'Appraiser Sorting Desk'}
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 block mb-2">
              Command Deck
            </span>

            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/admin' && item.href !== '/worker' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer",
                    isActive
                      ? "bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 shadow-xs"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#C5A059]" : "text-slate-400")} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Footer Profile & Signout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#14452F] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] font-bold text-xs shrink-0">
              {(profile.full_name || user.email || 'A')[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{profile.full_name || 'Staff User'}</p>
              <span className="text-[9px] font-black uppercase tracking-wider text-[#C5A059] block">
                {profile.role} clearance
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] rounded-xl text-xs font-bold transition-all border border-[#C5A059]/30"
          >
            <Globe className="h-3.5 w-3.5" /> Back to Main Website
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-white/10"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pt-14 lg:pt-0">
        {children}
      </div>
    </div>
  )
}
