"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Portfolio, Position as PortfolioPosition } from '@/types/portfolio'

// Local Position interface for components
interface Position {
  id: string
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  marketValue: number
  unrealizedPnL: number
  unrealizedPnLPercent: number
  stopLoss?: number
  takeProfit?: number
  botId?: string
  botName?: string
  riskLevel: 'low' | 'medium' | 'high'
}
import { Bot } from '@/types/bot'

// Mock data for development - in production this would come from APIs
const mockPortfolio: Portfolio = {
  id: 'main-portfolio',
  name: 'Main Trading Portfolio',
  focus: 'Diversified Growth',
  icon: '📈',
  tags: ['stocks', 'growth', 'diversified'],
  risk: 'Moderate',
  value: 100000,
  return: 12.5,
  returnClass: 'text-green-600',
  chartVariant: 'area',
  allocation: [
    { name: 'Technology', value: 40, color: '#3b82f6' },
    { name: 'Healthcare', value: 25, color: '#10b981' },
    { name: 'Finance', value: 20, color: '#f59e0b' },
    { name: 'Consumer', value: 15, color: '#ef4444' }
  ],
  positions: [
    {
      id: 'pos-1',
      symbol: 'AAPL',
      quantity: 100,
      avgPrice: 150.00,
      currentPrice: 175.50,
      marketValue: 17550.00,
      unrealizedPnL: 2550.00,
      unrealizedPnLPercent: 17.0,
      stopLoss: 140.00,
      takeProfit: 200.00,
      botId: 'bot-1',
      botName: 'Momentum Bot',
      riskLevel: 'medium' as const
    },
    {
      id: 'pos-2',
      symbol: 'MSFT',
      quantity: 50,
      avgPrice: 300.00,
      currentPrice: 320.75,
      marketValue: 16037.50,
      unrealizedPnL: 1037.50,
      unrealizedPnLPercent: 6.92,
      stopLoss: 285.00,
      takeProfit: 350.00,
      botId: 'bot-2',
      botName: 'Grid Bot',
      riskLevel: 'low' as const
    }
  ] as Position[],
  riskParameters: {
    maxDrawdown: 10,
    maxPositionSize: 5,
    maxDailyLoss: 2,
    stopLoss: 5,
    takeProfit: 10,
    volatilityLimit: 20
  },
  connectedBots: [
    {
      botId: 'bot-1',
      botName: 'Momentum Bot',
      allocation: 30,
      riskParameters: {
        maxDrawdown: 8,
        maxPositionSize: 3,
        maxDailyLoss: 1.5,
        stopLoss: 4,
        takeProfit: 8,
        volatilityLimit: 15
      },
      isActive: true,
      lastSync: new Date().toISOString()
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

const mockBots: Bot[] = [
  {
    id: 'bot-1',
    name: 'Momentum Bot',
    type: 'indicator',
    status: 'active',
    assets: ['AAPL', 'MSFT', 'GOOGL'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    performance: {
      totalPnL: 2500,
      pnlPercentage: 2.5,
      totalTrades: 45,
      winRate: 0.67,
      lastUpdated: new Date().toISOString()
    },
    allocation: 30,
    stopLoss: 5,
    takeProfit: 10,
    maxDrawdown: 8,
    indicatorConfig: {
      type: 'rsi',
      timeframe: '1hour',
      entryThreshold: 30,
      exitThreshold: 70
    }
  },
  {
    id: 'bot-2',
    name: 'Grid Bot',
    type: 'grid',
    status: 'paused',
    assets: ['TSLA'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    performance: {
      totalPnL: -500,
      pnlPercentage: -0.5,
      totalTrades: 23,
      winRate: 0.52,
      lastUpdated: new Date().toISOString()
    },
    allocation: 20,
    stopLoss: 3,
    takeProfit: 6,
    maxDrawdown: 5,
    gridConfig: {
      gridSize: 1,
      upperLimit: 300,
      lowerLimit: 200,
      quantity: 10
    }
  }
]

interface PortfolioDataContextType {
  portfolio: Portfolio
  portfolios: Portfolio[]
  availableBots: Bot[]
  positions: Position[]
  riskMetrics: any
  alerts: any[]
  analyticsData: any
  performanceData: any
  databaseConfig: any
  syncStatus: any
  realTimeConfig: any
  realTimeData: any
  apiConfig: any
  apiStats: any
  updatePortfolio: (portfolio: Portfolio) => void
  updatePosition: (positionId: string, updates: Partial<Position>) => void
  closePosition: (positionId: string) => void
  acknowledgeAlert: (alertId: string) => void
  runOptimization: (botId: string) => void
  applyOptimizedParameters: (botId: string, parameters: any) => void
  createPortfolio: (portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => void
  syncDatabase: () => void
  updateRealTimeConfig: (config: any) => void
  updateApiConfig: (config: any) => void
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined)

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<Portfolio>(mockPortfolio)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([mockPortfolio])
  const [availableBots, setAvailableBots] = useState<Bot[]>(mockBots)
  const [portfolioPositions, setPortfolioPositions] = useState<PortfolioPosition[]>(mockPortfolio.positions)
  const [componentPositions, setComponentPositions] = useState<Position[]>([
    {
      id: 'pos-1',
      symbol: 'AAPL',
      quantity: 100,
      avgPrice: 150.00,
      currentPrice: 175.50,
      marketValue: 17550.00,
      unrealizedPnL: 2550.00,
      unrealizedPnLPercent: 17.0,
      stopLoss: 140.00,
      takeProfit: 200.00,
      botId: 'bot-1',
      botName: 'Momentum Bot',
      riskLevel: 'medium' as const
    },
    {
      id: 'pos-2',
      symbol: 'MSFT',
      quantity: 50,
      avgPrice: 300.00,
      currentPrice: 320.75,
      marketValue: 16037.50,
      unrealizedPnL: 1037.50,
      unrealizedPnLPercent: 6.92,
      stopLoss: 285.00,
      takeProfit: 350.00,
      botId: 'bot-2',
      botName: 'Grid Bot',
      riskLevel: 'low' as const
    }
  ])

  // Mock additional data
  const [riskMetrics] = useState({
    currentDrawdown: 3.2,
    dailyPnL: 1250.50,
    volatility: 12.5,
    sharpeRatio: 1.8,
    winRate: 0.68
  })

  const [alerts] = useState([
    {
      id: 'alert-1',
      type: 'drawdown',
      message: 'Portfolio drawdown approaching limit',
      severity: 'medium',
      timestamp: new Date().toISOString(),
      acknowledged: false
    }
  ])

  const [analyticsData] = useState({
    performance: [],
    correlations: [],
    riskMetrics: riskMetrics
  })

  const [performanceData] = useState({
    returns: [],
    drawdowns: [],
    metrics: {}
  })

  const [databaseConfig] = useState({
    provider: 'supabase',
    syncEnabled: true,
    backupFrequency: 'daily'
  })

  const [syncStatus] = useState({
    lastSync: new Date().toISOString(),
    status: 'success',
    recordsSynced: 1250
  })

  const [realTimeConfig] = useState({
    enabled: true,
    updateInterval: 5000,
    sources: ['alpaca', 'yahoo']
  })

  const [realTimeData] = useState({
    marketData: {},
    portfolioUpdates: {},
    alerts: []
  })

  const [apiConfig] = useState({
    alpaca: { enabled: true },
    yahoo: { enabled: true },
    alphaVantage: { enabled: false }
  })

  const [apiStats] = useState({
    requestsToday: 1250,
    rateLimitRemaining: 4800,
    lastError: null
  })

  const updatePortfolio = (updatedPortfolio: Portfolio) => {
    setPortfolio(updatedPortfolio)
    setPortfolios(prev => prev.map(p => p.id === updatedPortfolio.id ? updatedPortfolio : p))
  }

  const updatePosition = (positionId: string, updates: Partial<Position>) => {
    setComponentPositions(prev => prev.map(pos =>
      pos.id === positionId ? { ...pos, ...updates } : pos
    ))
  }

  const closePosition = (positionId: string) => {
    setComponentPositions(prev => prev.filter(pos => pos.id !== positionId))
  }

  const acknowledgeAlert = (alertId: string) => {
    // In real implementation, this would update the alert status
    console.log('Acknowledging alert:', alertId)
  }

  const runOptimization = (botId: string) => {
    // In real implementation, this would trigger optimization
    console.log('Running optimization for bot:', botId)
  }

  const applyOptimizedParameters = (botId: string, parameters: any) => {
    // In real implementation, this would apply optimized parameters
    console.log('Applying optimized parameters for bot:', botId, parameters)
  }

  const createPortfolio = (newPortfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => {
    const portfolio: Portfolio = {
      ...newPortfolio,
      id: `portfolio-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setPortfolios(prev => [...prev, portfolio])
  }

  const syncDatabase = () => {
    // In real implementation, this would sync with database
    console.log('Syncing database...')
  }

  const updateRealTimeConfig = (config: any) => {
    // In real implementation, this would update real-time config
    console.log('Updating real-time config:', config)
  }

  const updateApiConfig = (config: any) => {
    // In real implementation, this would update API config
    console.log('Updating API config:', config)
  }

  const value: PortfolioDataContextType = {
    portfolio,
    portfolios,
    availableBots,
    positions: componentPositions,
    riskMetrics,
    alerts,
    analyticsData,
    performanceData,
    databaseConfig,
    syncStatus,
    realTimeConfig,
    realTimeData,
    apiConfig,
    apiStats,
    updatePortfolio,
    updatePosition,
    closePosition,
    acknowledgeAlert,
    runOptimization,
    applyOptimizedParameters,
    createPortfolio,
    syncDatabase,
    updateRealTimeConfig,
    updateApiConfig
  }

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  )
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext)
  if (context === undefined) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider')
  }
  return context
}
