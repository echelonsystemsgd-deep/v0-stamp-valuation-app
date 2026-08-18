import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { FormData } from './index'
import { cn } from '@/lib/utils'

interface ContactDetailsStepProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  errors: Partial<Record<keyof FormData, string>>
}

export function ContactDetailsStep({ formData, updateFormData, errors }: ContactDetailsStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-serif text-xl font-semibold text-primary mb-1">
          Your Contact Details
        </h3>
        <p className="text-muted-foreground text-sm">
          We will use these details to send you your valuation and discuss next steps.
        </p>
      </div>

      {/* Full Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Smith"
          value={formData.fullName}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
          className={cn('h-11', errors.fullName && 'border-destructive')}
          aria-invalid={!!errors.fullName}
          autoComplete="name"
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">
          Email Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          className={cn('h-11', errors.email && 'border-destructive')}
          aria-invalid={!!errors.email}
          autoComplete="email"
          autoCapitalize="none"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">
          Phone Number <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          placeholder="+44 7123 456789"
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          className="h-11"
          autoComplete="tel"
        />
      </div>

      {/* Preferred Contact Method */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium">Preferred Contact Method</legend>
        <div className="flex flex-wrap gap-4">
          {[
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone Call' },
            { value: 'callback', label: 'Request Call Back 📞' },
            { value: 'either', label: 'Either (Email/Phone)' }
          ].map((method) => (
            <label
              key={method.value}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 border rounded-2xl transition-all cursor-pointer select-none w-full sm:w-auto",
                formData.preferredContact === method.value
                  ? "border-forest-green bg-forest-green/5 text-primary dark:border-gold dark:bg-gold/5 dark:text-gold"
                  : "border-border hover:border-muted-foreground/30 hover:bg-secondary/40 bg-white dark:bg-slate-900"
              )}
            >
              <input
                type="radio"
                name="preferredContact"
                value={method.value}
                checked={formData.preferredContact === method.value}
                onChange={(e) => updateFormData({ preferredContact: e.target.value })}
                className="w-5 h-5 accent-forest-green dark:accent-gold cursor-pointer shrink-0"
              />
              <span className="text-sm font-bold">{method.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Postcode */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="postcode">
          Postcode <span className="text-destructive">*</span>
        </Label>
        <Input
          id="postcode"
          type="text"
          placeholder="SW1A 1AA"
          value={formData.postcode}
          onChange={(e) => updateFormData({ postcode: e.target.value.toUpperCase() })}
          className={cn('h-11 max-w-[200px]', errors.postcode && 'border-destructive')}
          aria-invalid={!!errors.postcode}
          autoComplete="postal-code"
        />
        {errors.postcode && (
          <p className="text-sm text-destructive">{errors.postcode}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Used to arrange collection if you proceed with selling
        </p>
      </div>

      {/* Trust & Guarantee Indicators */}
      <div className="border border-gold/30 bg-gold/5 dark:bg-gold/10/5 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-full -mr-8 -mt-8" />
        <h4 className="font-serif text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">Our Guarantees to You</h4>
        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-forest-green font-bold shrink-0">✓</span>
            <span><strong>No obligation:</strong> Our valuation is completely free with no pressure to sell.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-forest-green font-bold shrink-0">✓</span>
            <span><strong>Free insured returns:</strong> If you decline our offer, we ship your stamps back fully insured at no cost.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-forest-green font-bold shrink-0">✓</span>
            <span><strong>Secure transit:</strong> Your collection is covered by specialist insurance up to £50,000 during transport.</span>
          </li>
        </ul>
      </div>

      {/* Privacy Notice */}
      <div className="bg-secondary/40 rounded-xl p-4 text-xs sm:text-sm text-muted-foreground border border-border/30">
        <p>
          By submitting this form, you agree to our privacy policy. Your information 
          will only be used to process your valuation request and will not be shared 
          with third parties.
        </p>
      </div>
    </div>
  )
}
