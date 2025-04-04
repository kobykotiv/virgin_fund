"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function PositionSizeCalculator() {
  const [accountSize, setAccountSize] = useState<string>("")
  const [riskPercentage, setRiskPercentage] = useState<string>("")
  const [entryPrice, setEntryPrice] = useState<string>("")
  const [stopLoss, setStopLoss] = useState<string>("")
  const [results, setResults] = useState<{
    positionSize: number
    maxLoss: number
    riskReward: number[]
    shares: number
  } | null>(null)

  const calculatePosition = () => {
    const account = parseFloat(accountSize)
    const risk = parseFloat(riskPercentage)
    const entry = parseFloat(entryPrice)
    const stop = parseFloat(stopLoss)

    if (isNaN(account) || isNaN(risk) || isNaN(entry) || isNaN(stop)) return

    const maxLoss = account * (risk / 100)
    const priceDiff = Math.abs(entry - stop)
    const shares = Math.floor(maxLoss / priceDiff)
    const positionSize = shares * entry

    // Calculate potential returns at different R multiples
    const rMultiples = [1, 2, 3, 5]
    const riskReward = rMultiples.map(r => maxLoss * r)

    setResults({
      positionSize,
      maxLoss,
      riskReward,
      shares
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Account Size ($)</Label>
          <Input
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(e.target.value)}
            placeholder="10000"
          />
        </div>
        <div className="space-y-2">
          <Label>Risk Percentage (%)</Label>
          <Input
            type="number"
            value={riskPercentage}
            onChange={(e) => setRiskPercentage(e.target.value)}
            placeholder="1"
          />
        </div>
        <div className="space-y-2">
          <Label>Entry Price ($)</Label>
          <Input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            placeholder="100"
          />
        </div>
        <div className="space-y-2">
          <Label>Stop Loss ($)</Label>
          <Input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            placeholder="95"
          />
        </div>
      </div>

      <Button className="w-full" onClick={calculatePosition}>Calculate Position Size</Button>

      {results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium">Position Size</p>
              <p className="text-2xl font-bold">${results.positionSize.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium">Number of Shares</p>
              <p className="text-2xl font-bold">{results.shares}</p>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">Maximum Loss</p>
            <p className="text-2xl font-bold text-red-500">${results.maxLoss.toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Potential Returns (R Multiples)</p>
            <div className="grid grid-cols-2 gap-2">
              {results.riskReward.map((reward, i) => (
                <div key={i} className="p-2 border rounded">
                  <p className="text-sm text-muted-foreground">{i + 1}R</p>
                  <p className="text-lg font-bold text-green-500">
                    ${reward.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Position size is calculated based on your risk tolerance and stop loss level.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
