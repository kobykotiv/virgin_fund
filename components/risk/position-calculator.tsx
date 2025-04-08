"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface PositionCalcProps {
  accountValue: number
  defaultRisk?: number
}

export function PositionCalculator({ accountValue, defaultRisk = 1 }: PositionCalcProps) {
  const [entryPrice, setEntryPrice] = useState<number>(0)
  const [stopLoss, setStopLoss] = useState<number>(0)
  const [riskPercent, setRiskPercent] = useState<number>(defaultRisk)
  
  const calculatePosition = () => {
    const riskAmount = accountValue * (riskPercent / 100)
    const riskPerShare = Math.abs(entryPrice - stopLoss)
    const positionSize = Math.floor(riskAmount / riskPerShare)
    const totalRisk = positionSize * riskPerShare
    
    return {
      shares: positionSize,
      totalRisk,
      riskPercent: (totalRisk / accountValue) * 100
    }
  }

  const position = calculatePosition()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Position Size Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Entry Price</Label>
            <Input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Stop Loss</Label>
            <Input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Risk %</Label>
            <Input
              type="number"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              min={0.1}
              max={5}
              step={0.1}
            />
          </div>

          <div className="pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Position Size:</span>
              <span className="font-bold">{position.shares} shares</span>
            </div>
            <div className="flex justify-between">
              <span>Total Risk:</span>
              <span className="font-bold">${position.totalRisk.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Account Risk:</span>
              <span className="font-bold">{position.riskPercent.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
