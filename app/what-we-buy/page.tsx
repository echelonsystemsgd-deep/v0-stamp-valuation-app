import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
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
      <main id="main-content" className="flex-1 flex flex-col w-full bg-slate-50/50 dark:bg-slate-950/50">
        <HeroSlideshow 
          images={whatWeBuySlideshow}
          title="What we buy"
          subtitle="A straightforward list of UK stamp material we purchase. No calculator here—just clarity on fit, then you can value or sell when you are ready."
        >
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-forest-green hover:bg-forest-green/90 text-white font-semibold h-14 px-8 text-lg"
            >
              <Link href="/sell-your-stamps">Sell Your Stamps</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-oxford-blue font-semibold h-14 px-8 text-lg bg-transparent"
            >
              <Link href="/how-to-sell">How to Sell</Link>
            </Button>
          </div>
          <p className="mt-6 text-base text-white/70 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-forest-green" aria-hidden="true" />
            No obligation to sell
          </p>
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
