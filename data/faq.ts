export interface FAQItem {
  question: string;
  answer: string;
}

export const shippingFAQs: FAQItem[] = [
  {
    question: 'Is my collection insured during transit?',
    answer: 'Yes, absolutely. All collections are fully insured from the moment they leave your hands until they arrive safely with us. Our standard transit insurance covers items up to £50,000 via Royal Mail Special Delivery. For high-value collections exceeding this amount, we arrange bespoke courier coverage at no extra cost to you.',
  },
  {
    question: 'Can I drop off my collection in person?',
    answer: 'Yes, we welcome personal visits to our London office for high-value collections. Please contact our appraisal team in advance to schedule a dedicated valuation appointment.',
  },
  {
    question: 'What if I change my mind after sending my collection?',
    answer: 'You can withdraw from the sale at any point before accepting our formal valuation. If you decide not to proceed, we will return your collection to you safely via tracked Royal Mail delivery at no charge. Your stamps remain 100% your property until you explicitly accept the offer.',
  },
  {
    question: 'How should I package my stamps for shipping?',
    answer: 'We can provide protective packaging guidelines upon request. If packaging yourself, ensure stamp albums are padded with bubble wrap and packed tightly into sturdy cardboard boxes. Loose stamps should be kept in protective glassine envelopes or stock cards.',
  },
  {
    question: 'How long does the valuation and payment take?',
    answer: 'Initial digital estimates are typically delivered within 1–12 hours of submission. Once your collection arrives at our inspection desk, physical verification and payment (via direct bank transfer or cheque) are processed promptly.',
  },
];

export const generalFAQs: FAQItem[] = [
  {
    question: 'What types of stamps do you buy?',
    answer: 'We purchase virtually all forms of GB (Great Britain) postage: 1st and 2nd class barcoded stamps, commemorative sheets, presentation packs, decimal face-value postage, Victorian and Commonwealth collections, and historical postal covers.',
  },
  {
    question: 'What stamps do you NOT buy?',
    answer: 'To maintain fast turnaround times and competitive payouts, we do not purchase unsorted mixed collections, foreign or non-GB stamps, pre-decimal issues, or used and franked stamps. We specialize exclusively in genuine, unused Royal Mail British decimal postage stamps and sorted collectible GB issues.',
  },
  {
    question: 'Do you buy non-barcoded stamps?',
    answer: 'Yes. While modern non-barcoded Machin stamps are subject to Royal Mail swap-out policies, we purchase commemorative non-barcoded stamps, regional issues, and vintage collector issues at established market rates.',
  },
  {
    question: 'How do you calculate your buying rates?',
    answer: 'Our rates are transparently published on our website and calculated as a competitive percentage of nominal face value for valid postage, or fair current market catalog value for rare and collectible philatelic items.',
  },
  {
    question: 'Are there any fees or hidden commissions?',
    answer: 'No. Unlike traditional auction houses which charge seller fees of 20% to 30% plus cataloguing and unsold lot fees, our valuations are 100% free with zero commissions deducted from your agreed payout.',
  },
];

export const allFAQs: FAQItem[] = [...shippingFAQs, ...generalFAQs];

export const homeFAQData: FAQItem[] = [
  {
    question: 'How much are my stamps worth?',
    answer:
      'Stamp values depend on format, denomination, and physical condition. For valid, modern UK postage (1st Class, 2nd Class, Large Letter, and Barcoded Definitives), we pay live, transparent rates up to 78% of face value for full sheets and booklets. For rare, vintage, or collectible stamps (such as Victorian Penny Blacks or commemorative first day covers), valuation is determined individually based on condition grading (MNH, MH, FU, GU) and current market catalog values.',
  },
  {
    question: 'What stamps do you NOT buy?',
    answer:
      'To maintain fast turnarounds and premium payouts, we do not purchase unsorted mixed collections, foreign or non-GB stamps, pre-decimal issues, or used and franked stamps. We specialize exclusively in genuine, unused Royal Mail British decimal stamps (complete sheets, booklets, and sorted part-sheets) and catalogued Great Britain collectible issues. Collections must be pre-sorted before valuation.',
  },
  {
    question: 'How fast is payment processed?',
    answer:
      'Initial digital appraisals are provided within 1 to 12 hours of submitting our online valuation form. Once your collection arrives at our inspection desk and stamp condition is physically confirmed, payment is issued the very same day directly into your UK bank account via Faster Payments transfer or by cheque.',
  },
  {
    question: 'Is my collection insured during transit?',
    answer:
      'Yes, 100%. All collections dispatched to us are fully covered up to £50,000 via Royal Mail Special Delivery Guaranteed. For rare estates or specialized archives exceeding £50,000, we arrange bespoke, fully insured private courier transit at no extra charge to you.',
  },
  {
    question: 'Are there any hidden fees or auction commissions?',
    answer:
      'Zero. Traditional auction houses typically charge sellers 15% to 30% in commission fees, plus cataloguing fees, insurance deductions, and unsold lot charges. Sell Your Stamps UK provides completely free valuations with 0% commission deducted. The price quoted is the exact net payment you receive.',
  },
  {
    question: 'What if I decide not to sell after receiving my valuation?',
    answer:
      'There is absolutely no obligation to sell. Your stamps remain 100% your legal property until you formally accept our written offer. If you decline our valuation, we will return your collection to your UK address via tracked, insured delivery free of charge.',
  },
];

