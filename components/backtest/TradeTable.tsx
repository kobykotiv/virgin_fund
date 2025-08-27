import React from 'react'

export default function TradeTable({ trades }: { trades: any[] }) {
  if (!trades || trades.length === 0) return <div className="p-2 text-sm text-gray-600">No trades executed.</div>

  return (
    <div className="bg-white rounded border overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-2">Time</th>
            <th className="p-2">Type</th>
            <th className="p-2">Symbol</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Price</th>
            <th className="p-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{t.timestamp ?? t.date ?? '—'}</td>
              <td className="p-2">{t.type ?? t.side ?? t.action}</td>
              <td className="p-2">{t.symbol}</td>
              <td className="p-2">{t.quantity ?? t.qty ?? t.quantity}</td>
              <td className="p-2">{Number(t.price).toFixed(2)}</td>
              <td className="p-2">{Number(t.value ?? (t.quantity ?? t.qty) * (t.price ?? 0)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
