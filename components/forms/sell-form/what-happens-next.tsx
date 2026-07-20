import { Clock, Search, HandCoins, Truck, Banknote } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const steps = [
  {
    icon: Clock,
    title: 'Submit Your Details',
    description: 'Complete this form with your collection information.',
  },
  {
    icon: Search,
    title: 'Expert Review',
    description: 'Our specialists review your submission within 1-12 hours.',
  },
  {
    icon: HandCoins,
    title: 'Receive Valuation',
    description: 'We provide a detailed, fair market valuation.',
  },
  {
    icon: Truck,
    title: 'Arrange Collection',
    description: 'If you accept, we organise secure, insured shipping.',
  },
  {
    icon: Banknote,
    title: 'Get Paid',
    description: 'Receive same-day payment upon collection arrival.',
  },
]

export function WhatHappensNext() {
  return (
    <Card className="bg-secondary/50 border-border sticky top-28">
      <CardHeader className="pb-4">
        <CardTitle className="font-serif text-lg">What Happens Next?</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative border-l border-border ml-4">
          {steps.map((step, index) => (
            <li key={step.title} className="mb-6 ml-6 last:mb-0">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-oxford-blue rounded-full -left-4">
                <step.icon className="w-4 h-4 text-gold" aria-hidden="true" />
              </span>
              <h4 className="font-medium text-primary text-sm">{step.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-forest-green mt-1.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">No obligation to sell.</strong> If our 
              valuation does not meet your expectations, simply decline with no cost to you.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
