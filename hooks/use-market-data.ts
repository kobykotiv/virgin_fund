import { useState, useEffect } from 'react';
import { MarketQuote } from '@/types/market';
import { MarketDataService } from '@/services/market-data';

interface MarketData {
  quotes: Record<string, MarketQuote>;
  loading: boolean;
  error: string | null;
}

export function useMarketData(symbols: string[]): MarketData {
  const [quotes, setQuotes] = useState<Record<string, MarketQuote>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!symbols.length) {
          setQuotes({});
          return;
        }

        // Filter out any undefined symbols
        const validSymbols = symbols.filter(Boolean);
        if (!validSymbols.length) {
          setQuotes({});
          return;
        }

        // Check for Alpaca credentials
        const apiKey = localStorage.getItem('alpaca_api_key');
        const secretKey = localStorage.getItem('alpaca_secret_key');

        if (apiKey && secretKey) {
          // Use Alpaca API
          const marketDataService = new MarketDataService(apiKey, secretKey, true);
          const snapshot = await marketDataService.getSnapshot(validSymbols);

          // Transform Alpaca data to our format
          const transformedQuotes: Record<string, MarketQuote> = {};
          Object.entries(snapshot).forEach(([symbol, quote]: [string, any]) => {
            if (quote?.latestTrade?.p && quote?.latestQuote?.ap) {
              const price = quote.latestTrade.p;
              const prevClose = quote.dailyBar?.c || quote.prevDailyBar?.c || price;
              const change = price - prevClose;
              const changePercent = (change / prevClose) * 100;

              transformedQuotes[symbol] = {
                symbol,
                price,
                change,
                changePercent,
                volume: quote.dailyBar?.v || 0,
                lastUpdated: new Date(quote.latestTrade.t)
              };
            }
          });

          setQuotes(transformedQuotes);
        } else {
          // Fetch from our API endpoint which uses demo data
          const response = await fetch(`/api/market-data?symbols=${validSymbols.join(',')}`);
          
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          
          const result = await response.json();
          
          if (!result.success) {
            throw new Error(result.error || 'Failed to fetch market data');
          }
          
          setQuotes(result.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch market data');
        console.error('Error fetching market data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

    // Set up interval for periodic updates
    const intervalId = setInterval(fetchData, 15000); // Update every 15 seconds

    return () => clearInterval(intervalId);
  }, [symbols.join(',')]);
  
  return { quotes, loading, error };
}
