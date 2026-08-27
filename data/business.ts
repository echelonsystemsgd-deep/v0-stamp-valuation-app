/**
 * Centralized Business & Operational Configuration
 * 
 * NOTE FOR CLIENT / STAKEHOLDERS:
 * Items marked with [Client Verification Required] represent placeholder operational data.
 * Update these values when real company registration, telephone lines, and addresses are finalized.
 */

export interface BusinessAddress {
  street: string;
  city: string;
  region?: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface BusinessConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  phone: string;
  phoneRaw: string;
  email: string;
  valuationEmail: string;
  address: BusinessAddress;
  operatingHours: {
    display: string;
    daysOfWeek: string[];
    opens: string;
    closes: string;
  };
  transitInsuranceLimit: string;
  payoutTimeframe: string;
  socials: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  isVerified: boolean;
}

export const BUSINESS_CONFIG: BusinessConfig = {
  name: "Sell Your Stamps UK",
  legalName: "Sell Your Stamps UK Ltd", // [Client Verification Required: Company House registered name]
  tagline: "EXPERT VALUATIONS. FAIR PRICES. TRUSTED BUYERS.",
  description: "The UK's most trusted stamp valuation and buying service. Heritage-focused, expert-led, and committed to fair market prices.",
  phone: "+44 (0)20 1234 5678", // [Client Verification Required: Direct line]
  phoneRaw: "+442012345678",
  email: "info@sellyourstamps.co.uk",
  valuationEmail: "valuations@sellyourstamps.co.uk",
  address: {
    street: "123 Philately House", // [Client Verification Required: Registered physical trading premises]
    city: "London",
    region: "Greater London",
    postalCode: "EC1A 1AA",
    country: "GB",
    latitude: 51.5174,
    longitude: -0.0988,
  },
  operatingHours: {
    display: "Monday – Friday: 9:00 AM – 5:00 PM GMT",
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
  transitInsuranceLimit: "£50,000",
  payoutTimeframe: "Processed same day upon acceptance",
  socials: {
    facebook: "https://www.facebook.com/sellyourstampsuk", // [Client Verification Required]
    twitter: "https://twitter.com/sellyourstamps",        // [Client Verification Required]
  },
  isVerified: false,
};
