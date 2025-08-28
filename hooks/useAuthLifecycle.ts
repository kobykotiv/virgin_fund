import { useEffect } from 'react'
import { useAuth } from '@/providers/auth-provider'

// Throttle/dedupe state (module scope so it's shared across imports)
let lastRunAt = 0
let inFlight: Promise<void> | null = null
const DEFAULT_INTERVAL_MS = 30_000 // 30s
const MIN_INTERVAL_MS = Number(process.env.AUTH_LIFECYCLE_MIN_INTERVAL_MS ?? DEFAULT_INTERVAL_MS)

/**
 * runAuthLifecycle
 * - callable refresh used after login/register to rewarm server-derived auth state.
 * - Throttled: repeated calls within MIN_INTERVAL_MS are no-ops and an in-flight call is reused.
 */
export async function runAuthLifecycle(opts?: { force?: boolean }) {
  const force = !!opts?.force

  const now = Date.now()
  if (!force) {
    // reuse in-flight
    if (inFlight) return inFlight
    // throttle repeated calls
    if (now - lastRunAt < MIN_INTERVAL_MS) return Promise.resolve()
  }

  // Start the refresh and store the promise so concurrent callers can await it
  inFlight = (async () => {
    try {
      try {
        await fetch('/api/api-keys', { credentials: 'same-origin' }).catch(() => null)
        await fetch('/api/alpaca/keys', { credentials: 'same-origin' }).catch(() => null)
      } catch (e) {
        console.warn('runAuthLifecycle failed', e)
      }
      lastRunAt = Date.now()
    } finally {
      inFlight = null
    }
  })()

  return inFlight
}

/**
 * useAuthLifecycle
 * - A hook wrapper that calls runAuthLifecycle() on mount (for convenience).
 */
export function useAuthLifecycle() {
  const auth = useAuth()
  useEffect(() => {
    let mounted = true
    if (!mounted) return
    // best-effort call; runAuthLifecycle handles throttling/dedupe
    runAuthLifecycle().catch(() => null)
    return () => { mounted = false }
  }, [auth])
}

export default useAuthLifecycle
