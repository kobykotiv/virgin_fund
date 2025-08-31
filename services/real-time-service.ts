"use client"

import { Position, Trade, MarketData } from '@/types/portfolio'

export interface RealTimeConfig {
  enabled: boolean
  websocketUrl?: string
  pollingInterval: number
  maxRetries: number
}

export interface RealTimeUpdate {
  type: 'position' | 'trade' | 'market' | 'portfolio'
  data: any
  timestamp: number
}

export type RealTimeCallback = (update: RealTimeUpdate) => void

export class RealTimeService {
  private config: RealTimeConfig
  private ws: WebSocket | null = null
  private callbacks: RealTimeCallback[] = []
  private pollingTimer: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private isConnected = false

  constructor(config: RealTimeConfig) {
    this.config = config
  }

  connect(): void {
    if (!this.config.enabled) return

    if (this.config.websocketUrl) {
      this.connectWebSocket()
    } else {
      this.startPolling()
    }
  }

  private connectWebSocket(): void {
    if (!this.config.websocketUrl) return

    try {
      this.ws = new WebSocket(this.config.websocketUrl)

      this.ws.onopen = () => {
        console.log('Real-time WebSocket connected')
        this.isConnected = true
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const update: RealTimeUpdate = JSON.parse(event.data)
          this.notifyCallbacks(update)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('Real-time WebSocket disconnected')
        this.isConnected = false
        this.handleReconnect()
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.isConnected = false
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      this.handleReconnect()
    }
  }

  private startPolling(): void {
    if (this.pollingTimer) return

    this.pollingTimer = setInterval(async () => {
      await this.pollUpdates()
    }, this.config.pollingInterval)
  }

  private async pollUpdates(): Promise<void> {
    try {
      // Poll for position updates
      const positionsResponse = await fetch('/api/realtime/positions')
      if (positionsResponse.ok) {
        const positions: Position[] = await positionsResponse.json()
        this.notifyCallbacks({
          type: 'position',
          data: positions,
          timestamp: Date.now()
        })
      }

      // Poll for trade updates
      const tradesResponse = await fetch('/api/realtime/trades')
      if (tradesResponse.ok) {
        const trades: Trade[] = await tradesResponse.json()
        this.notifyCallbacks({
          type: 'trade',
          data: trades,
          timestamp: Date.now()
        })
      }

      // Poll for market data updates
      const marketResponse = await fetch('/api/realtime/market')
      if (marketResponse.ok) {
        const marketData: MarketData = await marketResponse.json()
        this.notifyCallbacks({
          type: 'market',
          data: marketData,
          timestamp: Date.now()
        })
      }
    } catch (error) {
      console.error('Polling error:', error)
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxRetries) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)

    setTimeout(() => {
      if (this.config.websocketUrl) {
        this.connectWebSocket()
      }
    }, delay)
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    if (this.pollingTimer) {
      clearInterval(this.pollingTimer)
      this.pollingTimer = null
    }

    this.isConnected = false
  }

  subscribe(callback: RealTimeCallback): void {
    this.callbacks.push(callback)
  }

  unsubscribe(callback: RealTimeCallback): void {
    this.callbacks = this.callbacks.filter(cb => cb !== callback)
  }

  private notifyCallbacks(update: RealTimeUpdate): void {
    this.callbacks.forEach(callback => {
      try {
        callback(update)
      } catch (error) {
        console.error('Callback error:', error)
      }
    })
  }

  isWebSocketConnected(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN
  }

  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    if (this.isConnected) return 'connected'
    if (this.reconnectAttempts > 0) return 'connecting'
    return 'disconnected'
  }

  async sendMessage(message: any): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected')
    }

    this.ws.send(JSON.stringify(message))
  }

  // Subscribe to specific symbols for real-time updates
  async subscribeToSymbols(symbols: string[]): Promise<void> {
    if (this.isWebSocketConnected()) {
      await this.sendMessage({
        type: 'subscribe',
        symbols
      })
    }
  }

  // Unsubscribe from specific symbols
  async unsubscribeFromSymbols(symbols: string[]): Promise<void> {
    if (this.isWebSocketConnected()) {
      await this.sendMessage({
        type: 'unsubscribe',
        symbols
      })
    }
  }

  // Get real-time quotes for symbols
  async getRealTimeQuotes(symbols: string[]): Promise<Record<string, any>> {
    try {
      const response = await fetch('/api/realtime/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols })
      })

      if (!response.ok) throw new Error('Failed to fetch real-time quotes')

      return await response.json()
    } catch (error) {
      console.error('Real-time quotes fetch error:', error)
      return {}
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    if (!this.config.enabled) return false

    try {
      if (this.config.websocketUrl) {
        return this.isWebSocketConnected()
      } else {
        const response = await fetch('/api/realtime/health')
        return response.ok
      }
    } catch (error) {
      console.error('Real-time connection test error:', error)
      return false
    }
  }
}
