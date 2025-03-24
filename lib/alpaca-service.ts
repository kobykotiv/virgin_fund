import { BotConfig } from "@/types/bot";

// Default Alpaca API URLs
const ALPACA_PAPER_BASE_URL = "https://paper-api.alpaca.markets";
const ALPACA_LIVE_BASE_URL = "https://api.alpaca.markets";
const ALPACA_DATA_BASE_URL = "https://data.alpaca.markets";
const ALPACA_CRYPTO_BASE_URL = "https://data.alpaca.markets/v1beta3/crypto";

export type AlpacaEnvironment = "paper" | "live";

interface AlpacaCredentials {
  apiKey: string;
  apiSecret: string;
  environment: AlpacaEnvironment;
}

export interface AlpacaOrder {
  id: string;
  client_order_id: string;
  symbol: string;
  quantity: number;
  side: "buy" | "sell";
  type: "market" | "limit" | "stop" | "stop_limit";
  time_in_force: "day" | "gtc" | "ioc" | "fok";
  limit_price?: number;
  stop_price?: number;
  status: string;
  created_at: string;
  updated_at: string;
  filled_at?: string;
  filled_quantity: number;
  filled_price?: number;
}

export interface AlpacaPosition {
  asset_id: string;
  symbol: string;
  qty: number;
  avg_entry_price: number;
  market_value: number;
  cost_basis: number;
  unrealized_pl: number;
  unrealized_plpc: number;
  current_price: number;
  lastday_price: number;
  change_today: number;
}

export interface AlpacaAccount {
  id: string;
  cash: number;
  buying_power: number;
  equity: number;
  portfolio_value: number;
  status: string;
  currency: string;
  pattern_day_trader: boolean;
  trading_blocked: boolean;
}

// Class to interact with Alpaca API
export class AlpacaService {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;
  private dataUrl: string;
  private cryptoUrl: string;
  private websocket: WebSocket | null = null;

  constructor(credentials?: AlpacaCredentials) {
    // Try to load from localStorage if not provided
    if (!credentials) {
      const savedCreds = this.loadCredentialsFromStorage();
      if (!savedCreds) {
        throw new Error("Alpaca credentials not found");
      }
      credentials = savedCreds;
    }

    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret;
    this.baseUrl = credentials.environment === "paper" ? ALPACA_PAPER_BASE_URL : ALPACA_LIVE_BASE_URL;
    this.dataUrl = ALPACA_DATA_BASE_URL;
    this.cryptoUrl = ALPACA_CRYPTO_BASE_URL;
  }

  private loadCredentialsFromStorage(): AlpacaCredentials | null {
    if (typeof window === "undefined") return null;
    
    try {
      const credentials = localStorage.getItem("alpaca_credentials");
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      console.error("Failed to load Alpaca credentials from localStorage", error);
      return null;
    }
  }

