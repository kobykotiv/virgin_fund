"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Settings2 } from "lucide-react"

export interface SignalConfig {
  id: string
  name: string
  type: string
  timeframe: string
  parameters: Record<string, any>
  conditions: SignalCondition[]
  enabled: boolean
}

interface SignalCondition {
  id: string
  indicator: string
  comparison: string
  value: number | string
  timeframe?: string
}

const AVAILABLE_INDICATORS = [
  { value: "rsi", label: "RSI" },
  { value: "macd", label: "MACD" },
  { value: "sma", label: "Simple Moving Average" },
  { value: "ema", label: "Exponential Moving Average" },
  { value: "bbands", label: "Bollinger Bands" },
  { value: "price", label: "Price Action" },
  { value: "volume", label: "Volume" },
]

const TIMEFRAMES = [
  { value: "1m", label: "1 minute" },
  { value: "5m", label: "5 minutes" },
  { value: "15m", label: "15 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "4h", label: "4 hours" },
  { value: "1d", label: "1 day" },
]

interface SignalConfigProps {
  signal?: SignalConfig
  onSave: (signal: SignalConfig) => void
  onDelete?: () => void
}

export function SignalConfig({ signal, onSave, onDelete }: SignalConfigProps) {
  const [config, setConfig] = useState<SignalConfig>(signal || {
    id: Math.random().toString(36).substring(7),
    name: "",
    type: "custom",
    timeframe: "1h",
    parameters: {},
    conditions: [],
    enabled: true,
  })

  const addCondition = () => {
    setConfig({
      ...config,
      conditions: [
        ...config.conditions,
        {
          id: Math.random().toString(36).substring(7),
          indicator: "price",
          comparison: "above",
          value: 0,
        },
      ],
    })
  }

  const removeCondition = (id: string) => {
    setConfig({
      ...config,
      conditions: config.conditions.filter((c) => c.id !== id),
    })
  }

  const updateCondition = (id: string, updates: Partial<SignalCondition>) => {
    setConfig({
      ...config,
      conditions: config.conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Signal Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="signal-name">Signal Name</Label>
              <Input
                id="signal-name"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                placeholder="Enter signal name..."
              />
            </div>
            <div>
              <Label>Enabled</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                />
                <span className="text-sm text-muted-foreground">
                  {config.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label>Default Timeframe</Label>
            <Select
              value={config.timeframe}
              onValueChange={(value) => setConfig({ ...config, timeframe: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                {TIMEFRAMES.map((tf) => (
                  <SelectItem key={tf.value} value={tf.value}>
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Conditions</Label>
              <Button variant="outline" size="sm" onClick={addCondition}>
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            </div>

            <div className="space-y-4">
              {config.conditions.map((condition) => (
                <Card key={condition.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Indicator</Label>
                          <Select
                            value={condition.indicator}
                            onValueChange={(value) =>
                              updateCondition(condition.id, { indicator: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select indicator" />
                            </SelectTrigger>
                            <SelectContent>
                              {AVAILABLE_INDICATORS.map((indicator) => (
                                <SelectItem key={indicator.value} value={indicator.value}>
                                  {indicator.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Comparison</Label>
                          <Select
                            value={condition.comparison}
                            onValueChange={(value) =>
                              updateCondition(condition.id, { comparison: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select comparison" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="above">Above</SelectItem>
                              <SelectItem value="below">Below</SelectItem>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="crosses_above">Crosses Above</SelectItem>
                              <SelectItem value="crosses_below">Crosses Below</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Value</Label>
                          <Input
                            type="number"
                            value={condition.value}
                            onChange={(e) =>
                              updateCondition(condition.id, {
                                value: parseFloat(e.target.value) || 0,
                              })
                            }
                            placeholder="Enter value..."
                          />
                        </div>
                        <div>
                          <Label>Timeframe</Label>
                          <Select
                            value={condition.timeframe || config.timeframe}
                            onValueChange={(value) =>
                              updateCondition(condition.id, { timeframe: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Default</SelectItem>
                              {TIMEFRAMES.map((tf) => (
                                <SelectItem key={tf.value} value={tf.value}>
                                  {tf.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCondition(condition.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {config.conditions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Settings2 className="h-8 w-8 mx-auto mb-2" />
                  <p>No conditions defined</p>
                  <p className="text-sm">Add conditions to define when this signal should trigger</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {onDelete && (
              <Button variant="destructive" onClick={onDelete}>
                Delete Signal
              </Button>
            )}
            <Button onClick={() => onSave(config)}>Save Signal</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )