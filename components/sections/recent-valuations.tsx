'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'

const recentValuations = [
  {
    category: 'GB Victorian',
    item: '1840 Penny Black (Plate 1b)',
    amount: '£450',
    time: '2 hours ago',
    condition: 'Fine Used'
  },
  {
    category: 'Commonwealth',
    item: '1935 Silver Jubilee Set (Mint)',
    amount: '£1,200',
    time: '5 hours ago',
    condition: 'Mint Never Hinged'
  },
  {
    category: 'Mixed Collection',
    item: 'Large QV-QEII Album Collection',
    amount: '£3,850',
    time: 'Yesterday',
    condition: 'Mixed'
  },
  {
    category: 'GB Modern',
    item: 'Bulk Presentation Packs (1990-2010)',
    amount: '£620',
    time: 'Yesterday',
    condition: 'As New'
  }
]

export const RecentValuations = React.memo(function RecentValuations() {
  return (
    <section className="py-16 bg-white border-y border-slate-100" aria-labelledby="valuations-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <h2 id="valuations-heading" className="text-primary">Recent Valuations</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what collectors have recently received for their items. 
              Price examples are based on actual purchases made this week.
            </p>
          </div>
          <Badge variant="outline" className="h-8 gap-1.5 px-3 border-forest-green/20 text-forest-green bg-forest-green/5 font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-green"></span>
            </span>
            Updated Live
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentValuations.map((val) => (
            <Card key={val.item} className="group hover:border-forest-green/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-forest-green bg-forest-green/10 px-2 py-0.5 rounded">
                    {val.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{val.time}</span>
                </div>
                
                <h3 className="font-serif text-lg font-bold text-primary mb-2 line-clamp-1 group-hover:text-forest-green transition-colors">
                  {val.item}
                </h3>
                
                <div className="flex items-end justify-between mt-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-black tracking-tighter mb-0.5">Value Paid</p>
                    <p className="text-2xl font-black text-slate-900">{val.amount}</p>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-medium">
                    {val.condition}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 italic">
               Interested in your collection's current value? 
               <button className="text-forest-green font-bold hover:underline inline-flex items-center gap-1">
                 Check our buying rates <ExternalLink className="w-3 h-3" />
               </button>
            </p>
        </div>
      </div>
    </section>
  )
})

