import { Award, Check, MapPin, ShieldCheck, X, Clock, BadgePoundSterling } from 'lucide-react'

const pillars = [
  {
    icon: Award,
    title: '25+ years experience',
    body:
      'We have valued and purchased British and worldwide material through every market cycle. That longevity means steady judgement—not inflated promises.',
  },
  {
    icon: BadgePoundSterling,
    title: 'Fair market prices',
    body:
      'Offers reflect current demand for your stamps and albums, explained in plain English. See how we compare to common alternatives in the table below.',
  },
  {
    icon: MapPin,
    title: 'UK-based experts',
    body:
      'Your enquiry is handled by specialists who understand GB issues, Commonwealth, and albums. Domestic banking, clear contracts, and no overseas middlemen.',
  },
  {
    icon: ShieldCheck,
    title: 'Fast & secure',
    body:
      'Insured postage, tracked receipt, and prompt payment once we agree a price. We treat high-value lots with the same care as modest albums.',
  },
]

const comparisonRows: { label: string; us: boolean | 'partial'; them: boolean | 'partial' }[] = [
  { label: 'Offer tied to current buyer demand', us: true, them: 'partial' },
  { label: 'No seller commission or listing fees', us: true, them: false },
]

function CellIcon({ value }: { value: boolean | 'partial' }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center" title="Yes">
        <Check className="h-6 w-6 text-forest-green" strokeWidth={2.5} aria-hidden />
        <span className="sr-only">Yes</span>
      </span>
    )
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center" title="No">
        <X className="h-6 w-6 text-destructive" strokeWidth={2.5} aria-hidden />
        <span className="sr-only">No</span>
      </span>
    )
  }
  return (
    <span className="text-sm font-medium text-muted-foreground text-center block">
      Varies
    </span>
  )
}

export function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-24 bg-secondary" aria-labelledby="why-choose-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 id="why-choose-heading" className="text-primary">
            Why choose us
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Clarity and security matter—especially when parting with a collection you have kept for
            years. Here is what sets our service apart.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-12">
          {pillars.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full bg-oxford-blue flex items-center justify-center">
                <item.icon className="w-6 h-6 text-gold" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-primary">What we pay versus typical routes</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                Auction houses and general dealers serve a purpose—but fees, timing, and uncertainty
                differ. This is a simple side-by-side guide, not a guarantee of every outcome.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
              <Clock className="h-4 w-4 text-gold" aria-hidden />
              <span>
                <strong className="text-foreground">Us:</strong> often within ~7 days of receipt
              </span>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[520px] text-sm text-left border-collapse">
              <caption className="sr-only">
                Comparison of UK Stamp Valuations versus typical auction or high-street routes
              </caption>
              <thead>
                <tr className="bg-muted/80">
                  <th scope="col" className="p-4 font-semibold text-primary w-[40%]">
                    Question
                  </th>
                  <th scope="col" className="p-4 font-semibold text-primary text-center w-[30%]">
                    UK Stamp Valuations
                  </th>
                  <th scope="col" className="p-4 font-semibold text-primary text-center w-[30%]">
                    Typical auction / dealer
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <th scope="row" className="p-4 font-medium text-foreground text-left align-middle">
                      {row.label}
                    </th>
                    <td className="p-4 align-middle text-center">
                      <CellIcon value={row.us} />
                    </td>
                    <td className="p-4 align-middle text-center">
                      <CellIcon value={row.them} />
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-border bg-muted/30">
                  <th scope="row" className="p-4 font-medium text-foreground text-left align-top">
                    Payment timing (typical)
                  </th>
                  <td className="p-4 align-middle text-center text-sm text-foreground">
                    ~7 days after we agree your offer
                  </td>
                  <td className="p-4 align-middle text-center text-sm text-muted-foreground">
                    Often several weeks to months (hammer + fees + settlement)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
