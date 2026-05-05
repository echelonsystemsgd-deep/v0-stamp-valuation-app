import { ClipboardList, Package, Banknote } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: ClipboardList,
    title: 'Request a Valuation',
    description: [
      'Use our online form wherever possible—it’s the quickest and simplest way to get started. This works particularly well for standard and large letter barcoded booklets and sheets, including stamps received from swap-out schemes, surveys, compensation, or seasonal distributions.',
      'Our form provides a fast, no-obligation estimate without the need for back-and-forth communication. For larger or more varied collections, you can still use the form, or contact us directly with as much detail as possible. This allows us to assess your stamps properly and respond with an accurate valuation.',
      'Providing clear information from the outset helps us give you the most efficient service.'
    ],
  },
  {
    number: '2',
    icon: Package,
    title: 'Send Your Stamps',
    description: [
      'If you’re happy with the valuation, you can send your stamps to us for review. We recommend using Royal Mail services—particularly Special Delivery—so your items are fully insured and securely delivered.',
      'This ensures your collection arrives safely and can be processed without delay.'
    ],
  },
  {
    number: '3',
    icon: Banknote,
    title: 'Receive Your Payment',
    description: [
      'Once your stamps arrive, we aim to review and process them promptly—often on the same day. Payments are typically issued shortly after, along with a confirmation email for your records.',
      'Our goal is to make the entire process smooth, transparent, and reliable from start to finish.'
    ],
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-24 bg-secondary" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 id="how-it-works-heading" className="text-primary">
            How It Works
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
              <h3 className="mt-6 text-xl font-semibold text-primary">
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
