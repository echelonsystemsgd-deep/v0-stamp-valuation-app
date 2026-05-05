import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AboutSummary() {
  return (
    <section
      className="py-20 lg:py-24 bg-white border-b border-border/60"
      aria-labelledby="about-summary-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-forest-green">
          About us
        </p>
        <h2
          id="about-summary-heading"
          className="mt-3 font-serif text-3xl md:text-4xl font-bold text-primary text-balance"
        >
          A quiet standard of expertise, built in Britain
        </h2>
        <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed text-left md:text-center md:text-balance">
          <p>
            For over twenty-five years, we have helped families and collectors across the UK
            understand the true value of their stamp collections—without pressure, jargon, or obligation.
          </p>
          <p>
            We are an independent UK-based valuation and buying service, offering a straightforward and reliable way to sell unwanted postage stamps. Whether you have a single album or a lifetime collection, our approach remains the same: careful assessment, clear communication, and fair market-based offers.
          </p>
          <p>
            Unlike online marketplaces, there are no listing fees, no uncertainty, and no dealing with unknown buyers. We handle the process from start to finish—simply, securely, and professionally.
          </p>
          <p>
            Our valuers combine deep philatelic knowledge with a practical, no-nonsense service: transparent pricing, fully insured handling, and the respect your collection deserves.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="mt-10 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Link href="/about-us">Read our full story</Link>
        </Button>
      </div>
    </section>
  )
}
