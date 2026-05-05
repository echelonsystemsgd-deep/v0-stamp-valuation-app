import Link from "next/link"
import Image from "next/image"
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  whatWeBuyIntro,
  whatWeBuyCategories,
} from "@/data/what-we-buy-catalog"
import { buyingRates, getBuyingRateImageSrc } from "@/data/buying-rates"

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
    <div className="space-y-8 lg:space-y-12 mb-16">
      {whatWeBuyCategories.map((cat, index) => {
        const isEven = index % 2 === 0;
        const numberString = `0${index + 1}`;
        
        let relatedProducts: typeof buyingRates = [];
        if (cat.id === "1st-class") relatedProducts = buyingRates.filter(r => r.group === "1st Class");
        else if (cat.id === "2nd-class") relatedProducts = buyingRates.filter(r => r.group === "2nd Class");
        else if (cat.id === "large-letter") relatedProducts = buyingRates.filter(r => r.group === "Large Letter");
        
        return (
          <Card
            key={cat.id}
            id={cat.id}
            className="overflow-hidden border-slate-100 shadow-xl shadow-slate-200/40 ring-1 ring-slate-100 scroll-mt-28 group/card flex flex-col md:flex-row bg-white"
          >
            {/* Image Side */}
            <div className={`relative w-full md:w-5/12 lg:w-1/2 aspect-video md:aspect-auto ${isEven ? 'md:order-2' : 'md:order-1'}`}>
              <div className="absolute inset-0 bg-slate-100">
                <Image
                  src={cat.image}
                  alt={cat.imageAlt}
                  fill
                  quality={90}
                  className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Content Side */}
            <div className={`w-full md:w-7/12 lg:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center ${isEven ? 'md:order-1' : 'md:order-2'}`}>
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-forest-green/10 text-forest-green font-black text-3xl md:text-4xl px-4 py-2 rounded-xl shrink-0">
                  {numberString}
                </div>
                <div className="flex flex-col justify-center mt-1">
                  <h3 className="font-black text-2xl md:text-3xl text-slate-900 tracking-tight leading-none mb-1.5">{cat.title}</h3>
                  {cat.formatsSubtitle && (
                    <p className="text-slate-500 font-medium">{cat.formatsSubtitle}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4 flex-1">
                <p className="text-slate-600 leading-relaxed text-lg">{cat.description}</p>
                
                {relatedProducts.length > 0 && (
                  <div className="mt-8">
                    <p className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      Items we buy in this category:
                    </p>
                    <ul className="space-y-3">
                      {relatedProducts.map(product => (
                        <li key={product.id} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-forest-green shrink-0 mt-0.5" />
                          <span className="text-slate-700 flex-1 leading-snug font-medium">
                            {product.name}
                          </span>
                          <span className="font-bold text-forest-green shrink-0 bg-forest-green/10 px-2 py-0.5 rounded-md">
                            {(product.rate * 100).toFixed(1).replace(/\.0$/, '')}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <Button asChild size="lg" className="w-full sm:w-auto bg-forest-green hover:bg-forest-green/90 text-white font-bold h-14 px-8 text-base shadow-lg shadow-forest-green/20 transition-all duration-300 hover:-translate-y-0.5">
                  <Link href="/sell-your-stamps">Sell Your Stamps Now!</Link>
                </Button>
                
                {cat.rateLabel && (
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Best Prices Paid</p>
                    <p className="text-2xl lg:text-3xl font-black text-forest-green tracking-tight">{cat.rateLabel}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export function WhatWeBuyExclusionsSection() {
  return (
    <section className="mb-16" aria-labelledby="exclusions-heading">
      <Card className="bg-amber-50/50 border-amber-200/60 ring-1 ring-amber-100/50 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="bg-amber-100/50 p-6 flex items-center justify-center sm:w-24 shrink-0">
            <AlertCircle className="w-8 h-8 text-amber-700" aria-hidden />
          </div>
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
            <h3 id="exclusions-heading" className="text-lg font-bold text-amber-900 mb-2">
              Please note
            </h3>
            <p className="text-amber-800 leading-relaxed text-base">
              We do not purchase franked, used, counterfeit, or non-UK stamps. We only accept genuine, unused Royal Mail postage stamps.
            </p>
          </div>
        </div>
      </Card>
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
