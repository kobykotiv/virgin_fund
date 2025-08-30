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

        // Ensure symbols is always an array
        const safeSymbols: string[] = Array.isArray(symbols) ? symbols : [];

        if (!safeSymbols.length) {
          setQuotes({});
          setError(null);
          setLoading(false);
          return;
        }

        // Filter out any undefined or non-string symbols
        const validSymbols = safeSymbols.filter((s): s is string => typeof s === 'string' && Boolean(s));
        if (!validSymbols.length) {
          setQuotes({});
          setError(null);
          setLoading(false);
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
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching market data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Use a stable dependency for useEffect
    const symbolsKey = Array.isArray(symbols) ? symbols.join(',') : '';
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Array.isArray(symbols) ? symbols.join(',') : '']);

  return { quotes, loading, error };
}
