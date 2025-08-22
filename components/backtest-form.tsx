"use client"

import type React from "react"

import { useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Info } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Bot } from "@/types/bot"
import type { BacktestParams } from "@/types/backtest"

interface BacktestFormProps {
  bots: Bot[]
  onSubmit: (params: BacktestParams) => void
  onOptimize?: (botId: string, paramToOptimize: string, rangeStart: number, rangeEnd: number, steps: number) => void
  isLoading: boolean
}

export function BacktestForm({ bots, onSubmit, onOptimize, isLoading }: BacktestFormProps) {
  const [selectedBotId, setSelectedBotId] = useState<string>("")
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
  )
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [initialCapital, setInitialCapital] = useState<number>(10000)
  const [slippage, setSlippage] = useState<number>(0.1)
  const [commission, setCommission] = useState<number>(0.1)
  const [dataSource, setDataSource] = useState<"mock" | "yahoo" | "alpaca">("mock")
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [optimizationParam, setOptimizationParam] = useState<string>("")
  const [optimizationStart, setOptimizationStart] = useState<number>(0)
  const [optimizationEnd, setOptimizationEnd] = useState<number>(0)
  const [optimizationSteps, setOptimizationSteps] = useState<number>(10)

  const selectedBot = bots.find((bot) => bot.id === selectedBotId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedBotId || !startDate || !endDate) return

    onSubmit({
      botId: selectedBotId,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      initialCapital,
      slippage,
      commission,
      dataSource,
    })
  }

  const handleOptimize = () => {
    if (!selectedBotId || !startDate || !endDate || !onOptimize || !optimizationParam) return

    onOptimize(selectedBotId, optimizationParam, optimizationStart, optimizationEnd, optimizationSteps)
  }

  // Generate optimization parameter options based on selected bot type
  const getOptimizationOptions = () => {
    if (!selectedBot) return []

    const options = [
      { value: "stopLoss", label: "Stop Loss (%)" },
      { value: "takeProfit", label: "Take Profit (%)" },
    ]

    switch (selectedBot.type) {
      case "indicator":
        if (selectedBot.indicatorConfig?.type === "rsi") {
          options.push(
            { value: "indicator.entryThreshold", label: "RSI Entry Threshold" },
            { value: "indicator.exitThreshold", label: "RSI Exit Threshold" },
          )
        } else if (selectedBot.indicatorConfig?.type === "macd") {
          options.push(
            { value: "indicator.fastPeriod", label: "MACD Fast Period" },
            { value: "indicator.slowPeriod", label: "MACD Slow Period" },
            { value: "indicator.signalPeriod", label: "MACD Signal Period" },
          )
        } else if (selectedBot.indicatorConfig?.type === "bollinger") {
          options.push(
            { value: "indicator.period", label: "Bollinger Period" },
            { value: "indicator.stdDev", label: "Bollinger Standard Deviation" },
          )
        }
        break
      case "grid":
        options.push(
          { value: "grid.gridSize", label: "Grid Size (%)" },
          { value: "grid.upperLimit", label: "Upper Limit" },
          { value: "grid.lowerLimit", label: "Lower Limit" },
          { value: "grid.quantity", label: "Quantity per Grid" },
        )
        break
      case "dca":
        options.push({ value: "dca.amount", label: "DCA Amount" })
        break
    }

    return options
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backtest Strategy</CardTitle>
        <CardDescription>Test your trading strategy against historical market data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bot">Select Bot Strategy</Label>
                <Select value={selectedBotId} onValueChange={setSelectedBotId}>
                  <SelectTrigger id="bot">
                    <SelectValue placeholder="Select a bot to test" />
                  </SelectTrigger>
                  <SelectContent>
                    {bots.map((bot) => (
                      <SelectItem key={bot.id} value={bot.id}>
                        {bot.name} ({bot.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className={`${buttonVariants({ variant: "outline" })} ${cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        disabled={(date) => date > new Date() || (endDate ? date > endDate : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className={`${buttonVariants({ variant: "outline" })} ${cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => date > new Date() || (startDate ? date < startDate : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="initialCapital">Initial Capital ($)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Starting capital for the backtest simulation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="initialCapital"
                  type="number"
                  min={100}
                  step={100}
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataSource">Data Source</Label>
                <Select value={dataSource} onValueChange={(value: "mock" | "yahoo" | "alpaca") => setDataSource(value)}>
                  <SelectTrigger id="dataSource">
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mock">Mock Data</SelectItem>
                    <SelectItem value="yahoo">Yahoo Finance</SelectItem>
                    <SelectItem value="alpaca">Alpaca Markets</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedBot && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <h4 className="font-medium mb-1">Strategy Details</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <p>Type: {selectedBot.type.charAt(0).toUpperCase() + selectedBot.type.slice(1)}</p>
                    <p>Assets: {selectedBot.assets.join(", ")}</p>
                    {selectedBot.type === "indicator" && selectedBot.indicatorConfig && (
                      <p>
                        Indicator: {selectedBot.indicatorConfig.type.toUpperCase()}
                        (Entry: {selectedBot.indicatorConfig.entryThreshold}, Exit:{" "}
                        {selectedBot.indicatorConfig.exitThreshold})
                      </p>
                    )}
                    {selectedBot.stopLoss && <p>Stop Loss: {selectedBot.stopLoss}%</p>}
                    {selectedBot.takeProfit && <p>Take Profit: {selectedBot.takeProfit}%</p>}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!selectedBotId || !startDate || !endDate || isLoading}
                >
                  {isLoading ? "Running Backtest..." : "Run Backtest"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="advanced">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="slippage">Slippage (%)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Simulated price slippage on trade execution</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm">{slippage.toFixed(2)}%</span>
                </div>
                <Slider
                  id="slippage"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[slippage]}
                  onValueChange={(values) => setSlippage(values[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="commission">Commission (%)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Trading commission percentage per trade</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm">{commission.toFixed(2)}%</span>
                </div>
                <Slider
                  id="commission"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[commission]}
                  onValueChange={(values) => setCommission(values[0])}
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={!selectedBotId || !startDate || !endDate || isLoading}
                >
                  {isLoading ? "Running Backtest..." : "Run Advanced Backtest"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="optimization">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="optimizationParam">Parameter to Optimize</Label>
                <Select value={optimizationParam} onValueChange={setOptimizationParam}>
                  <SelectTrigger id="optimizationParam">
                    <SelectValue placeholder="Select parameter" />
                  </SelectTrigger>
                  <SelectContent>
                    {getOptimizationOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="optimizationStart">Range Start</Label>
                  <Input
                    id="optimizationStart"
                    type="number"
                    value={optimizationStart}
                    onChange={(e) => setOptimizationStart(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="optimizationEnd">Range End</Label>
                  <Input
                    id="optimizationEnd"
                    type="number"
                    value={optimizationEnd}
                    onChange={(e) => setOptimizationEnd(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="optimizationSteps">Number of Steps</Label>
                <Input
                  id="optimizationSteps"
                  type="number"
                  min={5}
                  max={50}
                  value={optimizationSteps}
                  onChange={(e) => setOptimizationSteps(Number(e.target.value))}
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleOptimize}
                  className="w-full"
                  disabled={!selectedBotId || !startDate || !endDate || !optimizationParam || isLoading}
                >
                  {isLoading ? "Optimizing..." : "Optimize Parameter"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
