"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Plus, Minus, Info, Calculator, ArrowRight, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  buyingRates,
  calculatePurchaseTotal,
  BuyingRateItem,
  getBuyingRateImageSrc,
  getBuyingRateSections,
} from "@/data/buying-rates"

export function BuyingTable({ onAction }: { onAction?: (quantities: Record<string, number>, totalValue: number) => void }) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const [quantities, setQuantities] = useState<Record<string, string | number>>(() =>
    buyingRates.reduce((acc, p) => ({ ...acc, [p.id]: "" }), {})
  )

  const getNumericQty = (id: string) => {
    const val = quantities[id]
    if (val === undefined || val === null || val === "") return 0
    const parsed = typeof val === "string" ? parseFloat(val) : val
    return isNaN(parsed) ? 0 : parsed
  }

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const val = prev[id]
      const current = typeof val === "string" ? parseFloat(val) : (val as number || 0)
      const newVal = Math.max(0, (isNaN(current) ? 0 : current) + delta)
      return {
        ...prev,
        [id]: newVal,
      }
    })
  }

  const handleInputChange = (id: string, value: string, allowDecimal = false) => {
    if (value === "") {
      setQuantities((prev) => ({ ...prev, [id]: "" }))
      return
    }

    if (allowDecimal) {
      if (/^\d*\.?\d*$/.test(value)) {
        setQuantities((prev) => ({ ...prev, [id]: value }))
      }
    } else {
      if (/^\d*$/.test(value)) {
        setQuantities((prev) => ({ ...prev, [id]: value }))
      }
    }
  }

  const calculateSubtotal = (item: BuyingRateItem) => {
    return calculatePurchaseTotal(item.faceValue, getNumericQty(item.id), item.rate)
  }

  const totalValue = buyingRates.reduce((acc, item) => acc + calculateSubtotal(item), 0)

  const handleActionTrigger = () => {
    if (onAction) {
      const cleanQuantities: Record<string, number> = {}
      for (const item of buyingRates) {
        const qty = getNumericQty(item.id)
        if (qty > 0) {
          cleanQuantities[item.id] = qty
        }
      }
      onAction(cleanQuantities, totalValue)
    }
  }

  const sections = React.useMemo(() => getBuyingRateSections(), [])

  const renderDesktopRows = (items: BuyingRateItem[]) => (
    <div className="divide-y divide-border/60">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`grid grid-cols-[1.2fr_1.6fr_80px_90px_120px_110px] items-center gap-4 p-6 transition-all duration-200 hover:bg-primary/5 ${
            index % 2 === 0 ? "bg-background" : "bg-muted/5"
          } animate-fade-in-up`}
        >
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-slate-50 shadow-sm">
              <Image
                src={getBuyingRateImageSrc(item)}
                alt={item.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <span className="font-bold text-foreground leading-tight text-lg">{item.name}</span>
          </div>
          <div className="text-base text-muted-foreground leading-relaxed pr-4">{item.description}</div>
          <div className="text-right font-medium text-slate-600 font-mono">£{item.faceValue.toFixed(2)}</div>
          <div className="text-right">
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 font-bold whitespace-nowrap"
            >
              {(item.rate * 100).toFixed(item.rate % 0.01 === 0 ? 0 : 1)}%
            </Badge>
          </div>
          <div className="flex justify-center">
            {item.allowDecimal ? (
              <div className="flex items-center rounded-xl border-2 border-border/80 bg-background shadow-inner overflow-hidden focus-within:border-primary/50 transition-colors px-3">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={quantities[item.id] || ""}
                  onChange={(e) => handleInputChange(item.id, e.target.value, true)}
                  className="h-10 w-24 border-0 bg-transparent text-center font-bold text-lg focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                  placeholder="0.00"
                />
              </div>
            ) : (
              <div className="flex items-center rounded-xl border-2 border-border/80 bg-background shadow-inner overflow-hidden focus-within:border-primary/50 transition-colors">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border-r"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={quantities[item.id] || ""}
                  onChange={(e) => handleInputChange(item.id, e.target.value, false)}
                  className="h-10 w-16 border-0 bg-transparent text-center font-bold text-lg focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border-l"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="text-right font-extrabold text-2xl text-navy font-mono whitespace-nowrap">
            £{calculateSubtotal(item).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )

  const renderMobileCards = (items: BuyingRateItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:hidden gap-6">
      {items.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden border-border/60 shadow-md rounded-2xl flex flex-col h-full bg-card animate-fade-in-up"
        >
          <CardContent className="p-6 space-y-6 flex flex-col h-full">
            <div className="flex gap-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-sm">
                <Image
                  src={getBuyingRateImageSrc(item)}
                  alt={item.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-foreground text-xl leading-tight">{item.name}</h3>
                <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">{item.description}</p>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-4 border-t border-b border-dashed py-5">
              <div className="space-y-1.5 border-r border-border/30">
                <span className="text-[11px] text-slate-400 uppercase tracking-widest font-black">Face Price</span>
                <div className="font-bold text-slate-700 text-lg font-mono">£{item.faceValue.toFixed(2)}</div>
              </div>
              <div className="space-y-1.5 pl-4">
                <span className="text-[11px] text-slate-400 uppercase tracking-widest font-black block">Our Rate</span>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3 py-0.5">
                    {(item.rate * 100).toFixed(item.rate % 0.01 === 0 ? 0 : 1)}%
                  </Badge>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer focus:outline-none p-0.5" aria-label="Valuation Rate Guide">
                        <HelpCircle className="h-3.5 w-3.5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 text-left font-normal normal-case bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-border/80 rounded-xl shadow-xl z-50" align="end">
                      <h4 className="font-bold text-sm text-slate-950 dark:text-white mb-2 font-serif">Valuation Rate Guide</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                        Rates are determined by format (full sheets vs. booklets or loose stamps) and condition. For vintage stamps, we grade as follows:
                      </p>
                      <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                        <li><strong className="text-slate-950 dark:text-white">MNH (Mint Never Hinged):</strong> Pristine original gum, no hinge marks.</li>
                        <li><strong className="text-slate-950 dark:text-white">MH (Mint Hinged):</strong> Unused, but has a hinge mark/remnant on the back.</li>
                        <li><strong className="text-slate-950 dark:text-white">FU (Fine Used):</strong> Postally used with a clean, light cancel mark.</li>
                        <li><strong className="text-slate-950 dark:text-white">GU (Good Used):</strong> Postally used with a heavier cancel mark or flaws.</li>
                      </ul>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-6 pt-2">
              {item.allowDecimal ? (
                <div className="flex items-center rounded-2xl border-2 border-border/80 bg-background shadow-inner overflow-hidden focus-within:border-primary/50 transition-colors px-4">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={quantities[item.id] || ""}
                    onChange={(e) => handleInputChange(item.id, e.target.value, true)}
                    className="h-14 w-32 border-0 bg-transparent text-center text-2xl font-black focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                    placeholder="0.00"
                  />
                </div>
              ) : (
                <div className="flex items-center rounded-2xl border-2 border-border/80 bg-background shadow-inner overflow-hidden focus-within:border-primary/50 transition-colors">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-14 w-14 rounded-none text-muted-foreground border-r"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="h-6 w-6" />
                  </Button>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={quantities[item.id] || ""}
                    onChange={(e) => handleInputChange(item.id, e.target.value, false)}
                    className="h-14 w-20 border-0 bg-transparent text-center text-2xl font-black focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-14 w-14 rounded-none text-muted-foreground border-l"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
              )}
              <div className="text-right">
                <span className="text-[11px] text-slate-400 uppercase tracking-widest font-black block mb-1">Subtotal</span>
                <div className="text-3xl sm:text-4xl font-black text-primary font-mono tracking-tighter">
                  £{calculateSubtotal(item).toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const sectionHeading = (group: string) => group;

  return (
    <div className="w-full space-y-12">
      {sections.map((section) => (
        <div key={section.group} className="space-y-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{sectionHeading(section.group)}</h3>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="hidden xl:block overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-[1.2fr_1.6fr_80px_90px_120px_110px] items-center gap-4 bg-navy p-6 font-bold text-white text-sm uppercase tracking-wider">
                  <div>Product</div>
                  <div>Description</div>
                  <div className="text-right">Face Price</div>
                  <div className="text-right flex items-center justify-end gap-1">
                    <span>Buy Rate %</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" className="text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none" aria-label="Valuation Rate Guide">
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4 text-left font-normal normal-case bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-border/80 rounded-xl shadow-xl z-50" align="center">
                        <h4 className="font-bold text-sm text-slate-950 dark:text-white mb-2 font-serif">Valuation Rate Guide</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                          Rates are determined by format (full sheets vs. booklets or loose stamps) and condition. For vintage stamps, we grade as follows:
                        </p>
                        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-350">
                          <li><strong className="text-slate-950 dark:text-white">MNH (Mint Never Hinged):</strong> Pristine original gum, no hinge marks.</li>
                          <li><strong className="text-slate-950 dark:text-white">MH (Mint Hinged):</strong> Unused, but has a hinge mark/remnant on the back.</li>
                          <li><strong className="text-slate-950 dark:text-white">FU (Fine Used):</strong> Postally used with a clean, light cancel mark.</li>
                          <li><strong className="text-slate-950 dark:text-white">GU (Good Used):</strong> Postally used with a heavier cancel mark or flaws.</li>
                        </ul>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Subtotal Offer</div>
                </div>
                {renderDesktopRows(section.items)}
              </div>
            </div>
          </div>
          {renderMobileCards(section.items)}
        </div>
      ))}

      {/* Sticky Floating Action Bar */}
      {isMounted && totalValue > 0 && (
        <div className="fixed bottom-20 sm:bottom-24 lg:bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-auto max-w-lg z-50 animate-fade-in-up">
          <div className="flex items-center justify-between gap-6 px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-2xl shadow-primary/20 rounded-full">
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Total Est. Payout</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight leading-none">
                £{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <Button 
              size="default" 
              onClick={handleActionTrigger}
              className="bg-forest-green hover:bg-forest-green/90 text-white font-bold h-12 px-6 sm:px-8 rounded-full shadow-lg shadow-forest-green/30 transition-all hover:scale-105 active:scale-95 group shrink-0"
            >
              Submit <span className="hidden sm:inline">&nbsp;for Valuation</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Summary Section */}
      <section className="bg-navy text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden ring-1 ring-white/10 animate-slide-in-right">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-forest-green/20 blur-[120px] -mr-48 -mt-48 rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -ml-32 -mb-32 rounded-full" />
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/30">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Est. Valuation</h2>
            </div>
            <p className="text-slate-400 max-w-lg text-lg leading-relaxed">
              This is an instant estimate of what we can pay today. 
              Final value is confirmed once we verify the condition of your collection.
            </p>
          </div>

          <div className="flex flex-col items-center xl:items-end gap-6 w-full xl:w-auto">
            <div className="text-center xl:text-right space-y-1">
              <span className="text-blue-400 text-sm font-black uppercase tracking-[0.2em]">Total Estimated Payout</span>
              <div 
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tighter font-mono"
                suppressHydrationWarning
              >
                £{isMounted ? totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : totalValue.toFixed(2)}
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={handleActionTrigger}
              className="w-full sm:w-auto bg-forest-green hover:bg-forest-green/90 text-white font-black text-xl h-20 px-12 rounded-2xl shadow-2xl shadow-forest-green/40 transition-all duration-300 hover:scale-105 active:scale-95 group"
            >
              Submit for Valuation
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Info */}
      <div className="flex flex-col sm:flex-row items-start gap-5 p-6 bg-primary/5 rounded-2xl border border-primary/20 text-base text-slate-600 dark:text-slate-400">
        <div className="bg-primary/10 p-3 rounded-xl shrink-0">
          <Info className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-2">
          <p className="font-bold text-slate-800 dark:text-slate-200">Payment within 24 hours</p>
          <p className="leading-relaxed text-sm md:text-base">
            Once we receive and verify your stamps, payment is issued immediately via Bank Transfer or PayPal. 
            Got specialised collections or high-value archive lots? 
            Please <a href="/contact" className="text-primary font-bold hover:underline">contact our specialised team</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
