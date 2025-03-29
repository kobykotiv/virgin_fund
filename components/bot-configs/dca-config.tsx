"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import type { DCAConfig } from "@/types/bot"

interface DCAConfigProps {
  config: Partial<DCAConfig>
  onChange: (config: Partial<DCAConfig>) => void
}

export function DCAConfigForm({ config, onChange }: DCAConfigProps) {
  const handleChange = (field: keyof DCAConfig, value: any) => {
    onChange({ ...config, [field]: value })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dollar Cost Averaging Strategy</CardTitle>
          <CardDescription>
            Automatically invest fixed amounts at regular intervals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Investment Amount</Label>
              <Input
                type="number"
                value={config.investmentAmount}
                onChange={(e) => handleChange("investmentAmount", parseFloat(e.target.value))}
                placeholder="e.g. 100"
              />
              <p className="text-sm text-muted-foreground">Amount to invest each period</p>
            </div>

            <div className="space-y-2">
              <Label>Investment Interval</Label>
              <Select
                value={config.interval}
                onValueChange={(value) => handleChange("interval", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Every Hour</SelectItem>
                  <SelectItem value="4h">Every 4 Hours</SelectItem>
                  <SelectItem value="1d">Daily</SelectItem>
                  <SelectItem value="1w">Weekly</SelectItem>
                  <SelectItem value="1m">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">How often to make investments</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label>Smart Timing</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Optimize entry points within the interval using technical analysis</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-muted-foreground">
                  Wait for optimal entry points within each period
                </p>
              </div>
              <Switch
                checked={config.useSmartTiming}
                onCheckedChange={(checked) => handleChange("useSmartTiming", checked)}
              />
            </div>

            {config.useSmartTiming && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>RSI Period</Label>
                    <Input
                      type="number"
                      value={config.rsiPeriod}
                      onChange={(e) => handleChange("rsiPeriod", parseInt(e.target.value))}
                      placeholder="e.g. 14"
                    />
                    <p className="text-sm text-muted-foreground">Period for RSI calculation</p>
                  </div>

                  <div className="space-y-2">
                    <Label>RSI Threshold</Label>
                    <Input
                      type="number"
                      value={config.rsiThreshold}
                      onChange={(e) => handleChange("rsiThreshold", parseInt(e.target.value))}
                      placeholder="e.g. 30"
                    />
                    <p className="text-sm text-muted-foreground">RSI level to trigger buys</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>MACD Fast Period</Label>
                    <Input
                      type="number"
                      value={config.macdFastPeriod}
                      onChange={(e) => handleChange("macdFastPeriod", parseInt(e.target.value))}
                      placeholder="e.g. 12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>MACD Slow Period</Label>
                    <Input
                      type="number"
                      value={config.macdSlowPeriod}
                      onChange={(e) => handleChange("macdSlowPeriod", parseInt(e.target.value))}
                      placeholder="e.g. 26"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label>Dynamic Allocation</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adjust investment amount based on market conditions</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-muted-foreground">
                  Increase investment during dips, decrease during peaks
                </p>
              </div>
              <Switch
                checked={config.useDynamicAllocation}
                onCheckedChange={(checked) => handleChange("useDynamicAllocation", checked)}
              />
            </div>

            {config.useDynamicAllocation && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Max Allocation Multiplier</Label>
                  <Input
                    type="number"
                    value={config.maxAllocationMultiplier}
                    onChange={(e) => handleChange("maxAllocationMultiplier", parseFloat(e.target.value))}
                    placeholder="e.g. 2"
                  />
                  <p className="text-sm text-muted-foreground">Maximum investment multiplier during dips</p>
                </div>

                <div className="space-y-2">
                  <Label>Min Allocation Multiplier</Label>
                  <Input
                    type="number"
                    value={config.minAllocationMultiplier}
                    onChange={(e) => handleChange("minAllocationMultiplier", parseFloat(e.target.value))}
                    placeholder="e.g. 0.5"
                  />
                  <p className="text-sm text-muted-foreground">Minimum investment multiplier during peaks</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label>Take Profit</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Automatically sell when target profit is reached</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-muted-foreground">
                Set a take profit level for each position
              </p>
            </div>
            <Switch
              checked={config.useTakeProfit}
              onCheckedChange={(checked) => handleChange("useTakeProfit", checked)}
            />
          </div>

          {config.useTakeProfit && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Take Profit Percentage</Label>
                <Input
                  type="number"
                  value={config.takeProfitPercentage}
                  onChange={(e) => handleChange("takeProfitPercentage", parseFloat(e.target.value))}
                  placeholder="e.g. 20"
                />
                <p className="text-sm text-muted-foreground">% gain to trigger profit taking</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}