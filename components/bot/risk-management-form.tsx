import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import type { RiskManagementSettings } from "@/types/bot"

interface RiskManagementFormProps {
  value: RiskManagementSettings
  onChange: (settings: RiskManagementSettings) => void
}

export function RiskManagementForm({ value, onChange }: RiskManagementFormProps) {
  const addTakeProfitTarget = () => {
    onChange({
      ...value,
      takeProfit: {
        ...value.takeProfit,
        targets: [
          ...value.takeProfit.targets,
          { price: 0, quantity: 0 }
        ]
      }
    })
  }

  const removeTakeProfitTarget = (index: number) => {
    onChange({
      ...value,
      takeProfit: {
        ...value.takeProfit,
        targets: value.takeProfit.targets.filter((_, i) => i !== index)
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stop Loss Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Stop Loss Type</Label>
            <Select 
              value={value.stopLoss.type}
              onValueChange={(type) => 
                onChange({
                  ...value,
                  stopLoss: { ...value.stopLoss, type: type as "fixed" | "trailing" | "atr" }
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="trailing">Trailing</SelectItem>
                <SelectItem value="atr">ATR-Based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Stop Loss Value (%)</Label>
            <Input 
              type="number"
              value={value.stopLoss.value}
              onChange={(e) => 
                onChange({
                  ...value,
                  stopLoss: { ...value.stopLoss, value: parseFloat(e.target.value) }
                })
              }
            />
          </div>

          {value.stopLoss.type === "trailing" && (
            <div className="space-y-2">
              <Label>Trailing Offset (%)</Label>
              <Input 
                type="number"
                value={value.stopLoss.trailingOffset}
                onChange={(e) => 
                  onChange({
                    ...value,
                    stopLoss: { ...value.stopLoss, trailingOffset: parseFloat(e.target.value) }
                  })
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Take Profit Targets
            <Button variant="outline" size="sm" onClick={addTakeProfitTarget}>
              <Plus className="h-4 w-4 mr-2" />
              Add Target
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {value.takeProfit.targets.map((target, index) => (
            <div key={index} className="flex items-end gap-4">
              <div className="space-y-2 flex-1">
                <Label>Price Target {index + 1}</Label>
                <Input 
                  type="number"
                  value={target.price}
                  onChange={(e) => {
                    const newTargets = [...value.takeProfit.targets]
                    newTargets[index].price = parseFloat(e.target.value)
                    onChange({
                      ...value,
                      takeProfit: { ...value.takeProfit, targets: newTargets }
                    })
                  }}
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label>Quantity (%)</Label>
                <Input 
                  type="number"
                  value={target.quantity}
                  onChange={(e) => {
                    const newTargets = [...value.takeProfit.targets]
                    newTargets[index].quantity = parseFloat(e.target.value)
                    onChange({
                      ...value,
                      takeProfit: { ...value.takeProfit, targets: newTargets }
                    })
                  }}
                />
              </div>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => removeTakeProfitTarget(index)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Position Sizing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Max Position Size (%)</Label>
              <Input 
                type="number"
                value={value.positionSizing.maxPositionSize}
                onChange={(e) => 
                  onChange({
                    ...value,
                    positionSizing: { 
                      ...value.positionSizing, 
                      maxPositionSize: parseFloat(e.target.value) 
                    }
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Risk Per Trade (%)</Label>
              <Input 
                type="number"
                value={value.riskPerTrade}
                onChange={(e) => 
                  onChange({
                    ...value,
                    riskPerTrade: parseFloat(e.target.value)
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
