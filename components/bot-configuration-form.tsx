"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { BotWithPortfolio } from "@/components/dashboard"
import type { BotType } from "@/types/bot"
import { Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BotConfigurationFormProps {
  botType: BotType | 'custom'
  initialData?: any
  onSubmit: (data: any) => void
}

export function BotConfigurationForm({ botType, initialData, onSubmit }: BotConfigurationFormProps) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    symbol: '',
    investment: 1000,
    ...getDefaultConfigForType(botType)
  })

  function getDefaultConfigForType(type: BotType | 'custom') {
    switch (type) {
      case 'grid':
        return {
          gridLevels: 5,
          upperLimit: 0,
          lowerLimit: 0
        }
      case 'dca':
        return {
          interval: 'weekly',
          amount: 100
        }
      case 'momentum':
        return {
          lookbackPeriod: 14,
          threshold: 0.1
        }
      case 'custom':
        if (initialData?.settings?.type === 'basket') {
          return {
            type: 'basket',
            targetAllocation: {},
            rebalancePeriod: '0 0 * * 1',
            baskets: []
          }
        } else if (initialData?.settings?.type === 'signal') {
          return {
            type: 'signal',
            indicators: [{
              type: 'rsi',
              timeframe: '1hour',
              entryThreshold: 30,
              exitThreshold: 70
            }],
            symbol: '',
            positionSize: 0
          }
        }
        return {}
      default:
        return {}
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bot Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="symbol">Trading Symbol</Label>
            <Input
              id="symbol"
              value={formData.symbol}
              onChange={e => handleChange('symbol', e.target.value)}
              placeholder="e.g. BTC/USD"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="investment">Initial Investment ($)</Label>
          <Input
            id="investment"
            type="number"
            min={0}
            step={100}
            value={formData.investment}
            onChange={e => handleChange('investment', Number(e.target.value))}
            required
          />
        </div>

        {botType === 'grid' && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="upperLimit">Upper Price Limit</Label>
                  <Input
                    id="upperLimit"
                    type="number"
                    min={0}
                    value={formData.upperLimit}
                    onChange={e => handleChange('upperLimit', Number(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowerLimit">Lower Price Limit</Label>
                  <Input
                    id="lowerLimit"
                    type="number"
                    min={0}
                    value={formData.lowerLimit}
                    onChange={e => handleChange('lowerLimit', Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gridLevels">Grid Levels</Label>
                <Input
                  id="gridLevels"
                  type="number"
                  min={2}
                  max={100}
                  value={formData.gridLevels}
                  onChange={e => handleChange('gridLevels', Number(e.target.value))}
                  required
                />
              </div>
            </CardContent>
          </Card>
        )}

        {botType === 'dca' && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="interval">Investment Interval</Label>
                <Select 
                  value={formData.interval}
                  onValueChange={value => handleChange('interval', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount per Investment ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={0}
                  step={10}
                  value={formData.amount}
                  onChange={e => handleChange('amount', Number(e.target.value))}
                  required
                />
              </div>
            </CardContent>
          </Card>
        )}

        {botType === 'momentum' && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lookbackPeriod">Lookback Period (days)</Label>
                <Input
                  id="lookbackPeriod"
                  type="number"
                  min={1}
                  value={formData.lookbackPeriod}
                  onChange={e => handleChange('lookbackPeriod', Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">Momentum Threshold</Label>
                <Input
                  id="threshold"
                  type="number"
                  min={0}
                  step={0.01}
                  value={formData.threshold}
                  onChange={e => handleChange('threshold', Number(e.target.value))}
                  required
                />
              </div>
            </CardContent>
          </Card>
        )}

        {botType === 'custom' && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Configure your custom bot parameters below
              </p>
            </CardContent>
          </Card>
        )}

        {botType === 'custom' && formData.settings?.type === 'basket' && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Basket Assets</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(formData.settings.targetAllocation).map(([symbol, weight]) => (
                    <Badge key={symbol} variant="secondary" className="flex items-center gap-2">
                      {symbol} ({(Number(weight) * 100).toFixed(0)}%)
                      <button
                        type="button"
                        onClick={() => {
                          const { [symbol]: removed, ...rest } = formData.settings.targetAllocation
                          handleChange('settings', { ...formData.settings, targetAllocation: rest })
                        }}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const symbol = prompt('Enter asset symbol (e.g. AAPL)')
                      const weight = prompt('Enter weight (0-100%)')
                      if (symbol && weight) {
                        handleChange('settings', {
                          ...formData.settings,
                          targetAllocation: {
                            ...formData.settings.targetAllocation,
                            [symbol]: Number(weight) / 100
                          }
                        })
                      }
                    }}
                    className="rounded-full p-1 hover:bg-accent"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rebalancePeriod">Rebalance Schedule</Label>
                <Select 
                  value={formData.settings.rebalancePeriod}
                  onValueChange={value => handleChange('settings', { ...formData.settings, rebalancePeriod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rebalancing schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0 0 * * 1">Weekly</SelectItem>
                    <SelectItem value="0 0 1 * *">Monthly</SelectItem>
                    <SelectItem value="0 0 1 */3 *">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {botType === 'custom' && formData.settings?.type === 'signal' && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Trading Signals</Label>
                {formData.settings.indicators.map((indicator: any, index: number) => (
                  <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label>Indicator Type</Label>
                      <Select 
                        value={indicator.type}
                        onValueChange={value => {
                          const newIndicators = [...formData.settings.indicators]
                          newIndicators[index] = { ...indicator, type: value }
                          handleChange('settings', { ...formData.settings, indicators: newIndicators })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select indicator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rsi">RSI</SelectItem>
                          <SelectItem value="macd">MACD</SelectItem>
                          <SelectItem value="bollinger">Bollinger Bands</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timeframe</Label>
                      <Select 
                        value={indicator.timeframe}
                        onValueChange={value => {
                          const newIndicators = [...formData.settings.indicators]
                          newIndicators[index] = { ...indicator, timeframe: value }
                          handleChange('settings', { ...formData.settings, indicators: newIndicators })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1min">1 Minute</SelectItem>
                          <SelectItem value="5min">5 Minutes</SelectItem>
                          <SelectItem value="15min">15 Minutes</SelectItem>
                          <SelectItem value="1hour">1 Hour</SelectItem>
                          <SelectItem value="4hour">4 Hours</SelectItem>
                          <SelectItem value="1day">1 Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Entry Threshold</Label>
                      <Input
                        type="number"
                        value={indicator.entryThreshold}
                        onChange={e => {
                          const newIndicators = [...formData.settings.indicators]
                          newIndicators[index] = { ...indicator, entryThreshold: Number(e.target.value) }
                          handleChange('settings', { ...formData.settings, indicators: newIndicators })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Exit Threshold</Label>
                      <Input
                        type="number"
                        value={indicator.exitThreshold}
                        onChange={e => {
                          const newIndicators = [...formData.settings.indicators]
                          newIndicators[index] = { ...indicator, exitThreshold: Number(e.target.value) }
                          handleChange('settings', { ...formData.settings, indicators: newIndicators })
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      className="col-span-2"
                      onClick={() => {
                        const newIndicators = formData.settings.indicators.filter((_: any, i: number) => i !== index)
                        handleChange('settings', { ...formData.settings, indicators: newIndicators })
                      }}
                    >
                      Remove Indicator
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newIndicators = [...formData.settings.indicators, {
                      type: 'rsi',
                      timeframe: '1hour',
                      entryThreshold: 30,
                      exitThreshold: 70
                    }]
                    handleChange('settings', { ...formData.settings, indicators: newIndicators })
                  }}
                >
                  Add Indicator
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </form>
  )
}
