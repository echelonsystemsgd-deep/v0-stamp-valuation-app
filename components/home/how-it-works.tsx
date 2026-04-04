import { ClipboardList, Search, Banknote } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: ClipboardList,
    title: 'Tell Us About Your Collection',
    description:
      'Fill out our simple form with details about your stamps. Include photos if you have them for a more accurate valuation.',
  },
  {
    number: '2',
    icon: Search,
    title: 'Receive Expert Valuation',
    description:
      'Our specialists will carefully review your submission and provide a detailed, fair market valuation within 48 hours.',
  },
  {
    number: '3',
    icon: Banknote,
    title: 'Get Paid Quickly',
    description:
      'Accept our offer and receive secure payment within 7 days. We handle all shipping and insurance arrangements.',
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
          <p className="mt-4 text-lg text-muted-foreground">
            Selling your stamps has never been easier. Our straightforward process ensures you receive a fair valuation with minimal hassle.
          </p>
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
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
