"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SpreadCalculator() {
  const [askPrice, setAskPrice] = useState<string>("")
  const [bidPrice, setBidPrice] = useState<string>("")
  const [results, setResults] = useState<{
    spread: number;
    spreadPercentage: number;
    midPrice: number;
  } | null>(null)

  const calculateSpread = () => {
    const ask = parseFloat(askPrice)
    const bid = parseFloat(bidPrice)

    if (isNaN(ask) || isNaN(bid) || bid > ask) {
      return
    }

    const spread = ask - bid
    const midPrice = (ask + bid) / 2
    const spreadPercentage = (spread / midPrice) * 100

    setResults({
      spread,
      spreadPercentage,
      midPrice,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ask-price">Ask Price</Label>
          <Input
            id="ask-price"
            type="number"
            step="0.0001"
            value={askPrice}
            onChange={(e) => setAskPrice(e.target.value)}
            placeholder="Enter ask price"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bid-price">Bid Price</Label>
          <Input
            id="bid-price"
            type="number"
            step="0.0001"
            value={bidPrice}
            onChange={(e) => setBidPrice(e.target.value)}
            placeholder="Enter bid price"
          />
        </div>
      </div>

      <Button className="w-full" onClick={calculateSpread}>
        Calculate Spread
      </Button>

      {results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium">Spread</p>
              <p className="text-2xl font-bold">{results.spread.toFixed(4)}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium">Spread %</p>
              <p className="text-2xl font-bold">{results.spreadPercentage.toFixed(2)}%</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">Mid Price</p>
            <p className="text-2xl font-bold">{results.midPrice.toFixed(4)}</p>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              A tighter spread typically indicates higher liquidity and lower transaction costs.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
