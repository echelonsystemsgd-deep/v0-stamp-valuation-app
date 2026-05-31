import { buyingRates, BuyingRateItem } from "@/data/buying-rates";

export type StampRate = BuyingRateItem;

// Export a shared constant for rates used across the app
export const STAMP_RATES: StampRate[] = buyingRates;
