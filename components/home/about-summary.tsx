import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AboutSummary() {
  return (
    <section
      className="py-28 lg:py-32 bg-white border-b border-border/60 overflow-hidden"
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
          We are one of the UK’s leading buyers and resellers of GB postage stamps.
        </h2>
        <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed text-left md:text-center md:text-balance">
          <p>
            Our aim is to remove the stress and uncertainty from selling your unused postage stamps. As a fully independent UK-based company, we provide a straightforward and efficient way to turn your stamps into value.
          </p>
          <p>
            Rather than spending time on platforms like eBay or Amazon—dealing with fees, delays, and unreliable buyers—we offer a simple alternative: we purchase your stamps directly in one transaction, with prompt and secure payment.
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
