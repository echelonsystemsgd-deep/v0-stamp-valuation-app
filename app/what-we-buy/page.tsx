"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StampBuyingTable } from "@/components/buying-desk/StampBuyingTable";
import { GlobalValuationSummary } from "@/components/buying-desk/GlobalValuationSummary";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, TrendingUp, Clock, Info } from "lucide-react";
import { InlineSellCTA } from '@/components/sections/sell-cta';

export default function WhatWeBuyPage() {
  const [totals, setTotals] = useState({ face: 0, offer: 0 });

  const handleTotalChange = (face: number, offer: number) => {
    setTotals({ face, offer });
  };

  const handleLockIn = () => {
    alert(`You've locked in an offer of £${totals.offer.toFixed(2)}! Redirecting to checkout...`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <Header />

      <main className="flex-1 pb-24 lg:pb-32">
        <section className="bg-oxford-blue relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center space-y-6 mb-16">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
                Professional Acquisition Desk
              </Badge>
              <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-7xl">
                Current <span className="text-primary italic">Buying Rates</span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-white/80 font-medium">
                Transparent pricing for your stamp collections. Calculate your fixed offer in real-time and lock in today's best rates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
              {[
                { icon: ShieldCheck, title: "Secure Offer", desc: "No haggling. Fixed rates based on market value." },
                { icon: TrendingUp, title: "Market Rates", desc: "Daily updates ensuring you get the best price." },
                { icon: Clock, title: "Fast Checkout", desc: "Lock in your rate and get paid within 48 hours." },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl shadow-primary/5 group hover:border-primary/30 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-white/60 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 -mt-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="bg-background rounded-3xl p-6 md:p-10 shadow-2xl border border-border/50">
               <StampBuyingTable onTotalChange={handleTotalChange} />
            </div>
          </div>
        </section>

        <section className="pb-20 lg:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <InlineSellCTA 
              variant="dark"
              title="Ready to finalize your valuation?"
              description="Our experts are standing by to process your collection. Lock in your rates now to guarantee the current market price."
            />
          </div>
        </section>
      </main>

      <GlobalValuationSummary
        faceTotal={totals.face}
        offerTotal={totals.offer}
        onLockIn={handleLockIn}
      />
      <Footer />
    </div>
  );
}
