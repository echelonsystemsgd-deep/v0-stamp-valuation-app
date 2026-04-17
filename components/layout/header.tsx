'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, PhoneCall } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { mainNavigation, contactInfo } from '@/data/navigation'
import { cn } from '@/lib/utils'
import { PageBreadcrumbs } from '@/components/layout/breadcrumbs'

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm shadow-sm border-b border-border'
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-20 items-center justify-between" aria-label="Main navigation">
          {/* Logo */}
          <Link 
            href="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-primary leading-tight">
                UK Stamp
              </span>
              <span className="font-serif text-xl font-bold text-primary leading-tight">
                Valuations
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-base font-medium transition-colors hover:text-forest-green focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 py-2',
                  pathname === item.href
                    ? 'text-forest-green'
                    : 'text-foreground/80'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex flex-col items-end mr-2">
              <span className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground font-semibold">
                Need Expert Advice?
              </span>
              <a 
                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
                className="flex items-center gap-2 text-forest-green hover:text-forest-green/80 transition-colors group"
                suppressHydrationWarning
              >
                <PhoneCall className="h-4 w-4" />
                <span className="font-bold tracking-tight text-lg">{contactInfo.phone}</span>
              </a>
            </div>
            <Button
              asChild
              className="bg-forest-green hover:bg-forest-green/90 text-white font-semibold px-6 h-11 animate-pulse-subtle shadow-[0_0_0_0_rgba(45,106,79,0.4)]"
              suppressHydrationWarning
            >
              <Link href="/sell-your-stamps">Sell Your Stamps</Link>
            </Button>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <a 
              href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
              className="flex items-center gap-1.5 text-forest-green hover:text-forest-green/80 bg-forest-green/10 px-3 py-2 rounded-md transition-colors"
              aria-label="Call us"
              suppressHydrationWarning
            >
              <PhoneCall className="h-4 w-4" />
              <span className="text-sm font-bold hidden sm:inline-block tracking-tight">
                {contactInfo.phone}
              </span>
            </a>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-11 w-11"
                  aria-label="Open menu"
                  suppressHydrationWarning
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle className="font-serif text-xl text-primary">
                    UK Stamp Valuations
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-8" aria-label="Mobile navigation">
                  {mainNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors',
                        pathname === item.href
                          ? 'bg-forest-green/10 text-forest-green'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-8 px-4 py-6 bg-muted/30 rounded-xl border border-border/50">
                    <p className="text-base text-muted-foreground mb-3 font-medium">Need Expert Advice?</p>
                    <a 
                      href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
                      className="flex items-center gap-3 text-forest-green font-bold text-xl mb-6 hover:opacity-80 transition-opacity"
                    >
                      <div className="bg-forest-green/10 p-2.5 rounded-full">
                        <PhoneCall className="h-5 w-5" />
                      </div>
                      {contactInfo.phone}
                    </a>
                    <Button
                      asChild
                      className="w-full bg-forest-green hover:bg-forest-green/90 text-white font-semibold h-12"
                      onClick={() => setIsOpen(false)}
                      suppressHydrationWarning
                    >
                      <Link href="/sell-your-stamps">Sell Your Stamps</Link>
                    </Button>
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
