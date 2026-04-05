import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { InlineSellCTA } from "@/components/sections/sell-cta"
import {
  WhatWeBuyCategoryGrid,
  WhatWeBuyExclusionsSection,
  WhatWeBuyIntroBlock,
  WhatWeBuyNextSteps,
} from "@/components/what-we-buy/catalog-sections"
import { PackageSearch, Verified } from "lucide-react"

export default function WhatWeBuyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
        <section className="bg-[#0b1b3d] py-16 md:py-24 lg:py-32 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 transform translate-x-1/2 hidden md:block" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto lg:mx-0 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-sm">
                <PackageSearch className="h-4 w-4 text-gold" aria-hidden />
                Reference catalog
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.1] sm:max-w-3xl text-white">
                What we <span className="text-gold italic">buy</span>
              </h1>
              <p className="mt-4 text-lg sm:text-xl md:text-2xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A straightforward list of UK stamp material we purchase. No calculator here—just clarity on fit, then
                you can value or sell when you are ready.
              </p>
              <p className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-sm text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Verified className="h-4 w-4 text-gold shrink-0" aria-hidden />
                  Trusted UK specialists
                </span>
                <Link
                  href="/buying-rates"
                  className="text-white font-semibold hover:text-gold underline underline-offset-4 transition-colors"
                >
                  Need live rates & totals? →
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-20 -mt-10 md:-mt-16 relative z-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 lg:p-14 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-100">
              <WhatWeBuyIntroBlock />
              <WhatWeBuyCategoryGrid />
              <WhatWeBuyExclusionsSection />
              <div className="border-t border-slate-100 pt-10 mb-10">
                <p className="text-center text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">
                  Next steps
                </p>
                <WhatWeBuyNextSteps />
              </div>
              <InlineSellCTA
                variant="featured"
                title="Ready for a real offer?"
                description="Use our sell page to run instant estimates or upload photos for a full appraisal. Same team—one clear place to take action."
                className="my-0"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
