'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { buyingRates, getBuyingRateImageSrc, BUYING_RATE_GROUP_ORDER } from '@/data/buying-rates'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function StampTypesPreview() {
  // Group all buying rates
  const groups = BUYING_RATE_GROUP_ORDER.map((group) => {
    const items = buyingRates.filter((item) => item.group === group)
    const bestItem = [...items].sort((a, b) => b.rate - a.rate)[0]
    return {
      group,
      bestItem,
      items,
    }
  })

  return (
    <section className="py-28 lg:py-32 bg-slate-50/50 dark:bg-slate-950/50" aria-labelledby="stamp-types-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 id="stamp-types-heading" className="text-navy text-3xl font-black tracking-tight md:text-4xl">
              What We Buy & Live Rates
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              From modern unused postage to complete sheets, we purchase a wide variety of UK stamps at top market percentages. Compare our live rates below.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="shrink-0 border-navy text-navy hover:bg-navy hover:text-white"
          >
            <Link href="/what-we-buy">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {groups.map(({ group, bestItem, items }) => {
            const displayTitle = group === "Barcoded Values" ? "Barcoded Face Values" : `${group} Stamps`
            
            return (
              <Card
                key={group}
                className="group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col overflow-hidden border-border hover:border-forest-green/50 transition-all hover:shadow-lg bg-white dark:bg-slate-900"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-muted m-2 rounded-xl">
                  <div className="absolute inset-0 stamp-edge z-10 pointer-events-none opacity-50" />
                  <Image
                    src={getBuyingRateImageSrc(bestItem)}
                    alt={displayTitle}
                    fill
                    quality={90}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                  <div className="absolute top-3 right-3 z-20 bg-forest-green text-white font-bold px-3 py-1 rounded-full text-xs shadow-md">
                    Up to {(bestItem.rate * 100).toFixed(0)}% Rate
                  </div>
                </div>
                <CardContent className="p-5 flex flex-col flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-forest-green/70 mb-1">
                    {group}
                  </p>
                  <h3 className="font-serif text-lg font-semibold text-navy group-hover:text-forest-green transition-colors">
                    {displayTitle}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    Looking to sell your {group.toLowerCase()} stamps? We offer the best rates in the UK for sheets, booklets, and loose collections.
                  </p>

                  <div className="mt-4 pt-4 border-t border-border flex-1 flex flex-col justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="flex items-center justify-between w-full text-sm font-bold text-navy hover:text-forest-green transition-colors py-2 cursor-pointer">
                          <span>View Live Rates</span>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="font-serif text-2xl text-navy">{displayTitle} - Live Rates</DialogTitle>
                          <DialogDescription className="text-muted-foreground text-sm">
                            Current payout rates for {group.toLowerCase()} stamps.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <ul className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 py-1">
                            {items.map((item) => (
                              <li key={item.id} className="flex justify-between items-start gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 animate-fade-in-up">
                                <span className="font-medium text-slate-700 dark:text-slate-300 leading-snug flex-1">
                                  {item.name}
                                </span>
                                <span className="font-bold text-forest-green bg-forest-green/10 dark:bg-forest-green/20 px-2 py-0.5 rounded shrink-0">
                                  {(item.rate * 100).toFixed(0)}%
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border">
                    <Button asChild className="w-full bg-forest-green hover:bg-forest-green/90 text-white transition-all duration-300 group/btn">
                      <Link href="/sell-your-stamps" className="flex items-center justify-center gap-2 font-medium">
                        Go to Sell Calculator
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

