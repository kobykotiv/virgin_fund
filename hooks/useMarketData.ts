import { useState, useEffect } from "react";

/**
 * Generic market-data hook compatible with multiple call sites.
 * - Accepts either an array of symbols or a key string and options object.
 * - Returns a flexible shape: { data?: T, loading: boolean, error?: any }
 *
 * This keeps callers (Calendar, charts, etc.) type-safe while being permissive.
 */
export function useMarketData<T = any>(
  keyOrSymbols: string | string[],
  opts?: any,
): { data?: T; loading: boolean; error?: any } {
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    let canceled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        if (typeof keyOrSymbols === "string") {
          // Generic key-based endpoint (adaptable)
          const res = await fetch(
            `/api/market-data?key=${encodeURIComponent(keyOrSymbols)}&opts=${encodeURIComponent(
              JSON.stringify(opts ?? {}),
            )}`,
          )
          if (!res.ok) throw new Error(res.statusText)
          const json = await res.json()
          if (!canceled) setData(json?.data as T)
          return
        }

        if (Array.isArray(keyOrSymbols)) {
          const symbols = keyOrSymbols.filter(Boolean)
          if (symbols.length === 0) {
            if (!canceled) setData(undefined)
            return
          }

          // Use new merged market-data endpoint
          const res = await fetch(`/api/market-data?symbols=${encodeURIComponent(symbols.join(","))}`)
          if (!res.ok) throw new Error(res.statusText)
          const json = await res.json()
          if (!canceled) setData(json?.data as T)
          return
        }
      } catch (err) {
        if (!canceled) setError(err instanceof Error ? err.message : err)
        console.error("Error fetching market data:", err)
      } finally {
        if (!canceled) setLoading(false)
      }
    }

    fetchData()

    return () => {
      canceled = true
    }
    // keyOrSymbols can be string or array; normalize dependency
  }, [Array.isArray(keyOrSymbols) ? keyOrSymbols.join(",") : keyOrSymbols, JSON.stringify(opts)])

  return { data, loading, error }
}
