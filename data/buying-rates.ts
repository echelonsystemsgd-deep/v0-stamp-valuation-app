export type BuyingRateGroup = "1st Class" | "2nd Class" | "Large Letter";

export type LargeLetterSubgroup = "1st Class Large" | "2nd Class Large";

export interface BuyingRateItem {
  id: string;
  name: string;
  /** Top-level section in calculator and buying desk */
  group: BuyingRateGroup;
  /** Only when `group` is Large Letter — renders as a subheading */
  subgroup?: LargeLetterSubgroup;
  description: string;
  faceValue: number;
  rate: number; // 0.55 for 55%
  imageUrl?: string;
  isBarcoded: boolean;
}

export const BUYING_RATE_GROUP_ORDER: BuyingRateGroup[] = [
  "1st Class",
  "2nd Class",
  "Large Letter",
];

export const buyingRates: BuyingRateItem[] = [
  // —— 1st Class ——
  {
    id: "1st-purple-complete-sheets-25-50",
    name: "1st Class Barcoded Purple, Complete Sheet 25/50",
    group: "1st Class",
    description: "Full sheets of 25 or 50 barcoded purple 1st class stamps.",
    faceValue: 1.35,
    rate: 0.55,
    isBarcoded: true,
    imageUrl: "/images/stamp-1.70-purple.png",
  },
  {
    id: "1st-purple-complete-booklets-4-8",
    name: "1st Class Barcoded Purple, Complete Booklets 4/8",
    group: "1st Class",
    description: "Complete booklets of 4 or 8 barcoded purple 1st class stamps.",
    faceValue: 1.35,
    rate: 0.55,
    isBarcoded: true,
    imageUrl: "/images/stamp-1.70-purple.png",
  },
  {
    id: "1st-purple-incomplete-sheets-booklets",
    name: "1st Class Barcoded Purple, Incomplete Sheets & Booklets",
    group: "1st Class",
    description: "Part sheets, incomplete booklets, or loose barcoded purple 1st class.",
    faceValue: 1.35,
    rate: 0.525,
    isBarcoded: true,
    imageUrl: "/images/stamp-1.70-purple.png",
  },
  {
    id: "1st-xmas-complete-sheets-booklets",
    name: "1st Class Barcoded XMAS, Complete Sheets and Booklets",
    group: "1st Class",
    description: "Complete Christmas / festive barcoded sheets and booklets.",
    faceValue: 1.35,
    rate: 0.45,
    isBarcoded: true,
    imageUrl: "/images/stamps/fdc-commemorative.jpg",
  },
  {
    id: "1st-xmas-incomplete-sheets-booklets",
    name: "1st Class Barcoded XMAS, Incomplete Sheets and Booklets",
    group: "1st Class",
    description: "Incomplete festive sheets, booklets, or loose barcoded XMAS stamps.",
    faceValue: 1.35,
    rate: 0.4,
    isBarcoded: true,
    imageUrl: "/images/stamps/fdc-commemorative.jpg",
  },

  // —— 2nd Class ——
  {
    id: "2nd-green-complete-sheets-25-50",
    name: "2nd Class Barcoded Green, Complete Sheets 25/50",
    group: "2nd Class",
    description: "Full sheets of 25 or 50 barcoded green 2nd class stamps.",
    faceValue: 0.85,
    rate: 0.75,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "2nd-green-complete-booklets-8",
    name: "2nd Class Barcoded Green, Complete Booklets 8",
    group: "2nd Class",
    description: "Complete booklets of 8 barcoded green 2nd class stamps.",
    faceValue: 0.85,
    rate: 0.725,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "2nd-green-incomplete-sheets-booklets",
    name: "2nd Class Barcoded Green, Incomplete Sheets & Booklets",
    group: "2nd Class",
    description: "Part sheets, incomplete booklets, or loose barcoded green 2nd class.",
    faceValue: 0.85,
    rate: 0.7,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "2nd-xmas-complete-sheets-booklets",
    name: "2nd Class Barcoded XMAS, Complete Sheets and Booklets",
    group: "2nd Class",
    description: "Complete Christmas / festive barcoded 2nd class sheets and booklets.",
    faceValue: 0.85,
    rate: 0.6,
    isBarcoded: true,
    imageUrl: "/images/stamps/fdc-definitive.jpg",
  },
  {
    id: "2nd-xmas-incomplete-sheets-booklets",
    name: "2nd Class Barcoded XMAS, Incomplete Sheets and Booklets",
    group: "2nd Class",
    description: "Incomplete festive 2nd class sheets, booklets, or loose stamps.",
    faceValue: 0.85,
    rate: 0.55,
    isBarcoded: true,
    imageUrl: "/images/stamps/fdc-definitive.jpg",
  },

  // —— Large Letter — 1st Class ——
  {
    id: "ll-1st-commem-xmas-non-barcoded-self-adhesive",
    name: "1st Class Commemorative & Xmas, Non Barcoded Self Adhesive Stamps",
    group: "Large Letter",
    subgroup: "1st Class Large",
    description: "Large letter format commemorative and Christmas self-adhesive, non-barcoded.",
    faceValue: 1.7,
    rate: 0.35,
    isBarcoded: false,
    imageUrl: "/images/stamp-1.70-purple.png",
  },
  {
    id: "ll-1st-commem-xmas-non-barcoded-gummed",
    name: "1st Class Commemorative & Xmas, Non Barcoded Gummed Stamps",
    group: "Large Letter",
    subgroup: "1st Class Large",
    description: "Large letter commemorative and Christmas gummed stamps without barcode.",
    faceValue: 1.7,
    rate: 0.33,
    isBarcoded: false,
    imageUrl: "/images/stamp-1.70-purple.png",
  },
  {
    id: "ll-1st-turquoise-complete-sheets-25-50",
    name: "1st Class Large Letter Barcoded Turquoise, Complete Sheets 25/50",
    group: "Large Letter",
    subgroup: "1st Class Large",
    description: "Full sheets of 25 or 50 barcoded turquoise large letter 1st class.",
    faceValue: 1.7,
    rate: 0.52,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "ll-1st-turquoise-complete-booklets-4",
    name: "1st Class Large Letter Barcoded Turquoise, Complete Booklets 4",
    group: "Large Letter",
    subgroup: "1st Class Large",
    description: "Complete booklets of 4 barcoded turquoise large letter 1st class.",
    faceValue: 1.7,
    rate: 0.52,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "ll-1st-turquoise-incomplete-sheets-booklets",
    name: "1st Class Large Letter Barcoded Turquoise, Incomplete Sheets & Booklets",
    group: "Large Letter",
    subgroup: "1st Class Large",
    description: "Incomplete turquoise large letter sheets, booklets, or loose stamps.",
    faceValue: 1.7,
    rate: 0.5,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },

  // —— Large Letter — 2nd Class ——
  {
    id: "ll-2nd-green-complete-booklets-sheets-25-50",
    name: "2nd Class Large Letter Barcoded Green, Complete Booklets & Complete Sheets 25/50",
    group: "Large Letter",
    subgroup: "2nd Class Large",
    description: "Complete large letter 2nd class booklets and full sheets of 25 or 50, barcoded green.",
    faceValue: 1.15,
    rate: 0.7,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "ll-2nd-green-incomplete-sheets-booklets",
    name: "2nd Class Large Letter Barcoded Green, Incomplete Sheets & Booklets",
    group: "Large Letter",
    subgroup: "2nd Class Large",
    description: "Incomplete large letter 2nd class sheets, booklets, or loose barcoded green stamps.",
    faceValue: 1.15,
    rate: 0.675,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "ll-2nd-xmas-complete-sheets-booklets",
    name: "2nd Class Large Letter Barcoded XMAS, Complete Sheets and Booklets",
    group: "Large Letter",
    subgroup: "2nd Class Large",
    description: "Complete Christmas / festive barcoded large letter 2nd class sheets and booklets.",
    faceValue: 1.15,
    rate: 0.6,
    isBarcoded: true,
    imageUrl: "/images/stamps/fdc-definitive.jpg",
  },
  {
    id: "ll-2nd-xmas-incomplete-sheets-booklets",
    name: "2nd Class Large Letter Barcoded XMAS, Incomplete Sheets and Booklets",
    group: "Large Letter",
    subgroup: "2nd Class Large",
    description: "Incomplete festive large letter 2nd class sheets, booklets, or loose stamps.",
    faceValue: 1.15,
    rate: 0.55,
    isBarcoded: true,
    imageUrl: "/images/stamps/fdc-definitive.jpg",
  },
];

