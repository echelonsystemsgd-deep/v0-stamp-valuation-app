'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, PhoneCall } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { mainNavigation, contactInfo } from '@/data/navigation'
import { cn } from '@/lib/utils'
import { PageBreadcrumbs } from '@/components/layout/breadcrumbs'
import { Logo } from '@/components/layout/logo'

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

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
        'sticky top-0 z-50 w-full transition-all duration-500',
        isScrolled
          ? 'bg-white/80 dark:bg-navy/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border-b border-white/20'
          : 'bg-transparent'
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
          "flex items-center justify-between transition-all duration-500",
          isScrolled ? "h-16 sm:h-20" : "h-20 sm:h-32"
        )} aria-label="Main navigation">
          {/* Logo */}
          <Link 
            href="/" 
            onClick={(e) => handleLinkClick(e, '/')}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm group relative flex-shrink-0"
          >
            <Logo variant={isScrolled ? 'dark' : 'light'} scrolled={isScrolled} />
            <span className="sr-only">Sell Your Stamps UK</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-14 xl:gap-16">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={cn(
                  'text-base font-semibold transition-all duration-300 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 py-2 relative group/nav whitespace-nowrap',
                  isScrolled 
                    ? (pathname === item.href ? 'text-forest-green' : 'text-foreground/70 hover:text-forest-green')
                    : (pathname === item.href ? 'text-white' : 'text-white/70 hover:text-white')
                )}
              >
                {item.label}
                <span className={cn(
                  "absolute bottom-0 left-1 right-1 h-0.5 transition-all duration-300 transform scale-x-0 group-hover/nav:scale-x-100 origin-left",
                  isScrolled ? "bg-forest-green" : "bg-white",
                  pathname === item.href && "scale-x-100"
                )} />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-10 xl:gap-12 flex-shrink-0">
            <div className="flex flex-col items-end mr-2 whitespace-nowrap">
              <span className={cn(
                "text-[10px] uppercase tracking-widest font-bold transition-colors duration-500 mb-0.5",
                isScrolled ? "text-muted-foreground" : "text-white/60"
              )}>
                Need Expert Advice?
              </span>
              <a 
                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
                className={cn(
                  "flex items-center gap-2.5 transition-all duration-300 group font-serif whitespace-nowrap",
                  isScrolled ? "text-forest-green hover:text-forest-green/80" : "text-white hover:text-white/80"
                )}
                suppressHydrationWarning
              >
                <PhoneCall className={cn("h-4 w-4", !isScrolled && "text-heritage-gold")} />
                <span className="font-bold tracking-tight text-xl">{contactInfo.phone}</span>
              </a>
            </div>
            <Button
              asChild
              className={cn(
                "font-bold px-8 h-12 transition-all duration-500 shadow-lg whitespace-nowrap",
                isScrolled 
                  ? "bg-forest-green hover:bg-forest-green/90 text-white shadow-forest-green/20" 
                  : "bg-white text-forest-green hover:bg-white/90 shadow-white/10"
              )}
              suppressHydrationWarning
            >
              <Link href="/sell-your-stamps">Sell Your Stamps</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <a 
              href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-500 min-h-11 border",
                isScrolled 
                  ? "text-forest-green bg-forest-green/10 border-forest-green/10" 
                  : "text-white bg-white/10 border-white/20 backdrop-blur-md"
              )}
              aria-label={`Call us on ${contactInfo.phone}`}
              suppressHydrationWarning
            >
              <PhoneCall className="h-4 w-4" />
              <span className="text-sm font-bold tracking-tight">
                {contactInfo.phone}
              </span>
            </a>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-11 w-11 rounded-full transition-colors",
                    isScrolled ? "text-foreground" : "text-white hover:bg-white/10"
                  )}
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
      <PageBreadcrumbs />
    </header>
  )
}
