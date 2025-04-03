"use client"

import Link from "next/link"
import { BotShowcase } from "@/components/bot-showcase"
import { Button } from "@/components/ui/button"
import { ChevronRight, Bot } from "lucide-react"
import { useConditionalAuth } from "@/contexts/auth-context"
import { LiveTicker } from "@/components/live-ticker"
import { useEffect, useState } from "react"

/**
 * Fetches the top 5 trending stock symbols from Alpaca Markets API.
 * 
 * @returns {Promise<string[]>} A promise that resolves to an array of trending stock symbols.
 * If an error occurs during the fetch, an empty array is returned.
 */
function fetchTrendingSymbols(): Promise<string[]> {
  return Promise.resolve([]);
}

/**
 * Fetches the top 5 trending cryptocurrency symbols from Alpaca Markets API.
 * 
 * @returns {Promise<string[]>} A promise that resolves to an array of trending cryptocurrency symbols.
 * If an error occurs during the fetch, an empty array is returned.
 */
function fetchTrendingCoins(): Promise<string[]> {
  return Promise.resolve([]);
}

export function HeroSection() {
  // Use conditional auth hook that provides safe defaults
  const { isDemoMode } = useConditionalAuth();

  const [symbols, setSymbols] = useState<string[]>([]);
  const [coins, setCoins] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [fetchedSymbols, fetchedCoins] = await Promise.all([
        fetchTrendingSymbols(),
        fetchTrendingCoins(),
      ]);
      setSymbols(fetchedSymbols);
      setCoins(fetchedCoins);
    }
    fetchData();
  }, []);

  return (
    <div>
      <LiveTicker symbols={[...symbols, ...coins]} />
      <div className="relative z-10 w-full h-64 md:h-96 bg-gradient-to-b from-primary/10 to-transparent rounded-lg overflow-hidden">
      </div>
      <BotShowcase />
    </div>
  );
}
