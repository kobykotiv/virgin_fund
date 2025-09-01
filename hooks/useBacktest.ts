"use client"

import { useState, useCallback } from 'react'

export interface BacktestConfig {
  symbol: string
  startDate: string
  endDate: string
  initialCapital: number
  strategy: any
  timeframe: string
}

export interface BacktestResult {
  totalReturn: number
  winRate: number
  maxDrawdown: number
  sharpeRatio: number
  totalTrades: number
  trades: any[]
}

export function useBacktest() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<BacktestResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runBacktest = useCallback(async (config: BacktestConfig) => {
    setIsRunning(true)
    setError(null)

    try {
      const response = await fetch('/api/backtest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        throw new Error('Backtest failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsRunning(false)
    }
  }, [])

  const clearResult = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    runBacktest,
    clearResult,
    isRunning,
    result,
    error
  }
}

// List/backtests hook: fetches available backtests from the API
export function useListBacktest() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchList = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/backtests')
      if (!res.ok) throw new Error('Failed to fetch backtests')
      const data = await res.json()
      setList(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  return { list, fetchList, loading, error, setList }
}
