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
import { HeroSlideshow } from "@/components/ui/hero-slideshow"
import { whatWeBuySlideshow } from "@/data/slideshows"
import { PackageSearch, Verified } from "lucide-react"

export default function WhatWeBuyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
        <HeroSlideshow 
          images={whatWeBuySlideshow}
          title="What we buy"
          subtitle="A straightforward list of UK stamp material we purchase. No calculator here—just clarity on fit, then you can value or sell when you are ready."
        >
          <div className="mt-8 flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white border border-white/30 text-xs font-black uppercase tracking-widest backdrop-blur-sm shadow-sm">
              <PackageSearch className="h-4 w-4 text-gold" aria-hidden />
              Reference catalog
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-white/90">
              <Verified className="h-4 w-4 text-gold shrink-0" aria-hidden />
              Trusted UK specialists
            </span>
          </div>
        </HeroSlideshow>

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
