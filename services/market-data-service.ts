// Market data service to fetch data from multiple sources
import { isDemoMode } from "./demo-service"

// Define the market data interface
export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  previousClose: number
  marketCap?: number
  timestamp: string
}

// Data sources enum
export enum DataSource {
  ALPACA = "alpaca",
  YAHOO_FINANCE = "yahoo",
  COINGECKO = "coingecko",
  DEMO = "demo",
}

// Cache for market data to avoid excessive API calls
const marketDataCache: Record<string, { data: MarketData; timestamp: number }> = {}
const CACHE_EXPIRY = 15000 // 15 seconds

// Get market data for a symbol
export async function getMarketData(symbol: string, forceRefresh = false): Promise<MarketData> {
  // Check if we're in demo mode
  if (isDemoMode()) {
    return getDemoMarketData(symbol)
  }

  // Check cache first if not forcing refresh
  const cacheKey = symbol.toUpperCase()
  const now = Date.now()
  if (!forceRefresh && marketDataCache[cacheKey] && now - marketDataCache[cacheKey].timestamp < CACHE_EXPIRY) {
    return marketDataCache[cacheKey].data
  }

  // Try Alpaca first
  try {
    const data = await getAlpacaMarketData(symbol)
    // Cache the result
    marketDataCache[cacheKey] = { data, timestamp: now }
    return data
  } catch (error) {
    console.warn(`Alpaca data fetch failed for ${symbol}, trying Yahoo Finance`, error)

    // Try Yahoo Finance as fallback
    try {
      const data = await getYahooFinanceMarketData(symbol)
      // Cache the result
      marketDataCache[cacheKey] = { data, timestamp: now }
      return data
    } catch (yahooError) {
      console.warn(`Yahoo Finance data fetch failed for ${symbol}, trying CoinGecko`, yahooError)

      // Try CoinGecko as a last resort for crypto
      if (symbol.includes("-USD") || symbol.includes("BTC") || symbol.includes("ETH")) {
        try {
          const data = await getCoinGeckoMarketData(symbol)
          // Cache the result
          marketDataCache[cacheKey] = { data, timestamp: now }
          return data
        } catch (geckoError) {
          console.error(`All data sources failed for ${symbol}`, geckoError)
          throw new Error(`Failed to fetch market data for ${symbol} from all sources`)
        }
      } else {
        console.error(`All data sources failed for ${symbol}`, yahooError)
        throw new Error(`Failed to fetch market data for ${symbol} from all sources`)
      }
    }
  }
}

// Get market data for multiple symbols
export async function getMultipleMarketData(symbols: string[]): Promise<MarketData[]> {
  return Promise.all(symbols.map((symbol) => getMarketData(symbol)))
}

// Get market data from Alpaca
async function getAlpacaMarketData(symbol: string): Promise<MarketData> {
  // First try to get latest trade data
  const tradeResponse = await fetch(`${process.env.NEXT_PUBLIC_ALPACA_BASE_URL}/v2/stocks/${symbol}/trades/latest`, {
    headers: {
      'APCA-API-KEY-ID': process.env.NEXT_PUBLIC_ALPACA_KEY_ID || '',
      'APCA-API-SECRET-KEY': process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY || ''
    }
  });

  if (!tradeResponse.ok) {
    throw new Error(`Alpaca API error: ${tradeResponse.statusText}`);
  }

  const tradeData = await tradeResponse.json();

  // Get the day's snapshot for additional data
  const snapshotResponse = await fetch(`${process.env.NEXT_PUBLIC_ALPACA_BASE_URL}/v2/stocks/${symbol}/snapshot`, {
    headers: {
      'APCA-API-KEY-ID': process.env.NEXT_PUBLIC_ALPACA_KEY_ID || '',
      'APCA-API-SECRET-KEY': process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY || ''
    }
  });

  if (!snapshotResponse.ok) {
    throw new Error(`Alpaca API error: ${snapshotResponse.statusText}`);
  }

  const snapshotData = await snapshotResponse.json();

  const prevClose = snapshotData.dailyBar?.c || snapshotData.prevDailyBar?.c;
  const currentPrice = tradeData.price;
  const change = prevClose ? currentPrice - prevClose : 0;
  const changePercent = prevClose ? (change / prevClose) * 100 : 0;

  return {
    symbol,
    price: currentPrice,
    change,
    changePercent,
    volume: snapshotData.dailyBar?.v || 0,
    high: snapshotData.dailyBar?.h || currentPrice,
    low: snapshotData.dailyBar?.l || currentPrice,
    open: snapshotData.dailyBar?.o || currentPrice,
    previousClose: prevClose || currentPrice,
    marketCap: undefined, // Alpaca doesn't provide market cap directly
    timestamp: tradeData.t
  };
}

