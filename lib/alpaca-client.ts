import { z } from "zod"
import { decrypt, encrypt } from "@/lib/utils/crypto"

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
}

export interface AlpacaOrder {
  id?: string
  symbol: string
  qty?: number
  notional?: number
  side: 'buy' | 'sell'
  type: 'market' | 'limit' | 'stop' | 'stop_limit'
  time_in_force: 'day' | 'gtc' | 'opg' | 'cls' | 'ioc' | 'fok'
  limit_price?: number
  stop_price?: number
  filled_avg_price?: number
  filled_at?: string
  submitted_at?: string
  status?: 'new' | 'filled' | 'partially_filled' | 'canceled' | 'expired' | 'rejected'
  filled_qty?: number
  filled_notional?: number
  order_class?: string
  order_type?: string
}

export interface CreateOrderRequest extends Omit<AlpacaOrder, 
  'id' | 'filled_avg_price' | 'filled_at' | 'submitted_at' | 'status' | 'filled_qty' | 'filled_notional'> {
  // Additional fields specific to order creation
}

export interface AlpacaPosition {
  asset_id: string
  symbol: string
  qty: string
  market_value: string
  cost_basis: string
  unrealized_pl: string
  current_price: string
}

const alpacaConfigSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  secretKey: z.string().min(1, "Secret Key is required"),
  isPaper: z.boolean().default(true),
})

export type AlpacaConfig = z.infer<typeof alpacaConfigSchema>

/**
 * @TODO: Replace with secure credential storage solution
 * Technical Debt: Current implementation uses localStorage
 * - Security concerns with storing API keys in localStorage
 * - No encryption of sensitive data
 * - Keys are exposed to XSS attacks
 * 
 * Future improvements:
 * - Implement server-side storage with encryption
 * - Add key rotation mechanism
 * - Add secure credential management system
 */
export class AlpacaClient {
  private static storageKey = "alpaca_config"
  static baseUrl = "https://paper-api.alpaca.markets"
  private config: AlpacaConfig

  constructor(config: AlpacaConfig) {
    this.config = config
    AlpacaClient.baseUrl = config.isPaper ? 
      "https://paper-api.alpaca.markets" : 
      "https://api.alpaca.markets"
  }

  static saveConfig(config: AlpacaConfig): void {
    const encrypted = encrypt(JSON.stringify(config))
    localStorage.setItem(this.storageKey, encrypted)
    // Update baseUrl based on isPaper setting
    this.baseUrl = config.isPaper ? 
      "https://paper-api.alpaca.markets" : 
      "https://api.alpaca.markets"
  }

  static fromEncrypted(
    encryptedApiKey: string,
    encryptedSecretKey: string,
    salt: string,
    isPaper: boolean
  ): AlpacaClient {
    try {
      const apiKey = decrypt(encryptedApiKey)
      const secretKey = decrypt(encryptedSecretKey)
      const config: AlpacaConfig = {
        apiKey,
        secretKey,
        isPaper
      }
      return new AlpacaClient(config)
    } catch (error) {
      console.error("Failed to decrypt Alpaca config:", error)
      throw new Error("Invalid encrypted config")
    }
  }

  static getConfig(): AlpacaConfig | null {
    const encrypted = localStorage.getItem(this.storageKey)
    if (!encrypted) return null

    try {
      const decrypted = decrypt(encrypted)
      const config = JSON.parse(decrypted)
      const parsedConfig = alpacaConfigSchema.parse(config)
      
      // Set the appropriate base URL
      this.baseUrl = parsedConfig.isPaper ? 
        "https://paper-api.alpaca.markets" : 
        "https://api.alpaca.markets"
        
      return parsedConfig
    } catch (error) {
      console.error("Invalid Alpaca config:", error)
      return null
    }
  }

  static hasValidConfig(): boolean {
    return this.getConfig() !== null
  }

  static async testConnection(config: AlpacaConfig): Promise<boolean> {
    const url = config.isPaper ? 
      "https://paper-api.alpaca.markets" : 
      "https://api.alpaca.markets"
    
    try {
      const response = await fetch(`${url}/v2/account`, {
        headers: {
          'APCA-API-KEY-ID': config.apiKey,
          'APCA-API-SECRET-KEY': config.secretKey,
        }
      })
      return response.ok
    } catch (error) {
      console.error("Failed to test Alpaca connection:", error)
      return false
    }
  }

  async createOrder(order: CreateOrderRequest): Promise<AlpacaOrder> {
    const response = await fetch(`${AlpacaClient.baseUrl}/v2/orders`, {
      method: 'POST',
      headers: {
        'APCA-API-KEY-ID': this.config.apiKey,
        'APCA-API-SECRET-KEY': this.config.secretKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to create order: ${error.message}`)
    }

    return response.json()
  }

  async getAccount(): Promise<AlpacaAccount> {
    const response = await fetch(`${AlpacaClient.baseUrl}/v2/account`, {
      headers: {
        'APCA-API-KEY-ID': this.config.apiKey,
        'APCA-API-SECRET-KEY': this.config.secretKey
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to get account: ${error.message}`)
    }

    return response.json()
  }

  async getPositions(): Promise<AlpacaPosition[]> {
    const response = await fetch(`${AlpacaClient.baseUrl}/v2/positions`, {
      headers: {
        'APCA-API-KEY-ID': this.config.apiKey,
        'APCA-API-SECRET-KEY': this.config.secretKey
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to get positions: ${error.message}`)
    }

    return response.json()
  }
}
