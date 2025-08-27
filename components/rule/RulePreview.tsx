import React from 'react'
import { evaluateRule, evaluateCondition } from '@/lib/ruleInterpreter'
import { calculateIndicatorsFromOHLC } from '@/lib/indicators'

function compareValue(left: number | null | undefined, comp: string, right: number) {
  if (left === null || left === undefined) return false
  switch (comp) {
    case '<': return left < right
    case '<=': return left <= right
    case '==': return left === right
    case '>=': return left >= right
    case '>': return left > right
    default: return false
  }
}

function collectConditions(group: any): any[] {
  const out: any[] = []
  if (!group) return out
  for (const c of group.conditions || []) {
    if (c.conditions) {
      out.push(...collectConditions(c))
    } else {
      out.push(c)
    }
  }
  return out
}

export default function RulePreview({ rule, sample }: { rule?: any; sample?: any[] }) {
  // sample: may be demo-data items { symbol, price, volume, timestamp } or OHLC bars
  if (!rule) return <div className="text-sm text-gray-600">No rule defined</div>

  const bars = (sample || []).map((s) => ({
    date: s.date ?? s.timestamp ?? new Date().toISOString(),
    open: s.open ?? s.price ?? s.o ?? s.c ?? 0,
    high: s.high ?? s.price ?? s.h ?? s.c ?? 0,
    low: s.low ?? s.price ?? s.l ?? s.c ?? 0,
    close: s.close ?? s.price ?? s.c ?? 0,
    volume: s.volume ?? 0,
  }))

  // compute indicators for OHLC sample
  const ind = calculateIndicatorsFromOHLC(bars, { type: (rule.conditions && rule.conditions[0] && (rule.conditions[0] as any).indicator) || 'rsi' })

  // collect flat list of conditions for diagnostics
  const conditions = collectConditions(rule)

  // Build a per-bar context and evaluate rule, but also collect values for debug per-condition
  const debug = bars.map((b) => {
    const ctx = { price: b.close, volume: b.volume, indicators: ind }
    let triggered = false
    try { triggered = evaluateRule(rule, ctx) } catch (e) { triggered = false }

    const conds = conditions.map((cond: any) => {
      let actual: number | null = null
      let missing = false
      if (cond.type === 'price') {
        actual = ctx.price
      } else if (cond.type === 'volume') {
        actual = ctx.volume ?? null
      } else if (cond.type === 'indicator') {
        const key = cond.indicator ?? ''
        const val = ctx.indicators?.[key]
        if (val === undefined) {
          missing = true
        } else if (Array.isArray(val)) {
          actual = val.slice(-1)[0] ?? null
        } else {
          actual = Number(val)
        }
      }

      const passed = !missing && compareValue(actual, cond.comparator, cond.value)
      return { id: cond.id, type: cond.type, indicator: cond.indicator, comparator: cond.comparator, value: cond.value, actual, missing, passed }
    })

    return { date: b.date, price: b.close, triggered, conds }
  })

  const matched = debug.filter((d) => d.triggered)
  const first = matched.slice(0, 10)

  return (
    <div className="bg-white p-2 rounded border">
      <h4 className="text-sm font-medium">Rule Preview</h4>
      <div className="text-xs text-gray-600">Matches in sample: {matched.length}</div>
          <div className="mt-2 text-xs">
            <strong>Indicator snapshot:</strong>
            <pre className="text-xs bg-gray-50 p-2 rounded mt-1 max-h-40 overflow-auto">{JSON.stringify(ind, null, 2)}</pre>
          </div>

          <div className="mt-2">
            <div className="text-xs font-medium mb-1">Per-bar condition diagnostics (first 8 bars):</div>
            <div className="overflow-auto">
              <table className="min-w-full text-xs border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-1">Date</th>
                    <th className="p-1">Price</th>
                    {conditions.map((c: any) => (
                      <th key={c.id} className="p-1">{c.type}{c.indicator ? `:${c.indicator}` : ''} {c.comparator} {c.value}</th>
                    ))}
                    <th className="p-1">Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {debug.slice(0, 8).map((d: any, i: number) => (
                    <tr key={i} className="border-t">
                      <td className="p-1 align-top">{d.date}</td>
                      <td className="p-1 align-top">{d.price}</td>
                      {d.conds.map((cd: any) => (
                        <td key={cd.id} className={`p-1 align-top ${cd.passed ? 'bg-green-50' : cd.missing ? 'bg-yellow-50' : 'bg-red-50'}`}>
                          <div>{cd.actual ?? '—'}</div>
                          <div className="text-xs text-gray-500">{cd.passed ? 'OK' : cd.missing ? 'missing' : 'no'}</div>
                        </td>
                      ))}
                      <td className={`p-1 align-top ${d.triggered ? 'bg-green-100' : ''}`}>{d.triggered ? 'TRIGGER' : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </div>
  )
}