const LARGE_LETTER_SUBGROUP_ORDER: LargeLetterSubgroup[] = [
  "1st Class Large",
  "2nd Class Large",
];

export function getBuyingRateImageSrc(item: BuyingRateItem): string {
  if (item.imageUrl) return item.imageUrl;
  if (item.group === "1st Class") return "/images/stamp-1st-red.png";
  if (item.group === "2nd Class") return "/images/stamp-2nd-blue.png";
  return "/images/stamp-2.20-green.png";
}

/** Sections for UIs: flat groups, or Large Letter as nested subgroups */
export type BuyingRateSection =
  | { group: BuyingRateGroup; kind: "flat"; items: BuyingRateItem[] }
  | {
      group: "Large Letter";
      kind: "nested";
      subgroups: { title: LargeLetterSubgroup; items: BuyingRateItem[] }[];
    };

export function getBuyingRateSections(): BuyingRateSection[] {
  return BUYING_RATE_GROUP_ORDER.map((group) => {
    const items = buyingRates.filter((i) => i.group === group);
    if (group !== "Large Letter") {
      return { group, kind: "flat" as const, items };
    }
    const subgroups = LARGE_LETTER_SUBGROUP_ORDER.map((title) => ({
      title,
      items: items.filter((i) => i.subgroup === title),
    }));
    return { group: "Large Letter", kind: "nested" as const, subgroups };
  });
}

export const calculatePurchaseTotal = (
  faceValue: number,
  quantity: number,
  rate: number
) => {
  return faceValue * quantity * rate;
};
