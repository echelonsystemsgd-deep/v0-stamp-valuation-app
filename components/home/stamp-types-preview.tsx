import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { buyingRates, getBuyingRateImageSrc } from '@/data/buying-rates'

export function StampTypesPreview() {
  return (
    <section className="py-20 lg:py-24" aria-labelledby="stamp-types-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 id="stamp-types-heading" className="text-primary">
              What We Buy
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              From modern unused postage to complete sheet collections, we purchase a wide variety of UK stamps at fair market percentages.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link href="/what-we-buy">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {buyingRates.slice(0, 6).map((product) => (
            <Card
              key={product.id}
              className="group flex flex-col h-full overflow-hidden border-border hover:border-forest-green/50 transition-all hover:shadow-lg"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-muted">
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
                <h3 className="font-serif text-lg font-semibold text-primary group-hover:text-forest-green transition-colors">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                <p className="mt-3 mb-4 text-base font-semibold text-forest-green">
                  {product.rate * 100}% of Face Value
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
