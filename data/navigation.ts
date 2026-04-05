export const mainNavigation = [
  { label: 'Home', href: '/' },
  { label: 'How to Sell', href: '/how-to-sell' },
  { label: 'What We Buy', href: '/what-we-buy' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact', href: '/contact' },
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
} as const

export const contactInfo = {
  businessName: 'UK Stamp Valuations Ltd',
  address: '123 Philately House, London, EC1A 1AA',
  phone: '+44 (0)20 1234 5678',
  email: 'info@ukstampvaluations.co.uk',
  hours: 'Monday - Friday: 9am - 5pm',
} as const
