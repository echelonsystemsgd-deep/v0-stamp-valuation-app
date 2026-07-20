import { ClipboardList, Package, Banknote } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: ClipboardList,
    title: 'Request a Valuation',
    description: [
      'Use our online form—it\'s the quickest way to get started. Works perfectly for barcoded booklets, sheets, and collections of all sizes. For larger or more varied collections, contact us directly with as much detail as possible for an accurate valuation.',
    ],
  },
  {
    number: '2',
    icon: Package,
    title: 'Send Your Stamps',
    description: [
      'If you\'re happy with the valuation, send your stamps to us for review. We recommend Royal Mail Special Delivery / Signed For Service so your items are fully insured and securely delivered straight to our team.',
    ],
  },
  {
    number: '3',
    icon: Banknote,
    title: 'Receive Your Payment',
    description: [
      'Once your stamps arrive, we aim to review and process them promptly—often on the same day. Payment is issued shortly after, along with a confirmation email. Fast, transparent, and reliable from start to finish.',
    ],
  },
]

export function HowItWorks() {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-white" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 id="how-it-works-heading" className="font-serif text-3xl md:text-4xl font-bold text-navy text-balance">
            How to Sell Your Stamps
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step Number & Icon */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-oxford-blue flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-gold" aria-hidden="true" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-forest-green text-white font-bold flex items-center justify-center text-lg">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <h3 className="mt-6 text-xl font-semibold text-navy">
                {step.title}
              </h3>
              <div className="mt-4 text-muted-foreground leading-relaxed space-y-4">
                {step.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
