import React from 'react'
import { evaluateRule } from '@/lib/ruleInterpreter'

export default function RulePreview({ rule, sample }: { rule?: any; sample?: any[] }) {
  // sample: may be demo-data items { symbol, price, volume, timestamp } or OHLC bars
  if (!rule) return <div className="text-sm text-gray-600">No rule defined</div>
  const triggers = (sample || []).map((s) => {
    const price = s.close ?? s.price ?? s.o ?? s.c
    const date = s.date ?? s.timestamp ?? s.t
    const ctx = { price: price ?? 0, volume: s.volume ?? 0, indicators: s.indicators ?? {} }
    let ok = false
    try { ok = evaluateRule(rule, ctx) } catch (e) { ok = false }
    return { date, triggered: ok }
  })

  const matched = triggers.filter((t: any) => t.triggered)
  const first = matched.slice(0, 10)

  return (
    <div className="bg-white p-2 rounded border">
      <h4 className="text-sm font-medium">Rule Preview</h4>
      <div className="text-xs text-gray-600">Matches in sample: {matched.length}</div>
      <ul className="text-sm mt-2 list-disc pl-5">
        {first.map((f: any, i: number) => <li key={i}>{f.date} — triggered</li>)}
        {first.length === 0 && <li className="text-xs text-gray-500">No triggers in sample</li>}
      </ul>
    </div>
  )
}
