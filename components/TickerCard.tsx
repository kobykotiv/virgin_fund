"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface TickerCardProps {
  symbol: string;
  name?: string;
  price: number;
  change: number; // daily % change
  volume?: number;
  onClick?: () => void;
}

export default function TickerCard({
  symbol,
  name,
  price,
  change,
  volume,
  onClick,
}: TickerCardProps) {
  const isUp = change >= 0;

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
      <Card
        onClick={onClick}
        className="cursor-pointer rounded-2xl shadow-md hover:shadow-lg transition-colors bg-card border border-border"
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-bold">{symbol}</CardTitle>
          <span className={`flex items-center text-sm font-medium ${isUp ? "text-green-500" : "text-red-500"}`}>
            {isUp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            {change.toFixed(2)}%
          </span>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">${price.toFixed(2)}</p>
          {name && <p className="text-sm text-muted-foreground truncate">{name}</p>}
          {volume !== undefined && (
            <p className="mt-2 text-xs text-muted-foreground">Vol: {Intl.NumberFormat().format(volume)}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
