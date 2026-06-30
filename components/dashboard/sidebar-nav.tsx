'use client'

import React, { useTransition } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/auth/actions'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Settings, 
  LogOut, 
  Loader2, 
  ShieldAlert, 
  Users, 
  Coins, 
  History, 
  CreditCard 
} from 'lucide-react'

interface SidebarNavProps {
  user: {
    email: string
    id: string
  }
  profile: {
    full_name?: string
    role: 'user' | 'seller' | 'admin'
    status?: string
  } | null
}

export function SidebarNav({ user, profile }: SidebarNavProps) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  
  const role = profile?.role ?? 'user'
  const name = profile?.full_name || user.email.split('@')[0]
  const avatarLetter = name.charAt(0).toUpperCase()

  const handleLogout = () => {
    startTransition(async () => {
      await signOut()
    })
  }

  // Navigation config based on role
  const adminNavigation = [
    {
      group: 'COMMAND DECK',
      items: [
        { label: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
        { label: 'Submissions Queue', href: '/admin/submissions', icon: FileSpreadsheet },
      ]
    },
    {
      group: 'SYSTEM MANAGEMENT',
      items: [
        { label: 'Rates Manager', href: '/admin/categories', icon: Coins },
        { label: 'Seller Accounts', href: '/admin/sellers', icon: Users },
      ]
    },
    {
      group: 'SETTINGS',
      items: [
        { label: 'System Settings', href: '/admin/settings', icon: Settings },
      ]
    }
  ]

  const userNavigation = [
    {
      group: 'COMMAND DECK',
      items: [
        { label: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Submit Valuation', href: '/sell-your-stamps', icon: FileSpreadsheet },
      ]
    },
    {
      group: 'MY APPRAISALS',
      items: [
        { label: 'Valuation History', href: '/dashboard/submissions', icon: History },
        { label: 'Payout Details', href: '/dashboard/settings', icon: CreditCard },
      ]
    },
    {
      group: 'SETTINGS',
      items: [
        { label: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
      ]
    }
  ]

  const navigationGroups = role === 'admin' ? adminNavigation : userNavigation

  return (
    <aside className="w-80 bg-[#0B1D2E] text-white flex flex-col h-screen border-r border-[#C5A059]/20 flex-shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#C5A059]/10">
        <Link href="/" className="font-serif text-2xl font-black tracking-wider text-white flex items-center gap-2">
          SellYourStamps<span className="text-[#C5A059]">UK</span>
        </Link>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mt-1">
          {role === 'admin' ? 'Admin Console' : 'Valuation Console'}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-8 custom-scrollbar">
        {navigationGroups.map((group) => (
          <div key={group.group} className="space-y-2">
            <span className="text-[10px] font-black tracking-widest text-slate-500 block px-3 uppercase">
              {group.group}
            </span>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group/item',
                      isActive 
                        ? 'bg-[#14452F] text-white shadow-lg shadow-[#14452F]/15 border border-[#14452F]/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className={cn(
                      'h-5 w-5 transition-transform duration-200 group-hover/item:scale-105',
                      isActive ? 'text-[#C5A059]' : 'text-slate-400 group-hover/item:text-white'
                    )} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info Bottom Card */}
      <div className="p-4 border-t border-[#C5A059]/10 bg-black/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-[#C5A059] text-[#0B1D2E] flex items-center justify-center font-bold text-lg flex-shrink-0 select-none">
            {avatarLetter}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate max-w-[130px]">{name}</p>
            <p className="text-xs text-slate-400 truncate max-w-[130px]">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Role Badge */}
          <span className={cn(
            'text-[10px] font-black uppercase px-2 py-0.5 rounded-full select-none tracking-wider shrink-0',
            role === 'admin' 
              ? 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/25'
              : 'bg-[#14452F]/10 text-emerald-400 border border-[#14452F]/25'
          )}>
            {role}
          </span>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer shrink-0 disabled:opacity-50"
            title="Sign Out"
          >
            {isPending ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}
