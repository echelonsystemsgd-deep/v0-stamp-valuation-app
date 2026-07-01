'use client'

import React, { useTransition } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/auth/actions'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
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
  CreditCard,
  ArrowLeft
} from 'lucide-react'

interface SidebarNavProps {
  user: {
    email: string
    id: string
  }
  profile: {
    full_name?: string
    role: 'user' | 'seller' | 'admin' | 'staff'
    status?: string
    avatar_url?: string | null
  } | null
}

export function SidebarNav({ user, profile }: SidebarNavProps) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [avatarPreviewUrl, setAvatarPreviewUrl] = React.useState<string | null>(null)
  const [pendingSubmissionsCount, setPendingSubmissionsCount] = React.useState<number>(0)
  const [activeSellersCount, setActiveSellersCount] = React.useState<number>(0)
  
  const role = profile?.role ?? 'user'
  const name = profile?.full_name || user.email.split('@')[0]
  const avatarLetter = name.charAt(0).toUpperCase()

  // Fetch live counts for pending submissions & sellers
  React.useEffect(() => {
    if (role !== 'admin' && role !== 'staff') return

    const supabase = createClient()

    const fetchCounts = async () => {
      // Pending submissions count: quote_requested, received, under_review
      const { count: pendingCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .in('status', ['quote_requested', 'received', 'under_review'])

      // Active sellers count: users with role = 'seller'
      const { count: sellersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'seller')

      setPendingSubmissionsCount(pendingCount || 0)
      setActiveSellersCount(sellersCount || 0)
    }

    fetchCounts()

    // Realtime subscription for submissions
    const submissionsChannel = supabase
      .channel('sidebar-submissions-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        () => {
          fetchCounts()
        }
      )
      .subscribe()

    // Realtime subscription for profiles
    const profilesChannel = supabase
      .channel('sidebar-profiles-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          fetchCounts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(submissionsChannel)
      supabase.removeChannel(profilesChannel)
    }
  }, [role])

  React.useEffect(() => {
    if (!profile?.avatar_url) {
      setAvatarPreviewUrl(null)
      return
    }

    const getSignedUrl = async () => {
      if (profile.avatar_url!.startsWith('http')) {
        setAvatarPreviewUrl(profile.avatar_url!)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase.storage
          .from('avatars')
          .createSignedUrl(profile.avatar_url!, 3600)
        
        if (error) throw error
        setAvatarPreviewUrl(data.signedUrl)
      } catch (err) {
        console.error('Error creating sidebar signed URL:', err)
      }
    }

    getSignedUrl()
  }, [profile?.avatar_url])

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

  const navigationGroups = (role === 'admin' || role === 'staff') ? adminNavigation : userNavigation

  return (
    <aside className="w-80 bg-[#0B1D2E] text-white flex flex-col h-screen border-r border-[#C5A059]/20 flex-shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#C5A059]/10 flex flex-col gap-4">
        <div>
          <Link href="/" className="font-serif text-2xl font-black tracking-wider text-white flex items-center gap-2">
            SellYourStamps<span className="text-[#C5A059]">UK</span>
          </Link>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mt-1">
            {role === 'admin' ? 'Admin Console' : 'Valuation Console'}
          </span>
        </div>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl border border-[#C5A059]/20 hover:border-[#C5A059]/50 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 group/btn"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-[#C5A059] group-hover/btn:-translate-x-0.5 transition-transform" />
          Back to Website
        </Link>
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
                let badgeVal: number | undefined = undefined
                
                if (role === 'admin' || role === 'staff') {
                  if (item.href === '/admin/submissions') {
                    badgeVal = pendingSubmissionsCount
                  } else if (item.href === '/admin/sellers') {
                    badgeVal = activeSellersCount
                  }
                }
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group/item',
                      isActive 
                        ? 'bg-[#14452F] text-white shadow-lg shadow-[#14452F]/15 border border-[#14452F]/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <Icon className={cn(
                        'h-5 w-5 transition-transform duration-200 group-hover/item:scale-105 flex-shrink-0',
                        isActive ? 'text-[#C5A059]' : 'text-slate-400 group-hover/item:text-white'
                      )} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {badgeVal !== undefined && badgeVal > 0 && (
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm flex-shrink-0 transition-all duration-200',
                        isActive 
                          ? 'bg-[#C5A059] text-[#0B1D2E] border-[#C5A059]' 
                          : 'bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/25 group-hover/item:bg-[#C5A059]/25'
                      )}>
                        {badgeVal}
                      </span>
                    )}
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
          <Avatar className="h-10 w-10 border border-[#C5A059]/20 flex-shrink-0">
            {avatarPreviewUrl ? (
              <AvatarImage
                src={avatarPreviewUrl}
                alt={name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-[#C5A059] text-[#0B1D2E] font-bold text-lg">
              {avatarLetter}
            </AvatarFallback>
          </Avatar>
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
