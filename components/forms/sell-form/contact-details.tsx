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
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          className={cn('h-11', errors.email && 'border-destructive')}
          aria-invalid={!!errors.email}
          autoComplete="email"
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
          {['email', 'phone', 'either'].map((method) => (
            <label
              key={method}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="preferredContact"
                value={method}
                checked={formData.preferredContact === method}
                onChange={(e) => updateFormData({ preferredContact: e.target.value })}
                className="w-5 h-5 accent-forest-green"
              />
              <span className="text-sm capitalize">{method}</span>
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

      {/* Privacy Notice */}
      <div className="bg-secondary rounded-lg p-4 text-sm text-muted-foreground">
        <p>
          By submitting this form, you agree to our privacy policy. Your information 
          will only be used to process your valuation request and will not be shared 
          with third parties.
        </p>
      </div>
    </div>
  )
}
