import { z } from "zod"

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

  static saveConfig(config: AlpacaConfig): void {
    localStorage.setItem(this.storageKey, JSON.stringify(config))
    // Update baseUrl based on isPaper setting
    this.baseUrl = config.isPaper ? 
      "https://paper-api.alpaca.markets" : 
      "https://api.alpaca.markets"
  }

  static getConfig(): AlpacaConfig | null {
    const stored = localStorage.getItem(this.storageKey)
    if (!stored) return null

    try {
      const config = JSON.parse(stored)
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
}
