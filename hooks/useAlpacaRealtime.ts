import { useEffect, useRef, useState } from 'react'

export default function useAlpacaRealtime(symbol: string | null) {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!symbol) return
    const url = `/api/alpaca/stream?symbol=${encodeURIComponent(symbol)}`
    const es = new EventSource(url)
    esRef.current = es
    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data)
        if (payload.ok) setData(payload.data)
        else setError(payload.error || 'unknown')
      } catch (e) {
        setError(String(e))
      }
    }
    es.onerror = (e) => {
      setError('eventsource error')
      try { es.close() } catch {}
    }
    return () => {
      try { es.close() } catch {}
      esRef.current = null
    }
  }, [symbol])

  return { data, error }
}
