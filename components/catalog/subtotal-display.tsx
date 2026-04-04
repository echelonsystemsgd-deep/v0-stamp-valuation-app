import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SubtotalDisplayProps {
  totalItems: number
  totalValue: number
  compact?: boolean
}

export function SubtotalDisplay({ totalItems, totalValue, compact = false }: SubtotalDisplayProps) {
  if (compact) {
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-forest-green/10 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-forest-green" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
            <p className="text-lg font-bold text-forest-green">£{totalValue}</p>
          </div>
        </div>
        <Button
          asChild
          className="bg-forest-green hover:bg-forest-green/90 text-white font-semibold"
        >
          <Link href="/sell-your-stamps">Get Valuation</Link>
        </Button>
      </div>
    )
  }

  return (
    <Card className={cn('border-forest-green/30')}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-serif">
          <ShoppingBag className="w-5 h-5 text-forest-green" />
          Estimate Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {totalItems === 0 ? (
          <p className="text-muted-foreground text-sm">
            Add items with quantity counters to see an estimate of their potential value.
          </p>
        ) : (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items selected</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-4">
              <span className="font-medium">Estimated Total</span>
              <span className="text-xl font-bold text-forest-green">£{totalValue}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This is a preliminary estimate. Final valuations may vary based on condition, rarity, and other factors.
            </p>
          </>
        )}
        <Button
          asChild
          className="w-full bg-forest-green hover:bg-forest-green/90 text-white font-semibold h-12 mt-2"
        >
          <Link href="/sell-your-stamps">Get Your Free Valuation</Link>
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          No obligation to sell
        </p>
      </CardContent>
    </Card>
  )
}
