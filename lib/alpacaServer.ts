import { AlpacaClient } from '@/lib/alpaca-client'

let alpacaServerInstance: AlpacaClient | null = null

export function getAlpacaServer(): typeof AlpacaClient {
  return AlpacaClient
}

// Server-side functions for Alpaca API
export class AlpacaServerService {
  private apiKey: string
  private secretKey: string
  private baseUrl: string

  constructor(apiKey?: string, secretKey?: string, isPaper = true) {
    this.apiKey = apiKey || process.env.ALPACA_API_KEY || ''
    this.secretKey = secretKey || process.env.ALPACA_SECRET_KEY || ''
    this.baseUrl = isPaper ?
      "https://paper-api.alpaca.markets" :
      "https://api.alpaca.markets"
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'APCA-API-KEY-ID': this.apiKey,
      'APCA-API-SECRET-KEY': this.secretKey,
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`Alpaca API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getAccount() {
    try {
      return await this.makeRequest('/v2/account')
    } catch (error) {
      console.error('Alpaca server getAccount error:', error)
      throw error
    }
  }

  async getPositions() {
    try {
      return await this.makeRequest('/v2/positions')
    } catch (error) {
      console.error('Alpaca server getPositions error:', error)
      throw error
    }
  }

  async getOrders() {
    try {
      return await this.makeRequest('/v2/orders')
    } catch (error) {
      console.error('Alpaca server getOrders error:', error)
      throw error
    }
  }

  async placeOrder(orderData: any) {
    try {
      return await this.makeRequest('/v2/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      })
    } catch (error) {
      console.error('Alpaca server placeOrder error:', error)
      throw error
    }
  }

  async cancelOrder(orderId: string) {
    try {
      return await this.makeRequest(`/v2/orders/${orderId}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Alpaca server cancelOrder error:', error)
      throw error
    }
  }
}
