import { supabase } from './supabase';

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export async function fetchHistoricalData(symbol: string) {
  try {
    // First check cache
    const { data: cachedData, error: cacheError } = await supabase
      .from('asset_data')
      .select('*')
      .eq('symbol', symbol)
      .gte('last_updated', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (cacheError) {
      console.error('Cache read error:', cacheError);
    }

    if (cachedData?.length) {
      return cachedData;
    }

    // If not in cache, fetch from Alpha Vantage
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();

    if (data['Time Series (Daily)']) {
      return Object.entries(data['Time Series (Daily)']).map(
        ([date, values]: [string, any]) => ({
          symbol,
          date,
          price: parseFloat(values['4. close']),
          last_updated: new Date().toISOString(),
        })
      );
    }

    throw new Error('Failed to fetch historical data');
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
}