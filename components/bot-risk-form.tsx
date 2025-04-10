"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import type { BotWithPortfolio } from "@/components/dashboard"

interface BotRiskFormProps {
  initialData: Partial<BotWithPortfolio>
  onSubmit: (data: Partial<BotWithPortfolio>) => void
}

export function BotRiskForm({ initialData, onSubmit }: BotRiskFormProps) {
  const [formData, setFormData] = useState({
    maxDrawdown: initialData.riskSettings?.maxDrawdown || 5,
    stopLoss: initialData.riskSettings?.stopLoss || 3,
    takeProfit: initialData.riskSettings?.takeProfit || 5,
    positionSize: initialData.riskSettings?.positionSize || 10,
    maxPositions: initialData.riskSettings?.maxPositions || 5,
    enableEmergencyStop: initialData.riskSettings?.enableEmergencyStop || true,
    volatilityAdjustment: initialData.riskSettings?.volatilityAdjustment || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleSliderChange = (name: string, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onSubmit({
      riskSettings: {
        maxDrawdown: Number(formData.maxDrawdown),
        stopLoss: Number(formData.stopLoss),
        takeProfit: Number(formData.takeProfit),
        positionSize: Number(formData.positionSize),
        maxPositions: Number(formData.maxPositions),
        enableEmergencyStop: formData.enableEmergencyStop,
        volatilityAdjustment: formData.volatilityAdjustment,
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="positionSize">Position Size (% of portfolio)</Label>
                <span className="text-sm font-medium">{formData.positionSize}%</span>
              </div>
              <div className="pt-2">
                <Slider 
                  id="positionSize"
                  min={1}
                  max={50}
                  step={1}
                  defaultValue={[formData.positionSize]}
                  onValueChange={(values) => handleSliderChange('positionSize', values[0])}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="maxDrawdown">Max Drawdown Tolerance (%)</Label>
                <span className="text-sm font-medium">{formData.maxDrawdown}%</span>
              </div>
              <div className="pt-2">
                <Slider 
                  id="maxDrawdown"
                  min={1}
                  max={20}
                  step={1}
                  defaultValue={[formData.maxDrawdown]}
                  onValueChange={(values) => handleSliderChange('maxDrawdown', values[0])}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                <Input
                  id="stopLoss"
                  name="stopLoss"
                  type="number"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={formData.stopLoss}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="takeProfit">Take Profit (%)</Label>
                <Input
                  id="takeProfit"
                  name="takeProfit"
                  type="number"
                  min="1"
                  max="50"
                  step="0.5"
                  value={formData.takeProfit}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPositions">Max Concurrent Positions</Label>
              <Select
                name="maxPositions"
                value={formData.maxPositions.toString()}
                onValueChange={(value) => handleSelectChange('maxPositions', value)}
              >
                <SelectTrigger id="maxPositions">
                  <SelectValue placeholder="Select max positions" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 3, 5, 10, 15, 25].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableEmergencyStop">Emergency Stop</Label>
                <p className="text-sm text-muted-foreground">
                  Auto-close all positions in severe market conditions
                </p>
              </div>
              <Switch 
                id="enableEmergencyStop"
                checked={formData.enableEmergencyStop}
                onCheckedChange={(checked) => handleSwitchChange('enableEmergencyStop', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="volatilityAdjustment">Volatility Adjustment</Label>
                <p className="text-sm text-muted-foreground">
                  Adjust position size based on market volatility
                </p>
              </div>
              <Switch 
                id="volatilityAdjustment"
                checked={formData.volatilityAdjustment}
                onCheckedChange={(checked) => handleSwitchChange('volatilityAdjustment', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Button type="submit" className="w-full">Continue</Button>
    </form>
  )
}
