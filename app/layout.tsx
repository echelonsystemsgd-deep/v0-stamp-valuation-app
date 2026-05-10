import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { BackToTop } from '@/components/layout/back-to-top'
import { StickyCTA } from '@/components/layout/sticky-cta'
import { JsonLd } from '@/components/seo/json-ld'
import { SupportPanel } from '@/components/valuation/expert-panel'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ukstampvaluations.co.uk'),
  title: {
    default: 'UK Stamp Valuations | Professional Stamp Buying Service',
    template: '%s | UK Stamp Valuations',
  },
  description: 'Get expert valuations for your stamp collection from UK-based specialists. 25+ years experience, fair market prices, and no obligation to sell.',
  keywords: ['stamp valuation', 'sell stamps UK', 'stamp collection', 'philately', 'Penny Black', 'stamp buyers', 'Great Britain stamps'],
  authors: [{ name: 'UK Stamp Valuations' }],
  creator: 'UK Stamp Valuations',
  publisher: 'UK Stamp Valuations',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://ukstampvaluations.co.uk',
    siteName: 'UK Stamp Valuations',
    title: 'UK Stamp Valuations | Professional Stamp Buying Service',
    description: 'Expert UK-based stamp valuations and buying service with over 25 years of experience. Get a fair price for your collection today.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'UK Stamp Valuations - Professional Stamp Buying Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Stamp Valuations | Professional Stamp Buying Service',
    description: 'Expert UK-based stamp valuations and buying service with over 25 years of experience.',
    creator: '@UKStampVal',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B263B',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <SupportPanel />
        <StickyCTA />
        <BackToTop />
        <JsonLd type="LocalBusiness" data={{}} />
      </body>
    </html>
  )
}
