import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ExpertPanel } from '@/components/valuation/expert-panel'
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
  title: {
    default: 'UK Stamp Valuations | Professional Stamp Buying Service',
    template: '%s | UK Stamp Valuations',
  },
  description: 'Get expert valuations for your stamp collection from UK-based specialists. 25+ years experience, fair market prices, and no obligation to sell.',
  keywords: ['stamp valuation', 'sell stamps UK', 'stamp collection', 'philately', 'Penny Black', 'stamp buyers'],
  authors: [{ name: 'UK Stamp Valuations' }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'UK Stamp Valuations',
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
        <ExpertPanel />
      </body>
    </html>
  )
}
