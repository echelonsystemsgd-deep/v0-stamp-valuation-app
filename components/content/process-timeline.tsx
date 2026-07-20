import Link from 'next/link'
import { ClipboardList, Search, MessageSquare, Truck, ShieldCheck, Banknote, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const timelineSteps = [
  {
    icon: ClipboardList,
    title: 'Submit Your Collection Details',
    description: 'Fill out our simple online form with information about your stamps. Include details about the type of collection, approximate quantity, and era. The more information you provide, the more accurate our initial assessment will be.',
    tips: [
      'Describe the overall condition of your collection',
      'Mention any stamps you believe may be particularly valuable',
      'Include how the collection was stored over the years',
    ],
  },
  {
    icon: Search,
    title: 'Receive Your Free Valuation',
    description: 'Our expert philatelists will carefully review your submission. We examine the details and photos you provide to give you a fair, comprehensive valuation based on current market conditions.',
    tips: [
      'Valuations are typically provided within 1-12 hours',
      'We may request additional photos if needed',
      'All valuations are provided free of charge',
    ],
  },
  {
    icon: MessageSquare,
    title: 'Review & Decide',
    description: 'Take your time to consider our offer. There is absolutely no obligation to sell. We are happy to answer any questions you may have about the valuation or the selling process.',
    tips: [
      'No pressure, no time limits',
      'Ask us anything about the valuation',
      'Request a detailed breakdown if needed',
    ],
  },
  {
    icon: Truck,
    title: 'Arrange Secure Collection',
    description: 'If you decide to proceed, we will arrange for your collection to be collected securely. We use trusted courier services and your items are fully insured from the moment they leave your hands.',
    tips: [
      'Free collection from your door',
      'Fully insured up to £50,000',
      'Track your shipment online',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Expert Verification',
    description: 'Once we receive your collection, our specialists conduct a thorough in-person examination. If the condition matches the description, we confirm the agreed price. If we discover additional value, we will increase our offer.',
    tips: [
      'Professional examination by qualified philatelists',
      'Final valuation confirmed within 2 working days',
      'We only adjust downward if condition was misrepresented',
    ],
  },
  {
    icon: Banknote,
    title: 'Receive Payment',
    description: 'Once the final valuation is agreed, we process your payment immediately. Most customers receive funds same day of their collection arriving with us.',
    tips: [
      'Bank transfer to your UK account',
      'No hidden fees or deductions',
      'Full payment confirmation provided',
    ],
  },
]

export function ProcessTimeline() {
  return (
    <div className="relative">
      {/* Gradient timeline line */}
      <div
        className="absolute left-8 top-8 bottom-8 w-0.5 hidden md:block"
        style={{ background: 'linear-gradient(to bottom, var(--color-forest-green, #2d6a4f), transparent)' }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-6">
        {timelineSteps.map((step, index) => {
          const isLast = index === timelineSteps.length - 1
          return (
            <div key={step.title} className="relative flex gap-6 group">

              {/* Icon circle */}
              <div className="relative z-10 shrink-0">
                <div className="w-16 h-16 rounded-full bg-oxford-blue flex items-center justify-center shadow-lg ring-4 ring-background group-hover:ring-forest-green/20 transition-all duration-300">
                  <step.icon className="w-7 h-7 text-heritage-gold" aria-hidden="true" />
                </div>
                {/* Step number badge */}
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-forest-green text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {index + 1}
                </span>
              </div>

              {/* Card */}
              <div
                className={`flex-1 rounded-xl border bg-card shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5 overflow-hidden ${
                  isLast
                    ? 'border-forest-green/30 bg-forest-green/5'
                    : 'border-border'
                }`}
              >
                {/* Coloured left accent bar */}
                <div className={`h-1 w-full ${isLast ? 'bg-forest-green' : 'bg-oxford-blue/20 group-hover:bg-forest-green/40 transition-colors duration-300'}`} />

                <div className="p-6">
                  {/* Step label */}
                  <p className="text-xs font-bold uppercase tracking-widest text-forest-green mb-1">
                    Step {index + 1}
                  </p>

                  <h3 className="font-serif text-xl font-bold text-primary mb-3">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed mb-5">
                    {step.description}
                  </p>

                  {/* Tips */}
                  <ul className="flex flex-col gap-2.5">
                    {step.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-forest-green/10 flex items-center justify-center" aria-hidden="true">
                          <Check className="w-2.5 h-2.5 text-forest-green" strokeWidth={3} />
                        </span>
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Single CTA at the bottom */}
      <div className="mt-10 flex justify-start pl-[5.5rem]">
        <Button
          asChild
          size="lg"
          className="bg-forest-green hover:bg-forest-green/90 text-white font-bold h-14 px-8 shadow-lg shadow-forest-green/20 group"
        >
          <Link href="/sell-your-stamps" className="flex items-center gap-2">
            Start Selling Today
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
