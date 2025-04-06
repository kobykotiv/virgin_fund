import { useState, useEffect } from 'react';

interface MarketDataOptions {
  symbol?: string;
  timeframe?: string;
  start?: string;
  end?: string;
}

interface CalendarOptions {
  start?: string;
  end?: string;
}

interface ActivityOptions {
  type?: string;
  date?: string;
}

export function useMarketData<T = any>(endpoint: 'data' | 'calendar' | 'activities', options: MarketDataOptions | CalendarOptions | ActivityOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams();
        
        // Add all options as query parameters
        Object.entries(options).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        
        const url = `/api/market/${endpoint}?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Unknown error occurred');
        }
        
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Error fetching market data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [endpoint, JSON.stringify(options)]);
  
  return { data, loading, error };
}
