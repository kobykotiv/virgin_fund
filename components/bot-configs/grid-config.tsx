"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import type { GridConfig } from "@/types/bot"

interface GridConfigProps {
  config: Partial<GridConfig>
  onChange: (config: Partial<GridConfig>) => void
}

export function GridConfigForm({ config, onChange }: GridConfigProps) {
  const handleChange = (field: keyof GridConfig, value: any) => {
    onChange({ ...config, [field]: value })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grid Trading Strategy</CardTitle>
          <CardDescription>
            Create a grid of buy and sell orders at regular price intervals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Upper Price</Label>
              <Input
                type="number"
                value={config.upperPrice}
                onChange={(e) => handleChange("upperPrice", parseFloat(e.target.value))}
                placeholder="e.g. 100"
              />
              <p className="text-sm text-muted-foreground">Highest price in grid</p>
            </div>

            <div className="space-y-2">
              <Label>Lower Price</Label>
              <Input
                type="number"
                value={config.lowerPrice}
                onChange={(e) => handleChange("lowerPrice", parseFloat(e.target.value))}
                placeholder="e.g. 90"
              />
              <p className="text-sm text-muted-foreground">Lowest price in grid</p>
            </div>

            <div className="space-y-2">
              <Label>Number of Grids</Label>
              <Input
                type="number"
                value={config.gridCount}
                onChange={(e) => handleChange("gridCount", parseInt(e.target.value))}
                placeholder="e.g. 10"
              />
              <p className="text-sm text-muted-foreground">Number of price levels</p>
            </div>

            <div className="space-y-2">
              <Label>Investment per Grid</Label>
              <Input
                type="number"
                value={config.investmentPerGrid}
                onChange={(e) => handleChange("investmentPerGrid", parseFloat(e.target.value))}
                placeholder="e.g. 100"
              />
              <p className="text-sm text-muted-foreground">Amount to invest at each level</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label>Geometric Progression</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Use geometric instead of arithmetic grid spacing</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-muted-foreground">
                Adjust grid spacing based on price volatility
              </p>
            </div>
            <Switch
              checked={config.useGeometricSpacing}
              onCheckedChange={(checked) => handleChange("useGeometricSpacing", checked)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label>Auto Grid Adjustment</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Automatically adjust grid range based on market conditions</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-muted-foreground">
                  Move grid up/down following market trends
                </p>
              </div>
              <Switch
                checked={config.useAutoAdjust}
                onCheckedChange={(checked) => handleChange("useAutoAdjust", checked)}
              />
            </div>

            {config.useAutoAdjust && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Adjustment Period</Label>
                  <Select 
                    value={config.adjustmentPeriod}
                    onValueChange={(value) => handleChange("adjustmentPeriod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="4h">4 Hours</SelectItem>
                      <SelectItem value="1d">1 Day</SelectItem>
                      <SelectItem value="1w">1 Week</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">How often to adjust grid</p>
                </div>

                <div className="space-y-2">
                  <Label>Moving Average Period</Label>
                  <Input
                    type="number"
                    value={config.maPeriod}
                    onChange={(e) => handleChange("maPeriod", parseInt(e.target.value))}
                    placeholder="e.g. 20"
                  />
                  <p className="text-sm text-muted-foreground">Period for trend calculation</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label>Stop Loss</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Automatically exit all positions if price moves below threshold</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-muted-foreground">
                Set a stop loss to limit potential losses
              </p>
            </div>
            <Switch
              checked={config.useStopLoss}
              onCheckedChange={(checked) => handleChange("useStopLoss", checked)}
            />
          </div>

          {config.useStopLoss && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Stop Loss Percentage</Label>
                <Input
                  type="number"
                  value={config.stopLossPercentage}
                  onChange={(e) => handleChange("stopLossPercentage", parseFloat(e.target.value))}
                  placeholder="e.g. 10"
                />
                <p className="text-sm text-muted-foreground">% below lowest grid to trigger stop loss</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}