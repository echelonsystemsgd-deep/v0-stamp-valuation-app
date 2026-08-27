import { BUSINESS_CONFIG } from './business'

export const mainNavigation = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'How to Sell', href: '/how-to-sell' },
  { label: 'What We Buy', href: '/what-we-buy' },
  { label: 'Contact Us', href: '/contact' },
] as const

export const footerNavigation = {
  services: [
    { label: 'Stamp Valuations', href: '/sell-your-stamps' },
    { label: 'What We Buy', href: '/what-we-buy' },
    { label: 'How to Sell', href: '/how-to-sell' },
  ],
  company: [
    { label: 'About Us', href: '/about-us' },
    { label: 'Contact', href: '/contact' },
  ],
  support: [
    { label: 'Instant Estimate', href: '/sell-your-stamps' },
    { label: 'Selling Guide', href: '/how-to-sell' },
    { label: 'Direct Inquiry', href: '/contact' },
  ],
} as const

export const contactInfo = {
  businessName: BUSINESS_CONFIG.legalName,
  address: `${BUSINESS_CONFIG.address.street}, ${BUSINESS_CONFIG.address.city}, ${BUSINESS_CONFIG.address.postalCode}`,
  phone: BUSINESS_CONFIG.phone,
  phoneRaw: BUSINESS_CONFIG.phoneRaw,
  email: BUSINESS_CONFIG.email,
  hours: BUSINESS_CONFIG.operatingHours.display,
  tagline: BUSINESS_CONFIG.tagline,
} as const

