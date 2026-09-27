'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Mail, Clock } from 'lucide-react'
import { footerNavigation, contactInfo } from '@/data/navigation'
import { Logo } from '@/components/layout/logo'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-navy text-primary-foreground" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {/* Brand Column */}
            <div className="lg:col-span-2 xl:col-span-2">
              <Link 
                href="/" 
                onClick={(e) => handleLinkClick(e, '/')} 
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-heritage-gold rounded-sm group transition-all"
              >
                <Logo variant="light" size="sm" className="origin-left" />
              </Link>
              <p className="mt-6 text-base text-primary-foreground/80 leading-relaxed max-w-xs">
                The UK's most trusted stamp valuation and buying service. 
                Heritage-focused, expert-led, and committed to fair pricing for your stamp collection.
              </p>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="font-serif text-lg font-semibold text-primary-foreground mb-4">
                Our Services
              </h3>
              <ul className="flex flex-col gap-3" role="list">
                {footerNavigation.services.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      className="text-base text-primary-foreground/80 hover:text-gold hover:translate-x-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm inline-block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-serif text-lg font-semibold text-primary-foreground mb-4">
                Company
              </h3>
              <ul className="flex flex-col gap-3" role="list">
                {footerNavigation.company.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      className="text-base text-primary-foreground/80 hover:text-gold hover:translate-x-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm inline-block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Support */}
            <div>
              <h3 className="font-serif text-lg font-semibold text-primary-foreground mb-4">
                Quick Support
              </h3>
              <ul className="flex flex-col gap-3" role="list">
                {footerNavigation.support.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      className="text-base text-primary-foreground/80 hover:text-gold hover:translate-x-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm inline-block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-serif text-lg font-semibold text-primary-foreground mb-4">
                Contact Us
              </h3>
              <address className="not-italic flex flex-col gap-5">

                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-heritage-gold shrink-0" aria-hidden="true" />
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                    className="text-base text-primary-foreground/80 hover:text-gold transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-heritage-gold shrink-0" aria-hidden="true" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-base text-primary-foreground/80 hover:text-gold transition-colors break-all"
                  >
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-heritage-gold shrink-0" aria-hidden="true" />
                  <span className="text-base text-primary-foreground/80">
                    {contactInfo.hours}
                  </span>
                </div>
              </address>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:gap-3 sm:text-left text-sm text-primary-foreground/60">
              <p>
                &copy; {currentYear} {contactInfo.businessName}. All rights reserved.
              </p>
              <span className="hidden sm:inline" aria-hidden="true">&bull;</span>
              <p>
                Built by{' '}
                <a
                  href="https://mercianwealth.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors underline-offset-4 hover:underline"
                >
                  Mercian Wealth
                </a>
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                onClick={(e) => handleLinkClick(e, '/privacy')}
                className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                onClick={(e) => handleLinkClick(e, '/terms')}
                className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Terms of Service
              </Link>
              {/* [Client Decision Required: Consider whether 'Sign In (Admin)' should remain publicly visible in footer or hidden before full launch] */}
              <Link
                href="/login"
                onClick={(e) => handleLinkClick(e, '/login')}
                className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Sign In (Admin)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
