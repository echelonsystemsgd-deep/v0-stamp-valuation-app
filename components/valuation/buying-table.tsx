"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Plus, Minus, Info, Calculator, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  description: string
  price: number // per unit face value
  rate: number // percentage as decimal (e.g. 0.85)
  image: string
}

const products: Product[] = [
  {
    id: "1",
    name: "1st Class Barcoded, XMAS, Incomplete Sheets & Booklets",
    description: "Incomplete Sheets & Booklets Barcoded Xmas & Regionals. Modern adhesive types.",
    price: 1.70,
    rate: 0.40,
    image: "/images/stamp-1st-red.png",
  },
  {
    id: "2",
    name: "1st Class Large Letter Commemorative/XMAS, Sheets & Booklets",
    description: "Sheets & Booklets, Part Sheets, etc. For Large Letters. Includes Xmas & Special Events.",
    price: 1.70,
    rate: 0.45,
    image: "/images/stamp-1.70-purple.png",
  },
  {
    id: "3",
    name: "2nd Class Commemorative/XMAS, Sheets & Booklets",
    description: "Complete Sheets, Booklets, Part Sheets, etc. Modern self-adhesive or gummed.",
    price: 1.70,
    rate: 0.50,
    image: "/images/stamp-2nd-blue.png",
  },
  {
    id: "4",
    name: "2nd Class Large Letter Commemorative/XMAS, Sheets & Booklets",
    description: "Sheets & Booklets, Part Sheets. Special Christmas editions for Large Letters.",
    price: 1.70,
    rate: 0.55,
    image: "/images/stamp-2.20-green.png",
  }
]

export function BuyingTable({ onAction }: { onAction?: () => void }) {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    products.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {})
  )

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta),
    }))
  }

  const handleInputChange = (id: string, value: string) => {
    const num = parseInt(value)
    if (!isNaN(num) && num >= 0) {
      setQuantities((prev) => ({ ...prev, [id]: num }))
    } else if (value === "") {
      setQuantities((prev) => ({ ...prev, [id]: 0 }))
    }
  }

  const calculateSubtotal = (product: Product) => {
    return product.price * product.rate * quantities[product.id]
  }

  const totalValue = products.reduce((acc, p) => acc + calculateSubtotal(p), 0)

  return (
    <div className="w-full space-y-8">
      {/* Desktop Table View - Only show on large screens where there is enough width */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[1.2fr_1.8fr_100px_100px_160px_140px] items-center gap-4 bg-muted/40 p-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
              <div>Product</div>
              <div>Description</div>
              <div className="text-right">Price</div>
              <div className="text-right">Rate %</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Subtotal</div>
            </div>
            <div className="divide-y divide-border/60">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`grid grid-cols-[1.2fr_1.8fr_100px_100px_160px_140px] items-center gap-4 p-6 transition-all duration-200 hover:bg-primary/5 ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/5"
                  } animate-fade-in-up reveal-hidden`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-slate-50 shadow-sm">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="font-bold text-foreground leading-tight text-lg">
                      {product.name}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed pr-4">
                    {product.description}
                  </div>
                  <div className="text-right font-medium text-slate-600 font-mono">£{product.price.toFixed(2)}</div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 font-bold whitespace-nowrap">
                      {(product.rate * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex items-center rounded-xl border-2 border-border/80 bg-background shadow-inner overflow-hidden focus-within:border-primary/50 transition-colors">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-none text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border-r"
                        onClick={() => updateQuantity(product.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantities[product.id] || ""}
                        onChange={(e) => handleInputChange(product.id, e.target.value)}
                        className="h-10 w-16 border-0 bg-transparent text-center font-bold text-lg focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-none text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border-l"
                        onClick={() => updateQuantity(product.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right font-extrabold text-2xl text-primary font-mono">
                    £{calculateSubtotal(product).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Card View - Show on anything below lg breakpoint */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6">
        {products.map((product, index) => (
          <Card 
            key={product.id} 
            className="overflow-hidden border-border/60 shadow-md rounded-2xl flex flex-col h-full bg-card animate-fade-in-up reveal-hidden"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardContent className="p-6 space-y-6 flex flex-col h-full">
              <div className="flex gap-5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-sm">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-foreground text-xl leading-tight">{product.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{product.description}</p>
                </div>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-4 border-t border-b border-dashed py-5">
                <div className="space-y-1.5 border-r border-border/30">
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-black">Base Price</span>
                  <div className="font-bold text-slate-700 text-lg font-mono">£{product.price.toFixed(2)}</div>
                </div>
                <div className="space-y-1.5 pl-4">
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-black">Our Rate</span>
                  <div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3 py-0.5">
                      {(product.rate * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 pt-2">
                <div className="flex items-center rounded-2xl border-2 border-border/80 bg-background shadow-inner overflow-hidden focus-within:border-primary/50 transition-colors">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-14 w-14 rounded-none text-muted-foreground border-r"
                    onClick={() => updateQuantity(product.id, -1)}
                  >
                    <Minus className="h-6 w-6" />
                  </Button>
                  <Input
                    type="number"
                    value={quantities[product.id] || ""}
                    onChange={(e) => handleInputChange(product.id, e.target.value)}
                    className="h-14 w-20 border-0 bg-transparent text-center text-2xl font-black focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-14 w-14 rounded-none text-muted-foreground border-l"
                    onClick={() => updateQuantity(product.id, 1)}
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-black block mb-1">Subtotal</span>
                  <div className="text-4xl font-black text-primary font-mono tracking-tighter">
                    £{calculateSubtotal(product).toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden ring-1 ring-white/10 animate-slide-in-right reveal-hidden" style={{ animationDelay: '800ms' }}>
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] -mr-48 -mt-48 rounded-full animate-pulse" />
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
              <div className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter font-mono">
                £{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={onAction}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-black text-xl h-20 px-12 rounded-2xl shadow-2xl shadow-primary/40 transition-all duration-300 hover:scale-105 active:scale-95 group"
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
            Got specialized collections or high-value archive lots? 
            Please <a href="/contact" className="text-primary font-bold hover:underline">contact our specialist team</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
