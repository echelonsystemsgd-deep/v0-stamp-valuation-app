'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface ResponsiveSidebarWrapperProps {
  user: {
    id: string
    email: string
  }
  profile: any
  children: React.ReactNode
}

export function ResponsiveSidebarWrapper({ user, profile, children }: ResponsiveSidebarWrapperProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Auto-close sheet when pathname changes (user clicked a menu link)
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Real-time online presence tracking
  useEffect(() => {
    if (!user?.id) return

    const supabase = createClient()
    const mountId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user.id,
        },
      },
    })

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: user.id,
          email: user.email,
          role: profile?.role || 'user',
          online_at: new Date().toISOString(),
        })
      }
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, profile?.role])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FBFBF9] flex-col lg:flex-row">
      {/* Mobile/Tablet Top Nav Bar */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#0B1D2E] text-white border-b border-[#C5A059]/10 shrink-0">
        <div className="flex items-center gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-white hover:bg-white/10 rounded-xl cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80 bg-[#0B1D2E] text-white border-r-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Console navigation options</SheetDescription>
              </SheetHeader>
              <SidebarNav
                user={user}
                profile={profile}
                className="w-full h-full border-r-0"
              />
            </SheetContent>
          </Sheet>
          <span className="font-serif text-lg font-black tracking-wider text-white select-none">
            SellYourStamps<span className="text-[#C5A059]">UK</span>
          </span>
        </div>

        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/25 select-none tracking-wider">
          {profile?.role || 'user'}
        </span>
      </header>

      {/* Desktop Sidebar — hidden below lg, visible at lg+ */}
      <div className="hidden lg:block shrink-0">
        <SidebarNav user={user} profile={profile} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {children}
      </div>
    </div>
  )
}
