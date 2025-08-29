import { useState, useEffect } from 'react'

export interface BacktestResult {
  id: string
  name: string
  strategy: string
  startDate: string
  endDate: string
  initialCapital: number
  finalCapital: number
  totalReturn: number
  maxDrawdown: number
  winRate: number
  totalTrades: number
  sharpeRatio: number
  status: 'running' | 'completed' | 'failed'
  createdAt: string
}

export function useListBacktest() {
  const [backtests, setBacktests] = useState<BacktestResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBacktests()
  }, [])

  const loadBacktests = async () => {
    try {
      setIsLoading(true)
      // In a real app, this would fetch from your API
      // For now, return mock data
      const mockBacktests: BacktestResult[] = [
        {
          id: '1',
          name: 'SMA Crossover Strategy',
          strategy: 'SMA Crossover',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          initialCapital: 10000,
          finalCapital: 12500,
          totalReturn: 25.0,
          maxDrawdown: 8.5,
          winRate: 0.65,
          totalTrades: 45,
          sharpeRatio: 1.2,
          status: 'completed',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'RSI Mean Reversion',
          strategy: 'RSI Mean Reversion',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          initialCapital: 10000,
          finalCapital: 11800,
          totalReturn: 18.0,
          maxDrawdown: 12.3,
          winRate: 0.58,
          totalTrades: 62,
          sharpeRatio: 0.9,
          status: 'completed',
          createdAt: '2024-01-20T14:15:00Z'
        }
      ]

      setBacktests(mockBacktests)
      setError(null)
    } catch (err) {
      setError('Failed to load backtests')
      console.error('Error loading backtests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const createBacktest = async (config: any) => {
    try {
      // In a real app, this would POST to your API
      const newBacktest: BacktestResult = {
        id: Math.random().toString(36).substring(2, 9),
        name: config.name || 'New Backtest',
        strategy: config.strategy || 'Custom',
        startDate: config.startDate,
        endDate: config.endDate,
        initialCapital: config.initialCapital || 10000,
        finalCapital: 0,
        totalReturn: 0,
        maxDrawdown: 0,
        winRate: 0,
        totalTrades: 0,
        sharpeRatio: 0,
        status: 'running',
        createdAt: new Date().toISOString()
      }

      setBacktests(prev => [newBacktest, ...prev])
      return newBacktest
    } catch (err) {
      console.error('Error creating backtest:', err)
      throw err
    }
  }

  return {
    backtests,
    isLoading,
    error,
    loadBacktests,
    createBacktest
  }
}
