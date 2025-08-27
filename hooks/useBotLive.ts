import { useState, useEffect } from 'react'

export default function useBotLive(botId: string) {
  const [data, setData] = useState<any | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle')

  useEffect(() => {
    let mounted = true
    setStatus('loading')

    // Simple polling demo: fetch /api/bots/:id/status if available, otherwise use demo data
    const fetchOnce = async () => {
      try {
        // If a real endpoint exists, prefer it
        const res = await fetch(`/api/bots/${botId}/live`).catch(() => null)
        if (!mounted) return
        if (res && res.ok) {
          const json = await res.json()
          setData(json)
          setStatus('connected')
        } else {
          // fallback demo
          setData({ price: 123.45, lastTradeAt: new Date().toISOString(), positions: [] })
          setStatus('connected')
        }
      } catch (e) {
        if (!mounted) return
        setStatus('error')
      }
    }

    fetchOnce()
    const id = setInterval(fetchOnce, 5000)
    return () => { mounted = false; clearInterval(id) }
  }, [botId])

  return { data, status }
}
