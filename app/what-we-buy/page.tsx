import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductGrid } from '@/components/catalog/product-grid'

export const metadata: Metadata = {
  title: 'What We Buy',
  description: 'View the types of stamps and collections we purchase. From Penny Blacks to complete albums, we buy a wide variety of philatelic items at fair market prices.',
}

export default function WhatWeBuyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {/* Page Header */}
        <section className="bg-oxford-blue py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-white">What We Buy</h1>
              <p className="mt-4 text-lg text-white/80 leading-relaxed">
                We purchase a wide variety of stamps and philatelic items at fair market prices. 
                Browse our categories below to see what your collection might be worth.
              </p>
            </div>
          </div>
        </section>

        {/* Product Catalog */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ProductGrid />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
