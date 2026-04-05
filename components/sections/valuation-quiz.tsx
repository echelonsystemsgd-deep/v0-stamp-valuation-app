'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, ArrowRight, HelpCircle, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const steps = [
  {
    question: "How old is your collection primarily?",
    options: [
      { label: "Victorian / Early 20th Century", value: "high", icon: "💎" },
      { label: "Middle Period (1940-1970)", value: "med", icon: "🏛️" },
      { label: "Modern (1980 to Present)", value: "bulk", icon: "✉️" }
    ]
  },
  {
    question: "How large is the collection?",
    options: [
      { label: "Small / Single Items", value: "single", icon: "🔍" },
      { label: "Several Albums / Stockbooks", value: "albums", icon: "📚" },
      { label: "Large Bulk (Multiple Boxes)", value: "bulk", icon: "📦" }
    ]
  },
  {
    question: "Which describes the condition best?",
    options: [
      { label: "Pristine / Unused", value: "high", icon: "✨" },
      { label: "Carefully Postmarked", value: "med", icon: "✉️" },
      { label: "Mixed / Heavily Used", value: "low", icon: "📋" }
    ]
  }
]

export const ValuationQuiz = React.memo(function ValuationQuiz() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<string[]>([])
  const [isFinished, setIsFinished] = React.useState(false)

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsFinished(true)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  if (isFinished) {
    const isHighValue = answers.includes('high')
    
    return (
      <Card className="max-w-2xl mx-auto glassmorphism border-forest-green/20 overflow-hidden">
        <div className="h-2 bg-forest-green" />
        <CardContent className="p-10 text-center">
          <div className="w-20 h-20 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-forest-green" />
          </div>
          <h3 className="text-3xl font-serif font-black mb-4">Your Result: Potential High Interest!</h3>
          <p className="text-muted-foreground text-lg mb-8">
            Based on your answers, your collection has characteristics that our experts are actively looking for. 
            We recommend a professional full appraisal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button asChild size="lg" className="bg-forest-green hover:bg-forest-green/90 text-white font-bold h-14 px-8">
               <Link href="/sell-your-stamps">Get Full Appraisal Now</Link>
             </Button>
             <Button variant="outline" onClick={() => { setCurrentStep(0); setAnswers([]); setIsFinished(false); }} className="h-14 font-bold">
                Retake Quiz
             </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="py-24 bg-slate-50" aria-labelledby="quiz-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-12">
           <Badge variant="secondary" className="mb-4 bg-forest-green/10 text-forest-green font-black uppercase tracking-widest text-[10px]">60-Second Check</Badge>
           <h2 id="quiz-heading" className="text-primary tracking-tight">Is My Collection Worth Valuing?</h2>
           <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
             Take our quick assessment to see if your stamps meet our current high-purchase criteria.
           </p>
        </div>

        <Card className="max-w-2xl mx-auto border-none shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full">
              <Progress value={progress} className="h-1 bg-slate-100 rounded-none" />
           </div>
           
           <CardHeader className="pt-10">
              <p className="text-forest-green font-black text-xs uppercase tracking-widest mb-2">Step {currentStep + 1} of {steps.length}</p>
              <CardTitle className="text-2xl font-serif">{steps[currentStep].question}</CardTitle>
           </CardHeader>
           
           <CardContent className="p-8 pt-4">
              <div className="grid grid-cols-1 gap-4">
                 {steps[currentStep].options.map((option, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleAnswer(option.value)}
                     className="flex items-center gap-4 p-5 rounded-xl border-2 border-slate-100 hover:border-forest-green hover:bg-forest-green/5 transition-all text-left group"
                   >
                     <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{option.icon}</span>
                     <div className="flex-1">
                        <p className="font-bold text-slate-800">{option.label}</p>
                     </div>
                     <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-forest-green group-hover:translate-x-1 transition-all" />
                   </button>
                 ))}
              </div>
           </CardContent>
           
           <div className="bg-slate-50 px-8 py-4 flex items-center justify-center gap-2 border-t border-slate-100">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Your data is safe and 100% anonymous</p>
           </div>
        </Card>
      </div>
    </section>
  )
})


function Badge({ children, variant, className }: any) {
  return (
    <div className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", 
      variant === 'secondary' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground',
      className
    )}>
      {children}
    </div>
  )
}
