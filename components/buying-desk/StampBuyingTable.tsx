"use client";

import React, { useState, useEffect } from "react";
import { BuyingRateItem, buyingRates, calculatePurchaseTotal } from "@/data/buying-rates";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Info } from "lucide-react";
import CountUp from "react-countup";

interface Quantities {
  [id: string]: number;
}

interface StampBuyingTableProps {
  onTotalChange?: (faceTotal: number, offerTotal: number) => void;
}

export const StampBuyingTable: React.FC<StampBuyingTableProps> = ({ onTotalChange }) => {
  const [quantities, setQuantities] = useState<Quantities>({});

  const handleQuantityChange = (id: string, value: number) => {
    const newVal = Math.max(0, value);
    const updated = { ...quantities, [id]: newVal };
    setQuantities(updated);
  };

  useEffect(() => {
    let faceTotal = 0;
    let offerTotal = 0;

    buyingRates.forEach((item) => {
      const qty = quantities[item.id] || 0;
      faceTotal += item.faceValue * qty;
      offerTotal += calculatePurchaseTotal(item.faceValue, qty, item.rate);
    });

    if (onTotalChange) {
      onTotalChange(faceTotal, offerTotal);
    }
  }, [quantities, onTotalChange]);

  const categories = Array.from(new Set(buyingRates.map((item) => item.category)));

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue={categories[0]} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-muted/50 p-1 glassmorphism">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="px-6 py-2">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="space-y-4">
            <div className="hidden md:block overflow-hidden rounded-xl border border-border/50 glassmorphism">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[300px]">Stamp Description</TableHead>
                    <TableHead className="text-center">Face Value</TableHead>
                    <TableHead className="text-center">Buy Rate</TableHead>
                    <TableHead className="text-center w-[150px]">Quantity</TableHead>
                    <TableHead className="text-right">Subtotal Offer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyingRates
                    .filter((item) => item.category === cat)
                    .map((item) => (
                      <TableRow key={item.id} className="hover:bg-primary/5 transition-colors group">
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-12 bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground border border-border/50 group-hover:border-primary/30 transition-colors">
                              IMG
                            </div>
                            <div>
                              <div className="font-semibold">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">£{item.faceValue.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                            {(item.rate * 100).toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              className="h-8 w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              value={quantities[item.id] || ""}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                              placeholder="0"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          £
                          <CountUp
                            end={calculatePurchaseTotal(item.faceValue, quantities[item.id] || 0, item.rate)}
                            decimals={2}
                            duration={0.5}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {buyingRates
                .filter((item) => item.category === cat)
                .map((item) => (
                  <Card key={item.id} className="glassmorphism border-border/50 overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-bold">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                          {(item.rate * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs">
                          Face: <span className="font-semibold">£{item.faceValue.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            className="h-8 w-14 text-center p-0"
                            value={quantities[item.id] || ""}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right font-bold text-primary">
                          £
                          <CountUp
                            end={calculatePurchaseTotal(item.faceValue, quantities[item.id] || 0, item.rate)}
                            decimals={2}
                            duration={0.5}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start space-x-3 mt-8">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-primary/80">
          <p className="font-semibold mb-1">How to use this tool:</p>
          <p>
            Enter the quantity for each stamp type you possess. The "Subtotal Offer" will update in real-time. 
            Once you've entered all items, use the summary bar at the bottom to lock in your offer and proceed 
            with the valuation.
          </p>
        </div>
      </div>
    </div>
  );
};
