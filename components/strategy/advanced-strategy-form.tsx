import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface AdvancedStrategyFormProps {
  onSubmit: (params: AdvancedStrategyParams) => void
}

interface AdvancedStrategyParams {
  positionSizing: {
    type: 'fixed' | 'risk' | 'percent'
    value: number
  }
  riskManagement: {
    maxDrawdown: number
    maxPositionSize: number
    stopLossType: 'fixed' | 'atr' | 'trailing'
    stopLossValue: number
  }
  indicators: {
    type: string
    params: Record<string, number>
    conditions: {
      crossover?: string
      threshold?: number
      action: 'buy' | 'sell' | 'reduce'
      size: number
    }[]
  }[]
}

export function AdvancedStrategyForm({ onSubmit }: AdvancedStrategyFormProps) {
  const [params, setParams] = useState<AdvancedStrategyParams>({
    positionSizing: {
      type: 'risk',
      value: 1
    },
    riskManagement: {
      maxDrawdown: 10,
      maxPositionSize: 20,
      stopLossType: 'trailing',
      stopLossValue: 2
    },
    indicators: []
  })

  const addIndicator = () => {
    setParams(prev => ({
      ...prev,
      indicators: [
        ...prev.indicators,
        {
          type: 'rsi',
          params: { period: 14 },
          conditions: [
            {
              threshold: 30,
              action: 'buy',
              size: 100
            }
          ]
        }
      ]
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Strategy Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Position Sizing */}
        <div className="space-y-4">
          <Label>Position Sizing</Label>
          <div className="grid grid-cols-2 gap-4">
            <select 
              value={params.positionSizing.type}
              onChange={(e) => setParams(prev => ({
                ...prev,
                positionSizing: {
                  ...prev.positionSizing,
                  type: e.target.value as any
                }
              }))}
              className="w-full"
            >
              <option value="fixed">Fixed Size</option>
              <option value="risk">Risk-Based</option>
              <option value="percent">Portfolio %</option>
            </select>
            <Input
              type="number"
              value={params.positionSizing.value}
              onChange={(e) => setParams(prev => ({
                ...prev,
                positionSizing: {
                  ...prev.positionSizing,
                  value: Number(e.target.value)
                }
              }))}
            />
          </div>
        </div>

        {/* Risk Management */}
        <div className="space-y-4">
          <Label>Risk Management</Label>
          <div className="space-y-2">
            <div>
              <Label>Max Drawdown %</Label>
              <Slider
                value={[params.riskManagement.maxDrawdown]}
                onValueChange={([value]) => setParams(prev => ({
                  ...prev,
                  riskManagement: {
                    ...prev.riskManagement,
                    maxDrawdown: value
                  }
                }))}
                min={1}
                max={50}
              />
            </div>
            <div>
              <Label>Stop Loss Type</Label>
              <select
                value={params.riskManagement.stopLossType}
                onChange={(e) => setParams(prev => ({
                  ...prev,
                  riskManagement: {
                    ...prev.riskManagement,
                    stopLossType: e.target.value as any
                  }
                }))}
                className="w-full"
              >
                <option value="fixed">Fixed</option>
                <option value="atr">ATR-Based</option>
                <option value="trailing">Trailing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Indicators</Label>
            <Button onClick={addIndicator} variant="outline" size="sm">
              Add Indicator
            </Button>
          </div>
          {params.indicators.map((indicator, i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <div className="grid gap-4">
                  <select
                    value={indicator.type}
                    onChange={(e) => {
                      const newIndicators = [...params.indicators]
                      newIndicators[i] = {
                        ...indicator,
                        type: e.target.value
                      }
                      setParams(prev => ({
                        ...prev,
                        indicators: newIndicators
                      }))
                    }}
                    className="w-full"
                  >
                    <option value="rsi">RSI</option>
                    <option value="macd">MACD</option>
                    <option value="bollinger">Bollinger Bands</option>
                  </select>
                  
                  {/* Indicator-specific parameters */}
                  {indicator.conditions.map((condition, j) => (
                    <div key={j} className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        value={condition.threshold}
                        onChange={(e) => {
                          const newIndicators = [...params.indicators]
                          newIndicators[i].conditions[j].threshold = Number(e.target.value)
                          setParams(prev => ({
                            ...prev,
                            indicators: newIndicators
                          }))
                        }}
                        placeholder="Threshold"
                      />
                      <select
                        value={condition.action}
                        onChange={(e) => {
                          const newIndicators = [...params.indicators]
                          newIndicators[i].conditions[j].action = e.target.value as any
                          setParams(prev => ({
                            ...prev,
                            indicators: newIndicators
                          }))
                        }}
                      >
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                        <option value="reduce">Reduce</option>
                      </select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          onClick={() => onSubmit(params)}
          className="w-full"
        >
          Apply Strategy
        </Button>
      </CardContent>
    </Card>
  )
}
