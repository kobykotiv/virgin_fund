import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

interface RiskSettingsProps {
  onUpdate: (settings: RiskSettings) => void
  initial?: RiskSettings
}

export interface RiskSettings {
  maxPositionSize: number
  stopLossType: 'fixed' | 'atr' | 'indicator'
  stopLossValue: number
  takeProfitType: 'fixed' | 'riskRatio'
  takeProfitValue: number
  trailingStop: boolean
  trailingStopDistance: number
  maxDrawdown: number
  positionSizing: {
    type: 'fixed' | 'risk' | 'equity'
    value: number
    reduceOnly?: boolean
    indicator?: {
      type: string
      threshold: number
      action: 'reduce' | 'exit'
      percentage: number
    }
  }
}

export function RiskSettings({ onUpdate, initial }: RiskSettingsProps) {
  const [settings, setSettings] = useState<RiskSettings>(initial || {
    maxPositionSize: 10,
    stopLossType: 'fixed',
    stopLossValue: 2,
    takeProfitType: 'fixed',
    takeProfitValue: 4,
    trailingStop: false,
    trailingStopDistance: 2,
    maxDrawdown: 10,
    positionSizing: {
      type: 'fixed',
      value: 1000
    }
  })

  const handleChange = (field: keyof RiskSettings, value: any) => {
    const updated = { ...settings, [field]: value }
    setSettings(updated)
    onUpdate(updated)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Management Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Max Position Size (% of Portfolio)</Label>
          <Slider
            value={[settings.maxPositionSize]}
            onValueChange={([value]) => handleChange('maxPositionSize', value)}
            min={1}
            max={100}
            step={1}
          />
          <span className="text-sm text-muted-foreground">{settings.maxPositionSize}%</span>
        </div>

        <div>
          <Label>Stop Loss Type</Label>
          <Select
            value={settings.stopLossType}
            onValueChange={(value) => handleChange('stopLossType', value)}
          >
            <option value="fixed">Fixed Percentage</option>
            <option value="atr">ATR Multiple</option>
            <option value="indicator">Indicator Based</option>
          </Select>
        </div>

        <div>
          <Label>Position Sizing Rules</Label>
          <div className="space-y-2">
            <Select
              value={settings.positionSizing.type}
              onValueChange={(value) => handleChange('positionSizing', {
                ...settings.positionSizing,
                type: value
              })}
            >
              <option value="fixed">Fixed Size</option>
              <option value="risk">Risk Based</option>
              <option value="equity">Equity %</option>
            </Select>

            <Input
              type="number"
              value={settings.positionSizing.value}
              onChange={(e) => handleChange('positionSizing', {
                ...settings.positionSizing,
                value: parseFloat(e.target.value)
              })}
              placeholder="Size value"
            />

            {settings.positionSizing.type === 'risk' && (
              <div>
                <Label>Max Risk per Trade (%)</Label>
                <Input
                  type="number"
                  value={settings.positionSizing.value}
                  onChange={(e) => handleChange('positionSizing', {
                    ...settings.positionSizing,
                    value: parseFloat(e.target.value)
                  })}
                  min={0.1}
                  max={5}
                  step={0.1}
                />
              </div>
            )}
          </div>
        </div>

        {/* Add indicator-based position sizing */}
        <div>
          <Label>Indicator-Based Position Adjustments</Label>
          <Select
            value={settings.positionSizing.indicator?.type || ''}
            onValueChange={(value) => handleChange('positionSizing', {
              ...settings.positionSizing,
              indicator: {
                type: value,
                threshold: 0,
                action: 'reduce',
                percentage: 5
              }
            })}
          >
            <option value="">None</option>
            <option value="rsi">RSI</option>
            <option value="macd">MACD</option>
            <option value="bb">Bollinger Bands</option>
          </Select>

          {settings.positionSizing.indicator && (
            <div className="mt-2 space-y-2">
              <Input
                type="number"
                value={settings.positionSizing.indicator.threshold}
                onChange={(e) => handleChange('positionSizing', {
                  ...settings.positionSizing,
                  indicator: {
                    ...settings.positionSizing.indicator!,
                    threshold: parseFloat(e.target.value)
                  }
                })}
                placeholder="Threshold value"
              />

              <Select
                value={settings.positionSizing.indicator.action}
                onValueChange={(value: 'reduce' | 'exit') => handleChange('positionSizing', {
                  ...settings.positionSizing,
                  indicator: {
                    ...settings.positionSizing.indicator!,
                    action: value
                  }
                })}
              >
                <option value="reduce">Reduce Position</option>
                <option value="exit">Full Exit</option>
              </Select>

              {settings.positionSizing.indicator.action === 'reduce' && (
                <div>
                  <Label>Reduction Percentage</Label>
                  <Input
                    type="number"
                    value={settings.positionSizing.indicator.percentage}
                    onChange={(e) => handleChange('positionSizing', {
                      ...settings.positionSizing,
                      indicator: {
                        ...settings.positionSizing.indicator!,
                        percentage: parseFloat(e.target.value)
                      }
                    })}
                    min={1}
                    max={100}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
