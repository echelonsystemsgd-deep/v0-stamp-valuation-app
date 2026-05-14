import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What We Buy | Sell Your Stamps UK",
  description:
    "Browse the types of stamps we buy, including Great Britain, British Commonwealth, and Worldwide collections.",
  openGraph: {
    title: "What We Buy | Sell Your Stamps UK",
    description:
      "A clear catalogue of stamp types we buy. For live rates and totals, use our buying rates desk or sell page.",
    type: "website",
  },
}

export default function WhatWeBuyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
