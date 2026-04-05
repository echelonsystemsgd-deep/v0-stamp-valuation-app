import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Current Stamp Buying Rates | UK Stamp Valuation Service",
  description:
    "Interactive buying desk: enter quantities for 1st Class, 2nd Class, and Large Letter items. Totals update in real time.",
  openGraph: {
    title: "Current Stamp Buying Rates | UK Stamp Valuation Service",
    description: "Calculate purchase totals with our interactive buying rates desk.",
    type: "website",
  },
}

export default function BuyingRatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
