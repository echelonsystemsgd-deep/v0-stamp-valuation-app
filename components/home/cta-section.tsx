import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-20 lg:py-24" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-secondary rounded-xl p-8 lg:p-12 text-center">
          <h2 id="cta-heading" className="text-primary max-w-2xl mx-auto text-balance">
            Ready to Discover Your Collection&apos;s Value?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Get a free, no-obligation valuation from our expert team. We make selling your stamps simple and stress-free.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-forest-green hover:bg-forest-green/90 text-white font-semibold h-14 px-8 text-lg"
            >
              <Link href="/sell-your-stamps">Get Your Free Valuation</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold h-14 px-8 text-lg"
            >
              <Link href="/how-to-sell">Learn How It Works</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No obligation to sell. Valuations typically provided within 48 hours.
          </p>
        </div>
      </div>
    </section>
  )
}
