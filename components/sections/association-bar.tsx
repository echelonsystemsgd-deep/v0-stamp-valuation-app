'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const associations = [
  { name: 'PTS', fullName: 'Philatelic Traders Society', logo: 'PTS' },
  { name: 'BPFA', fullName: 'British Philatelic Federation Association', logo: 'BPFA' },
  { name: 'RPSL', fullName: 'Royal Philatelic Society London', logo: 'RPSL' },
  { name: 'ASDA', fullName: 'American Stamp Dealers Association', logo: 'ASDA' },
  { name: 'IFSDA', fullName: 'International Federation of Stamp Dealers Associations', logo: 'IFSDA' },
]

export function AssociationBar() {
  return (
    <section className="py-12 bg-white/50 border-y border-slate-100 overflow-hidden" aria-labelledby="associations-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="associations-heading" className="sr-only">Our Professional Accreditations</h2>
        <div className="flex flex-col items-center gap-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 text-center">
            Recognized & Accredited By
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {associations.map((assoc) => (
              <div key={assoc.name} className="flex flex-col items-center group cursor-default">
                <div className="h-10 flex items-center justify-center font-serif text-3xl font-black text-primary/40 group-hover:text-primary transition-colors">
                  {assoc.logo}
                </div>
                <span className="text-[10px] mt-1 font-bold text-slate-400 invisible group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all">
                  {assoc.fullName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
