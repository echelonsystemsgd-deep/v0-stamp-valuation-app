export interface ParsedSubmissionMetadata {
  sellingOption: 'calculator' | 'box_and_send' | 'photo_appraisal' | 'vip_collection' | string
  preferredContact: 'phone' | 'callback' | 'email' | 'either' | string
  shippingPreference: 'prepaid_qr_label' | 'self_ship' | 'courier_pickup' | 'home_visit' | string
  cleanDescription: string
}

/**
 * Parses embedded metadata tags from submission descriptions.
 * Tags format: [Selling Option: ...], [Preferred Contact: ...], [Shipping Preference: ...]
 */
export function parseSubmissionMetadata(description: string = ''): ParsedSubmissionMetadata {
  if (!description) {
    return {
      sellingOption: 'box_and_send',
      preferredContact: 'phone',
      shippingPreference: 'prepaid_qr_label',
      cleanDescription: ''
    }
  }

  const sellingMatch = description.match(/\[Selling Option:\s*([^\]]+)\]/i)
  const contactMatch = description.match(/\[Preferred Contact(?:\s*Method)?:\s*([^\]]+)\]/i)
  const shippingMatch = description.match(/\[Shipping Preference:\s*([^\]]+)\]/i)

  const sellingOption = sellingMatch ? sellingMatch[1].trim() : 'box_and_send'
  const preferredContact = contactMatch ? contactMatch[1].trim() : 'phone'
  const shippingPreference = shippingMatch ? shippingMatch[1].trim() : 'prepaid_qr_label'

  // Clean description by stripping out metadata tags
  const cleanDescription = description
    .replace(/\[Selling Option:[^\]]+\]\s*/gi, '')
    .replace(/\[Preferred Contact(?:\s*Method)?:[^\]]+\]\s*/gi, '')
    .replace(/\[Shipping Preference:[^\]]+\]\s*/gi, '')
    .trim()

  return {
    sellingOption,
    preferredContact,
    shippingPreference,
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

export function getShippingPreferenceBadge(pref: string): { label: string; icon: string; className: string } {
  const norm = pref.toLowerCase()
  if (norm.includes('special') || norm.includes('self')) {
    return { label: 'Royal Mail Special Delivery', icon: '📮', className: 'bg-rose-50 text-rose-700 border-rose-200' }
  }
  if (norm.includes('courier')) {
    return { label: 'Courier Collection', icon: '🚚', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
  }
  if (norm.includes('home') || norm.includes('visit')) {
    return { label: 'Home Visit Arranged', icon: '🏡', className: 'bg-amber-50 text-amber-800 border-amber-300' }
  }
  return { label: 'Prepaid Tracked QR Label', icon: '🏷️', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
}
