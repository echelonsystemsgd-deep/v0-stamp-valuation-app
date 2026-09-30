"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Tag, 
  Layers, 
  CreditCard, 
  Search, 
  ShieldCheck, 
  History,
  Ban,
  XCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const readinessItems = [
  {
    title: "Stamp Classification",
    description: "Identify if your collection consists of barcoded, commemorative, or vintage definitive stamps for accurate valuation.",
    icon: Tag,
    color: "text-gold",
    bgColor: "bg-gold/10"
  },
  {
    title: "Presentation & Format",
    description: "We value stamps in all formats: full sheets, presentation packs, booklets, or loose stamps in original condition.",
    icon: Layers,
    color: "text-forest-green",
    bgColor: "bg-forest-green/10"
  },
  {
    title: "Secure Payout Methods",
    description: "Choose your preferred secure payment method, including direct bank transfers (BACS) or PayPal, for same-day payout.",
    icon: CreditCard,
    color: "text-oxford-blue",
    bgColor: "bg-oxford-blue/10"
  },
  {
    title: "Condition Grading",
    description: "Mint never hinged (MNH) stamps carry the highest value. We assess gum quality, perforations, and preservation.",
    icon: Search,
    color: "text-gold",
    bgColor: "bg-gold/10"
  },
  {
    title: "Insured Protection",
    description: "Every collection is fully insured from the moment it leaves your hands until the final payout is confirmed.",
    icon: ShieldCheck,
    color: "text-forest-green",
    bgColor: "bg-forest-green/10"
  },
  {
    title: "Expert Valuation",
    description: "Our stamp valuation experts provide a detailed breakdown of your collection's market value based on catalogue rates.",
    icon: History,
    color: "text-oxford-blue",
    bgColor: "bg-oxford-blue/10"
  }
]

export const ValuationReadiness = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32 overflow-hidden" aria-labelledby="readiness-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="readiness-heading" className="font-serif text-3xl md:text-4xl font-bold text-oxford-blue mb-6">
            Getting the Best Value for Your Stamps
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Preparation is key to a smooth valuation. Use our expert readiness guide to ensure your collection is organised for the maximum possible payout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {readinessItems.map((item, index) => (
            <Card 
              key={index} 
              className={cn(
                "group relative border-white/40 glassmorphism hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden",
                "reveal-hidden animate-fade-in-up"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300",
                  item.bgColor
                )}>
                  <item.icon className={cn("w-7 h-7", item.color)} />
                </div>
                <h3 className="text-xl font-serif font-bold text-oxford-blue mb-3 group-hover:text-forest-green transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 overflow-hidden border-burgundy/20 bg-burgundy/5 glassmorphism shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="bg-burgundy p-10 text-white flex flex-col justify-center items-center md:w-1/3 text-center">
                <Ban className="w-16 h-16 mb-4 opacity-90 animate-pulse-subtle" />
                <h3 className="text-white font-serif text-2xl lg:text-3xl font-bold">Our Purity Policy</h3>
                <p className="mt-2 text-white/80 text-sm">Quality Control Measures</p>
              </div>
              <div className="p-10 md:w-2/3">
                <p className="text-charcoal font-semibold text-lg mb-6">
                  To maintain the highest standards of inspection and quality, we strictly do not accept:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    "Forged or altered stamps",
                    "Heavy circular date stamps (CDS)",
                    "Damaged or torn stamps",
                    "Low-volume common fractionals",
                    "Used stamps without original gum",
                    "Counterfeit barcoded issues"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <XCircle className="w-5 h-5 text-burgundy mt-0.5 shrink-0 transition-transform group-hover:scale-125" />
                      <span className="text-muted-foreground font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-burgundy/10 flex justify-start">
                  <Button 
                    asChild 
                    variant="outline" 
                    className="group/btn h-12 px-6 border-forest-green/20 bg-forest-green/5 text-forest-green hover:bg-forest-green hover:text-white font-bold transition-all duration-300 rounded-xl"
                  >
                    <Link href="/sell-your-stamps" className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Unsure? Send a photo for a quick assessment</span>
                      <ArrowRight className="w-4 h-4 opacity-70 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
