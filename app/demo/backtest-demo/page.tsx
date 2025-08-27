"use client"
import React, { useEffect, useState } from 'react'
import BacktestResults from '@/components/backtest/BacktestResults'

export default function Page() {
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchIt() {
      try {
        const res = await fetch('/demo/backtest-demo')
        const json = await res.json()
        setResult(json)
      } finally { setLoading(false) }
    }
    fetchIt()
  }, [])

  if (loading) return <div className="p-4">Loading demo backtest...</div>
  if (!result) return <div className="p-4">No result</div>

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Backtest Demo</h2>
      <BacktestResults result={result} />
    </div>
  )
}
