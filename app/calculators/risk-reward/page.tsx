"use client"

import { useState } from 'react'

export default function RiskRewardCalculator() {
  const [entryPrice, setEntryPrice] = useState<number>(0)
  const [stopLoss, setStopLoss] = useState<number>(0)
  const [takeProfit, setTakeProfit] = useState<number>(0)
  
  const calculateRatio = () => {
    if (!stopLoss || !takeProfit) return 0
    const risk = Math.abs(entryPrice - stopLoss)
    const reward = Math.abs(takeProfit - entryPrice)
    return (reward / risk).toFixed(2)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Risk/Reward Calculator</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Entry Price</label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stop Loss</label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Take Profit</label>
          <input
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <p className="text-lg font-bold">Risk/Reward Ratio: {calculateRatio()}</p>
        </div>
      </div>
    </div>
  )
}
