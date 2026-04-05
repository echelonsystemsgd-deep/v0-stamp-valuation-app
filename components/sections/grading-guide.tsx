'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Info } from 'lucide-react'
import Image from 'next/image'

const conditions = [
  {
    title: 'Mint Never Hinged (MNH)',
    description: 'Original gum, never been mounted or hinged. Perfect condition as issued by the post office.',
    points: ['Full original gum', 'No hinge marks', 'Pristine surface'],
    image: '/images/grading/mnh.jpg',
    color: 'border-gold'
  },
  {
    title: 'Mint Hinged (MH)',
    description: 'Original gum, but showing signs of having been mounted in an album with a hinge before.',
    points: ['Original gum present', 'Hinge mark or sliver', 'Good surface color'],
    image: '/images/grading/mh.jpg',
    color: 'border-slate-300'
  },
  {
    title: 'Fine Used (FU)',
    description: 'A stamp that has passed through the post but still looks clear and attractive.',
    points: ['Light, clean postmark', 'Intact perforations', 'Bright colors'],
    image: '/images/grading/fu.jpg',
    color: 'border-forest-green/30'
  },
  {
    title: 'Good Used (GU)',
    description: 'A clear example of the stamp with a heavier or slightly messy postmark.',
    points: ['Heavier cancellation', 'Decent perforations', 'Clear design'],
    image: '/images/grading/gu.jpg',
    color: 'border-slate-200'
  }
]

export function GradingGuide() {
  return (
    <section className="py-20 bg-oxford-blue text-white" aria-labelledby="grading-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
          <div className="flex-1 text-center lg:text-left">
            <h2 id="grading-heading" className="text-white mb-6">Condition & Grading Guide</h2>
            <p className="text-xl text-white/70 leading-relaxed max-w-2xl font-medium mx-auto lg:mx-0">
               Understanding the condition of your stamps is the first step to an accurate valuation. 
               We grade every item based on these international philatelic standards.
            </p>
          </div>
          <div className="flex-shrink-0 bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-forest-green/20 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-forest-green" />
              </div>
              <div>
                 <p className="font-serif font-black text-white text-lg mb-2">Expert Tip</p>
                 <p className="text-sm text-white/60">
                   "Centering" also plays a major role in valuation—the more symmetrical the margins, the higher the grade.
                 </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {conditions.map((cond, index) => (
            <Card key={index} className={`bg-white/5 border-2 border-transparent transition-all duration-300 hover:bg-white/10 hover:${cond.color}`}>
              <div className="relative aspect-square w-full opacity-80 group-hover:opacity-100 transition-opacity">
                 {/* Placeholder for standard grading image */}
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white/20 font-black text-2xl border-b border-white/10">
                   [Condition Example]
                 </div>
                 {/* Once user has images, replace with: 
                 <Image src={cond.image} alt={cond.title} fill className="object-cover" /> 
                 */}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-white font-serif text-xl font-bold">{cond.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-sm text-white/60 leading-normal mb-4">
                   {cond.description}
                 </p>
                 <ul className="space-y-2">
                   {cond.points.map((point, i) => (
                     <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                        <CheckCircle className="w-3.5 h-3.5 text-forest-green" />
                        {point}
                     </li>
                   ))}
                 </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center border-t border-white/10 pt-10">
            <p className="text-lg text-white/70 italic max-w-3xl mx-auto">
               Unsure of your collection's condition? Our experts can help. 
               Simply send a few high-quality photos and we will give you a preliminary grade.
            </p>
        </div>
      </div>
    </section>
  )
}
