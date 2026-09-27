import React from 'react'
import { Clock, PoundSterling, Award, Truck, CheckCircle2 } from 'lucide-react'

export function AuthoritySignals() {
  const signals = [
    {
      icon: Clock,
      title: 'Same-Day Payout',
      detail: 'Funds issued within 24 hours of stamp verification via Bank Transfer or Cheque.',
    },
    {
      icon: Truck,
      title: '£50,000 Insured Transit',
      detail: 'Fully covered via Royal Mail Special Delivery with bespoke courier for high-value lots.',
    },
    {
      icon: PoundSterling,
      title: '0% Seller Fees',
      detail: 'Zero auction commissions, zero listing fees. What we offer is 100% what you receive.',
    },
    {
      icon: Award,
      title: '10+ Years Experience',
      detail: 'Specialist British philatelic appraisers offering fair, catalog-backed market valuations.',
    },
  ]

  return (
    <section 
      className="relative z-20 -mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      aria-label="Key Service Facts & Guarantees"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-6 md:p-8">
        <div className="text-center md:text-left mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-forest-green">
              Fast, Fair &amp; Transparent
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy dark:text-white mt-1">
              Guaranteed British Philatelic Standards
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-700 shrink-0 self-center md:self-auto">
            <CheckCircle2 className="h-4 w-4 text-forest-green" />
            <span>UK-Based Physical Inspection Desk</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signals.map((item, idx) => {
            const Icon = item.icon
            return (
              <div 
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="bg-forest-green/10 text-forest-green p-3 rounded-xl shrink-0">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
