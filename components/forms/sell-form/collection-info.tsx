import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FormData } from './index'
import { cn } from '@/lib/utils'

interface CollectionInfoStepProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  errors: Partial<Record<keyof FormData, string>>
}

const collectionTypes = [
  { value: 'album', label: 'Complete Album' },
  { value: 'loose', label: 'Loose Stamps' },
  { value: 'fdc', label: 'First Day Covers' },
  { value: 'mixed', label: 'Mixed Collection' },
  { value: 'other', label: 'Other' },
]

const eras = [
  { value: 'victorian', label: 'Victorian (1837-1901)' },
  { value: 'edwardian', label: 'Edwardian (1901-1910)' },
  { value: 'pre-war', label: 'Pre-War (1910-1939)' },
  { value: 'post-war', label: 'Post-War (1945-1970)' },
  { value: 'modern', label: 'Modern (1970-present)' },
  { value: 'mixed', label: 'Mixed / Unknown' },
]

export function CollectionInfoStep({ formData, updateFormData, errors }: CollectionInfoStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-serif text-xl font-semibold text-primary mb-1">
          Tell Us About Your Collection
        </h3>
        <p className="text-muted-foreground text-sm">
          Please provide details about the stamps you would like valued.
        </p>
      </div>

      {/* Collection Type */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="collectionType">
          Collection Type <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.collectionType}
          onValueChange={(value) => updateFormData({ collectionType: value })}
        >
          <SelectTrigger 
            id="collectionType" 
            className={cn('w-full h-11', errors.collectionType && 'border-destructive')}
            aria-invalid={!!errors.collectionType}
          >
            <SelectValue placeholder="Select collection type" />
          </SelectTrigger>
          <SelectContent>
            {collectionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.collectionType && (
          <p className="text-sm text-destructive">{errors.collectionType}</p>
        )}
      </div>

      {/* Quantity */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="quantity">
          Approximate Quantity <span className="text-destructive">*</span>
        </Label>
        <Input
          id="quantity"
          type="text"
          placeholder="e.g., 500 stamps, 3 albums, etc."
          value={formData.quantity}
          onChange={(e) => updateFormData({ quantity: e.target.value })}
          className={cn('h-11', errors.quantity && 'border-destructive')}
          aria-invalid={!!errors.quantity}
        />
        {errors.quantity && (
          <p className="text-sm text-destructive">{errors.quantity}</p>
        )}
      </div>

      {/* Era */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="era">
          Estimated Era <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.era}
          onValueChange={(value) => updateFormData({ era: value })}
        >
          <SelectTrigger 
            id="era" 
            className={cn('w-full h-11', errors.era && 'border-destructive')}
            aria-invalid={!!errors.era}
          >
            <SelectValue placeholder="Select era" />
          </SelectTrigger>
          <SelectContent>
            {eras.map((era) => (
              <SelectItem key={era.value} value={era.value}>
                {era.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.era && (
          <p className="text-sm text-destructive">{errors.era}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">
          Brief Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Please describe your collection, including any notable stamps, condition, and how it was stored."
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          className={cn('min-h-24', errors.description && 'border-destructive')}
          aria-invalid={!!errors.description}
        />

        {/* Quick description helper chips */}
        <div className="flex flex-col gap-1.5 mt-1">
          <span className="text-xs font-bold text-slate-400">Tap to add descriptions:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Inherited Collection 👥", text: "This is an inherited collection." },
              { label: "Stored in Albums 📘", text: "Stamps are stored in protective albums." },
              { label: "Mostly Loose Stamps ✉️", text: "Stamps are mostly loose in envelopes/boxes." },
              { label: "Clean Condition ✨", text: "Stamps are clean and dry." },
              { label: "Unsure of Value ❓", text: "I am unsure of the value." }
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const currentDesc = formData.description;
                  const separator = currentDesc && !currentDesc.endsWith(' ') ? ' ' : '';
                  if (!currentDesc.includes(chip.text)) {
                    updateFormData({ description: currentDesc + separator + chip.text });
                  }
                }}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-forest-green/10 text-forest-green hover:bg-forest-green/20 cursor-pointer"
              >
                + {chip.label}
              </button>
            ))}
          </div>
        </div>

        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      {/* Valuable Items */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="valuableItems">
          Any Known Valuable Items? <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Textarea
          id="valuableItems"
          placeholder="If you know of any particularly valuable stamps in your collection (e.g., Penny Blacks, errors, rarities), please list them here."
          value={formData.valuableItems}
          onChange={(e) => updateFormData({ valuableItems: e.target.value })}
          className="min-h-20"
        />
      </div>
    </div>
  )
}
