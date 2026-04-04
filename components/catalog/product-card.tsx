'use client'

import * as React from 'react'
import Image from 'next/image'
import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { StampProduct } from '@/data/stamps'

interface ProductCardProps {
  product: StampProduct
  quantity?: number
  onQuantityChange?: (id: string, quantity: number) => void
}

export function ProductCard({ product, quantity = 0, onQuantityChange }: ProductCardProps) {
  const hasQuantityCounter = product.pricePerUnit !== undefined

  const handleIncrement = () => {
    onQuantityChange?.(product.id, quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange?.(product.id, quantity - 1)
    }
  }

  const subtotal = hasQuantityCounter && product.pricePerUnit 
    ? quantity * product.pricePerUnit 
    : 0

  return (
    <Card className="group overflow-hidden border-border hover:border-forest-green/50 transition-all hover:shadow-lg h-full flex flex-col">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-oxford-blue text-white text-xs font-medium px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
      </div>
      <CardContent className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg font-semibold text-primary group-hover:text-forest-green transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
          {product.description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-border">
          {hasQuantityCounter ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Price per item
                </span>
                <span className="font-semibold text-forest-green">
                  £{product.pricePerUnit}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={handleDecrement}
                    disabled={quantity === 0}
                    aria-label="Decrease quantity"
                    className="h-9 w-9"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={handleIncrement}
                    aria-label="Increase quantity"
                    className="h-9 w-9"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {subtotal > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm font-medium">Subtotal</span>
                  <span className="font-bold text-lg text-forest-green">
                    £{subtotal}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Price range</span>
              <span className="font-semibold text-forest-green">
                {product.priceRange}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
