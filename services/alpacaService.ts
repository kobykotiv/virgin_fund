import { getAlpacaClient, alpacaApiRequest } from '../lib/alpaca';

export class AlpacaService {
  // Account Management
  static async getAccount(apiKey?: string, secretKey?: string, isPaper: boolean = true) {
    const alpaca = getAlpacaClient(apiKey, secretKey, isPaper);
    return alpacaApiRequest(() => alpaca.getAccount());
  }

  // Asset Management
  static async getAssets(status?: 'active' | 'inactive', assetClass?: 'us_equity' | 'crypto', apiKey?: string, secretKey?: string, isPaper: boolean = true) {
    const alpaca = getAlpacaClient(apiKey, secretKey, isPaper);
    return alpacaApiRequest(() => alpaca.getAssets({ status, asset_class: assetClass }));
  }

  static async getAsset(symbol: string, apiKey?: string, secretKey?: string, isPaper: boolean = true) {
    const alpaca = getAlpacaClient(apiKey, secretKey, isPaper);
    return alpacaApiRequest(() => alpaca.getAsset(symbol));
  }

  // Order Management
  static async createOrder(params: {
    symbol: string;
    qty: number;
    side: 'buy' | 'sell';
    type: 'market' | 'limit' | 'stop' | 'stop_limit';
    time_in_force: 'day' | 'gtc' | 'ioc' | 'opg';
    limit_price?: number;
    stop_price?: number;
  }, apiKey?: string, secretKey?: string, isPaper: boolean = true) {
    const alpaca = getAlpacaClient(apiKey, secretKey, isPaper);
    return alpacaApiRequest(() => alpaca.createOrder(params));
  }

  static async getOrders(status?: 'open' | 'closed' | 'all', 
                         limit?: number, 
                         after?: Date,
                         until?: Date,
                         apiKey?: string, 
                         secretKey?: string, 
                         isPaper: boolean = true) {
    const alpaca = getAlpacaClient(apiKey, secretKey, isPaper);
    return alpacaApiRequest(() => alpaca.getOrders({
      status,
      limit,
      after: after?.toISOString(),
      until: until?.toISOString()
    }));
  }

  static async getOrder(orderId: string, apiKey?: string, secretKey?: string, isPaper: boolean = true) {
    const alpaca = getAlpacaClient(apiKey, secretKey, isPaper);
    return alpacaApiRequest(() => alpaca.getOrder(orderId));
  }

  static async cancelOrder(orderId: string, apiKey?: string, secretKey?: string, isPaper: boolean = true) {
    const alpaca = getAlpacaClient(apiKey, secretKey, isPaper);
    return alpacaApiRequest(() => alpaca.cancelOrder(orderId));
  }

  // Position Management
  static async getPositions(apiKey?: string, secretKey?: string, isPaper: boolean = true) {
    const alpaca = getAlpacaClient(apiKey, secretKey, isPaper);
    return alpacaApiRequest(() => alpaca.getPositions());
  }

  static async getPosition(symbol: string, apiKey?: string, secretKey?: string, isPaper: boolean = true) {
    const alpaca = getAlpacaClient(apiKey, secretKey, isPaper);
    return alpacaApiRequest(() => alpaca.getPosition(symbol));
  }

  static async closePosition(symbol: string, apiKey?: string, secretKey?: string, isPaper: boolean = true) {
    const alpaca = getAlpacaClient(apiKey, secretKey, isPaper);
    return alpacaApiRequest(() => alpaca.closePosition(symbol));
  }

  static async closeAllPositions(apiKey?: string, secretKey?: string, isPaper: boolean = true) {
    const alpaca = getAlpacaClient(apiKey, secretKey, isPaper);
    return alpacaApiRequest(() => alpaca.closeAllPositions());
  }

  // Market Data
  static async getBars(
    symbols: string[], 
    timeframe: '1Min' | '5Min' | '15Min' | '1Hour' | '1Day', 
    start: Date, 
    end: Date,
    limit: number = 1000,
    apiKey?: string, 
    secretKey?: string, 
    isPaper: boolean = true
  ) {
    const alpaca = getAlpacaClient(apiKey, secretKey, isPaper);
    return alpacaApiRequest(() => alpaca.getBarsV2(
      symbols,
      {
        start: start.toISOString(),
        end: end.toISOString(),
        timeframe,
        limit
      }
    ));
  }

  // Paper Trading
  static async createPaperAccount(initialBalance: number = 100000) {
    // This is just a mock since Alpaca doesn't actually have an API to create paper accounts on-demand
    // In a real implementation, we would use your backend to track paper accounts
    return {
      data: {
        id: `paper-${Date.now()}`,
        cash: initialBalance,
        created_at: new Date().toISOString(),
        status: 'ACTIVE',
        currency: 'USD'
      }
    };
  }
}
