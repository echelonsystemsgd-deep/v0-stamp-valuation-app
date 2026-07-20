import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AboutSummary() {
  return (
    <section
      className="py-12 md:py-24 lg:py-32 bg-white border-b border-border/60 overflow-hidden relative"
      aria-labelledby="about-summary-heading"
    >
      <div className="absolute inset-0 bg-cancellation-lines opacity-5 pointer-events-none" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-forest-green">
          Our Heritage
        </p>
        <h2
          id="about-summary-heading"
          className="mt-3 font-serif text-3xl md:text-4xl font-bold text-navy text-balance"
        >
          We are one of the UK’s leading buyers and resellers of GB postage stamps.
        </h2>
        <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed text-left md:text-center md:text-balance">
          <p>
            Our aim is to remove the stress and uncertainty from selling your unused postage stamps. As a fully independent UK-based company, we provide a straightforward and efficient way to turn your stamps into cash.
          </p>
          <p>
            Rather than spending time on platforms like eBay or Amazon—dealing with fees, delays, and unreliable buyers—we offer a simple alternative: we purchase your stamps directly in one transaction, with prompt and secure payment.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="mt-10 border-navy text-navy hover:bg-navy hover:text-white"
        >
          <Link href="/about-us">Read our full story</Link>
        </Button>
      </div>
    </section>
  )
}
