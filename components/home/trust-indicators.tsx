import { CheckCircle, Shield, Clock, Award } from 'lucide-react'

const trustPoints = [
  {
    icon: Award,
    title: '25+ Years Experience',
    description: 'Decades of expertise in stamp valuation and philately',
  },
  {
    icon: Shield,
    title: 'UK-Based Experts',
    description: 'Professional valuers located throughout the United Kingdom',
  },
  {
    icon: CheckCircle,
    title: 'Fair Market Prices',
    description: 'Transparent valuations based on current market rates',
  },
  {
    icon: Clock,
    title: 'Fast & Secure',
    description: 'Quick valuations and insured shipping for your peace of mind',
  },
]

export function TrustIndicators() {
  return (
    <section className="py-16 lg:py-20 bg-oxford-blue" aria-labelledby="trust-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="trust-heading" className="sr-only">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                <point.icon className="w-7 h-7 text-gold" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {point.title}
              </h3>
              <p className="mt-2 text-sm text-white/70">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
