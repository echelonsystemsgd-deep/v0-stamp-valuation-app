export interface BuyingRateItem {
  id: string;
  name: string;
  category: string; // "1st Class" | "2nd Class" | "Large Letter" | "Special"
  description: string;
  faceValue: number;
  rate: number; // 0.55 for 55%
  imageUrl?: string;
  isBarcoded: boolean;
}

export const buyingRates: BuyingRateItem[] = [
  // 1st Class Barcoded
  {
    id: "1st-class-sheets-barcoded",
    name: "1st Class Sheets (25/50)",
    category: "1st Class",
    description: "Full sheets of 25 or 50 stamps, barcoded.",
    faceValue: 1.35, // Current 1st class rate (approx, check details if needed)
    rate: 0.55,
    isBarcoded: true,
  },
  {
    id: "1st-class-booklets-barcoded",
    name: "1st Class Booklets (4/8)",
    category: "1st Class",
    description: "Full booklets of 4 or 8 stamps, barcoded.",
    faceValue: 1.35,
    rate: 0.55,
    isBarcoded: true,
  },
  {
    id: "1st-class-incomplete-barcoded",
    name: "1st Class Incomplete/Loose",
    category: "1st Class",
    description: "Incomplete sheets or loose barcoded stamps.",
    faceValue: 1.35,
    rate: 0.525,
    isBarcoded: true,
  },

  // 1st Class XMAS/Commem
  {
    id: "1st-class-xmas-barcoded",
    name: "1st Class XMAS/Commem (Barcoded)",
    category: "1st Class",
    description: "Special event or Christmas stamps with barcodes.",
    faceValue: 1.35,
    rate: 0.45,
    isBarcoded: true,
  },
  {
    id: "1st-class-non-barcoded",
    name: "1st Class Non-Barcoded",
    category: "1st Class",
    description: "Legacy non-barcoded 1st class stamps.",
    faceValue: 1.35,
    rate: 0.325,
    isBarcoded: false,
  },

  // 2nd Class Barcoded
  {
    id: "2nd-class-sheets-barcoded",
    name: "2nd Class Sheets (25/50)",
    category: "2nd Class",
    description: "Full sheets of 25 or 50 stamps, barcoded.",
    faceValue: 0.85,
    rate: 0.75,
    isBarcoded: true,
  },
  {
    id: "2nd-class-booklets-barcoded",
    name: "2nd Class Booklets (8)",
    category: "2nd Class",
    description: "Full booklets of 8 stamps, barcoded.",
    faceValue: 0.85,
    rate: 0.725,
    isBarcoded: true,
  },
  {
    id: "2nd-class-incomplete-barcoded",
    name: "2nd Class Incomplete/Loose",
    category: "2nd Class",
    description: "Incomplete sheets or loose barcoded stamps.",
    faceValue: 0.85,
    rate: 0.70,
    isBarcoded: true,
  },

  // 2nd Class Large Letter
  {
    id: "2nd-class-large-letter-sheets",
    name: "2nd Class Large Letter Sheets",
    category: "Large Letter",
    description: "Full sheets of Large Letter stamps, barcoded.",
    faceValue: 1.15,
    rate: 0.70,
    isBarcoded: true,
  },
  {
    id: "2nd-class-large-letter-booklets",
    name: "2nd Class Large Letter Booklets",
    category: "Large Letter",
    description: "Full booklets of Large Letter stamps, barcoded.",
    faceValue: 1.15,
    rate: 0.70,
    isBarcoded: true,
  },
  {
    id: "2nd-class-large-letter-incomplete",
    name: "2nd Class Large Letter Incomplete",
    category: "Large Letter",
    description: "Incomplete sheets or loose Large Letter barcoded stamps.",
    faceValue: 1.15,
    rate: 0.675,
    isBarcoded: true,
  }
];

export const calculatePurchaseTotal = (faceValue: number, quantity: number, rate: number) => {
  return faceValue * quantity * rate;
};
