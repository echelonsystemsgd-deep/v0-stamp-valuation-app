'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Mail, Clock, Landmark } from 'lucide-react'
import { footerNavigation, contactInfo } from '@/data/navigation'

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
    <footer className="bg-primary text-primary-foreground" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link 
                href="/" 
                onClick={(e) => handleLinkClick(e, '/')} 
                className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-heritage-gold rounded-sm group transition-all"
              >
                <div className="bg-heritage-gold/20 p-2 rounded-lg text-heritage-gold group-hover:scale-110 transition-transform duration-300">
                  <Landmark className="h-6 w-6" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-serif text-xl font-light text-primary-foreground">
                    Sell Your Stamps
                    <span className="font-bold ml-1.5 text-heritage-gold">UK</span>
                  </span>
                </div>
              </Link>
              <p className="mt-4 text-base text-primary-foreground/80 leading-relaxed">
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
                      className="text-base text-primary-foreground/80 hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm"
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
                      className="text-base text-primary-foreground/80 hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm"
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
              <address className="not-italic flex flex-col gap-4">

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-heritage-gold shrink-0" aria-hidden="true" />
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                    className="text-base text-primary-foreground/80 hover:text-gold transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-heritage-gold shrink-0" aria-hidden="true" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-base text-primary-foreground/80 hover:text-gold transition-colors break-all"
                  >
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
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
            <p className="text-base text-primary-foreground/60">
              &copy; {currentYear} {contactInfo.businessName}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                onClick={(e) => handleLinkClick(e, '/privacy')}
                className="text-base text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                onClick={(e) => handleLinkClick(e, '/terms')}
                className="text-base text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
