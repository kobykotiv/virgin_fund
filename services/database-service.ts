"use client"

import { Portfolio, Position, Bot, Trade, RiskMetrics, PerformanceData } from '@/types/portfolio'

export interface DatabaseConfig {
  enabled: boolean
  type: 'supabase' | 'postgres' | 'sqlite' | 'mongodb'
  connectionString?: string
  supabaseUrl?: string
  supabaseKey?: string
}

export class DatabaseService {
  private config: DatabaseConfig

  constructor(config: DatabaseConfig) {
    this.config = config
  }

  async savePortfolio(portfolio: Portfolio): Promise<boolean> {
    if (!this.config.enabled) return false

    try {
      const response = await fetch('/api/database/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolio)
      })

      return response.ok
    } catch (error) {
      console.error('Database portfolio save error:', error)
      return false
    }
  }

  async loadPortfolio(portfolioId: string): Promise<Portfolio | null> {
    if (!this.config.enabled) return null

    try {
      const response = await fetch(`/api/database/portfolio/${portfolioId}`)

      if (!response.ok) return null

      return await response.json()
    } catch (error) {
      console.error('Database portfolio load error:', error)
      return null
    }
  }

  async savePositions(positions: Position[]): Promise<boolean> {
    if (!this.config.enabled) return false

    try {
      const response = await fetch('/api/database/positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ positions })
      })

      return response.ok
    } catch (error) {
      console.error('Database positions save error:', error)
      return false
    }
  }

  async loadPositions(portfolioId: string): Promise<Position[]> {
    if (!this.config.enabled) return []

    try {
      const response = await fetch(`/api/database/positions/${portfolioId}`)

      if (!response.ok) return []

      const data = await response.json()
      return data.positions || []
    } catch (error) {
      console.error('Database positions load error:', error)
      return []
    }
  }

  async saveBot(bot: Bot): Promise<boolean> {
    if (!this.config.enabled) return false

    try {
      const response = await fetch('/api/database/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bot)
      })

      return response.ok
    } catch (error) {
      console.error('Database bot save error:', error)
      return false
    }
  }

  async loadBots(portfolioId: string): Promise<Bot[]> {
    if (!this.config.enabled) return []

    try {
      const response = await fetch(`/api/database/bots/${portfolioId}`)

      if (!response.ok) return []

      const data = await response.json()
      return data.bots || []
    } catch (error) {
      console.error('Database bots load error:', error)
      return []
    }
  }

  async saveTrades(trades: Trade[]): Promise<boolean> {
    if (!this.config.enabled) return false

    try {
      const response = await fetch('/api/database/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trades })
      })

      return response.ok
    } catch (error) {
      console.error('Database trades save error:', error)
      return false
    }
  }

  async loadTrades(portfolioId: string): Promise<Trade[]> {
    if (!this.config.enabled) return []

    try {
      const response = await fetch(`/api/database/trades/${portfolioId}`)

      if (!response.ok) return []

      const data = await response.json()
      return data.trades || []
    } catch (error) {
      console.error('Database trades load error:', error)
      return []
    }
  }

  async saveRiskMetrics(metrics: RiskMetrics): Promise<boolean> {
    if (!this.config.enabled) return false

    try {
      const response = await fetch('/api/database/risk-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics)
      })

      return response.ok
    } catch (error) {
      console.error('Database risk metrics save error:', error)
      return false
    }
  }

  async loadRiskMetrics(portfolioId: string): Promise<RiskMetrics | null> {
    if (!this.config.enabled) return null

    try {
      const response = await fetch(`/api/database/risk-metrics/${portfolioId}`)

      if (!response.ok) return null

      return await response.json()
    } catch (error) {
      console.error('Database risk metrics load error:', error)
      return null
    }
  }

  async savePerformanceData(data: PerformanceData): Promise<boolean> {
    if (!this.config.enabled) return false

    try {
      const response = await fetch('/api/database/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      return response.ok
    } catch (error) {
      console.error('Database performance data save error:', error)
      return false
    }
  }

  async loadPerformanceData(portfolioId: string): Promise<PerformanceData | null> {
    if (!this.config.enabled) return null

    try {
      const response = await fetch(`/api/database/performance/${portfolioId}`)

      if (!response.ok) return null

      return await response.json()
    } catch (error) {
      console.error('Database performance data load error:', error)
      return null
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.config.enabled) return false

    try {
      const response = await fetch('/api/database/health')
      return response.ok
    } catch (error) {
      console.error('Database connection test error:', error)
      return false
    }
  }

  async backupData(): Promise<boolean> {
    if (!this.config.enabled) return false

    try {
      const response = await fetch('/api/database/backup', {
        method: 'POST'
      })

      return response.ok
    } catch (error) {
      console.error('Database backup error:', error)
      return false
    }
  }

  async restoreData(backupId: string): Promise<boolean> {
    if (!this.config.enabled) return false

    try {
      const response = await fetch(`/api/database/restore/${backupId}`, {
        method: 'POST'
      })

      return response.ok
    } catch (error) {
      console.error('Database restore error:', error)
      return false
    }
  }
}
