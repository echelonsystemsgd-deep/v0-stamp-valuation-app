'use client'

import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HelpCircle, AlertTriangle, ShieldCheck, Clock, PoundSterling, Truck } from 'lucide-react'

import { homeFAQData, type FAQItem } from '@/data/faq'

export { homeFAQData }
export type { FAQItem }

const faqIcons: Record<number, React.ComponentType<{ className?: string }>> = {
  0: PoundSterling,
  1: AlertTriangle,
  2: Clock,
  3: Truck,
  4: ShieldCheck,
  5: HelpCircle,
}

export function HomeFAQ() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200/60 dark:border-slate-800" aria-labelledby="home-faq-heading">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-forest-green mb-3">
            Common Questions Answered
          </p>
          <h2 id="home-faq-heading" className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white text-balance">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Everything you need to know about selling your British postage stamps, our valuation criteria, transit insurance, and same-day payment guarantees.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/80 dark:border-slate-800">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {homeFAQData.map((item, index) => {
              const Icon = faqIcons[index] || HelpCircle
              return (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-slate-100 dark:border-slate-800 rounded-2xl px-5 sm:px-6 data-[state=open]:bg-slate-50/60 dark:data-[state=open]:bg-slate-800/40 transition-colors"
                >
                  <AccordionTrigger className="text-left font-serif text-lg sm:text-xl font-bold text-navy dark:text-white hover:text-forest-green dark:hover:text-gold py-5 transition-colors cursor-pointer">
                    <span className="flex items-center gap-3.5 pr-4">
                      <span className="p-2 rounded-xl bg-forest-green/10 text-forest-green shrink-0">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>{item.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-300 text-base leading-relaxed pl-12 pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
