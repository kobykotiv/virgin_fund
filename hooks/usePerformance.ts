/**
 * hooks/usePerformance.ts
 *
 * Lightweight data hook for the Performance dashboard.
 * - Conservative implementation that calls the existing `getSavedBacktests`
 *   provider as a fallback so we don't introduce new infra changes.
 * - Provides a small interface: { data, loading, error, refetch } so the
 *   PerformanceDashboard and its subcomponents can consume a single source.
 *
 * Later: replace internals with React Query + Supabase-backed calls.
 */

import { useCallback, useEffect, useState } from "react"
import type { BacktestResult } from "@/types/backtest"
import { getSavedBacktests } from "@/lib/backtest-service"

export function usePerformance() {
  const [data, setData] = useState<BacktestResult[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getSavedBacktests()
      if (Array.isArray(res)) {
        setData(res)
      } else {
        setData([])
      }
    } catch (err: any) {
      setError(err)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
