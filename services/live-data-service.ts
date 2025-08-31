"use client"

import { AlpacaService } from './alpaca-service'
import { YahooFinanceService } from './yahoo-finance-service'
import { MarketDataService } from './market-data-service'
import { DatabaseService } from './database-service'
import { RealTimeService } from './real-time-service'

export interface LiveDataConfig {
  alpaca: {
    enabled: boolean
    apiKey: string
    secretKey: string
    baseUrl: string
    isPaper: boolean
  }
  yahoo: boolean
  database: {
    enabled: boolean
    type: 'supabase' | 'postgres' | 'sqlite' | 'mongodb'
    connectionString?: string
    supabaseUrl?: string
    supabaseKey?: string
  }
  realtime: {
    enabled: boolean
    websocketUrl?: string
    pollingInterval: number
    maxRetries: number
  }
}

export class LiveDataService {
  private config: LiveDataConfig
  private alpacaService: AlpacaService
  private yahooService: YahooFinanceService
  private marketDataService: MarketDataService
  private databaseService: DatabaseService
  private realTimeService: RealTimeService

  constructor(config: LiveDataConfig) {
    this.config = config
    this.alpacaService = new AlpacaService(config.alpaca)
    this.yahooService = new YahooFinanceService()
    this.marketDataService = new MarketDataService()
    this.databaseService = new DatabaseService(config.database)
    this.realTimeService = new RealTimeService(config.realtime)
  }

  // Alpaca Markets Integration
  async getAlpacaAccount() {
    if (!this.config.alpaca.enabled) return null
    return await this.alpacaService.getAccount()
  }

  async getAlpacaPositions() {
    if (!this.config.alpaca.enabled) return []
    return await this.alpacaService.getPositions()
  }

  async getAlpacaOrders() {
    if (!this.config.alpaca.enabled) return []
    return await this.alpacaService.getOrders()
  }

  async placeAlpacaOrder(order: any) {
    if (!this.config.alpaca.enabled) throw new Error('Alpaca not enabled')
    return await this.alpacaService.placeOrder(order)
  }

  // Yahoo Finance Integration
  async getYahooQuote(symbol: string) {
    if (!this.config.yahoo) return null
    return await this.yahooService.getQuote(symbol)
  }

  async getYahooHistoricalData(symbol: string, period: string = '1y') {
    if (!this.config.yahoo) return []
    const period1 = Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60) // 1 year ago
    const period2 = Math.floor(Date.now() / 1000)
    return await this.yahooService.getHistoricalData(symbol, period1, period2, '1d')
  }

  // Market Data Aggregation
  async getMarketData(symbols: string[]) {
    return await this.marketDataService.getMultipleQuotes(symbols)
  }

  async getMarketNews(symbol?: string) {
    return await this.marketDataService.getNews(symbol)
  }

  // Database Integration
  async savePortfolioData(data: any) {
    if (!this.config.database.enabled) return
    return await this.databaseService.savePortfolio(data)
  }

  async loadPortfolioData(portfolioId: string) {
    if (!this.config.database.enabled) return null
    return await this.databaseService.loadPortfolio(portfolioId)
  }

  async syncBotData(botData: any) {
    if (!this.config.database.enabled) return
    return await this.databaseService.saveBot(botData)
  }

  // Real-time Updates
  subscribeToMarketData(symbols: string[], callback: (data: any) => void) {
    if (!this.config.realtime.enabled) return
    return this.realTimeService.subscribe(callback)
  }

  subscribeToPortfolioUpdates(portfolioId: string, callback: (data: any) => void) {
    if (!this.config.realtime.enabled) return
    return this.realTimeService.subscribe(callback)
  }

  subscribeToBotUpdates(botId: string, callback: (data: any) => void) {
    if (!this.config.realtime.enabled) return
    return this.realTimeService.subscribe(callback)
  }

  // Health checks
  async checkAlpacaConnection() {
    if (!this.config.alpaca.enabled) return false
    return await this.alpacaService.testConnection()
  }

  async checkYahooConnection() {
    if (!this.config.yahoo) return false
    return await this.yahooService.testConnection()
  }

  async checkDatabaseConnection() {
    if (!this.config.database.enabled) return false
    return await this.databaseService.testConnection()
  }

  // Configuration updates
  updateConfig(newConfig: Partial<LiveDataConfig>) {
    this.config = { ...this.config, ...newConfig }
    // Reinitialize services with new config
    this.alpacaService = new AlpacaService(this.config.alpaca)
    this.yahooService = new YahooFinanceService()
    this.databaseService = new DatabaseService(this.config.database)
    this.realTimeService = new RealTimeService(this.config.realtime)
  }

  getConfig() {
    return this.config
  }
}

// Singleton instance
let liveDataService: LiveDataService | null = null

export function getLiveDataService(config?: LiveDataConfig): LiveDataService {
  if (!liveDataService && config) {
    liveDataService = new LiveDataService(config)
  }
  if (!liveDataService) {
    throw new Error('LiveDataService not initialized. Please provide config.')
  }
  return liveDataService
}

export function initializeLiveDataService(config: LiveDataConfig) {
  liveDataService = new LiveDataService(config)
  return liveDataService
}
