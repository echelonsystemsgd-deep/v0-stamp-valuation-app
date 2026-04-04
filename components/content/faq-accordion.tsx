import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left font-medium text-primary hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export const shippingFAQs: FAQItem[] = [
  {
    question: 'Is my collection insured during transit?',
    answer: 'Yes, absolutely. All collections are fully insured from the moment they leave your hands until they arrive safely with us. Our standard insurance covers items up to £50,000. For collections exceeding this value, we arrange additional coverage at no extra cost to you.',
  },
  {
    question: 'Can I drop off my collection in person?',
    answer: 'Yes, we welcome personal visits to our London office. This can be a great option if you prefer to meet our team and see our facilities. Please contact us in advance to arrange a convenient appointment time.',
  },
  {
    question: 'What if I change my mind after sending my collection?',
    answer: 'You can withdraw from the sale at any point before accepting our final valuation. If you decide not to proceed, we will return your collection to you at no charge. Your stamps remain your property until you explicitly agree to sell.',
  },
  {
    question: 'How should I package my stamps for shipping?',
    answer: 'We will send you appropriate packaging materials when collection is arranged. If you prefer to package the items yourself, ensure stamps in albums are wrapped in bubble wrap, and loose stamps are secured in protective sleeves or between cardboard.',
  },
  {
    question: 'How long does the entire process take?',
    answer: 'From initial enquiry to payment, the typical timeline is 2-3 weeks. Valuations are provided within 48 hours of submission. Once you accept and we receive your collection, verification takes 2 working days, with payment processed within 7 days.',
  },
]

export const generalFAQs: FAQItem[] = [
  {
    question: 'What types of stamps do you buy?',
    answer: 'We purchase virtually all types of stamps: British definitives and commemoratives, Commonwealth issues, worldwide collections, first day covers, postal history, errors and varieties. We are particularly interested in Victorian and Edwardian stamps, but welcome collections from all eras.',
  },
  {
    question: 'How do you determine the value of my stamps?',
    answer: 'Our valuations are based on current market prices, condition, rarity, and collector demand. We consult major catalogues (Stanley Gibbons, Scott) and recent auction results. Our experts have decades of experience and stay current with market trends.',
  },
  {
    question: 'Is there a minimum value you will consider?',
    answer: 'While we focus on collections with estimated values of £50 or more, we are happy to provide guidance for smaller collections. Contact us and we will let you know if we can help or suggest alternative options.',
  },
  {
    question: 'Can I get a valuation before committing to sell?',
    answer: 'Absolutely. All our valuations are provided free of charge with no obligation to sell. You can use our valuation simply for insurance purposes, estate planning, or personal knowledge.',
  },
]
