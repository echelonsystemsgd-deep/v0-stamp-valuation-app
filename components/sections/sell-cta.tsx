'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Tag, BadgeCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface InlineSellCTAProps {
  title?: string
  description?: string
  variant?: 'simple' | 'featured' | 'dark'
  className?: string
}

export function InlineSellCTA({ 
  variant = 'simple',
  className = ""
}: InlineSellCTAProps) {
  
  if (variant === 'featured') {
    return (
      <section className={`my-12 ${className}`}>
        <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-forest-green/10 -rotate-45 translate-x-12 -translate-y-12 hidden sm:block" />
          <CardContent className="p-8 sm:p-12">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary mb-4 leading-tight">Send an Enquiry</h2>
              <p className="text-lg text-muted-foreground mb-3 leading-relaxed">
                If you have any questions, our team is always happy to assist.
              </p>
              <p className="text-sm text-muted-foreground italic mb-6 leading-relaxed">
                Please note, we do not purchase unsorted collections, non-GB stamps, pre-decimal issues, used stamps, or counterfeit items.
              </p>
              <div className="mb-8 border-l-4 border-forest-green pl-4">
                <p className="text-sm text-foreground leading-relaxed">
                  We are committed to providing a fair, efficient, and reliable service—ensuring a smooth process and prompt payment for your stamps.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-forest-green hover:bg-forest-green/90 text-white font-bold h-14 px-8 group"
                >
                  <Link href="/sell-your-stamps" className="flex items-center gap-2">
                    Sell Your Stamps Today
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Link 
                  href="/how-to-sell" 
                  className="text-primary font-semibold hover:text-forest-green transition-colors py-2 flex items-center gap-1 underline underline-offset-4 decoration-primary/30"
                >
                  See how the process works
                </Link>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-primary/10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: BadgeCheck, text: "UK Master Valuers" },
                { icon: Zap, text: "Results within 48h" },
                { icon: Tag, text: "Highest Market Rates" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-forest-green" />
                  <span className="text-sm font-medium text-primary/80">{item.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (variant === 'dark') {
    return (
      <section className={`my-12 ${className}`}>
        <div className="bg-primary rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Send an Enquiry</h2>
          <p className="text-white/80 mb-3 max-w-xl mx-auto">
            If you have any questions, our team is always happy to assist.
          </p>
          <p className="text-white/60 text-sm italic mb-6 max-w-xl mx-auto">
            Please note, we do not purchase unsorted collections, non-GB stamps, pre-decimal issues, used stamps, or counterfeit items.
          </p>
          <div className="mb-8 max-w-2xl mx-auto">
            <p className="text-sm text-white/90 leading-relaxed">
              We are committed to providing a fair, efficient, and reliable service—ensuring a smooth process and prompt payment for your stamps.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-forest-green border-none hover:bg-forest-green/90 text-white font-bold h-14 px-10"
          >
            <Link href="/sell-your-stamps">Sell Your Stamps Today</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <div className={`flex flex-col items-center sm:items-start text-center sm:text-left gap-6 p-8 bg-secondary rounded-xl border border-border ${className}`}>
      <div className="max-w-3xl w-full">
        <h3 className="text-2xl font-bold text-primary mb-3">Send an Enquiry</h3>
        <p className="text-muted-foreground mb-3">
          If you have any questions, our team is always happy to assist.
        </p>
        <p className="text-sm text-muted-foreground italic mb-6">
          Please note, we do not purchase unsorted collections, non-GB stamps, pre-decimal issues, used stamps, or counterfeit items.
        </p>
        <div className="mb-8 border-l-4 border-forest-green pl-4 text-left">
          <p className="text-sm text-foreground leading-relaxed">
            We are committed to providing a fair, efficient, and reliable service—ensuring a smooth process and prompt payment for your stamps.
          </p>
        </div>
        <Button
          asChild
          className="w-full sm:w-auto shrink-0 bg-forest-green hover:bg-forest-green/90 text-white font-bold h-14 px-8 min-w-[200px]"
        >
          <Link href="/sell-your-stamps">Sell Your Stamps Today</Link>
        </Button>
      </div>
    </div>
  )
}
