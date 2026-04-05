import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SellYourStampsView } from "./sell-your-stamps-view"

function SellYourStampsFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Header />
      <div className="flex flex-1 items-center justify-center px-4">
        <p className="text-sm font-medium text-muted-foreground">Loading…</p>
      </div>
      <Footer />
    </div>
  )
}

export default function SellYourStampsPage() {
  return (
    <Suspense fallback={<SellYourStampsFallback />}>
      <SellYourStampsView />
    </Suspense>
  )
}
