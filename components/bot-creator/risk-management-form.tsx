"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface RiskManagement {
  maxPositionSize: number
  stopLoss?: number
  takeProfit?: number
  maxDrawdown?: number
  trailingStop?: boolean
  trailingStopDistance?: number
  maxOpenTrades?: number
  leverageEnabled?: boolean
  maxLeverage?: number
  marginCallLevel?: number
  rebalanceThreshold?: number
}

interface RiskManagementFormProps {
  riskManagement: RiskManagement
  onChange: (riskManagement: RiskManagement) => void
}

export function RiskManagementForm({ riskManagement, onChange }: RiskManagementFormProps) {
  const [localState, setLocalState] = useState(riskManagement)

  useEffect(() => {
    onChange(localState)
  }, [localState, onChange])

  const handleValueChange = (key: keyof RiskManagement, value: any) => {
    setLocalState(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Risk Management Settings</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Configure risk management parameters for your trading bot</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label>Maximum Position Size (%)</Label>
            <Slider
              value={[localState.maxPositionSize]}
              onValueChange={([value]) => handleValueChange("maxPositionSize", value)}
              min={1}
              max={100}
              step={1}
            />
            <div className="text-sm text-muted-foreground">
              Current: {localState.maxPositionSize}%
            </div>
          </div>

          <div className="space-y-4">
            <Label>Stop Loss (%)</Label>
            <Slider
              value={[localState.stopLoss || 0]}
              onValueChange={([value]) => handleValueChange("stopLoss", value)}
              min={0}
              max={50}
              step={0.5}
            />
            <div className="text-sm text-muted-foreground">
              Current: {localState.stopLoss || 0}%
            </div>
          </div>

          <div className="space-y-4">
            <Label>Take Profit (%)</Label>
            <Slider
              value={[localState.takeProfit || 0]}
              onValueChange={([value]) => handleValueChange("takeProfit", value)}
              min={0}
              max={100}
              step={0.5}
            />
            <div className="text-sm text-muted-foreground">
              Current: {localState.takeProfit || 0}%
            </div>
          </div>

          <div className="space-y-4">
            <Label>Maximum Drawdown (%)</Label>
            <Slider
              value={[localState.maxDrawdown || 0]}
              onValueChange={([value]) => handleValueChange("maxDrawdown", value)}
              min={0}
              max={50}
              step={0.5}
            />
            <div className="text-sm text-muted-foreground">
              Current: {localState.maxDrawdown || 0}%
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Trailing Stop</Label>
              <Switch
                checked={localState.trailingStop || false}
                onCheckedChange={(checked) => handleValueChange("trailingStop", checked)}
              />
            </div>
            {localState.trailingStop && (
              <>
                <Label>Trailing Stop Distance (%)</Label>
                <Slider
                  value={[localState.trailingStopDistance || 1]}
                  onValueChange={([value]) => handleValueChange("trailingStopDistance", value)}
                  min={0.1}
                  max={20}
                  step={0.1}
                />
                <div className="text-sm text-muted-foreground">
                  Current: {localState.trailingStopDistance || 1}%
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <Label>Maximum Open Trades</Label>
            <Input
              type="number"
              min={1}
              value={localState.maxOpenTrades || ""}
              onChange={(e) => handleValueChange("maxOpenTrades", parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium mb-4">Advanced Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Leverage</Label>
                <Switch
                  checked={localState.leverageEnabled || false}
                  onCheckedChange={(checked) => handleValueChange("leverageEnabled", checked)}
                />
              </div>
              {localState.leverageEnabled && (
                <>
                  <Label>Maximum Leverage</Label>
                  <Slider
                    value={[localState.maxLeverage || 1]}
                    onValueChange={([value]) => handleValueChange("maxLeverage", value)}
                    min={1}
                    max={20}
                    step={1}
                  />
                  <div className="text-sm text-muted-foreground">
                    Current: {localState.maxLeverage || 1}x
                  </div>
                </>
              )}
            </div>

            {localState.leverageEnabled && (
              <div className="space-y-4">
                <Label>Margin Call Level (%)</Label>
                <Slider
                  value={[localState.marginCallLevel || 50]}
                  onValueChange={([value]) => handleValueChange("marginCallLevel", value)}
                  min={10}
                  max={90}
                  step={5}
                />
                <div className="text-sm text-muted-foreground">
                  Current: {localState.marginCallLevel || 50}%
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Label>Rebalance Threshold (%)</Label>
              <Slider
                value={[localState.rebalanceThreshold || 5]}
                onValueChange={([value]) => handleValueChange("rebalanceThreshold", value)}
                min={1}
                max={20}
                step={0.5}
              />
              <div className="text-sm text-muted-foreground">
                Current: {localState.rebalanceThreshold || 5}%
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}