export interface ParsedSubmissionMetadata {
  sellingOption: 'calculator' | 'box_and_send' | 'photo_appraisal' | 'vip_collection' | string
  preferredContact: 'phone' | 'callback' | 'email' | 'either' | string
  cleanDescription: string
}

/**
 * Parses embedded metadata tags from submission descriptions.
 * Tags format: [Selling Option: ...], [Preferred Contact: ...]
 */
export function parseSubmissionMetadata(description: string = ''): ParsedSubmissionMetadata {
  if (!description) {
    return {
      sellingOption: 'box_and_send',
      preferredContact: 'phone',
      cleanDescription: ''
    }
  }

  const sellingMatch = description.match(/\[Selling Option:\s*([^\]]+)\]/i)
  const contactMatch = description.match(/\[Preferred Contact(?:\s*Method)?:\s*([^\]]+)\]/i)

  const sellingOption = sellingMatch ? sellingMatch[1].trim() : 'box_and_send'
  const preferredContact = contactMatch ? contactMatch[1].trim() : 'phone'

  // Clean description by stripping out metadata tags
  const cleanDescription = description
    .replace(/\[Selling Option:[^\]]+\]\s*/gi, '')
    .replace(/\[Preferred Contact(?:\s*Method)?:[^\]]+\]\s*/gi, '')
    .replace(/\[Shipping Preference:[^\]]+\]\s*/gi, '')
    .trim()

  return {
    sellingOption,
    preferredContact,
    cleanDescription: cleanDescription || description
  }
}

export function getSellingOptionBadge(option: string): { label: string; icon: string; className: string } {
  const norm = option.toLowerCase()
  if (norm.includes('calc') || norm.includes('sheet') || norm.includes('itemized')) {
    return { label: 'Itemized Modern Postage', icon: '🧮', className: 'bg-blue-50 text-blue-700 border-blue-200' }
  }
  if (norm.includes('photo') || norm.includes('appraisal')) {
    return { label: 'Photo Appraisal', icon: '📸', className: 'bg-purple-50 text-purple-700 border-purple-200' }
  }
  if (norm.includes('vip') || norm.includes('estate') || norm.includes('high')) {
    return { label: 'VIP Estate Collection', icon: '👑', className: 'bg-amber-50 text-amber-800 border-amber-300' }
  }
  return { label: 'Box & Send (We Sort)', icon: '📦', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
}

export function getPreferredContactBadge(method: string): { label: string; icon: string; className: string; requiresCall: boolean } {
  const norm = method.toLowerCase()
  if (norm.includes('call') || norm === 'callback') {
    return { label: 'Request Call Back 📞', icon: '📞', className: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold', requiresCall: true }
  }
  if (norm.includes('phone')) {
    return { label: 'Phone Call Preferred', icon: '📱', className: 'bg-blue-50 text-blue-700 border-blue-200 font-bold', requiresCall: true }
  }
  if (norm.includes('either')) {
    return { label: 'Either (Phone/Email)', icon: '💬', className: 'bg-slate-100 text-slate-700 border-slate-200', requiresCall: false }
  }
  return { label: 'Email Only', icon: '✉️', className: 'bg-slate-100 text-slate-600 border-slate-200', requiresCall: false }
}

export const COLLECTION_CATEGORIES = [
  { value: 'mixed', label: 'Mixed Collection (Albums + Loose)' },
  { value: 'album', label: 'Complete Album(s)' },
  { value: 'loose', label: 'Loose Stamps (Boxes / Tins)' },
  { value: 'sheets_booklets', label: 'Modern Sheets & Booklets' },
  { value: 'fdc', label: 'First Day Covers & Presentation Packs' },
  { value: 'rare_specialist', label: 'Rare / Specialist Singles' },
  { value: 'other', label: 'Other Philatelic Items' },
] as const

export function getCategoryLabel(type: string): string {
  if (!type) return 'Uncategorized'
  const match = COLLECTION_CATEGORIES.find(c => c.value === type)
  if (match) return match.label
  return type.replace(/_/g, ' ')
}
