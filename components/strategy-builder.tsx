"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Info, Plus, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Bot, BotType, IndicatorConfig, GridConfig, DCAConfig, BasketConfig } from "@/types/bot"

interface StrategyBuilderProps {
  onSave: (bot: Partial<Bot>) => void
  existingBot?: Bot
  availableAssets: string[]
}

export function StrategyBuilder({ onSave, existingBot, availableAssets }: StrategyBuilderProps) {
  const [botName, setBotName] = useState<string>(existingBot?.name || "")
  const [botType, setBotType] = useState<BotType>(existingBot?.type || "indicator")
  const [selectedAssets, setSelectedAssets] = useState<string[]>(existingBot?.assets || ["AAPL"])
  const [stopLoss, setStopLoss] = useState<number | undefined>(existingBot?.stopLoss || 5)
  const [takeProfit, setTakeProfit] = useState<number | undefined>(existingBot?.takeProfit || 10)
  const [maxDrawdown, setMaxDrawdown] = useState<number | undefined>(existingBot?.maxDrawdown || 20)

  // Indicator strategy settings
  const [indicatorType, setIndicatorType] = useState<"rsi" | "macd" | "bollinger">(
    (existingBot?.indicatorConfig?.type ?? "rsi") as "rsi" | "macd" | "bollinger",
  )
  const [indicatorTimeframe, setIndicatorTimeframe] = useState<string>(
    existingBot?.indicatorConfig?.timeframe || "1hour",
  )
  const [entryThreshold, setEntryThreshold] = useState<number>(existingBot?.indicatorConfig?.entryThreshold || 30)
  const [exitThreshold, setExitThreshold] = useState<number>(existingBot?.indicatorConfig?.exitThreshold || 70)

  // Grid strategy settings
  const [gridSize, setGridSize] = useState<number>(existingBot?.gridConfig?.gridSize || 1)
  const [upperLimit, setUpperLimit] = useState<number>(existingBot?.gridConfig?.upperLimit || 200)
  const [lowerLimit, setLowerLimit] = useState<number>(existingBot?.gridConfig?.lowerLimit || 100)
  const [gridQuantity, setGridQuantity] = useState<number>(existingBot?.gridConfig?.quantity || 1)

  // DCA strategy settings
  const [dcaInterval, setDcaInterval] = useState<string>(existingBot?.dcaConfig?.interval || "0 0 * * 1")
  const [dcaAmount, setDcaAmount] = useState<number>(existingBot?.dcaConfig?.amount || 100)
  const [dcaDuration, setDcaDuration] = useState<string | undefined>(existingBot?.dcaConfig?.duration || "30days")

  // Basket strategy settings
  const [basketAllocations, setBasketAllocations] = useState<{ symbol: string; allocation: number }[]>(
    existingBot?.basketConfig?.targetAllocation
      ? Object.entries(existingBot.basketConfig.targetAllocation).map(([symbol, allocation]) => ({
          symbol,
          allocation: allocation * 100, // Convert from decimal to percentage
        }))
      : [
          { symbol: "AAPL", allocation: 50 },
          { symbol: "MSFT", allocation: 50 },
        ],
  )
  const [rebalancePeriod, setRebalancePeriod] = useState<string | undefined>(
    existingBot?.basketConfig?.rebalancePeriod || "0 0 1 * *",
  )

  const handleAddAsset = (asset: string) => {
    if (!selectedAssets.includes(asset)) {
      setSelectedAssets([...selectedAssets, asset])
    }
  }

  const handleRemoveAsset = (asset: string) => {
    setSelectedAssets(selectedAssets.filter((a) => a !== asset))
  }

  const handleAddBasketAllocation = () => {
    setBasketAllocations([...basketAllocations, { symbol: availableAssets[0], allocation: 0 }])
  }

  const handleRemoveBasketAllocation = (index: number) => {
    setBasketAllocations(basketAllocations.filter((_, i) => i !== index))
  }

  const handleUpdateBasketAllocation = (index: number, field: "symbol" | "allocation", value: string | number) => {
    const newAllocations = [...basketAllocations]
    newAllocations[index] = {
      ...newAllocations[index],
      [field]: field === "allocation" ? Number(value) : value,
    }
    setBasketAllocations(newAllocations)
  }

  const handleSaveStrategy = () => {
    // Validate strategy
    if (!botName) {
      alert("Please enter a strategy name")
      return
    }

    if (selectedAssets.length === 0) {
      alert("Please select at least one asset")
      return
    }

    // Create bot configuration
    const bot: Partial<Bot> = {
      name: botName,
      type: botType,
      assets: selectedAssets,
      stopLoss,
      takeProfit,
      maxDrawdown,
    }

    // Add strategy-specific configuration
    switch (botType) {
      case "indicator":
        bot.indicatorConfig = {
          type: indicatorType,
          timeframe: indicatorTimeframe,
          entryThreshold,
          exitThreshold,
        } as IndicatorConfig
        break
      case "grid":
        bot.gridConfig = {
          gridSize,
          upperLimit,
          lowerLimit,
          quantity: gridQuantity,
        } as GridConfig
        break
      case "dca":
        bot.dcaConfig = {
          interval: dcaInterval,
          amount: dcaAmount,
          duration: dcaDuration,
        } as DCAConfig
        break
      case "basket":
        // Convert allocations to the required format
        const targetAllocation: Record<string, number> = {}
        let totalAllocation = 0

        basketAllocations.forEach(({ symbol, allocation }) => {
          targetAllocation[symbol] = allocation / 100 // Convert from percentage to decimal
          totalAllocation += allocation
        })

        // Validate total allocation
        if (Math.abs(totalAllocation - 100) > 0.1) {
          alert("Total allocation must equal 100%")
          return
        }

        bot.basketConfig = {
          targetAllocation,
          rebalancePeriod,
        } as BasketConfig
        break
    }

    onSave(bot)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{existingBot ? "Edit Strategy" : "Create New Strategy"}</CardTitle>
        <CardDescription>Configure your trading strategy parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="botName">Strategy Name</Label>
            <Input
              id="botName"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              placeholder="My Trading Strategy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="botType">Strategy Type</Label>
            <Select value={botType} onValueChange={(value: BotType) => setBotType(value)}>
              <SelectTrigger id="botType">
                <SelectValue placeholder="Select strategy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indicator">Indicator-Based</SelectItem>
                <SelectItem value="grid">Grid Trading</SelectItem>
                <SelectItem value="dca">Dollar Cost Averaging</SelectItem>
                <SelectItem value="basket">Basket Trading</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Trading Assets</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedAssets.map((asset) => (
                <div
                  key={asset}
                  className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                >
                  <span>{asset}</span>
                  <Button
                    {...({ variant: "ghost", size: "icon", className: "h-4 w-4 rounded-full" } as any)}
                    onClick={() => handleRemoveAsset(asset)}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Remove {asset}</span>
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Select onValueChange={handleAddAsset}>
                <SelectTrigger>
                  <SelectValue placeholder="Add asset" />
                </SelectTrigger>
                <SelectContent>
                  {availableAssets
                    .filter((asset) => !selectedAssets.includes(asset))
                    .map((asset) => (
                      <SelectItem key={asset} value={asset}>
                        {asset}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="strategy" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="strategy">Strategy Parameters</TabsTrigger>
              <TabsTrigger value="risk">Risk Management</TabsTrigger>
            </TabsList>

            <TabsContent value="strategy">
              {botType === "indicator" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="indicatorType">Indicator Type</Label>
                    <Select
                      value={indicatorType}
                      onValueChange={(value: "rsi" | "macd" | "bollinger") => setIndicatorType(value)}
                    >
                      <SelectTrigger id="indicatorType">
                        <SelectValue placeholder="Select indicator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rsi">Relative Strength Index (RSI)</SelectItem>
                        <SelectItem value="macd">Moving Average Convergence Divergence (MACD)</SelectItem>
                        <SelectItem value="bollinger">Bollinger Bands</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <Select value={indicatorTimeframe} onValueChange={setIndicatorTimeframe}>
                      <SelectTrigger id="timeframe">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1min">1 Minute</SelectItem>
                        <SelectItem value="5min">5 Minutes</SelectItem>
                        <SelectItem value="15min">15 Minutes</SelectItem>
                        <SelectItem value="30min">30 Minutes</SelectItem>
                        <SelectItem value="1hour">1 Hour</SelectItem>
                        <SelectItem value="4hour">4 Hours</SelectItem>
                        <SelectItem value="1day">1 Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {indicatorType === "rsi" && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="entryThreshold">Entry Threshold (Oversold)</Label>
                          <span className="text-sm">{entryThreshold}</span>
                        </div>
                        <Slider
                          id="entryThreshold"
                          min={0}
                          max={100}
                          step={1}
                          value={[entryThreshold]}
                          onValueChange={(values) => setEntryThreshold(values[0])}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="exitThreshold">Exit Threshold (Overbought)</Label>
                          <span className="text-sm">{exitThreshold}</span>
                        </div>
                        <Slider
                          id="exitThreshold"
                          min={0}
                          max={100}
                          step={1}
                          value={[exitThreshold]}
                          onValueChange={(values) => setExitThreshold(values[0])}
                        />
                      </div>
                    </>
                  )}

                  {indicatorType === "macd" && (
                    <div className="rounded-md bg-muted p-3 text-sm">
                      <p>
                        MACD will use standard settings (12, 26, 9) and generate signals when the MACD line crosses the
                        signal line.
                      </p>
                    </div>
                  )}

                  {indicatorType === "bollinger" && (
                    <div className="rounded-md bg-muted p-3 text-sm">
                      <p>
                        Bollinger Bands will use standard settings (20-period SMA with 2 standard deviations) and
                        generate signals when price touches the bands.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {botType === "grid" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="gridSize">Grid Size (%)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Percentage difference between grid levels</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="text-sm">{gridSize}%</span>
                    </div>
                    <Slider
                      id="gridSize"
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={[gridSize]}
                      onValueChange={(values) => setGridSize(values[0])}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lowerLimit">Lower Price Limit</Label>
                      <Input
                        id="lowerLimit"
                        type="number"
                        min={0}
                        value={lowerLimit}
                        onChange={(e) => setLowerLimit(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="upperLimit">Upper Price Limit</Label>
                      <Input
                        id="upperLimit"
                        type="number"
                        min={0}
                        value={upperLimit}
                        onChange={(e) => setUpperLimit(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gridQuantity">Quantity per Grid</Label>
                    <Input
                      id="gridQuantity"
                      type="number"
                      min={1}
                      value={gridQuantity}
                      onChange={(e) => setGridQuantity(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}

              {botType === "dca" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dcaInterval">Purchase Interval</Label>
                    <Select value={dcaInterval} onValueChange={setDcaInterval}>
                      <SelectTrigger id="dcaInterval">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0 0 * * *">Daily</SelectItem>
                        <SelectItem value="0 0 * * 1">Weekly (Monday)</SelectItem>
                        <SelectItem value="0 0 1 * *">Monthly (1st day)</SelectItem>
                        <SelectItem value="0 0 15 * *">Monthly (15th day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dcaAmount">Purchase Amount ($)</Label>
                    <Input
                      id="dcaAmount"
                      type="number"
                      min={1}
                      value={dcaAmount}
                      onChange={(e) => setDcaAmount(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dcaDuration">Duration (optional)</Label>
                    <Select value={dcaDuration || ""} onValueChange={setDcaDuration}>
                      <SelectTrigger id="dcaDuration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                        <SelectItem value="30days">30 Days</SelectItem>
                        <SelectItem value="90days">90 Days</SelectItem>
                        <SelectItem value="180days">180 Days</SelectItem>
                        <SelectItem value="365days">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {botType === "basket" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Asset Allocations</Label>
                      <Button {...({ variant: "outline", size: "sm" } as any)} onClick={handleAddBasketAllocation}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Asset
                      </Button>
                    </div>

                    {basketAllocations.map((allocation, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select
                          value={allocation.symbol}
                          onValueChange={(value) => handleUpdateBasketAllocation(index, "symbol", value)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select asset" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableAssets.map((asset) => (
                              <SelectItem key={asset} value={asset}>
                                {asset}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={allocation.allocation}
                            onChange={(e) => handleUpdateBasketAllocation(index, "allocation", Number(e.target.value))}
                          />
                          <span className="text-sm">%</span>
                        </div>

                        <Button
                          {...({ variant: "ghost", size: "icon" } as any)}
                          onClick={() => handleRemoveBasketAllocation(index)}
                          disabled={basketAllocations.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove allocation</span>
                        </Button>
                      </div>
                    ))}

                    <div className="flex justify-between items-center text-sm mt-2">
                      <span>Total Allocation:</span>
                      <span
                        className={
                          Math.abs(basketAllocations.reduce((sum, { allocation }) => sum + allocation, 0) - 100) <= 0.1
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {basketAllocations.reduce((sum, { allocation }) => sum + allocation, 0)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rebalancePeriod">Rebalance Period</Label>
                    <Select value={rebalancePeriod || ""} onValueChange={setRebalancePeriod}>
                      <SelectTrigger id="rebalancePeriod">
                        <SelectValue placeholder="Select rebalance period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-rebalancing">No Rebalancing</SelectItem>
                        <SelectItem value="0 0 * * 1">Weekly (Monday)</SelectItem>
                        <SelectItem value="0 0 1 * *">Monthly (1st day)</SelectItem>
                        <SelectItem value="0 0 1 1,4,7,10 *">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="risk">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Maximum loss before closing position</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={stopLoss !== undefined}
                        onCheckedChange={(checked) => setStopLoss(checked ? 5 : undefined)}
                      />
                      {stopLoss !== undefined && <span className="text-sm">{stopLoss}%</span>}
                    </div>
                  </div>
                  {stopLoss !== undefined && (
                    <Slider
                      id="stopLoss"
                      min={1}
                      max={20}
                      step={0.5}
                      value={[stopLoss]}
                      onValueChange={(values) => setStopLoss(values[0])}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="takeProfit">Take Profit (%)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Target profit before closing position</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={takeProfit !== undefined}
                        onCheckedChange={(checked) => setTakeProfit(checked ? 10 : undefined)}
                      />
                      {takeProfit !== undefined && <span className="text-sm">{takeProfit}%</span>}
                    </div>
                  </div>
                  {takeProfit !== undefined && (
                    <Slider
                      id="takeProfit"
                      min={1}
                      max={50}
                      step={0.5}
                      value={[takeProfit]}
                      onValueChange={(values) => setTakeProfit(values[0])}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="maxDrawdown">Max Drawdown (%)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Maximum portfolio drawdown before pausing the bot</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={maxDrawdown !== undefined}
                        onCheckedChange={(checked) => setMaxDrawdown(checked ? 20 : undefined)}
                      />
                      {maxDrawdown !== undefined && <span className="text-sm">{maxDrawdown}%</span>}
                    </div>
                  </div>
                  {maxDrawdown !== undefined && (
                    <Slider
                      id="maxDrawdown"
                      min={5}
                      max={50}
                      step={1}
                      value={[maxDrawdown]}
                      onValueChange={(values) => setMaxDrawdown(values[0])}
                    />
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-4">
            <Button onClick={handleSaveStrategy} className="w-full">
              {existingBot ? "Update Strategy" : "Create Strategy"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
