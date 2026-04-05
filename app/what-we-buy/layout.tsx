import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Current Stamp Buying Rates | UK Stamp Valuation Service',
  description: 'Pro-active pricing desk for your stamp collections. Calculate your fixed offer in real-time for 1st Class, 2nd Class, and Large Letter stamps.',
  openGraph: {
    title: 'Current Stamp Buying Rates | UK Stamp Valuation Service',
    description: 'Get an instant valuation on your stamps with our interactive buying desk.',
    type: 'website',
  },
};

export default function WhatWeBuyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
