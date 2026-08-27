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
