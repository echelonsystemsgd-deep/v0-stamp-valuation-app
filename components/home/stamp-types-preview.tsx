import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { buyingRates, getBuyingRateImageSrc, BUYING_RATE_GROUP_ORDER, type BuyingRateGroup } from '@/data/buying-rates'

/**
 * Pick the single best-rate (non-decimal) item from each group to show on the homepage.
 * This ensures we show the highest/most attractive rate per category rather than
 * an arbitrary raw slice which can include lower-rate Christmas items.
 */
function getBestItemPerGroup() {
  const seen = new Set<BuyingRateGroup>()
  const result = []
  // Sort by rate descending within each group, pick first occurrence of each group
  const sorted = [...buyingRates]
    .filter(item => !item.allowDecimal) // exclude face-value decimal items
    .sort((a, b) => b.rate - a.rate)

  for (const item of sorted) {
    if (!seen.has(item.group)) {
      seen.add(item.group)
      result.push(item)
    }
  }
  // Re-sort by group order for consistent display
  return result.sort((a, b) =>
    BUYING_RATE_GROUP_ORDER.indexOf(a.group) - BUYING_RATE_GROUP_ORDER.indexOf(b.group)
  )
}

const previewItems = getBestItemPerGroup()

export function StampTypesPreview() {
  return (
    <section className="py-28 lg:py-32" aria-labelledby="stamp-types-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 id="stamp-types-heading" className="text-navy">
              What We Buy
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              From modern unused postage to complete sheet collections, we purchase a wide variety of UK stamps at fair market percentages.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="shrink-0 border-navy text-navy hover:bg-navy hover:text-white"
          >
            <Link href="/what-we-buy">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewItems.map((product) => (
            <Card
              key={product.id}
              className="group flex flex-col h-full overflow-hidden border-border hover:border-forest-green/50 transition-all hover:shadow-lg"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-muted m-2">
                <div className="absolute inset-0 stamp-edge z-10 pointer-events-none opacity-50" />
                <Image
                  src={getBuyingRateImageSrc(product)}
                  alt={product.name}
                  fill
                  quality={90}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <CardContent className="p-5 flex flex-col flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-forest-green/70 mb-1">
                  {product.group}
                </p>
                <h3 className="font-serif text-lg font-semibold text-navy group-hover:text-forest-green transition-colors">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                <p className="mt-3 mb-4 text-base font-semibold text-forest-green">
                  Up to {product.rate * 100}% of Face Value
                </p>
                <div className="pt-4 mt-auto border-t border-border">
                  <Button asChild className="w-full bg-forest-green hover:bg-forest-green/90 text-white transition-all duration-300 group/btn">
                    <Link href="/sell-your-stamps" className="flex items-center justify-center gap-2 font-medium">
                      Sell your stamps
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
