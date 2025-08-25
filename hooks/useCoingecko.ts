import { useQuery } from '@tanstack/react-query'

export function useCoingeckoTop(page = 1, per_page = 100, vs_currency = 'usd') {
  return useQuery(['coingecko', 'top', vs_currency, page, per_page], async () => {
    const res = await fetch(`/api/market/coingecko/top?page=${page}&per_page=${per_page}&vs_currency=${vs_currency}`)
    if (!res.ok) return []
    const json = await res.json()
    return json?.data ?? []
  }, { staleTime: 1000 * 30 })
}

export function useCoingeckoCoin(id?: string) {
  return useQuery(['coingecko', 'coin', id], async () => {
    if (!id) return null
    const res = await fetch(`/api/market/coingecko/coin/${encodeURIComponent(id)}`)
    if (!res.ok) return null
    const json = await res.json()
    return json?.data ?? null
  }, { enabled: Boolean(id), staleTime: 1000 * 60 })
}
