import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  whatWeBuyCategories,
  whatWeBuyExclusions,
  whatWeBuyIntro,
} from "@/data/what-we-buy-catalog"

export function WhatWeBuyIntroBlock() {
  return (
    <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
        {whatWeBuyIntro.headline}
      </h2>
      {whatWeBuyIntro.paragraphs.map((p, i) => (
        <p key={i} className="text-slate-600 text-lg leading-relaxed mb-4 last:mb-0">
          {p}
        </p>
      ))}

    </div>
  )
}

export function WhatWeBuyCategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
      {whatWeBuyCategories.map((cat) => (
        <Card
          key={cat.id}
          id={cat.id}
          className="overflow-hidden border-slate-100 shadow-lg shadow-slate-200/40 ring-1 ring-slate-100 scroll-mt-28 group/card flex flex-col h-full"
        >
          <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
            <Image
              src={cat.image}
              alt={cat.imageAlt}
              fill
              quality={90}
              className="object-cover transition-transform duration-300 group-hover/card:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-xl md:text-2xl text-primary">{cat.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 flex-1 flex flex-col">
            <p className="text-slate-600 leading-relaxed">{cat.description}</p>
            {cat.examples && cat.examples.length > 0 && (
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Examples we see often</p>
                <ul className="list-disc list-inside text-slate-700 text-sm space-y-1" role="list">
                  {cat.examples.map((ex) => (
                    <li key={ex}>{ex}</li>
                  ))}
                </ul>
              </div>
            )}
            {cat.indicativeNote && (
              <p className="text-sm text-slate-500 border-l-2 border-forest-green/40 pl-3 italic">{cat.indicativeNote}</p>
            )}
            <div className="pt-6 mt-auto border-t border-slate-100">
              <Button asChild className="w-full sm:w-auto bg-forest-green hover:bg-forest-green/90 text-white transition-all duration-300 hover:gap-3 group">
                <Link href={`/sell-your-stamps?category=${encodeURIComponent(cat.title)}`} className="flex items-center justify-center gap-2 font-medium">
                  Sell your stamps <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function WhatWeBuyExclusionsSection() {
  return (
    <section className="mb-16" aria-labelledby="exclusions-heading">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
          <ListChecks className="h-5 w-5 text-slate-600" aria-hidden />
        </div>
        <h2 id="exclusions-heading" className="text-2xl font-black text-slate-900 tracking-tight">
          What we typically do not buy
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {whatWeBuyExclusions.map((item) => (
          <Card key={item.title} className="bg-slate-50/80 border-slate-200/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function WhatWeBuyNextSteps() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 flex-wrap">
      <Button
        asChild
        size="lg"
        className="bg-forest-green hover:bg-forest-green/90 text-white font-bold h-14 px-8"
      >
        <Link href="/sell-your-stamps" className="gap-2">
          Sell your stamps
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>

      <Button asChild variant="ghost" size="lg" className="h-14 px-8 font-semibold text-slate-700">
        <Link href="/contact">Contact us</Link>
      </Button>
    </div>
  )
}
