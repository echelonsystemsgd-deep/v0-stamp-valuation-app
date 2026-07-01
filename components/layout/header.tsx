'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, PhoneCall, Settings, LogOut, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mainNavigation, contactInfo } from '@/data/navigation'
import { cn } from '@/lib/utils'
import { PageBreadcrumbs } from '@/components/layout/breadcrumbs'
import { Logo } from '@/components/layout/logo'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { signOut } from '@/app/auth/actions'

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [user, setUser] = React.useState<User | null>(null)
  const [profile, setProfile] = React.useState<{ full_name?: string; role: 'user' | 'seller' | 'admin'; avatar_url?: string | null } | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = React.useState<string | null>(null)
  const pathname = usePathname()

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const fetchProfile = React.useCallback(async (userId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('full_name, role, avatar_url')
      .eq('id', userId)
      .single()
    setProfile(data as any)
  }, [])

  React.useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  React.useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id)
    } else {
      setProfile(null)
    }
  }, [user?.id, pathname, fetchProfile])

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
        console.error('Error creating header signed URL:', err)
      }
    }

    getSignedUrl()
  }, [profile?.avatar_url])

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/95 dark:bg-navy/95 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-b border-slate-200/80 dark:border-white/10'
          : 'bg-white/90 dark:bg-navy/90 backdrop-blur-md shadow-[0_2px_15px_rgba(0,0,0,0.02)] border-b border-slate-100 dark:border-slate-800/40'
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-forest-green focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-offset-2 transition-all duration-200"
        suppressHydrationWarning
      >
        Skip to main content
      </a>
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <nav className={cn(
          "flex items-center justify-between transition-all duration-300",
          isScrolled ? "h-16 sm:h-18" : "h-20 sm:h-24"
        )} aria-label="Main navigation">
          {/* Logo */}
          <Link 
            href="/" 
            onClick={(e) => handleLinkClick(e, '/')}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm group relative flex-shrink-0"
          >
            <Logo variant="dark" scrolled={isScrolled} />
            <span className="sr-only">Sell Your Stamps UK</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-14">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={cn(
                  'text-base font-semibold transition-all duration-300 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 py-2 relative group/nav whitespace-nowrap',
                  pathname === item.href 
                    ? 'text-forest-green dark:text-gold' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-forest-green dark:hover:text-gold'
                )}
              >
                {item.label}
                <span className={cn(
                  "absolute bottom-0 left-1 right-1 h-0.5 transition-all duration-300 transform scale-x-0 group-hover/nav:scale-x-100 origin-left bg-forest-green dark:bg-gold",
                  pathname === item.href && "scale-x-100"
                )} />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6 xl:gap-10 flex-shrink-0">
            <div className="flex flex-col items-end mr-2 whitespace-nowrap">
              <span className="text-xs uppercase tracking-widest font-bold mb-0.5 text-slate-500 dark:text-slate-400">
                Need Expert Advice?
              </span>
              <a 
                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
                className="flex items-center gap-2.5 transition-all duration-300 group font-serif whitespace-nowrap text-forest-green dark:text-gold hover:opacity-85"
                suppressHydrationWarning
              >
                <PhoneCall className="h-4 w-4 text-forest-green dark:text-gold" />
                <span className="font-bold tracking-tight text-xl">{contactInfo.phone}</span>
              </a>
            </div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full border border-slate-200 dark:border-slate-850 p-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden hover:opacity-90 transition-opacity cursor-pointer flex-shrink-0 mr-2"
                  >
                    <Avatar className="h-full w-full">
                      {avatarPreviewUrl ? (
                        <AvatarImage
                          src={avatarPreviewUrl}
                          alt={profile?.full_name || user.email || 'User Avatar'}
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="bg-forest-green/10 text-forest-green dark:bg-gold/10 dark:text-gold font-bold text-sm">
                        {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 bg-white dark:bg-navy border border-slate-200/80 dark:border-white/10 rounded-xl p-2 shadow-xl" align="end">
                  <DropdownMenuLabel className="font-normal px-3 py-2.5">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {profile?.full_name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="pt-1.5">
                        <span className={cn(
                          'text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full select-none tracking-wider',
                          profile?.role === 'admin'
                            ? 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/25'
                            : 'bg-[#14452F]/10 text-emerald-600 dark:text-emerald-400 border border-[#14452F]/25'
                        )}>
                          {profile?.role || 'user'}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-805/50 my-1" />
                  <DropdownMenuItem asChild>
                    <Link
                      href={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <UserIcon className="h-4 w-4 text-slate-400" />
                      {profile?.role === 'admin' ? 'Admin Console' : 'Valuation Console'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={profile?.role === 'admin' ? '/admin/settings' : '/dashboard/profile'}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-805/50 my-1" />
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut()
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className={cn(
                  'text-base font-semibold transition-all duration-300 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 py-2 relative group/nav whitespace-nowrap mr-2',
                  pathname === '/login'
                    ? 'text-forest-green dark:text-gold'
                    : 'text-slate-700 dark:text-slate-300 hover:text-forest-green dark:hover:text-gold'
                )}
              >
                Sign In
                <span className={cn(
                  "absolute bottom-0 left-1 right-1 h-0.5 transition-all duration-300 transform scale-x-0 group-hover/nav:scale-x-100 origin-left bg-forest-green dark:bg-gold",
                  pathname === '/login' && "scale-x-100"
                )} />
              </Link>
            )}
            <Button
              asChild
              className="font-bold px-8 h-12 transition-all duration-300 shadow-lg whitespace-nowrap bg-forest-green hover:bg-forest-green/90 text-white shadow-forest-green/20"
              suppressHydrationWarning
            >
              <Link href="/sell-your-stamps">Sell Your Stamps</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <a 
              href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
              className="flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 min-h-11 border text-forest-green bg-forest-green/10 border-forest-green/10 dark:text-gold dark:bg-gold/10 dark:border-gold/10"
              aria-label={`Call us on ${contactInfo.phone}`}
              suppressHydrationWarning
            >
              <PhoneCall className="h-4 w-4" />
              <span className="text-base font-bold tracking-tight hidden sm:inline">
                {contactInfo.phone}
              </span>
            </a>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-11 w-11 rounded-full transition-colors text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
                  aria-label="Open menu"
                  suppressHydrationWarning
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle className="font-serif text-2xl text-primary text-left">
                    Sell Your Stamps UK
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Mobile navigation menu for Sell Your Stamps UK
                  </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-8" aria-label="Mobile navigation">
                  {mainNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => {
                        setIsOpen(false)
                        handleLinkClick(e, item.href)
                      }}
                      className={cn(
                        'flex items-center px-4 py-4 text-xl font-serif font-bold rounded-xl transition-all',
                        pathname === item.href
                          ? 'bg-forest-green/10 text-forest-green translate-x-2'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {user ? (
                    <>
                      <div className="mt-6 mb-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-205 dark:border-slate-800 flex-shrink-0">
                          {avatarPreviewUrl ? (
                            <AvatarImage
                              src={avatarPreviewUrl}
                              alt={profile?.full_name || user.email || 'User Avatar'}
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="bg-[#C5A059] text-navy font-bold text-lg">
                            {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden flex-1">
                          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                            {profile?.full_name || (user.email || '').split('@')[0]}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{user.email || ''}</p>
                        </div>
                        <span className={cn(
                          'text-[10px] font-black uppercase px-2 py-0.5 rounded-full select-none tracking-wider shrink-0',
                          profile?.role === 'admin'
                            ? 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/25'
                            : 'bg-[#14452F]/10 text-[#14452F] border border-[#14452F]/25'
                        )}>
                          {profile?.role || 'user'}
                        </span>
                      </div>
                      <Link
                        href={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center px-4 py-3.5 text-lg font-serif font-bold rounded-xl transition-all',
                          pathname === '/dashboard' || pathname === '/admin'
                            ? 'bg-[#14452F]/10 text-[#14452F] translate-x-2'
                            : 'text-foreground hover:bg-muted'
                        )}
                      >
                        {profile?.role === 'admin' ? 'Admin Console' : 'Valuation Console'}
                      </Link>
                      <Link
                        href={profile?.role === 'admin' ? '/admin/settings' : '/dashboard/profile'}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center px-4 py-3.5 text-lg font-serif font-bold rounded-xl transition-all',
                          pathname === '/dashboard/profile' || pathname === '/admin/settings'
                            ? 'bg-[#14452F]/10 text-[#14452F] translate-x-2'
                            : 'text-foreground hover:bg-muted'
                        )}
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={async () => {
                          setIsOpen(false)
                          await signOut()
                        }}
                        className="flex w-full items-center text-left px-4 py-3.5 text-lg font-serif font-bold rounded-xl transition-all text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center px-4 py-4 text-xl font-serif font-bold rounded-xl transition-all',
                        pathname === '/login'
                          ? 'bg-forest-green/10 text-forest-green translate-x-2'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      Sign In
                    </Link>
                  )}
                  <div className="mt-8 p-6 bg-muted/30 rounded-2xl border border-border/50 relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-bold">Need Expert Advice?</p>
                      <a 
                        href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
                        className="flex items-center gap-3 text-forest-green font-serif font-bold text-2xl mb-8 hover:opacity-80 transition-opacity"
                      >
                        <div className="bg-forest-green/10 p-3 rounded-full">
                          <PhoneCall className="h-6 w-6" />
                        </div>
                        {contactInfo.phone}
                      </a>
                      <Button
                        asChild
                        className="w-full bg-forest-green hover:bg-forest-green/90 text-white font-bold h-14 rounded-xl text-lg shadow-xl shadow-forest-green/20"
                        onClick={() => setIsOpen(false)}
                        suppressHydrationWarning
                      >
                        <Link href="/sell-your-stamps">Sell Your Stamps Today</Link>
                      </Button>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
      <div className={cn(
        "transition-all duration-500 ease-in-out overflow-hidden origin-top",
        isScrolled 
          ? "max-h-0 opacity-0 pointer-events-none transform -translate-y-2" 
          : "max-h-16 opacity-100 transform translate-y-0"
      )}>
        <PageBreadcrumbs />
      </div>
    </header>
  )
}
