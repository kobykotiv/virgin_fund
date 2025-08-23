"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export type PotentialReturnItem = {
  priceMove: number
  pnl: number
  roi: number
}

export type LeverageResults = {
  requiredMargin: number
  maxLoss: number
  liquidationPrice: number
  potentialReturn: PotentialReturnItem[]
} | null

export function LeverageCalculator() {
  const [position, setPosition] = useState<number>(10000)
  const [leverage, setLeverage] = useState<number>(5)
  const [price, setPrice] = useState<number>(100)
  const [direction, setDirection] = useState<"long" | "short">("long")

  const [results, setResults] = useState<LeverageResults>(null)

  const calculateLeverage = () => {
    const margin = position / leverage
    const contractValue = position * leverage
    const maxLoss = margin
    
    // Calculate liquidation price (simplified)
    const liquidationThreshold = 0.80 // 80% of margin
    const priceDelta = (margin * (1 - liquidationThreshold)) / contractValue
    const liquidationPrice = direction === "long" 
      ? price * (1 - priceDelta)
      : price * (1 + priceDelta)

    // Calculate potential returns for different price movements
    const priceMovements = [-10, -5, 5, 10] // percentage moves
    const returns = priceMovements.map(move => {
      const pnl = (contractValue * (move / 100)) * (direction === "long" ? 1 : -1)
      return {
        priceMove: move,
        pnl: pnl,
        roi: (pnl / margin) * 100
      }
    })

    setResults({
      requiredMargin: margin,
      maxLoss: maxLoss,
      liquidationPrice: liquidationPrice,
      potentialReturn: returns
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leverage Calculator</CardTitle>
        <CardDescription>Calculate margin requirements and potential returns for leveraged positions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Position Size ($)</Label>
            <Input 
              type="number" 
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Leverage (x)</Label>
            <Select 
              value={leverage.toString()}
              onValueChange={(value) => setLeverage(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leverage" />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 5, 10, 20, 50, 100].map((x) => (
                  <SelectItem key={x} value={x.toString()}>{x}x</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Entry Price ($)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Direction</Label>
            <Select
              value={direction}
              onValueChange={(value: "long" | "short") => setDirection(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="long">Long</SelectItem>
                <SelectItem value="short">Short</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="w-full" onClick={calculateLeverage}>Calculate</Button>

        {results && (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                High leverage increases both potential profits and losses. Never risk more than you can afford to lose.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm font-medium">Required Margin</p>
                <p className="text-2xl font-bold">${results.requiredMargin.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm font-medium">Maximum Loss</p>
                <p className="text-2xl font-bold text-red-500">
                  ${results.maxLoss.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium">Liquidation Price</p>
              <p className="text-2xl font-bold">${results.liquidationPrice.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                Position will be liquidated at this price
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Potential Returns</h4>
              {results.potentialReturn.map((r, i) => (
                <div key={i} className="flex justify-between p-2 border rounded">
                  <span>{r.priceMove}% price movement</span>
                  <span className={r.pnl >= 0 ? "text-green-600" : "text-red-600"}>
                    ${r.pnl.toLocaleString()} ({r.roi.toFixed(2)}% ROI)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Note: This is a simplified calculation. Actual results may vary due to funding rates, fees, and market conditions.
      </CardFooter>
    </Card>
  )
}
