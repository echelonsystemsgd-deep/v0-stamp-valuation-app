import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = currentStep > stepNumber
          const isCurrent = currentStep === stepNumber

          return (
            <li key={step} className="flex-1 relative">
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base transition-colors border-2',
                    isCompleted && 'bg-forest-green border-forest-green text-white',
                    isCurrent && 'bg-oxford-blue border-oxford-blue text-white',
                    !isCompleted && !isCurrent && 'bg-secondary border-border text-muted-foreground'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {/* Step Label */}
                <span
                  className={cn(
                    'mt-2 text-sm font-medium text-center hidden sm:block',
                    isCurrent ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step}
                </span>
              </div>
              {/* Connector Line */}
              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    'absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2',
                    isCompleted ? 'bg-forest-green' : 'bg-border'
                  )}
                  style={{ left: '50%' }}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
