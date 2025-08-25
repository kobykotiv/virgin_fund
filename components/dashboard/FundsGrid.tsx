"use client"

import React, { useEffect, useState } from "react"
import FundCard from "./FundCard"
import type { Fund } from "@/lib/mockApi"
import { fetchFunds } from "@/lib/mockApi"

export default function FundsGrid() {
  const [funds, setFunds] = useState<Fund[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetchFunds().then((f) => { if (mounted) setFunds(f) }).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 bg-muted animate-pulse rounded" />)}</div>

  if (funds.length === 0) return <div className="p-8 text-center text-sm text-muted-foreground">No funds available — try adjusting your filters.</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {funds.map(f => (
        <FundCard key={f.ticker} fund={f} onOpen={(t) => console.log('open', t)} />
      ))}
    </div>
  )
}
