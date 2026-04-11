import Link from 'next/link'
import { ClipboardList, Search, MessageSquare, Truck, ShieldCheck, Banknote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
    ctaText: 'Start Your Submission',
  },
  {
    icon: Search,
    title: 'Receive Your Free Valuation',
    description: 'Our expert philatelists will carefully review your submission. We examine the details and photos you provide to give you a fair, comprehensive valuation based on current market conditions.',
    tips: [
      'Valuations are typically provided within 48 hours',
      'We may request additional photos if needed',
      'All valuations are provided free of charge',
    ],
    ctaText: 'Request Your Valuation',
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
    ctaText: 'Sell Your Stamps',
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
    ctaText: 'Arrange Collection',
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
    ctaText: 'Sell Your Stamps',
  },
  {
    icon: Banknote,
    title: 'Receive Payment',
    description: 'Once the final valuation is agreed, we process your payment immediately. Most customers receive funds within 7 days of their collection arriving with us.',
    tips: [
      'Bank transfer to your UK account',
      'No hidden fees or deductions',
      'Full payment confirmation provided',
    ],
    ctaText: 'Start Selling Today',
  },
]

export function ProcessTimeline() {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" aria-hidden="true" />

      <div className="flex flex-col gap-8">
        {timelineSteps.map((step, index) => (
          <div key={step.title} className="relative flex gap-6">
            {/* Step Number Circle */}
            <div className="relative z-10 shrink-0">
              <div className="w-16 h-16 rounded-full bg-oxford-blue flex items-center justify-center shadow-lg">
                <step.icon className="w-7 h-7 text-gold" aria-hidden="true" />
              </div>
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-forest-green text-white text-sm font-bold flex items-center justify-center">
                {index + 1}
              </span>
            </div>

            {/* Content */}
            <Card className="flex-1">
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-semibold text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {step.description}
                </p>
                <ul className="flex flex-col gap-2">
                  {step.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-green mt-2 shrink-0" aria-hidden="true" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <Button asChild variant="outline" className="w-full sm:w-auto text-forest-green border-forest-green/30 hover:bg-forest-green hover:text-white transition-colors duration-300">
                    <Link href="/sell-your-stamps">
                      {step.ctaText}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
