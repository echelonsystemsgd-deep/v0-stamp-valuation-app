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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sellyourstamps.co.uk'),
  title: {
    default: 'Sell Your Stamps UK | Professional Stamp Valuation & Buying',
    template: '%s | Sell Your Stamps UK',
  },
  description: 'The UK\'s most trusted stamp valuation and buying service. Heritage-focused, expert-led, and committed to fair pricing for your stamp collection.',
  keywords: ['sell stamps UK', 'stamp valuation', 'stamp buyers', 'Great Britain stamps', 'professional philately', 'stamp collection value'],
  authors: [{ name: 'Sell Your Stamps UK' }],
  creator: 'Sell Your Stamps UK',
  publisher: 'Sell Your Stamps UK',
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
    url: 'https://sellyourstamps.co.uk',
    siteName: 'Sell Your Stamps UK',
    title: 'Sell Your Stamps UK | Professional Stamp Valuation & Buying',
    description: 'Expert UK-based stamp valuations and buying service with over 25 years of experience. Get a fair price for your collection today.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Sell Your Stamps UK - Professional Stamp Buying Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sell Your Stamps UK | Professional Stamp Valuation & Buying',
    description: 'Expert UK-based stamp valuations and buying service with over 25 years of experience.',
    creator: '@SellYourStampsUK',
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