// Get market data from Yahoo Finance
async function getYahooFinanceMarketData(symbol: string): Promise<MarketData> {
  // In a real implementation, this would use the yahoofinance-2 package
  // For now, we'll simulate a response
  const response = await fetch(`/api/yahoo/market?symbol=${symbol}`)

  if (!response.ok) {
    throw new Error(`Yahoo Finance API error: ${response.statusText}`)
  }

  const data = await response.json()

  return {
    symbol: data.symbol,
    price: data.price,
    change: data.changePercent,
    changePercent: data.changePercent,
    volume: data.volume,
    high: data.high,
    low: data.low,
    open: data.open,
    previousClose: data.previousClose,
    marketCap: data.marketCap,
    timestamp: data.timestamp || new Date().toISOString(),
  }
}

// Get market data from CoinGecko
async function getCoinGeckoMarketData(symbol: string): Promise<MarketData> {
  // In a real implementation, this would call the CoinGecko API
  // For now, we'll simulate a response
  const response = await fetch(`/api/coingecko/market?symbol=${symbol}`)

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.statusText}`)
  }

  const data = await response.json()

  return {
    symbol: data.symbol,
    price: data.price,
    change: data.change,
    changePercent: data.changePercent,
    volume: data.volume,
    high: data.high,
    low: data.low,
    open: data.open,
    previousClose: data.previousClose,
    marketCap: data.marketCap,
    timestamp: data.timestamp || new Date().toISOString(),
  }
}

// Get demo market data
function getDemoMarketData(symbol: string): MarketData {
  // Generate realistic demo data based on the symbol
  const basePrice = getBasePrice(symbol)
  const changePercent = Math.random() * 6 - 3 // -3% to +3%
  const change = basePrice * (changePercent / 100)
  const price = basePrice + change
  const volume = Math.floor(Math.random() * 10000000) + 100000

  return {
    symbol,
    price,
    change,
    changePercent,
    volume,
    high: price * (1 + Math.random() * 0.02), // 0-2% higher than current
    low: price * (1 - Math.random() * 0.02), // 0-2% lower than current
    open: price * (1 + (Math.random() * 0.02 - 0.01)), // +/- 1% from current
    previousClose: price * (1 + (Math.random() * 0.02 - 0.01)), // +/- 1% from current
    marketCap: symbol === "BTC-USD" || symbol === "ETH-USD" ? undefined : price * getDefaultShares(symbol),
    timestamp: new Date().toISOString(),
  }
}

// Helper function to get a base price for a symbol
function getBasePrice(symbol: string): number {
  // Return realistic base prices for common stocks
  switch (symbol) {
    case "AAPL":
      return 180 + (Math.random() * 10 - 5)
    case "MSFT":
      return 350 + (Math.random() * 15 - 7.5)
    case "GOOGL":
      return 130 + (Math.random() * 8 - 4)
    case "AMZN":
      return 140 + (Math.random() * 10 - 5)
    case "TSLA":
      return 240 + (Math.random() * 20 - 10)
    case "META":
      return 320 + (Math.random() * 15 - 7.5)
    case "NVDA":
      return 450 + (Math.random() * 25 - 12.5)
    case "BTC-USD":
      return 28000 + (Math.random() * 1000 - 500)
    case "ETH-USD":
      return 1800 + (Math.random() * 100 - 50)
    case "SPY":
      return 450 + (Math.random() * 5 - 2.5)
    case "QQQ":
      return 380 + (Math.random() * 8 - 4)
    case "VTI":
      return 220 + (Math.random() * 4 - 2)
    default:
      return 100 + (Math.random() * 10 - 5)
  }
}

// Helper function to get shares outstanding for market cap calculation
function getDefaultShares(symbol: string): number {
  switch (symbol) {
    case "AAPL": return 16.7e9;
    case "MSFT": return 7.6e9;
    case "GOOGL": return 680e6;
    case "AMZN": return 500e6;
    case "TSLA": return 1.0e9;
    case "META": return 1.2e9;
    case "NVDA": return 600e6;
    default: return 1.0e9;
  }
}

async function getSharesOutstanding(symbol: string): Promise<number> {
  try {
    const response = await fetch(`/api/alpaca/shares?symbol=${symbol}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch shares outstanding for ${symbol}`);
    }
    const data = await response.json();
    return data.sharesOutstanding;
  } catch (error) {
    console.warn(`Failed to fetch shares outstanding for ${symbol}`, error);
    return getDefaultShares(symbol);
  }
}

export async function fetchHistoricalData(
  symbol: string,
  timeframe = "1D",
  limit = 30
): Promise<{ date: string; value: number }[]> {
  // Check if we're in demo mode
  if (isDemoMode()) {
    return getDemoHistoricalData(symbol, timeframe, limit);
  }

  try {
    const response = await fetch(`/api/alpaca/historical?symbol=${symbol}&timeframe=${timeframe}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((item: any) => ({
      date: new Date(item.timestamp).toISOString().split("T")[0],
      value: item.close
    }));
  } catch (error) {
    console.error("Failed to fetch historical data for", symbol, error);
    // Return demo data as fallback
    return getDemoHistoricalData(symbol, timeframe, limit);
  }
}

