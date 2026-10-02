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

const sellingOptions = [
  {
    id: 'box_and_send',
    title: 'Box & Send (We Sort & Value)',
    badge: 'Most Popular',
    desc: 'Inherited or unsorted collections? No need to count. Just pack them up, and our experts will catalogue and value every item for you.',
    icon: '📦',
  },
  {
    id: 'photo_appraisal',
    title: 'Photo Quick Appraisal',
    badge: 'Fast Quote',
    desc: 'Upload 1–5 clear photos of albums, covers, or high-value singles to receive a rapid expert appraisal within 2 hours.',
    icon: '📸',
  },
  {
    id: 'calculator',
    title: 'Itemized Modern Postage',
    badge: 'Instant Rates',
    desc: 'Selling modern Royal Mail 1st/2nd class sheets or booklets? We buy all quantities with locked-in cash payouts.',
    icon: '🧮',
  },
  {
    id: 'vip_collection',
    title: 'VIP Estate Collection (£1,000+)',
    badge: 'Specialist Service',
    desc: 'Substantial private collections or estates. We offer insured courier collection, direct phone callbacks, or in-person visits.',
    icon: '👑',
  },
]

const collectionTypes = [
  { value: 'mixed', label: 'Mixed Collection (Albums + Loose)' },
  { value: 'album', label: 'Complete Album(s)' },
  { value: 'loose', label: 'Loose Stamps (Boxes / Tins)' },
  { value: 'sheets_booklets', label: 'Modern Sheets & Booklets' },
  { value: 'fdc', label: 'First Day Covers & Presentation Packs' },
  { value: 'rare_specialist', label: 'Rare / Specialist Singles' },
  { value: 'other', label: 'Other Philatelic Items' },
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
          Select how you would like to sell and provide details about the stamps you would like valued.
        </p>
      </div>

      {/* Selling Pathway Options */}
      <div className="flex flex-col gap-2.5">
        <Label className="text-sm font-semibold text-slate-800">
          How Would You Like to Sell? <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sellingOptions.map((opt) => {
            const isSelected = (formData.sellingOption || 'box_and_send') === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateFormData({ sellingOption: opt.id })}
                className={cn(
                  "p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-2 cursor-pointer",
                  isSelected
                    ? "border-forest-green bg-forest-green/5 ring-2 ring-forest-green/20 shadow-sm"
                    : "border-border hover:border-muted-foreground/30 hover:bg-secondary/40 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="font-bold text-sm text-slate-900 leading-snug">{opt.title}</span>
                  </div>
                  <span className={cn(
                    "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shrink-0",
                    isSelected ? "bg-forest-green text-white" : "bg-slate-100 text-slate-600"
                  )}>
                    {opt.badge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {opt.desc}
                </p>
              </button>
            )
          })}
        </div>
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
          <div className="flex flex-wrap gap-2.5">
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
                className="inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-forest-green/10 text-forest-green hover:bg-forest-green/20 cursor-pointer"
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
