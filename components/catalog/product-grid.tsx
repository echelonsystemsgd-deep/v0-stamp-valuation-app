'use client'

import * as React from 'react'
import { ProductCard } from './product-card'
import { SubtotalDisplay } from './subtotal-display'
import { stampProducts, stampCategories, type StampCategory } from '@/data/stamps'
import { cn } from '@/lib/utils'

export function ProductGrid() {
  const [quantities, setQuantities] = React.useState<Record<string, number>>({})
  const [activeCategory, setActiveCategory] = React.useState<StampCategory | 'All'>('All')

  const handleQuantityChange = (id: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: quantity,
    }))
  }

  const filteredProducts = activeCategory === 'All'
    ? stampProducts
    : stampProducts.filter((p) => p.category === activeCategory)

  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0)
  const totalValue = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const product = stampProducts.find((p) => p.id === id)
    if (product?.pricePerUnit) {
      return sum + product.pricePerUnit * qty
    }
    return sum
  }, 0)

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1">
        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveCategory('All')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                activeCategory === 'All'
                  ? 'bg-oxford-blue text-white'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              )}
            >
              All Categories
            </button>
            {stampCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring whitespace-nowrap',
                  activeCategory === category
                    ? 'bg-oxford-blue text-white'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={quantities[product.id] || 0}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-28">
          <SubtotalDisplay totalItems={totalItems} totalValue={totalValue} />
        </div>
      </div>

      {/* Sticky Footer - Mobile */}
      {totalItems > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border p-4 shadow-lg">
          <SubtotalDisplay totalItems={totalItems} totalValue={totalValue} compact />
        </div>
      )}
    </div>
  )
}