  public saveCredentialsToStorage(credentials: AlpacaCredentials): void {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem("alpaca_credentials", JSON.stringify(credentials));
      
      // Update current instance
      this.apiKey = credentials.apiKey;
      this.apiSecret = credentials.apiSecret;
      this.baseUrl = credentials.environment === "paper" ? ALPACA_PAPER_BASE_URL : ALPACA_LIVE_BASE_URL;
    } catch (error) {
      console.error("Failed to save Alpaca credentials to localStorage", error);
    }
  }

  private async request<T>(
    endpoint: string, 
    method: string = "GET", 
    data?: any, 
    isDataAPI: boolean = false
  ): Promise<T> {
    const url = `${isDataAPI ? this.dataUrl : this.baseUrl}${endpoint}`;
    
    const headers = {
      "APCA-API-KEY-ID": this.apiKey,
      "APCA-API-SECRET-KEY": this.apiSecret,
      "Content-Type": "application/json"
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Alpaca API error (${response.status}): ${errorText}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error("Alpaca API request failed:", error);
      throw error;
    }
  }

  // Account endpoints
  public async getAccount(): Promise<AlpacaAccount> {
    return this.request<AlpacaAccount>("/v2/account");
  }

  // Order endpoints
  public async placeOrder(
    symbol: string,
    qty: number,
    side: "buy" | "sell",
    type: "market" | "limit" | "stop" | "stop_limit",
    timeInForce: "day" | "gtc" | "ioc" | "fok",
    limitPrice?: number,
    stopPrice?: number,
    extendedHours: boolean = false,
    clientOrderId?: string
  ): Promise<AlpacaOrder> {
    const orderData = {
      symbol,
      qty: qty.toString(),
      side,
      type,
      time_in_force: timeInForce,
      limit_price: limitPrice?.toString(),
      stop_price: stopPrice?.toString(),
      extended_hours: extendedHours,
      client_order_id: clientOrderId
    };

    return this.request<AlpacaOrder>("/v2/orders", "POST", orderData);
  }

  public async placeFractionalOrder(
    symbol: string,
    notional: number,
    side: "buy" | "sell",
    timeInForce: "day" | "gtc" = "gtc",
    extendedHours: boolean = false
  ): Promise<AlpacaOrder> {
    const orderData = {
      symbol,
      notional: notional.toString(),
      side,
      type: "market",
      time_in_force: timeInForce,
      extended_hours: extendedHours
    };

    return this.request<AlpacaOrder>("/v2/orders", "POST", orderData);
  }

  public async getOrders(status: "open" | "closed" | "all" = "all"): Promise<AlpacaOrder[]> {
    return this.request<AlpacaOrder[]>(`/v2/orders?status=${status}`);
  }

  public async getOrder(orderId: string): Promise<AlpacaOrder> {
    return this.request<AlpacaOrder>(`/v2/orders/${orderId}`);
  }

  public async cancelOrder(orderId: string): Promise<void> {
    return this.request<void>(`/v2/orders/${orderId}`, "DELETE");
  }

  // Position endpoints
  public async getPositions(): Promise<AlpacaPosition[]> {
    return this.request<AlpacaPosition[]>("/v2/positions");
  }

  public async getPosition(symbol: string): Promise<AlpacaPosition> {
    return this.request<AlpacaPosition>(`/v2/positions/${symbol}`);
  }

  public async closePosition(symbol: string): Promise<void> {
    return this.request<void>(`/v2/positions/${symbol}`, "DELETE");
  }

  public async closeAllPositions(): Promise<void> {
    return this.request<void>("/v2/positions", "DELETE");
  }

  // Streaming via WebSocket
  public connectToStream(onMessage: (data: any) => void, channels: string[]): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      console.warn("WebSocket connection already open");
      return;
    }

    const wsUrl = this.baseUrl.replace("https", "wss") + "/stream";
    this.websocket = new WebSocket(wsUrl);

    this.websocket.onopen = () => {
      console.log("WebSocket connection established");
      if (this.websocket) {
        this.websocket.send(JSON.stringify({
          action: "authenticate",
          data: {
            key_id: this.apiKey,
            secret_key: this.apiSecret
          }
        }));

        this.websocket.send(JSON.stringify({
          action: "listen",
          data: { streams: channels }
        }));
      }
    };

    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    this.websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.websocket.onclose = () => {
      console.log("WebSocket connection closed");
      this.websocket = null;
    };
  }

  public disconnectFromStream(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  // Bot related functionality
  public async deployBot(botConfig: BotConfig): Promise<{ botId: string }> {
    // This would integrate with your backend service that manages bots
    // For now, we'll simulate this with a local implementation
    const botId = `bot_${Date.now()}`;
    localStorage.setItem(`bot_${botId}`, JSON.stringify(botConfig));
    return { botId };
  }

  public async getHistoricalData(
    symbol: string, 
    timeframe: "1Min" | "5Min" | "15Min" | "1Hour" | "1Day",
    startDate: string,
    endDate: string
  ): Promise<any> {
    const endpoint = `/v2/stocks/${symbol}/bars?timeframe=${timeframe}&start=${startDate}&end=${endDate}`;
    return this.request<any>(endpoint, "GET", undefined, true);
  }
}

// Create and export a singleton instance
export const alpacaService = new AlpacaService();
