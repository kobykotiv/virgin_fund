"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { getMarketData, MarketData } from '@/lib/market-data';

export function MarketTicker({ symbols = ['SPY', 'QQQ', 'IWM', 'DIA'] }) {
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        symbols.map(symbol => getMarketData(symbol))
      );
      setMarketData(data);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [symbols]);

  return (
    <div className="flex gap-4 overflow-x-auto py-4 px-6">
      {marketData.map((data) => (
        <Card key={data.symbol} className="p-4 min-w-[200px] backdrop-blur-sm bg-background/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${data.symbol}-${data.price}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-bold">{data.symbol}</h4>
                <Badge variant={data.change >= 0 ? "success" : "destructive"}>
                  {data.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {data.changePercent.toFixed(2)}%
                </Badge>
              </div>
              <div className="text-2xl font-mono">${data.price.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                Vol: {data.volume.toLocaleString()}
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      ))}
    </div>
  );
}
