"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Plus, X } from "lucide-react"
import type { IndicatorConfig, TradingIndicator } from "@/types/bot"

interface IndicatorConfigProps {
  config: Partial<IndicatorConfig>
  onChange: (config: Partial<IndicatorConfig>) => void
}

const AVAILABLE_INDICATORS = [
  { id: "rsi", name: "RSI", description: "Relative Strength Index" },
  { id: "macd", name: "MACD", description: "Moving Average Convergence Divergence" },
  { id: "bb", name: "Bollinger Bands", description: "Standard deviation-based bands" },
  { id: "sma", name: "Simple Moving Average", description: "Basic moving average" },
  { id: "ema", name: "Exponential Moving Average", description: "Weighted moving average" }
]

export function IndicatorConfigForm({ config, onChange }: IndicatorConfigProps) {
  const handleChange = (field: keyof IndicatorConfig, value: any) => {
    onChange({ ...config, [field]: value })
  }

  const addIndicator = () => {
    const indicators = config.indicators || []
    handleChange("indicators", [
      ...indicators,
      { type: "", period: 14, threshold: 50, weight: 1 }
    ])
  }

  const removeIndicator = (index: number) => {
    const indicators = [...(config.indicators || [])]
    indicators.splice(index, 1)
    handleChange("indicators", indicators)
  }

  const updateIndicator = (index: number, field: keyof TradingIndicator, value: any) => {
    const indicators = [...(config.indicators || [])]
    indicators[index] = { ...indicators[index], [field]: value }
    handleChange("indicators", indicators)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technical Indicator Strategy</CardTitle>
          <CardDescription>Configure your indicator-based trading strategy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Position Size</Label>
              <Input
                type="number"
                value={config.positionSize}
                onChange={(e) => handleChange("positionSize", parseFloat(e.target.value))}
                placeholder="e.g. 1000"
              />
              <p className="text-sm text-muted-foreground">Amount to invest per trade</p>
            </div>

            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select
                value={config.timeframe}
                onValueChange={(value) => handleChange("timeframe", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 minute</SelectItem>
                  <SelectItem value="5m">5 minutes</SelectItem>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="1d">1 day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Trading Indicators</Label>
              <Button
                onClick={addIndicator}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Indicator
              </Button>
            </div>

            <div className="space-y-4">
              {(config.indicators || []).map((indicator, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Indicator Type</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIndicator(index)}
                            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Select
                          value={indicator.type}
                          onValueChange={(value) => updateIndicator(index, "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select indicator" />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_INDICATORS.map((ind) => (
                              <SelectItem key={ind.id} value={ind.id}>
                                {ind.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Period</Label>
                        <Input
                          type="number"
                          value={indicator.period}
                          onChange={(e) =>
                            updateIndicator(index, "period", parseInt(e.target.value))
                          }
                          placeholder="e.g. 14"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Threshold</Label>
                        <Input
                          type="number"
                          value={indicator.threshold}
                          onChange={(e) =>
                            updateIndicator(index, "threshold", parseFloat(e.target.value))
                          }
                          placeholder="e.g. 70"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Weight ({indicator.weight})</Label>
                        <Slider
                          value={[indicator.weight]}
                          onValueChange={([value]) => updateIndicator(index, "weight", value)}
                          min={0.1}
                          max={5}
                          step={0.1}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(config.indicators || []).length === 0 && (
                <div className="text-center p-4 border rounded-lg border-dashed">
                  <p className="text-muted-foreground">Add indicators to create your strategy</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}