// Generate demo historical data
function getDemoHistoricalData(
  symbol: string,
  timeframe: string,
  limit: number
): { date: string; value: number }[] {
  const basePrice = getBasePrice(symbol);
  const result = [];
  const now = new Date();

  // Generate data points
  for (let i = limit - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Create some realistic price movement
    const volatility = getVolatility(symbol);
    const trend = getTrend(symbol);
    const randomWalk = (Math.random() - 0.5) * volatility;
    const trendFactor = ((trend / 100) * (limit - i)) / limit;

    // Calculate price with some randomness but following a trend
    const value = basePrice * (1 + trendFactor + randomWalk);
    result.push({
      date: date.toISOString().split("T")[0],
      value: Number.parseFloat(value.toFixed(2))
    });
  }

  return result;
}

// Helper function to get volatility for a symbol
function getVolatility(symbol: string): number {
  switch (symbol) {
    case "TSLA":
    case "NVDA":
    case "BTC-USD":
    case "ETH-USD":
      return 0.04 // 4% daily volatility for high volatility assets
    case "AAPL":
    case "MSFT":
    case "GOOGL":
    case "AMZN":
      return 0.02 // 2% for medium volatility
    case "SPY":
    case "QQQ":
    case "VTI":
      return 0.01 // 1% for low volatility
    default:
      return 0.025 // 2.5% default
  }
}

// Helper function to get trend for a symbol (percentage over the period)
function getTrend(symbol: string): number {
  switch (symbol) {
    case "NVDA":
    case "MSFT":
      return 15 // 15% uptrend
    case "TSLA":
    case "BTC-USD":
      return -5 // 5% downtrend
    case "AAPL":
    case "GOOGL":
    case "AMZN":
      return 8 // 8% uptrend
    case "ETH-USD":
      return 10 // 10% uptrend
    case "SPY":
    case "QQQ":
    case "VTI":
      return 5 // 5% uptrend
    default:
      return Math.random() * 20 - 10 // Random trend between -10% and +10%
  }
}

export class MarketDataService {
  private ws: WebSocket | null = null;
  private subscribers = new Map<string, Set<(data: MarketData) => void>>();

  constructor(private apiKey: string, private secretKey: string) {}

  connect() {
    this.ws = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');
    this.ws.onopen = () => {
      this.authenticate();
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.data) {
        data.data.forEach((update: any) => {
          const marketData: MarketData = {
            symbol: update.S,
            price: parseFloat(update.p),
            change: parseFloat(update.P),
            changePercent: parseFloat(update.P),
            volume: parseInt(update.v),
            high: parseFloat(update.h),
            low: parseFloat(update.l),
            open: parseFloat(update.o),
            previousClose: parseFloat(update.c),
            timestamp: update.t,
          };

          this.notifySubscribers(marketData);
        });
      }
    };

    this.ws.onclose = () => {
      setTimeout(() => this.connect(), 5000);
    };
  }

  private authenticate() {
    if (!this.ws) return;
    this.ws.send(JSON.stringify({
      action: 'auth',
      key: this.apiKey,
      secret: this.secretKey
    }));

    // Subscribe to all symbols that have subscribers
    this.subscribeToSymbols([...this.subscribers.keys()]);
  }

  private subscribeToSymbols(symbols: string[]) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({
      action: 'subscribe',
      trades: symbols,
      quotes: symbols
    }));
  }

  private notifySubscribers(data: MarketData) {
    const subscribers = this.subscribers.get(data.symbol);
    if (subscribers) {
      subscribers.forEach(callback => callback(data));
    }
  }

  subscribe(symbol: string, callback: (data: MarketData) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.subscribeToSymbols([symbol]);
      }
    }
    this.subscribers.get(symbol)?.add(callback);
  }

  unsubscribe(symbol: string, callback: (data: MarketData) => void) {
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.subscribers.delete(symbol);
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            action: 'unsubscribe',
            trades: [symbol],
            quotes: [symbol]
          }));
        }
      }
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Export a singleton instance
let marketDataService: MarketDataService | null = null;
export function getMarketDataService(apiKey: string, secretKey: string) {
  if (!marketDataService) {
    marketDataService = new MarketDataService(apiKey, secretKey);
  }
  return marketDataService;
}
