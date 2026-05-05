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



export const whatWeBuyIntro = {
  headline: "Stamps we actively purchase",
  paragraphs: [
    "We purchase a wide range of UK postage stamps, including first and second class, standard and large letter formats, as well as newer barcoded issues and older definitive designs. Whatever UK postage stamps you have available, we aim to provide a clear and fair route to selling them.",
  ],
}

export const whatWeBuyCategories: WhatWeBuyCategory[] = [
  {
    id: "everyday-postage",
    title: "Everyday postage",
    image: "/images/stamps/george-v.jpg",
    imageAlt: "UK definitive portrait stamps from the George V era as an example of everyday issues",
    description:
      "Current and recent unused postage, including 1st and 2nd class, standard, and large letter formats—both barcoded and older designs.",
  },
  {
    id: "special-issues",
    title: "Special issues",
    image: "/images/stamps/fdc-commemorative.jpg",
    imageAlt: "Commemorative first day cover with special UK stamps",
    description:
      "Unused Royal Mail commemorative sets, miniature sheets, and presentation packs.",
  },
  {
    id: "collections",
    title: "Collections and albums",
    image: "/images/stamps/complete-album.jpg",
    imageAlt: "Stamp album open showing a collection of UK stamps",
    description:
      "Inherited albums, mixed lots, and stock books containing genuine, unused UK postage.",
    indicativeNote: "Large or mixed lots are best submitted through our appraisal flow with photos.",
  },
]
