import React from 'react'

export default function EquityChart({ equity }: { equity: any[] }) {
  // equity items may be { date, value } or { ts, value }
  const points = (equity || []).map((p) => ({ x: new Date(p.date ?? p.ts ?? p.timestamp).getTime(), y: p.value ?? p.equity ?? p.value }))
  if (points.length === 0) return <div className="p-2 text-sm text-gray-600">No equity data</div>

  const ys = points.map((p) => p.y)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const width = 400
  const height = 120

  const path = points.map((pt, idx) => {
    const x = (idx / (points.length - 1)) * width
    const y = height - ((pt.y - minY) / (maxY - minY || 1)) * height
    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')

  return (
    <div className="bg-white p-2 rounded border">
      <h4 className="text-sm font-medium mb-2">Equity</h4>
      <svg width={width} height={height}>
        <path d={path} fill="none" stroke="#3b82f6" strokeWidth={2} />
      </svg>
      <div className="text-xs text-gray-500 mt-2">Points: {points.length} — Min: {minY.toFixed(2)} Max: {maxY.toFixed(2)}</div>
    </div>
  )
}
