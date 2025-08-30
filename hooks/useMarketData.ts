import { useState, useEffect } from 'react';

interface Quote {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

interface MarketData {
  quotes: Record<string, Quote>;
  loading: boolean;
  error: string | null;
}

export function useMarketData(symbols: string[]): MarketData {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
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

        const response = await fetch(`/api/alpaca/market?symbols=${validSymbols.join(',')}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Unknown error occurred');
        }
        
        setQuotes(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching market data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [JSON.stringify(symbols)]);
  
  return { quotes, loading, error };
}
