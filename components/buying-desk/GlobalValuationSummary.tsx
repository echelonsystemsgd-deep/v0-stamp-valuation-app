"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";
import CountUp from "react-countup";

interface GlobalValuationSummaryProps {
  faceTotal: number;
  offerTotal: number;
  onLockIn?: () => void;
}

export const GlobalValuationSummary: React.FC<GlobalValuationSummaryProps> = ({
  faceTotal,
  offerTotal,
  onLockIn,
}) => {
  if (offerTotal <= 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-border bg-background/80 backdrop-blur-lg lg:p-0">
      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="hidden sm:block">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Total Face Value
              </div>
              <div className="text-lg font-bold text-foreground">
                £
                <CountUp end={faceTotal} decimals={2} duration={0.5} />
              </div>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                Your Fixed Offer
              </div>
              <div className="text-2xl font-black text-primary">
                £
                <CountUp end={offerTotal} decimals={2} duration={0.5} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="lg"
              className="group bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={onLockIn}
            >
              <ShoppingCart className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              Lock In This Offer
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
