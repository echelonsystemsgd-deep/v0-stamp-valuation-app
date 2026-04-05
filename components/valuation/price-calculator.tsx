'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Info, Calculator, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip'
import CountUp from 'react-countup'

export function InteractivePriceCalculator() {
  const [faceValue, setFaceValue] = React.useState<number>(100)
  const [condition, setCondition] = React.useState<string>('mnh')
  const [rarity, setRarity] = React.useState<number>(1) // Multiplier
  const [centering, setCentering] = React.useState<number>(80) // %
  const [estimate, setEstimate] = React.useState<[number, number]>([0, 0])

  const calculateEstimate = React.useCallback(() => {
    // Basic logic for demonstration
    // Base rate for bulk modern stamps (using face value as base)
    let baseRate = 0.5 // 50% of face value for average condition
    
    if (condition === 'mnh') baseRate = 0.8
    else if (condition === 'mh') baseRate = 0.4
    else if (condition === 'fu') baseRate = 0.3
    else baseRate = 0.15

    // Centering multiplier (80% is neutral)
    const centeringMult = centering / 80

    const baseAmount = faceValue * baseRate * rarity * centeringMult
    
    // Range of ±15%
    const low = Math.round(baseAmount * 0.85)
    const high = Math.round(baseAmount * 1.15)
    
    setEstimate([low, high])
  }, [faceValue, condition, rarity, centering])

  React.useEffect(() => {
    calculateEstimate()
  }, [calculateEstimate])

  return (
    <section className="py-20 bg-secondary/30 bg-grainy-paper" aria-labelledby="calculator-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 gap-1.5 px-3 border-forest-green/20 text-forest-green bg-forest-green/5 font-bold uppercase tracking-widest text-[10px]">
             Smart Estimation Engine
          </Badge>
          <h2 id="calculator-heading" className="text-primary tracking-tight">Advanced Price Calculator</h2>
          <p className="mt-4 text-xl text-muted-foreground font-medium">
             Use our professional calculator to get a more accurate estimate of your collection's market value.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-serif">
                   <Calculator className="w-5 h-5 text-forest-green" /> Valuation Controls
                </CardTitle>
                <CardDescription>Adjust the sliders and fields to match your stamp's attributes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                 {/* Face Value */}
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <Label htmlFor="face-value" className="text-slate-800 font-bold uppercase tracking-tight text-xs">Total Face Value (£)</Label>
                       <span className="text-sm font-black text-forest-green">£{faceValue}</span>
                    </div>
                    <Slider 
                      defaultValue={[100]} 
                      max={1000} 
                      step={10} 
                      onValueChange={(val) => setFaceValue(val[0])}
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-black uppercase">
                       <span>£0</span>
                       <span>£500</span>
                       <span>£1000+</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Condition */}
                    <div className="space-y-3">
                       <Label htmlFor="condition" className="text-slate-800 font-bold uppercase tracking-tight text-xs flex items-center gap-1.5">
                          Stamp Condition
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>MNH = Mint Never Hinged (Pristine)</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                       </Label>
                       <Select defaultValue="mnh" onValueChange={setCondition}>
                          <SelectTrigger id="condition" className="h-12 border-slate-200 bg-slate-50/50 font-medium">
                            <SelectValue placeholder="Select Condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mnh" className="font-medium font-serif">Mint Never Hinged (MNH)</SelectItem>
                            <SelectItem value="mh" className="font-medium font-serif">Mint Hinged (MH)</SelectItem>
                            <SelectItem value="fu" className="font-medium font-serif">Fine Used (FU)</SelectItem>
                            <SelectItem value="gu" className="font-medium font-serif">Good Used (GU)</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>

                    {/* Rarity */}
                    <div className="space-y-3">
                       <Label htmlFor="rarity" className="text-slate-800 font-bold uppercase tracking-tight text-xs">Special Items / Rarity</Label>
                       <Select defaultValue="1" onValueChange={(v) => setRarity(parseFloat(v))}>
                          <SelectTrigger id="rarity" className="h-12 border-slate-200 bg-slate-50/50 font-medium">
                            <SelectValue placeholder="Select Rarity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1" className="font-medium font-serif">Standard Issues</SelectItem>
                            <SelectItem value="2" className="font-medium font-serif">Limited / Commemorative (2x)</SelectItem>
                            <SelectItem value="5" className="font-medium font-serif">Scarce Variations (5x)</SelectItem>
                            <SelectItem value="10" className="font-medium font-serif">Rare Rarities (10x+)</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>

                 {/* Centering */}
                 <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                       <Label className="text-slate-800 font-bold uppercase tracking-tight text-xs">Aesthetic Centering</Label>
                       <Badge variant="secondary" className="bg-forest-green/10 text-forest-green font-bold">{centering}%</Badge>
                    </div>
                    <Slider 
                      defaultValue={[80]} 
                      max={100} 
                      min={40} 
                      step={5} 
                      onValueChange={(val) => setCentering(val[0])}
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-black uppercase">
                       <span>Off-Center</span>
                       <span>Good</span>
                       <span>Perfect</span>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5">
             <Card className="bg-oxford-blue text-white border-none shadow-2xl overflow-hidden relative glassmorphism !bg-oxford-blue/90 border-white/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -skew-x-12 transform translate-x-1/2 -translate-y-1/2" />
                <CardHeader className="text-center pt-10">
                   <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-2">Estimated Market Value</p>
                   <CardTitle className="text-5xl md:text-6xl font-black tracking-tighter text-white flex items-center justify-center gap-1">
                      <span>£</span>
                      <CountUp end={estimate[0]} duration={0.8} />
                      <span>–</span>
                      <span>£</span>
                      <CountUp end={estimate[1]} duration={0.8} />
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                   <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10">
                      <div className="flex items-start gap-3">
                         <ShieldCheck className="w-5 h-5 text-forest-green shrink-0 mt-0.5" />
                         <div>
                            <p className="font-serif font-bold text-white leading-none mb-1.5">No-Obligation Offer</p>
                            <p className="text-xs text-white/50 leading-relaxed">
                               This estimate reflects current market data. Final offers are subject to professional audit of physical items.
                            </p>
                         </div>
                      </div>
                   </div>
                   
                   <div className="space-y-4 pt-4">
                      <Button asChild size="lg" className="w-full bg-forest-green hover:bg-forest-green/90 text-white font-bold h-14 group">
                        <a href="/sell-your-stamps">
                           Lock In This Offer <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                      <p className="text-center text-[10px] text-white/30 uppercase tracking-widest font-black">
                         Secured with SSL encryption
                      </p>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
