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
  /** Subtitle showing the formats accepted, e.g., "Sheets, Booklets & Loose" */
  formatsSubtitle?: string
  /** The top rate label, e.g., "Up to 55%" */
  rateLabel?: string
  /** Static indicative wording only — not a live calculator. */
  indicativeNote?: string
}



export const whatWeBuyIntro = {
  headline: "Stamps we actively purchase",
  paragraphs: [
    "We purchase a wide range of UK postage stamps, including first and second class, standard and large letter formats, as well as newer barcoded issues and older definitive designs. Whatever UK postage stamps you have available, we aim to provide a clear and fair route to selling them.",
  ],
}

export const whatWeBuyCategories: WhatWeBuyCategory[] = [
  {
    id: "1st-class",
    title: "1st Class Stamps",
    formatsSubtitle: "Sheets, Booklets & Loose",
    image: "/images/stamp-1.70-purple.png",
    imageAlt: "1st Class purple barcoded stamp",
    description:
      "We buy 1st Class barcoded stamps, including standard purple issues and Christmas/festive designs in both sheets and booklets.",
    rateLabel: "Up to 57%",
  },
  {
    id: "2nd-class",
    title: "2nd Class Stamps",
    formatsSubtitle: "Sheets, Booklets & Loose",
    image: "/images/stamp-2.20-green.png",
    imageAlt: "2nd Class green barcoded stamp",
    description:
      "We buy 2nd Class barcoded stamps, including standard green issues and Christmas/festive designs.",
    rateLabel: "Up to 78%",
  },
  {
    id: "large-letter",
    title: "Large Letter Formats",
    formatsSubtitle: "1st & 2nd Class Large Letter",
    image: "/images/stamps/fdc-commemorative.jpg",
    imageAlt: "Commemorative large letter stamps",
    description:
      "We buy both 1st and 2nd Class Large Letter stamps, including barcoded, commemorative, and non-barcoded self-adhesive issues.",
    rateLabel: "Up to 75%",
  },
  {
    id: "collections",
    title: "Mixed Collections & Albums",
    formatsSubtitle: "Albums, Stock Books & Dealer Lots",
    image: "/images/stamps/complete-album.jpg",
    imageAlt: "Stamp album open showing a collection of UK stamps",
    description:
      "Have a large mixed lot? Instead of the calculator, use our appraisal form to get a custom offer.",
    rateLabel: "Custom Appraisal",
  },
]
