import React from 'react'

export default function PositionSummary({ positions }: { positions: any[] }) {
  if (!positions || positions.length === 0) return <div className="text-sm text-gray-600">No positions</div>

  return (
    <div className="space-y-2">
      {positions.map((p, i) => (
        <div key={i} className="flex items-center justify-between text-sm border p-2 rounded">
          <div>{p.symbol}</div>
          <div>{p.qty ?? p.quantity ?? p.qty}</div>
          <div>{(p.avgPrice ?? p.avg_price ?? p.price)?.toFixed ? (p.avgPrice ?? p.avg_price ?? p.price).toFixed(2) : p.avgPrice}</div>
        </div>
      ))}
    </div>
  )
}
