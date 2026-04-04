export interface StampProduct {
  id: string
  name: string
  description: string
  image: string
  priceRange: string
  pricePerUnit?: number
  category: string
  featured?: boolean
}

export const stampCategories = [
  'Victorian',
  'Edwardian',
  'Commonwealth',
  'First Day Covers',
  'Albums',
  'Rarities',
  'Foreign',
] as const

export type StampCategory = typeof stampCategories[number]

export const stampProducts: StampProduct[] = [
  {
    id: 'penny-black',
    name: 'Penny Black',
    description: 'The world\'s first adhesive postage stamp, issued in 1840. Highly sought after by collectors worldwide.',
    image: '/images/stamps/penny-black.jpg',
    priceRange: '£100 - £5,000+',
    category: 'Victorian',
    featured: true,
  },
  {
    id: 'penny-red',
    name: 'Penny Red',
    description: 'The successor to the Penny Black, produced from 1841 to 1879 in various plate numbers.',
    image: '/images/stamps/penny-red.jpg',
    priceRange: '£5 - £500',
    category: 'Victorian',
    featured: true,
  },
  {
    id: 'two-penny-blue',
    name: 'Two Penny Blue',
    description: 'Britain\'s second stamp, issued alongside the Penny Black in 1840.',
    image: '/images/stamps/two-penny-blue.jpg',
    priceRange: '£50 - £3,000+',
    category: 'Victorian',
    featured: true,
  },
  {
    id: 'victorian-surface',
    name: 'Victorian Surface Printed',
    description: 'A wide range of stamps from Queen Victoria\'s reign, featuring various designs and denominations.',
    image: '/images/stamps/victorian-surface.jpg',
    priceRange: '£10 - £1,000',
    category: 'Victorian',
  },
  {
    id: 'edward-vii',
    name: 'King Edward VII Issues',
    description: 'Stamps from the Edwardian era (1901-1910), known for their elegant portrait designs.',
    image: '/images/stamps/edward-vii.jpg',
    priceRange: '£5 - £500',
    category: 'Edwardian',
  },
  {
    id: 'george-v',
    name: 'King George V Issues',
    description: 'Stamps from 1910-1936, including the sought-after Seahorse high values.',
    image: '/images/stamps/george-v.jpg',
    priceRange: '£5 - £2,000',
    category: 'Edwardian',
  },
  {
    id: 'commonwealth-qe2',
    name: 'Queen Elizabeth II Commonwealth',
    description: 'Stamps from across the Commonwealth nations during Her Majesty\'s reign.',
    image: '/images/stamps/commonwealth-qe2.jpg',
    priceRange: '£20 - £500 per set',
    category: 'Commonwealth',
    featured: true,
  },
  {
    id: 'british-colonies',
    name: 'British Colonial Issues',
    description: 'Historic stamps from former British colonies and territories.',
    image: '/images/stamps/british-colonies.jpg',
    priceRange: '£10 - £1,000+',
    category: 'Commonwealth',
  },
  {
    id: 'fdc-definitive',
    name: 'First Day Covers - Definitive',
    description: 'First Day Covers featuring definitive stamp issues with special postmarks.',
    image: '/images/stamps/fdc-definitive.jpg',
    priceRange: '£5 - £50 each',
    pricePerUnit: 15,
    category: 'First Day Covers',
  },
  {
    id: 'fdc-commemorative',
    name: 'First Day Covers - Commemorative',
    description: 'Special edition First Day Covers celebrating significant events and anniversaries.',
    image: '/images/stamps/fdc-commemorative.jpg',
    priceRange: '£10 - £100 each',
    pricePerUnit: 25,
    category: 'First Day Covers',
    featured: true,
  },
  {
    id: 'complete-album',
    name: 'Complete Stamp Albums',
    description: 'Well-maintained albums with comprehensive collections from specific periods or themes.',
    image: '/images/stamps/complete-album.jpg',
    priceRange: '£100 - £10,000+',
    category: 'Albums',
  },
  {
    id: 'stockbook',
    name: 'Stockbooks & Accumulations',
    description: 'Mixed collections in stockbooks, ideal for bulk valuations.',
    image: '/images/stamps/stockbook.jpg',
    priceRange: '£50 - £1,000+',
    category: 'Albums',
  },
  {
    id: 'error-stamps',
    name: 'Error Stamps & Varieties',
    description: 'Printing errors, inverted watermarks, and other valuable varieties.',
    image: '/images/stamps/error-stamps.jpg',
    priceRange: '£50 - £50,000+',
    category: 'Rarities',
    featured: true,
  },
  {
    id: 'proofs-essays',
    name: 'Proofs & Essays',
    description: 'Pre-production proofs and essay designs, extremely rare collectibles.',
    image: '/images/stamps/proofs-essays.jpg',
    priceRange: '£100 - £10,000+',
    category: 'Rarities',
  },
  {
    id: 'european-classic',
    name: 'European Classic Issues',
    description: 'Early stamps from France, Germany, Italy, and other European nations.',
    image: '/images/stamps/european-classic.jpg',
    priceRange: '£20 - £2,000',
    category: 'Foreign',
  },
  {
    id: 'worldwide-collections',
    name: 'Worldwide Collections',
    description: 'Mixed international collections spanning multiple countries and eras.',
    image: '/images/stamps/worldwide-collections.jpg',
    priceRange: '£50 - £5,000+',
    category: 'Foreign',
  },
]

export const featuredProducts = stampProducts.filter(p => p.featured)
