import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Plus, Trash } from 'lucide-react'
import type { IndicatorConfig } from '@/types/bot'

interface SignalIndicatorsProps {
  indicators: IndicatorConfig[]
  onUpdateIndicators: (indicators: IndicatorConfig[]) => void
}

export function SignalIndicators({ indicators, onUpdateIndicators }: SignalIndicatorsProps) {
  const handleAddIndicator = () => {
    onUpdateIndicators([
      ...indicators,
      {
        type: 'rsi',
        timeframe: '1hour',
        entryThreshold: 30,
        exitThreshold: 70
      }
    ])
  }

  const handleRemoveIndicator = (index: number) => {
    onUpdateIndicators(indicators.filter((_, i) => i !== index))
  }

  const handleUpdateIndicator = (index: number, updates: Partial<IndicatorConfig>) => {
    onUpdateIndicators(
      indicators.map((indicator, i) => 
        i === index ? { ...indicator, ...updates } : indicator
      )
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Trading Signals</CardTitle>
        <Button variant="outline" size="sm" onClick={handleAddIndicator}>
          <Plus className="h-4 w-4 mr-2" />
          Add Indicator
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {indicators.map((indicator, index) => (
            <div 
              key={index}
              className="p-4 border rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <Label>Indicator {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveIndicator(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={indicator.type}
                    onValueChange={(value: 'rsi' | 'macd' | 'bollinger') => 
                      handleUpdateIndicator(index, { type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                    onValueChange={(value) => 
                      handleUpdateIndicator(index, { timeframe: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1min">1 Minute</SelectItem>
                      <SelectItem value="5min">5 Minutes</SelectItem>
                      <SelectItem value="15min">15 Minutes</SelectItem>
                      <SelectItem value="30min">30 Minutes</SelectItem>
                      <SelectItem value="1hour">1 Hour</SelectItem>
                      <SelectItem value="2hour">2 Hours</SelectItem>
                      <SelectItem value="4hour">4 Hours</SelectItem>
                      <SelectItem value="1day">1 Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {indicator.type === 'rsi' && (
                  <>
                    <div className="space-y-2">
                      <Label>Oversold (Entry) Level</Label>
                      <Input
                        type="number"
                        value={indicator.entryThreshold}
                        onChange={(e) => 
                          handleUpdateIndicator(index, { 
                            entryThreshold: Number(e.target.value) 
                          })
                        }
                        min={0}
                        max={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Overbought (Exit) Level</Label>
                      <Input
                        type="number"
                        value={indicator.exitThreshold}
                        onChange={(e) => 
                          handleUpdateIndicator(index, { 
                            exitThreshold: Number(e.target.value) 
                          })
                        }
                        min={0}
                        max={100}
                      />
                    </div>
                  </>
                )}

                {indicator.type === 'macd' && (
                  <>
                    <div className="space-y-2">
                      <Label>Fast Period</Label>
                      <Input
                        type="number"
                        value={indicator.entryThreshold}
                        onChange={(e) => 
                          handleUpdateIndicator(index, { 
                            entryThreshold: Number(e.target.value) 
                          })
                        }
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slow Period</Label>
                      <Input
                        type="number"
                        value={indicator.exitThreshold}
                        onChange={(e) => 
                          handleUpdateIndicator(index, { 
                            exitThreshold: Number(e.target.value) 
                          })
                        }
                        min={1}
                      />
                    </div>
                  </>
                )}

                {indicator.type === 'bollinger' && (
                  <>
                    <div className="space-y-2">
                      <Label>Standard Deviations</Label>
                      <Input
                        type="number"
                        value={indicator.entryThreshold}
                        onChange={(e) => 
                          handleUpdateIndicator(index, { 
                            entryThreshold: Number(e.target.value) 
                          })
                        }
                        min={0.1}
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Period</Label>
                      <Input
                        type="number"
                        value={indicator.exitThreshold}
                        onChange={(e) => 
                          handleUpdateIndicator(index, { 
                            exitThreshold: Number(e.target.value) 
                          })
                        }
                        min={1}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {indicators.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No indicators configured. Click &quot;Add Indicator&quot; to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )