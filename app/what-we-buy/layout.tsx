import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What We Buy | UK Stamp Valuations",
  description:
    "Browse the UK stamp material we purchase: modern definitives, commemoratives, FDCs, and collections. Indicative reference only—get a valuation on our sell page.",
  openGraph: {
    title: "What We Buy | UK Stamp Valuations",
    description:
      "A clear catalogue of stamp types we buy. For live rates and totals, use our buying rates desk or sell page.",
    type: "website",
  },
}

export default function WhatWeBuyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
