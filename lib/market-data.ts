/**
 * Minimal lib/market-data stub used by components that import "@/lib/market-data".
 * Real implementation lives in lib/market-data/providers/* — this provides a small
 * compat layer so tests and tsc can import it without errors.
 */

/**
 * Return shape: { data, loading, error } to match callers.
 */
export async function getMarketData<T = any>(key: string, opts?: any): Promise<{ data?: T; loading?: boolean; error?: any }> {
  return { data: undefined, loading: false, error: null }
}
