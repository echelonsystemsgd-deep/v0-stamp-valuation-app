import Link from 'next/link'
import { Check, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ComparisonFeature = {
  title: string;
  us: string;
  usIcon: boolean | 'partial';
  them: string;
  themIcon: boolean | 'partial';
};

const comparisonFeatures: ComparisonFeature[] = [
  {
    title: 'Selling & Listing Fees',
    us: 'None — 100% free appraisal',
    usIcon: true,
    them: 'Up to 30% commission + hidden fees',
    themIcon: false,
  },
  {
    title: 'Payment Speed',
    us: 'Fast — typically within ~7 days',
    usIcon: true,
    them: 'Weeks to months (hammer + fees + settlement)',
    themIcon: false,
  },
  {
    title: 'Valuation Model',
    us: 'Fair market price tied to active buyer demand',
    usIcon: true,
    them: 'Varies heavily by auction room audience',
    themIcon: 'partial',
  },
  {
    title: 'Expertise & Security',
    us: '25+ years experience, UK-based & fully insured',
    usIcon: true,
    them: 'Varies — Risk often left to the seller',
    themIcon: 'partial',
  },
]

function IconIndicator({ type }: { type: boolean | 'partial' }) {
  if (type === true) {
    return <Check className="h-5 w-5 text-forest-green shrink-0" strokeWidth={2.5} aria-hidden />
  }
  if (type === false) {
    return <X className="h-5 w-5 text-destructive shrink-0" strokeWidth={2.5} aria-hidden />
  }
  return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" strokeWidth={2.5} aria-hidden />
}

export function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-secondary" aria-labelledby="why-choose-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-center mx-auto mb-16 lg:mb-20">
          <h2 id="why-choose-heading" className="font-serif text-3xl md:text-4xl font-bold text-navy text-balance">
            Why Choose Us
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed text-balance">
            Clarity and security matter—especially when parting with a collection you have kept for
            years. See how our streamlined approach compares to traditional routes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
          {/* Us Section */}
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10 rounded-2xl bg-card border-2 border-forest-green/20 shadow-xl lg:scale-105 relative overflow-hidden z-10 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-forest-green/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="mb-2 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest-green/10 text-forest-green rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
                Recommended Choice
              </div>
              <h3 className="text-2xl font-bold text-primary">Sell Your Stamps UK</h3>
              <p className="text-sm text-muted-foreground mt-2 text-balance">A seamless, fully transparent selling experience</p>
            </div>
            
            <div className="flex flex-col gap-6 relative">
              {comparisonFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="mt-0.5 p-1 rounded-full bg-forest-green/10 shrink-0 transition-transform group-hover:scale-110 duration-200">
                    <IconIndicator type={feature.usIcon} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary text-base">{feature.title}</h4>
                    <p className="text-base text-muted-foreground mt-1 leading-relaxed transition-colors duration-200 group-hover:text-primary">
                      {feature.us}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Them Section */}
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10 rounded-2xl bg-muted/30 border border-border">
            <div className="mb-2">
              <h3 className="text-2xl font-bold text-foreground">Typical Auction / Dealer</h3>
              <p className="text-sm text-muted-foreground mt-1">The traditional route with hidden costs & wait times</p>
            </div>
            
            <div className="flex flex-col gap-6">
              {comparisonFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="mt-0.5 p-1 rounded-full bg-background/50 border border-border shrink-0 transition-colors group-hover:bg-background/80">
                    <IconIndicator type={feature.themIcon} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-base">{feature.title}</h4>
                    <p className="text-base text-muted-foreground mt-1 leading-relaxed transition-colors duration-200">
                      {feature.them}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA section removed to avoid redundancy with InlineSellCTA on the landing page */}
      </div>
    </section>
  )
}
