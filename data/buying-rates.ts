export type BuyingRateGroup =
  | "1st Class"
  | "1st Class Large"
  | "2nd Class"
  | "2nd Class Large"
  | "Barcoded Values";

export interface BuyingRateItem {
  id: string;
  name: string;
  /** Top-level section in calculator and buying desk */
  group: BuyingRateGroup;
  description: string;
  faceValue: number;
  rate: number; // 0.55 for 55%
  imageUrl?: string;
  isBarcoded: boolean;
  allowDecimal?: boolean;
}

export const BUYING_RATE_GROUP_ORDER: BuyingRateGroup[] = [
  "1st Class",
  "1st Class Large",
  "2nd Class",
  "2nd Class Large",
  "Barcoded Values",
];

export const buyingRates: BuyingRateItem[] = [
  // —— 1st Class ——
  {
    id: "1st-purple-complete-sheets-25-50",
    name: "1st Class Purple Sheets of 25/50",
    group: "1st Class",
    description: "Full sheets of 25 or 50 barcoded purple 1st class stamps.",
    faceValue: 1.8,
    rate: 0.57,
    isBarcoded: true,
    imageUrl: "/images/stamp-1.70-purple.png",
  },
  {
    id: "1st-purple-complete-booklets-4-8",
    name: "1st Class Purple Books of 4/8",
    group: "1st Class",
    description: "Complete booklets of 4 or 8 barcoded purple 1st class stamps.",
    faceValue: 1.8,
    rate: 0.57,
    isBarcoded: true,
    imageUrl: "/images/stamp-1.70-purple.png",
  },
  {
    id: "1st-purple-incomplete-sheets-booklets",
    name: "1st Class Purple Part Sheets and Booklets",
    group: "1st Class",
    description: "Part sheets, incomplete booklets, or loose barcoded purple 1st class.",
    faceValue: 1.8,
    rate: 0.55,
    isBarcoded: true,
    imageUrl: "/images/stamp-1.70-purple.png",
  },
  {
    id: "1st-xmas-complete-sheets-booklets",
    name: "1st Class Xmas QR Code",
    group: "1st Class",
    description: "Complete Christmas / festive barcoded sheets and booklets.",
    faceValue: 1.8,
    rate: 0.48,
    isBarcoded: true,
    imageUrl: "/images/stamps/fdc-commemorative.jpg",
  },
  {
    id: "1st-xmas-incomplete-sheets-booklets",
    name: "1st Class Incomplete Xmas QR",
    group: "1st Class",
    description: "Incomplete festive sheets, booklets, or loose barcoded XMAS stamps.",
    faceValue: 1.8,
    rate: 0.45,
    isBarcoded: true,
    imageUrl: "/images/stamps/fdc-commemorative.jpg",
  },

  // —— 1st Class Large ——
  {
    id: "ll-1st-turquoise-complete-sheets-25-50",
    name: "1st Large Sheet of 25 and 50",
    group: "1st Class Large",
    description: "Full sheets of 25 or 50 barcoded turquoise large letter 1st class.",
    faceValue: 3.3,
    rate: 0.55,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "ll-1st-turquoise-complete-booklets-4",
    name: "1st Large Books of 4",
    group: "1st Class Large",
    description: "Complete booklets of 4 barcoded turquoise large letter 1st class.",
    faceValue: 3.3,
    rate: 0.55,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "ll-1st-turquoise-incomplete-sheets-booklets",
    name: "1st Large Incomplete Sheets",
    group: "1st Class Large",
    description: "Incomplete turquoise large letter sheets, booklets, or loose stamps.",
    faceValue: 3.3,
    rate: 0.53,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },

  // —— 2nd Class ——
  {
    id: "2nd-green-complete-sheets-25-50",
    name: "2nd Class Sheets",
    group: "2nd Class",
    description: "Full sheets of 25 or 50 barcoded green 2nd class stamps.",
    faceValue: 0.91,
    rate: 0.78,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "2nd-green-complete-booklets-8",
    name: "2nd Class Books of 8",
    group: "2nd Class",
    description: "Complete booklets of 8 barcoded green 2nd class stamps.",
    faceValue: 0.91,
    rate: 0.78,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "2nd-green-incomplete-sheets-booklets",
    name: "2nd Class Incomplete",
    group: "2nd Class",
    description: "Part sheets, incomplete booklets, or loose barcoded green 2nd class.",
    faceValue: 0.91,
    rate: 0.73,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "2nd-xmas-complete-sheets-booklets",
    name: "2nd Class Xmas QR",
    group: "2nd Class",
    description: "Complete Christmas / festive barcoded 2nd class sheets and booklets.",
    faceValue: 0.91,
    rate: 0.68,
    isBarcoded: true,
    imageUrl: "/images/stamps/fdc-definitive.jpg",
  },
  {
    id: "2nd-xmas-incomplete-sheets-booklets",
    name: "2nd Class Xmas QR Incomplete",
    group: "2nd Class",
    description: "Incomplete festive 2nd class sheets, booklets, or loose stamps.",
    faceValue: 0.91,
    rate: 0.67,
    isBarcoded: true,
    imageUrl: "/images/stamps/fdc-definitive.jpg",
  },

  // —— 2nd Class Large ——
  {
    id: "ll-2nd-green-complete-sheets-25-50",
    name: "2nd Large Sheets",
    group: "2nd Class Large",
    description: "Full sheets of 25 or 50 barcoded green large letter 2nd class.",
    faceValue: 1.55,
    rate: 0.75,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "ll-2nd-green-complete-booklets-4",
    name: "2nd Large Books of 4",
    group: "2nd Class Large",
    description: "Complete booklets of 4 barcoded green large letter 2nd class.",
    faceValue: 1.55,
    rate: 0.75,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "ll-2nd-green-incomplete-sheets-booklets",
    name: "2nd Large Incomplete",
    group: "2nd Class Large",
    description: "Incomplete large letter 2nd class sheets, booklets, or loose barcoded green stamps.",
    faceValue: 1.55,
    rate: 0.72,
    isBarcoded: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "ll-2nd-xmas-complete-sheets-booklets",
    name: "2nd Large Xmas Complete",
    group: "2nd Class Large",
    description: "Complete Christmas / festive barcoded large letter 2nd class sheets and booklets.",
    faceValue: 1.55,
    rate: 0.7,
    isBarcoded: true,
    imageUrl: "/images/stamps/fdc-definitive.jpg",
  },
  {
    id: "ll-2nd-xmas-incomplete-sheets-booklets",
    name: "2nd Large Xmas Incomplete",
    group: "2nd Class Large",
    description: "Incomplete festive large letter 2nd class sheets, booklets, or loose stamps.",
    faceValue: 1.55,
    rate: 0.67,
    isBarcoded: true,
    imageUrl: "/images/stamps/fdc-definitive.jpg",
  },

  // —— Barcoded Values ——
  {
    id: "barcoded-1-5-complete-sheets-25",
    name: "£1 - £5 Barcoded, Complete Sheets 25",
    group: "Barcoded Values",
    description: "Enter total face value, decimal, without £ sign:",
    faceValue: 1.00,
    rate: 0.55,
    isBarcoded: true,
    allowDecimal: true,
    imageUrl: "/images/stamp-1.70-purple.png",
  },
  {
    id: "barcoded-1-5-incomplete-sheets-individual",
    name: "£1 - £5 Barcoded, Incomplete Sheets, Individual Stamps",
    group: "Barcoded Values",
    description: "Enter total face value, decimal, without £ sign:",
    faceValue: 1.00,
    rate: 0.50,
    isBarcoded: true,
    allowDecimal: true,
    imageUrl: "/images/stamp-1.70-purple.png",
  },
  {
    id: "barcoded-5p-50p-complete-sheets-25",
    name: "5p - 50p Barcoded, Complete Sheets 25 (NOT 1p or 2p sorry!)",
    group: "Barcoded Values",
    description: "Enter total face value, decimal, without £ sign:",
    faceValue: 1.00,
    rate: 0.50,
    isBarcoded: true,
    allowDecimal: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
  {
    id: "barcoded-5p-50p-incomplete-sheets-individual",
    name: "5p - 50p Barcoded, Incomplete Sheets, Individual Stamps (NOT 1p or 2p sorry!)",
    group: "Barcoded Values",
    description: "Enter total face value, decimal, without £ sign:",
    faceValue: 1.00,
    rate: 0.45,
    isBarcoded: true,
    allowDecimal: true,
    imageUrl: "/images/stamp-2.20-green.png",
  },
];

export function getBuyingRateImageSrc(item: BuyingRateItem): string {
  if (item.imageUrl) return item.imageUrl;
  if (item.group === "1st Class" || item.group === "1st Class Large") return "/images/stamp-1st-red.png";
  if (item.group === "2nd Class" || item.group === "2nd Class Large") return "/images/stamp-2nd-blue.png";
  return "/images/stamp-2.20-green.png";
}

/** Sections for UIs: flat groups */
export type BuyingRateSection = {
  group: BuyingRateGroup;
  kind: "flat";
  items: BuyingRateItem[];
};

export function getBuyingRateSections(): BuyingRateSection[] {
  return BUYING_RATE_GROUP_ORDER.map((group) => {
    const items = buyingRates.filter((i) => i.group === group);
    return { group, kind: "flat" as const, items };
  });
}

export const calculatePurchaseTotal = (
  faceValue: number,
  quantity: number,
  rate: number
) => {
  return faceValue * quantity * rate;
};
