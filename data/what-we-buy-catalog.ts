/**
 * Read-only catalog content for /what-we-buy.
 * Edit categories and copy here without changing page layout.
 */

export type WhatWeBuyCategory = {
  id: string
  title: string
  description: string
  /** Same paths as `data/stamps.ts` — single source for imagery with the home grid. */
  image: string
  imageAlt: string
  examples?: string[]
  /** Static indicative wording only — not a live calculator. */
  indicativeNote?: string
}

export type WhatWeBuyExclusion = {
  title: string
  description: string
}

export const whatWeBuyIntro = {
  headline: "Stamps and material we actively purchase",
  paragraphs: [
    "We specialise in British decimal and modern UK issues. Below is a clear overview of what we buy day to day. If your material matches, the next step is a free valuation—either with our instant tools or a professional appraisal for larger lots.",
    "Figures shown are indicative only; final offers depend on condition, sorting, and verification.",
  ],
}

export const whatWeBuyCategories: WhatWeBuyCategory[] = [
  {
    id: "modern-definitives",
    title: "Modern definitives",
    image: "/images/stamps/george-v.jpg",
    imageAlt: "UK definitive portrait stamps from the George V era as an example of everyday issues",
    description:
      "Current and recent everyday postage: barcoded and earlier Machin-style definitives in sheets, booklets, and part sheets.",
    examples: [
      "1st and 2nd class sheets and booklets",
      "Large letter formats",
      "Coils and retail booklets in usable condition",
    ],
    indicativeNote:
      "Typical purchases are quoted as a percentage of face value; barcoded and complete units often attract the strongest percentages.",
  },
  {
    id: "commemoratives",
    title: "Commemoratives and special issues",
    image: "/images/stamps/fdc-commemorative.jpg",
    imageAlt: "Commemorative first day cover with special UK stamps",
    description:
      "Royal Mail commemoratives, mini-sheets, and special sets where demand is clear and condition is sound.",
    examples: ["Recent commemorative sets", "Presentation packs (selected)", "Mint NH where stated"],
    indicativeNote: "Rates vary by issue and theme; we confirm after inspection.",
  },
  {
    id: "fdc",
    title: "First day covers",
    image: "/images/stamps/fdc-definitive.jpg",
    imageAlt: "First day cover featuring definitive UK stamps",
    description: "Clean, unaddressed FDCs and related postal history of mainstream UK issues, when they fit our stock profile.",
    examples: ["Unaddressed FDCs", "Sets in protective sleeves"],
  },
  {
    id: "collections",
    title: "Collections, albums, and mixtures",
    image: "/images/stamps/complete-album.jpg",
    imageAlt: "Stamp album open showing a collection of UK stamps",
    description:
      "Albums, stock books, and mixed lots of UK material. We assess on merit—sorting and condition strongly affect the offer.",
    examples: ["Part collections", "Dealer lots", "Inherited albums"],
    indicativeNote: "Large or mixed lots are best submitted through our appraisal flow with photos.",
  },
]

export const whatWeBuyExclusions: WhatWeBuyExclusion[] = [
  {
    title: "Heavily damaged or incomplete",
    description: "Torn, heavily hinged, or incomplete booklets and sheets may fall outside our standard purchase terms.",
  },
  {
    title: "Non-UK or doubtful material",
    description: "We focus on British decimal/modern UK issues; foreign and cinderella material is usually declined.",
  },
  {
    title: "Uncertain provenance",
    description: "We reserve the right to decline items that cannot be verified or do not match described condition.",
  },
]
