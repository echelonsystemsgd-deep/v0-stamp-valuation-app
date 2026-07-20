import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-12 md:py-24" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-secondary rounded-xl p-8 lg:p-12 text-center">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-primary max-w-2xl mx-auto text-balance">
            Send an Enquiry
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            If you have any questions, our team is always happy to assist.
          </p>
          <p className="mt-3 text-sm text-muted-foreground italic max-w-2xl mx-auto">
            Please note, we do not purchase unsorted collections, non-GB stamps, pre-decimal issues, used stamps, or counterfeit items.
          </p>
          <p className="mt-4 text-base text-foreground max-w-2xl mx-auto leading-relaxed">
            We are committed to providing a fair, efficient, and reliable service—ensuring a smooth process and prompt payment for your stamps.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-forest-green hover:bg-forest-green/90 text-white font-semibold h-14 px-8 text-lg"
            >
              <Link href="/sell-your-stamps">Sell Your Stamps Today</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-navy text-navy hover:bg-navy hover:text-white font-semibold h-14 px-8 text-lg"
            >
              <Link href="/sell-your-stamps">Request a Free Valuation</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
