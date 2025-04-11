import { z } from "zod";
// Removed encrypt/decrypt imports as they are handled server-side before calling this client

export interface AlpacaAccount {
  id: string;
  status: string;
  currency: string;
  buying_power: string;
  cash: string;
  portfolio_value: string;
  trading_blocked: boolean;
  transfers_blocked: boolean;
  account_blocked: boolean;
  created_at: string;
  trade_suspended_by_user: boolean;
  // Add other relevant fields from Alpaca's /v2/account response if needed
}

export interface AlpacaOrder {
  id?: string;
  client_order_id?: string; // Added client_order_id
  symbol: string;
  qty?: string; // Alpaca API often uses strings for numbers
  notional?: string; // Alpaca API often uses strings for numbers
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit' | 'trailing_stop'; // Added trailing_stop
  time_in_force: 'day' | 'gtc' | 'opg' | 'cls' | 'ioc' | 'fok';
  limit_price?: string; // Use string
  stop_price?: string; // Use string
  trail_price?: string; // For trailing stops
  trail_percent?: string; // For trailing stops
  filled_avg_price?: string; // Use string
  filled_qty?: string; // Use string
  filled_at?: string | null; // Can be null
  submitted_at?: string;
  status?: 'new' | 'partially_filled' | 'filled' | 'done_for_day' | 'canceled' | 'expired' | 'replaced' | 'pending_cancel' | 'pending_replace' | 'accepted' | 'pending_new' | 'accepted_for_bidding' | 'stopped' | 'rejected' | 'suspended' | 'calculated'; // Expanded statuses
  order_class?: string;
  order_type?: string;
  // Add other relevant fields like take_profit, stop_loss if needed for advanced orders
}

// Interface for creating orders, matching Alpaca's POST /v2/orders body
export interface CreateOrderRequest {
  symbol: string;
  qty?: string; // Use string for consistency with Alpaca
  notional?: string; // Use string for consistency with Alpaca
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit' | 'trailing_stop';
  time_in_force: 'day' | 'gtc' | 'opg' | 'cls' | 'ioc' | 'fok';
  limit_price?: string;
  stop_price?: string;
  trail_price?: string;
  trail_percent?: string;
  client_order_id?: string; // Optional client-assigned ID
  extended_hours?: boolean;
  order_class?: 'simple' | 'bracket' | 'oco' | 'oto';
  take_profit?: { limit_price: string };
  stop_loss?: { stop_price: string; limit_price?: string };
  // Ensure either qty or notional is provided, but not both (handled by API logic calling this)
}


export interface AlpacaPosition {
  asset_id: string;
  symbol: string;
  qty: string; // Use string
  market_value: string; // Use string
  cost_basis: string; // Use string
  unrealized_pl: string; // Use string
  current_price: string; // Use string
  avg_entry_price: string; // Added avg_entry_price
  // Add other relevant fields
}

// Schema for the configuration object expected by the constructor
const alpacaConfigSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  secretKey: z.string().min(1, "Secret Key is required"),
  isPaper: z.boolean().default(true),
});

export type AlpacaConfig = z.infer<typeof alpacaConfigSchema>;

export class AlpacaClient {
  private config: AlpacaConfig;
  private baseUrl: string; // Base URL is now an instance property

  constructor(config: AlpacaConfig) {
    // Validate the config upon instantiation
    this.config = alpacaConfigSchema.parse(config);
    this.baseUrl = this.config.isPaper
      ? "https://paper-api.alpaca.markets"
      : "https://api.alpaca.markets";
  }

  // Removed static methods related to localStorage: saveConfig, fromEncrypted, getConfig, hasValidConfig

  // Static method to test connection - now accepts decrypted keys
  static async testConnection(config: AlpacaConfig): Promise<boolean> {
    // Validate config first
     try {
       alpacaConfigSchema.parse(config);
     } catch (error) {
       console.error("Invalid config provided to testConnection:", error);
       return false;
     }

    const url = config.isPaper
      ? "https://paper-api.alpaca.markets"
      : "https://api.alpaca.markets";

    try {
      const response = await fetch(`${url}/v2/account`, {
        headers: {
          'APCA-API-KEY-ID': config.apiKey,
          'APCA-API-SECRET-KEY': config.secretKey,
        }
      });
      return response.ok;
    } catch (error) {
      console.error("Failed to test Alpaca connection:", error);
      return false;
    }
  }

  // Helper for making authenticated requests
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'APCA-API-KEY-ID': this.config.apiKey,
      'APCA-API-SECRET-KEY': this.config.secretKey,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        let errorBody;
        try {
          errorBody = await response.json();
        } catch (e) {
          // If response is not JSON
          errorBody = { message: response.statusText };
        }
        console.error(`Alpaca API Error (${response.status}): ${url}`, errorBody);
        throw new Error(`Alpaca API Error (${response.status}): ${errorBody?.message || 'Unknown error'}`);
      }

      // Handle cases where response might be empty (e.g., DELETE)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T; // Return an empty object or appropriate type for void responses
      }

      return response.json() as Promise<T>;

    } catch (error) {
      console.error(`Network or fetch error calling Alpaca: ${url}`, error);
      // Re-throw network errors or wrap them
      throw error instanceof Error ? error : new Error('Network error during Alpaca API call');
    }
  }


  // --- Instance Methods ---

  async createOrder(order: CreateOrderRequest): Promise<AlpacaOrder> {
    // Basic validation: ensure qty or notional is present, not both
    if ((order.qty && order.notional) || (!order.qty && !order.notional)) {
       throw new Error('Order must have qty or notional, but not both.');
    }
    return this.request<AlpacaOrder>('/v2/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async getAccount(): Promise<AlpacaAccount> {
    return this.request<AlpacaAccount>('/v2/account');
  }

  async getPositions(): Promise<AlpacaPosition[]> {
    return this.request<AlpacaPosition[]>('/v2/positions');
  }

  async getOrders(params?: {
    status?: 'open' | 'closed' | 'all';
    limit?: number;
    after?: string; // ISO 8601 Date String
    until?: string; // ISO 8601 Date String
    direction?: 'asc' | 'desc';
    nested?: boolean; // For bracket orders
    symbols?: string[]; // Filter by symbols
  }): Promise<AlpacaOrder[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.after) query.append('after', params.after);
    if (params?.until) query.append('until', params.until);
    if (params?.direction) query.append('direction', params.direction);
    if (params?.nested) query.append('nested', params.nested.toString());
    if (params?.symbols) query.append('symbols', params.symbols.join(','));

    const queryString = query.toString();
    return this.request<AlpacaOrder[]>(`/v2/orders${queryString ? `?${queryString}` : ''}`);
  }

  async getOrderById(orderId: string): Promise<AlpacaOrder> {
     return this.request<AlpacaOrder>(`/v2/orders/${orderId}`);
  }

  async cancelOrder(orderId: string): Promise<void> {
     // Alpaca returns 204 No Content on success
     await this.request<void>(`/v2/orders/${orderId}`, { method: 'DELETE' });
  }

  async cancelAllOrders(): Promise<AlpacaOrder[]> {
     // Returns list of orders that were cancelled (or attempted to cancel)
     return this.request<AlpacaOrder[]>('/v2/orders', { method: 'DELETE' });
  }

  // Add other methods as needed (e.g., getPosition(symbol), closePosition(symbol), etc.)
}
