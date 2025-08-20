import { MarketDataBar, NewsItem } from '@/types/market'

export class MarketDataService {
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor(apiKey: string, secretKey: string, isPaper: boolean = true) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.baseUrl = isPaper ? 
      'https://paper-api.alpaca.markets' : 
      'https://api.alpaca.markets';
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'APCA-API-KEY-ID': this.apiKey,
          'APCA-API-SECRET-KEY': this.secretKey,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication failed: Invalid API credentials');
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching from Alpaca API:', error);
      throw error;
    }
  }

  // Get latest quote snapshot
  async getSnapshot(symbols: string[]) {
    return this.fetch(`/v2/stocks/quotes?symbols=${symbols.join(',')}`);
  }

  // Get historical bars
  async getHistoricalBars(symbol: string, timeframe: string, start: string, end: string) {
    const params = new URLSearchParams({
      timeframe,
      start,
      end,
      limit: '1000',
      adjustment: 'all'
    });
    
    return this.fetch(`/v2/stocks/${symbol}/bars?${params.toString()}`);
  }

  // Get account information
  async getAccount() {
    return this.fetch('/v2/account');
  }

  // Get account positions
  async getPositions() {
    return this.fetch('/v2/positions');
  }

  // Order management
  async getOrders(status = 'open') {
    return this.fetch(`/v2/orders?status=${status}`)
  }
  
  async placeOrder(orderParams: {
    symbol: string;
    qty?: number;
    notional?: number;
    side: 'buy' | 'sell';
    type: 'market' | 'limit' | 'stop' | 'stop_limit';
    time_in_force: 'day' | 'gtc' | 'ioc' | 'fok';
    limit_price?: number;
    stop_price?: number;
  }) {
    // Support fractional trading: qty or notional
    const body: any = {
      symbol: orderParams.symbol,
      side: orderParams.side,
      type: orderParams.type,
      time_in_force: orderParams.time_in_force,
    };
    if (orderParams.qty !== undefined) body.qty = orderParams.qty;
    if (orderParams.notional !== undefined) body.notional = orderParams.notional;
    if (orderParams.limit_price !== undefined) body.limit_price = orderParams.limit_price;
    if (orderParams.stop_price !== undefined) body.stop_price = orderParams.stop_price;

    let retries = 0;
    while (retries < 3) {
      try {
        const response = await fetch(`${this.baseUrl}/v2/orders`, {
          method: 'POST',
          headers: {
            'APCA-API-KEY-ID': this.apiKey,
            'APCA-API-SECRET-KEY': this.secretKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (response.status === 429) {
          // Rate limit hit, exponential backoff
          await new Promise(res => setTimeout(res, 500 * Math.pow(2, retries)));
          retries++;
          continue;
        }

        const json = await response.json();

        if (!response.ok) {
          // Map common Alpaca error codes/messages
          if (json.code === 40310000 || json.message?.includes('insufficient')) {
            throw new Error('Insufficient funds');
          }
          if (json.code === 40310001 || json.message?.includes('market closed')) {
            throw new Error('Market is closed');
          }
          throw new Error(json.message || 'Order placement failed');
        }

        return json;
      } catch (error: any) {
        if (retries >= 2) {
          throw error;
        }
        retries++;
      }
    }
    throw new Error('Order placement failed after retries');
  }
  
  async cancelOrder(orderId: string) {
    return this.fetch(`/v2/orders/${orderId}`, {
      method: 'DELETE'
    })
  }
  
  // Enhanced market data methods
  async getMultipleSymbolBars(symbols: string[], timeframe: string, start: string, end: string) {
    // For fetching data for multiple symbols in one request
    const symbolsQuery = symbols.join(',')
    return this.fetch(`/v2/stocks/bars?symbols=${symbolsQuery}&timeframe=${timeframe}&start=${start}&end=${end}`)
  }
  
  // Calendar and market hours
  async getCalendar(start?: string, end?: string) {
    let endpoint = '/v2/calendar'
    if (start && end) {
      endpoint += `?start=${start}&end=${end}`
    }
    return this.fetch(endpoint)
  }
  
  async getClock() {
    return this.fetch('/v2/clock')
  }
  
  // Assets information
  async getAssets(status = 'active', assetClass = 'us_equity') {
    return this.fetch(`/v2/assets?status=${status}&asset_class=${assetClass}`)
  }

  async getNews(symbols?: string[]): Promise<NewsItem[]> {
    const symbolsQuery = symbols ? `?symbols=${symbols.join(',')}` : ''
    return this.fetch(`/v2/news${symbolsQuery}`)
  }

  // Initialize WebSocket connection for real-time data
  initializeWebSocket() {
    const ws = new WebSocket('wss://stream.data.alpaca.markets/v2/iex')
    
    ws.onopen = () => {
      ws.send(JSON.stringify({
        action: 'auth',
        key: this.apiKey,
        secret: this.secretKey
      }))
    }

    return ws
  }
  
  // Configure WebSocket for specific data streams
  subscribeToStream(ws: WebSocket, streams: string[]) {
    ws.send(JSON.stringify({
      action: 'subscribe',
      trades: streams.map(symbol => `T.${symbol}`),
      quotes: streams.map(symbol => `Q.${symbol}`),
      bars: streams.map(symbol => `AM.${symbol}`)
    }))
  }
}
