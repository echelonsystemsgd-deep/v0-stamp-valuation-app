import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SellForm } from '@/components/forms/sell-form'

export const metadata: Metadata = {
  title: 'Sell Your Stamps',
  description: 'Get a free, no-obligation valuation for your stamp collection. Our UK-based experts will provide a fair market assessment within 48 hours.',
}

export default function SellYourStampsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {/* Page Header */}
        <section className="bg-oxford-blue py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-white">Sell Your Stamps</h1>
              <p className="mt-4 text-lg text-white/80 leading-relaxed">
                Complete the form below to receive a free, no-obligation valuation 
                from our expert team. We will respond within 48 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SellForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
