'use client'

import * as React from 'react'
import Link from 'next/link'
import { User, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OnboardingBannerProps {
  isProfileIncomplete: boolean
}

export function OnboardingBanner({ isProfileIncomplete }: OnboardingBannerProps) {
  const [isDismissed, setIsDismissed] = React.useState(true) // Default to true to prevent flash before client mount

  React.useEffect(() => {
    // Only check and show if we are on the client side
    const dismissed = localStorage.getItem('onboarding_banner_dismissed') === 'true'
    if (isProfileIncomplete && !dismissed) {
      setIsDismissed(false)
    }
  }, [isProfileIncomplete])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('onboarding_banner_dismissed', 'true')
  }

  if (isDismissed || !isProfileIncomplete) return null

  return (
    <div className="relative overflow-hidden bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-3xl p-5 sm:p-6 shadow-sm transition-all duration-300">
      {/* Decorative Left Accent Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#C5A059]" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pl-2">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-[#C5A059]">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Complete Your Profile
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Please provide your Full Name, Phone Number, and Postcode in your profile settings. 
              This information is required specifically when you accept a valuation quote or request payouts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 sm:pl-14">
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto text-xs font-bold border-amber-200/80 hover:bg-amber-100/50 dark:border-amber-900/40 dark:hover:bg-amber-950/40 text-slate-800 dark:text-slate-200 h-9 rounded-lg"
          >
            <Link href="/dashboard/profile">Complete Profile</Link>
          </Button>
          
          <button
            onClick={handleDismiss}
            className="hidden sm:flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Mobile close button (top right) */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 sm:hidden text-slate-400 hover:text-slate-650"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
