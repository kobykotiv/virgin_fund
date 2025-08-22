"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Bot, BotType } from "@/types/bot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// Add subscription tier check to the BotForm component
// Import the useSubscription hook at the top of the file
import { useSubscription } from "@/providers/subscription-provider"
import { apiPost } from '@/lib/apiClient';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface BotFormProps {
  initialBot: Bot | null
  onSubmit: (bot: any) => void
  onCancel: () => void
  presentationMode?: boolean
}

export function BotForm({ initialBot, onSubmit, onCancel, presentationMode = false }: BotFormProps) {
  const [formData, setFormData] = useState<Partial<Bot>>({
    id: initialBot?.id || "",
    name: initialBot?.name || "",
    type: initialBot?.type || "indicator",
    status: initialBot?.status || "paused",
    assets: initialBot?.assets || ["AAPL"],
    createdAt: initialBot?.createdAt || new Date().toISOString(),
    updatedAt: initialBot?.updatedAt || new Date().toISOString(),
    stopLoss: initialBot?.stopLoss || 5,
    takeProfit: initialBot?.takeProfit || 10,
    maxDrawdown: initialBot?.maxDrawdown || 15,
    indicatorConfig: initialBot?.indicatorConfig || {
      type: "rsi",
      timeframe: "1day",
      entryThreshold: 30,
      exitThreshold: 70,
    },
    gridConfig: initialBot?.gridConfig || {
      gridSize: 1, // Default to 1% grid
      upperLimit: 100,
      lowerLimit: 80,
      quantity: 1,
    },
    dcaConfig: initialBot?.dcaConfig || {
      interval: "0 0 * * 1", // Every Monday
      amount: 100,
    },
    basketConfig: initialBot?.basketConfig || {
      rebalancePeriod: "0 0 1 * *", // Monthly
      targetAllocation: { AAPL: 1 },
    },
  })

  const [newAsset, setNewAsset] = useState("")
  const [newAllocationSymbol, setNewAllocationSymbol] = useState("")
  const [newAllocationValue, setNewAllocationValue] = useState(0)
  const [activeTab, setActiveTab] = useState<string>(formData.type || "indicator")

  // Add this inside the BotForm function, after the existing useState declarations
  const { canCreateBot, tierLimits } = useSubscription()

  // Add this after the activeTab state declaration
  const [tierError, setTierError] = useState<string | null>(null)

  // New state for tracking the current step in presentation mode
  const [currentStep, setCurrentStep] = useState(0)

  // Define the steps for the presentation mode
  const steps = [
    { title: "Basic Information", description: "Name your bot and select its type" },
    { title: "Trading Assets", description: "Select the assets your bot will trade" },
    { title: "Risk Management", description: "Configure risk parameters" },
    { title: "Strategy Configuration", description: "Set up your trading strategy" },
    { title: "Review & Create", description: "Review your bot configuration" },
  ]

  // Update active tab when bot type changes
  useEffect(() => {
    setActiveTab(formData.type || "indicator")
  }, [formData.type])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData({
      ...formData,
      [field]: Number.parseFloat(e.target.value),
    })
  }

  // Modify the handleTypeChange function to check if the bot type is allowed
  const handleTypeChange = (type: BotType) => {
    if (!canCreateBot(type)) {
      setTierError(
        `Your current subscription plan doesn't support ${type} trading. Please upgrade to access this feature.`,
      )
      return
    }

    setTierError(null)
    setFormData({
      ...formData,
      type,
    })
    setActiveTab(type)
  }

  const handleIndicatorConfigChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      indicatorConfig: {
        ...formData.indicatorConfig!,
        [field]: value,
      },
    })
  }

  const handleGridConfigChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      gridConfig: {
        ...formData.gridConfig!,
        [field]: typeof value === "string" ? Number.parseFloat(value) : value,
      },
    })
  }

  const handleDcaConfigChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      dcaConfig: {
        ...formData.dcaConfig!,
        [field]: field === "amount" ? Number.parseFloat(value) : value,
      },
    })
  }

  const handleAddAsset = () => {
    if (newAsset && !formData.assets?.includes(newAsset)) {
      setFormData({
        ...formData,
        assets: [...(formData.assets || []), newAsset],
      })
      setNewAsset("")
    }
  }

  const handleRemoveAsset = (asset: string) => {
    setFormData({
      ...formData,
      assets: formData.assets?.filter((a) => a !== asset) || [],
    })
  }

  const handleAddAllocation = () => {
    if (newAllocationSymbol && newAllocationValue > 0) {
      setFormData({
        ...formData,
        basketConfig: {
          ...formData.basketConfig!,
          targetAllocation: {
            ...formData.basketConfig!.targetAllocation,
            [newAllocationSymbol]: newAllocationValue / 100,
          },
        },
      })
      setNewAllocationSymbol("")
      setNewAllocationValue(0)
    }
  }

  const handleRemoveAllocation = (symbol: string) => {
    const newAllocation = { ...formData.basketConfig!.targetAllocation }
    delete newAllocation[symbol]

    setFormData({
      ...formData,
      basketConfig: {
        ...formData.basketConfig!,
        targetAllocation: newAllocation,
      },
    })
  }

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If a parent provided an onSubmit handler (e.g., modal usage), delegate to it so
      // callers can control mutations, toasts, and navigation. Otherwise fall back to the
      // built-in API POST behavior for standalone pages.
      if (onSubmit) {
        // Ensure we await the caller's handler in case it returns a promise
        await onSubmit(formData)
      } else {
        const res = await apiPost('/api/bots', formData);
        toast({ title: 'Bot created', description: `Bot ${res.bot?.name || 'created'}` });
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast({ title: 'Error creating bot', description: err?.message || 'Failed', variant: 'destructive' });
    }
  }

  // Presentation mode navigation helpers
  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0))

  // If not in presentation mode, render the original form
  if (!presentationMode) {
    // Add this right before the return statement in the non-presentation mode form
    // (inside the if (!presentationMode) block)
    if (tierError) {
      return (
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Subscription Limit Reached</h2>
            <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0 rounded-full">
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
            <p className="mb-4">{tierError}</p>
            <Button
              onClick={() => (window.location.href = "/pricing")}
              variant="outline"
              className="bg-amber-100 hover:bg-amber-200 border-amber-300"
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      )
    }
    return (
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{initialBot ? "Edit Bot" : "Create New Bot"}</h2>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0 rounded-full">
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bot Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="My Trading Bot"
              required
            />
          </div>

          {/* Modify the Select component for bot type to show which types are restricted
          // Find the Select for bot type and replace it with this: */}
          <div className="space-y-2">
            <Label htmlFor="type">Bot Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleTypeChange(value as BotType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select bot type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basket">
                  Basket Trading{" "}
                  {!canCreateBot("basket") && <span className="ml-2 text-xs text-amber-600">(Upgrade Required)</span>}
                </SelectItem>
                <SelectItem value="grid">Grid Trading (1%)</SelectItem>
                <SelectItem value="dca">Dollar Cost Averaging</SelectItem>
                <SelectItem value="indicator">
                  Indicator-Based Trading{" "}
                  {!canCreateBot("indicator") && (
                    <span className="ml-2 text-xs text-amber-600">(Upgrade Required)</span>
                  )}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Trading Assets</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.assets?.map((asset) => (
                <Badge key={asset} variant="secondary" className="flex items-center gap-1">
                  {asset}
                  <button
                    type="button"
                    onClick={() => handleRemoveAsset(asset)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {asset}</span>
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add asset (e.g. AAPL)"
                value={newAsset}
                onChange={(e) => setNewAsset(e.target.value)}
              />
              <Button type="button" size="sm" onClick={handleAddAsset}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Risk Management</CardTitle>
              <CardDescription>Set your risk parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Percentage below entry price to exit position</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="stopLoss"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={formData.stopLoss || ""}
                  onChange={(e) => handleNumberChange(e, "stopLoss")}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="takeProfit">Take Profit (%)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Percentage above entry price to exit position</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="takeProfit"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={formData.takeProfit || ""}
                  onChange={(e) => handleNumberChange(e, "takeProfit")}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="maxDrawdown">Max Drawdown (%)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Maximum allowed drawdown before stopping the bot</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="maxDrawdown"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={formData.maxDrawdown || ""}
                  onChange={(e) => handleNumberChange(e, "maxDrawdown")}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="indicator">Indicator</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="dca">DCA</TabsTrigger>
              <TabsTrigger value="basket">Basket</TabsTrigger>
            </TabsList>

            <TabsContent value="indicator" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="indicatorType">Indicator Type</Label>
                <Select
                  value={formData.indicatorConfig?.type}
                  onValueChange={(value) => handleIndicatorConfigChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select indicator type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rsi">RSI</SelectItem>
                    <SelectItem value="macd">MACD</SelectItem>
                    <SelectItem value="bollinger">Bollinger Bands</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select
                  value={formData.indicatorConfig?.timeframe}
                  onValueChange={(value) => handleIndicatorConfigChange("timeframe", value)}
                >
                  <SelectTrigger>
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
                    <SelectItem value="1week">1 Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryThreshold">Entry Threshold</Label>
                <Input
                  id="entryThreshold"
                  type="number"
                  value={formData.indicatorConfig?.entryThreshold || ""}
                  onChange={(e) => handleIndicatorConfigChange("entryThreshold", Number.parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.indicatorConfig?.type === "rsi" && "RSI value below which to enter a position (e.g., 30)"}
                  {formData.indicatorConfig?.type === "macd" && "MACD signal line crossover threshold"}
                  {formData.indicatorConfig?.type === "bollinger" && "Number of standard deviations for entry"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exitThreshold">Exit Threshold</Label>
                <Input
                  id="exitThreshold"
                  type="number"
                  value={formData.indicatorConfig?.exitThreshold || ""}
                  onChange={(e) => handleIndicatorConfigChange("exitThreshold", Number.parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.indicatorConfig?.type === "rsi" && "RSI value above which to exit a position (e.g., 70)"}
                  {formData.indicatorConfig?.type === "macd" && "MACD signal line crossunder threshold"}
                  {formData.indicatorConfig?.type === "bollinger" && "Number of standard deviations for exit"}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="grid" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="gridSize">Grid Size (%)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Percentage gap between grid levels (default: 1%)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="gridSize"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={formData.gridConfig?.gridSize || 1}
                  onChange={(e) => handleGridConfigChange("gridSize", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="upperLimit">Upper Price Limit</Label>
                <Input
                  id="upperLimit"
                  type="number"
                  min={0}
                  step={1}
                  value={formData.gridConfig?.upperLimit || ""}
                  onChange={(e) => handleGridConfigChange("upperLimit", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Maximum price for the grid strategy</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lowerLimit">Lower Price Limit</Label>
                <Input
                  id="lowerLimit"
                  type="number"
                  min={0}
                  step={1}
                  value={formData.gridConfig?.lowerLimit || ""}
                  onChange={(e) => handleGridConfigChange("lowerLimit", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Minimum price for the grid strategy</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity per Order</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={0.001}
                  step={0.001}
                  value={formData.gridConfig?.quantity || ""}
                  onChange={(e) => handleGridConfigChange("quantity", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Amount to buy/sell at each grid level</p>
              </div>
            </TabsContent>

            <TabsContent value="dca" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="interval">Interval (Cron Expression)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Schedule for recurring purchases using cron syntax</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="interval"
                  placeholder="0 0 * * 1"
                  value={formData.dcaConfig?.interval || ""}
                  onChange={(e) => handleDcaConfigChange("interval", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Example: "0 0 * * 1" for every Monday at midnight</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount per Purchase ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={1}
                  step={1}
                  value={formData.dcaConfig?.amount || ""}
                  onChange={(e) => handleDcaConfigChange("amount", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Dollar amount to invest at each interval</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Optional)</Label>
                <Input
                  id="duration"
                  placeholder="30days"
                  value={formData.dcaConfig?.duration || ""}
                  onChange={(e) => handleDcaConfigChange("duration", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Example: "30days", "3months", "1year" (leave empty for indefinite)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="basket" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="rebalancePeriod">Rebalance Period (Cron Expression)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Schedule for rebalancing the basket using cron syntax</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="rebalancePeriod"
                  placeholder="0 0 1 * *"
                  value={formData.basketConfig?.rebalancePeriod || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      basketConfig: {
                        ...formData.basketConfig!,
                        rebalancePeriod: e.target.value,
                      },
                    })
                  }}
                />
                <p className="text-xs text-muted-foreground">Example: "0 0 1 * *" for the 1st day of every month</p>
              </div>

              <div className="space-y-2">
                <Label>Target Allocation</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.basketConfig?.targetAllocation &&
                    Object.entries(formData.basketConfig.targetAllocation).map(([symbol, allocation]) => (
                      <Badge key={symbol} variant="secondary" className="flex items-center gap-1">
                        {symbol}: {(allocation * 100).toFixed(0)}%
                        <button
                          type="button"
                          onClick={() => handleRemoveAllocation(symbol)}
                          className="ml-1 rounded-full hover:bg-muted p-0.5"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {symbol}</span>
                        </button>
                      </Badge>
                    ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Symbol (e.g. AAPL)"
                    value={newAllocationSymbol}
                    onChange={(e) => setNewAllocationSymbol(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Allocation %"
                    min={1}
                    max={100}
                    value={newAllocationValue || ""}
                    onChange={(e) => setNewAllocationValue(Number.parseFloat(e.target.value))}
                    className="w-24"
                  />
                  <Button type="button" size="sm" onClick={handleAddAllocation}>
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total allocation:{" "}
                  {formData.basketConfig?.targetAllocation
                    ? Object.values(formData.basketConfig.targetAllocation).reduce((sum, val) => sum + val, 0) * 100
                    : 0}
                  % (should equal 100%)
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end space-x-2 pt-6 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{initialBot ? "Update Bot" : "Create Bot"}</Button>
        </div>
      </form>
    )
  }

  // Presentation mode - multi-step interface
  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Progress indicator */}
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${index <= currentStep ? "text-primary" : "text-muted-foreground"}`}
              style={{ width: `${100 / steps.length}%` }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  index < currentStep
                    ? "bg-primary text-primary-foreground"
                    : index === currentStep
                      ? "border-2 border-primary"
                      : "border-2 border-muted"
                }`}
              >
                {index < currentStep ? "✓" : index + 1}
              </div>
              <span className="text-xs text-center hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold mb-2">{steps[currentStep].title}</h3>
          <p className="text-muted-foreground mb-8">{steps[currentStep].description}</p>

          {/* Step 1: Basic Information */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Bot Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="My Trading Bot"
                  required
                  className="text-lg p-6"
                />
              </div>

              <div className="space-y-2 mt-8">
                <Label htmlFor="type" className="text-lg">
                  Bot Type
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card
                    className={`cursor-pointer hover:border-primary transition-all ${formData.type === "indicator" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => handleTypeChange("indicator")}
                  >
                    <CardHeader>
                      <CardTitle>Indicator-Based Trading</CardTitle>
                      <CardDescription>
                        Use technical indicators like RSI, MACD, or Bollinger Bands to make trading decisions
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className={`cursor-pointer hover:border-primary transition-all ${formData.type === "grid" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => handleTypeChange("grid")}
                  >
                    <CardHeader>
                      <CardTitle>Grid Trading</CardTitle>
                      <CardDescription>
                        Place buy and sell orders at regular price intervals to profit from market volatility
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className={`cursor-pointer hover:border-primary transition-all ${formData.type === "dca" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => handleTypeChange("dca")}
                  >
                    <CardHeader>
                      <CardTitle>Dollar Cost Averaging</CardTitle>
                      <CardDescription>Invest a fixed amount at regular intervals regardless of price</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className={`cursor-pointer hover:border-primary transition-all ${formData.type === "basket" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => handleTypeChange("basket")}
                  >
                    <CardHeader>
                      <CardTitle>Basket Trading</CardTitle>
                      <CardDescription>Manage a portfolio of assets with periodic rebalancing</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Trading Assets */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-lg">Select Trading Assets</Label>
                <p className="text-muted-foreground">Choose the assets your bot will trade</p>

                <div className="flex flex-wrap gap-3 my-6">
                  {formData.assets?.map((asset) => (
                    <Badge key={asset} variant="secondary" className="flex items-center gap-1 text-base py-2 px-3">
                      {asset}
                      <button
                        type="button"
                        onClick={() => handleRemoveAsset(asset)}
                        className="ml-2 rounded-full hover:bg-muted p-1"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove {asset}</span>
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3 mt-8">
                  <Input
                    placeholder="Add asset (e.g. AAPL, MSFT, BTC)"
                    value={newAsset}
                    onChange={(e) => setNewAsset(e.target.value)}
                    className="text-lg p-6"
                  />
                  <Button type="button" onClick={handleAddAsset} className="px-6">
                    <Plus className="h-5 w-5 mr-2" /> Add Asset
                  </Button>
                </div>

                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-4">Portfolio Templates</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Stock Categories</h5>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "FAANG (FB,AAPL,AMZN,NFLX,GOOG)",
                          "Growth Stocks",
                          "Value Stocks",
                          "Dividend Aristocrats",
                          "Internet Stocks",
                          "WSB Favorites",
                        ].map((category) => (
                          <Button
                            key={category}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              // Set form values based on category
                              const symbols = getSymbolsByCategory(category)
                              setFormData({
                                ...formData,
                                assets: symbols,
                              })
                            }}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-2">Crypto Portfolios</h5>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "BTC:ETH:SOL:DOGE:ADA (Equal)",
                          "BTC:ETH:SOL:DOGE:ADA (Market Cap)",
                          "BTC:ETH:SOL:DOGE:ADA (Inverse Cap)",
                          "BTC:ETH (3:5)",
                          "Blue Chip Crypto",
                          "DeFi Tokens",
                        ].map((category) => (
                          <Button
                            key={category}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              // Set form values based on category
                              const symbols = getCryptoByPortfolio(category)
                              setFormData({
                                ...formData,
                                assets: symbols,
                              })
                            }}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <h5 className="text-sm font-medium mb-2">Popular Individual Assets</h5>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "AAPL",
                      "MSFT",
                      "GOOGL",
                      "AMZN",
                      "TSLA",
                      "META",
                      "NVDA",
                      "BTC",
                      "ETH",
                      "SOL",
                      "DOGE",
                      "ADA",
                      "SPY",
                      "QQQ",
                      "VTI",
                    ].map((symbol) => (
                      <Button
                        key={symbol}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          const currentSymbols = formData.assets || []

                          if (!currentSymbols.includes(symbol)) {
                            setFormData({
                              ...formData,
                              assets: [...currentSymbols, symbol],
                            })
                          }
                        }}
                      >
                        {symbol}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Risk Management */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Risk Management</CardTitle>
                  <CardDescription>Set your risk parameters to protect your investment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="stopLoss" className="text-lg">
                        Stop Loss (%)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Percentage below entry price to exit position</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="stopLoss"
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={formData.stopLoss || ""}
                      onChange={(e) => handleNumberChange(e, "stopLoss")}
                      className="text-lg p-6"
                    />
                    <p className="text-sm text-muted-foreground">Recommended: 2-5% for conservative strategies</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="takeProfit" className="text-lg">
                        Take Profit (%)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Percentage above entry price to exit position</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="takeProfit"
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={formData.takeProfit || ""}
                      onChange={(e) => handleNumberChange(e, "takeProfit")}
                      className="text-lg p-6"
                    />
                    <p className="text-sm text-muted-foreground">Recommended: 5-15% for balanced risk/reward</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="maxDrawdown" className="text-lg">
                        Max Drawdown (%)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Maximum allowed drawdown before stopping the bot</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="maxDrawdown"
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={formData.maxDrawdown || ""}
                      onChange={(e) => handleNumberChange(e, "maxDrawdown")}
                      className="text-lg p-6"
                    />
                    <p className="text-sm text-muted-foreground">Recommended: 10-20% to avoid excessive losses</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Strategy Configuration */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="indicator" className="text-base py-3">
                    Indicator
                  </TabsTrigger>
                  <TabsTrigger value="grid" className="text-base py-3">
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="dca" className="text-base py-3">
                    DCA
                  </TabsTrigger>
                  <TabsTrigger value="basket" className="text-base py-3">
                    Basket
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="indicator" className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="indicatorType" className="text-lg">
                      Indicator Type
                    </Label>
                    <Select
                      value={formData.indicatorConfig?.type}
                      onValueChange={(value) => handleIndicatorConfigChange("type", value)}
                    >
                      <SelectTrigger className="text-lg p-6">
                        <SelectValue placeholder="Select indicator type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rsi">RSI (Relative Strength Index)</SelectItem>
                        <SelectItem value="macd">MACD (Moving Average Convergence Divergence)</SelectItem>
                        <SelectItem value="bollinger">Bollinger Bands</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 mt-6">
                    <Label htmlFor="timeframe" className="text-lg">
                      Timeframe
                    </Label>
                    <Select
                      value={formData.indicatorConfig?.timeframe}
                      onValueChange={(value) => handleIndicatorConfigChange("timeframe", value)}
                    >
                      <SelectTrigger className="text-lg p-6">
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
                        <SelectItem value="1week">1 Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-3">
                      <Label htmlFor="entryThreshold" className="text-lg">
                        Entry Threshold
                      </Label>
                      <Input
                        id="entryThreshold"
                        type="number"
                        value={formData.indicatorConfig?.entryThreshold || ""}
                        onChange={(e) =>
                          handleIndicatorConfigChange("entryThreshold", Number.parseFloat(e.target.value))
                        }
                        className="text-lg p-6"
                      />
                      <p className="text-sm text-muted-foreground">
                        {formData.indicatorConfig?.type === "rsi" &&
                          "RSI value below which to enter a position (e.g., 30)"}
                        {formData.indicatorConfig?.type === "macd" && "MACD signal line crossover threshold"}
                        {formData.indicatorConfig?.type === "bollinger" && "Number of standard deviations for entry"}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="exitThreshold" className="text-lg">
                        Exit Threshold
                      </Label>
                      <Input
                        id="exitThreshold"
                        type="number"
                        value={formData.indicatorConfig?.exitThreshold || ""}
                        onChange={(e) =>
                          handleIndicatorConfigChange("exitThreshold", Number.parseFloat(e.target.value))
                        }
                        className="text-lg p-6"
                      />
                      <p className="text-sm text-muted-foreground">
                        {formData.indicatorConfig?.type === "rsi" &&
                          "RSI value above which to exit a position (e.g., 70)"}
                        {formData.indicatorConfig?.type === "macd" && "MACD signal line crossunder threshold"}
                        {formData.indicatorConfig?.type === "bollinger" && "Number of standard deviations for exit"}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="grid" className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="gridSize" className="text-lg">
                        Grid Size (%)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Percentage gap between grid levels (default: 1%)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="gridSize"
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={formData.gridConfig?.gridSize || 1}
                      onChange={(e) => handleGridConfigChange("gridSize", e.target.value)}
                      className="text-lg p-6"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-3">
                      <Label htmlFor="upperLimit" className="text-lg">
                        Upper Price Limit
                      </Label>
                      <Input
                        id="upperLimit"
                        type="number"
                        min={0}
                        step={1}
                        value={formData.gridConfig?.upperLimit || ""}
                        onChange={(e) => handleGridConfigChange("upperLimit", e.target.value)}
                        className="text-lg p-6"
                      />
                      <p className="text-sm text-muted-foreground">Maximum price for the grid strategy</p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="lowerLimit" className="text-lg">
                        Lower Price Limit
                      </Label>
                      <Input
                        id="lowerLimit"
                        type="number"
                        min={0}
                        step={1}
                        value={formData.gridConfig?.lowerLimit || ""}
                        onChange={(e) => handleGridConfigChange("lowerLimit", e.target.value)}
                        className="text-lg p-6"
                      />
                      <p className="text-sm text-muted-foreground">Minimum price for the grid strategy</p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    <Label htmlFor="quantity" className="text-lg">
                      Quantity per Order
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={0.001}
                      step={0.001}
                      value={formData.gridConfig?.quantity || ""}
                      onChange={(e) => handleGridConfigChange("quantity", e.target.value)}
                      className="text-lg p-6"
                    />
                    <p className="text-sm text-muted-foreground">Amount to buy/sell at each grid level</p>
                  </div>
                </TabsContent>

                <TabsContent value="dca" className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="interval" className="text-lg">
                        Interval (Cron Expression)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Schedule for recurring purchases using cron syntax</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="interval"
                      placeholder="0 0 * * 1"
                      value={formData.dcaConfig?.interval || ""}
                      onChange={(e) => handleDcaConfigChange("interval", e.target.value)}
                      className="text-lg p-6"
                    />
                    <p className="text-sm text-muted-foreground">Example: "0 0 * * 1" for every Monday at midnight</p>
                  </div>

                  <div className="space-y-3 mt-6">
                    <Label htmlFor="amount" className="text-lg">
                      Amount per Purchase ($)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      min={1}
                      step={1}
                      value={formData.dcaConfig?.amount || ""}
                      onChange={(e) => handleDcaConfigChange("amount", e.target.value)}
                      className="text-lg p-6"
                    />
                    <p className="text-sm text-muted-foreground">Dollar amount to invest at each interval</p>
                  </div>

                  <div className="space-y-3 mt-6">
                    <Label htmlFor="duration" className="text-lg">
                      Duration (Optional)
                    </Label>
                    <Input
                      id="duration"
                      placeholder="30days"
                      value={formData.dcaConfig?.duration || ""}
                      onChange={(e) => handleDcaConfigChange("duration", e.target.value)}
                      className="text-lg p-6"
                    />
                    <p className="text-sm text-muted-foreground">
                      Example: "30days", "3months", "1year" (leave empty for indefinite)
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="basket" className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="rebalancePeriod" className="text-lg">
                        Rebalance Period (Cron Expression)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Schedule for rebalancing the basket using cron syntax</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="rebalancePeriod"
                      placeholder="0 0 1 * *"
                      value={formData.basketConfig?.rebalancePeriod || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          basketConfig: {
                            ...formData.basketConfig!,
                            rebalancePeriod: e.target.value,
                          },
                        })
                      }}
                      className="text-lg p-6"
                    />
                    <p className="text-sm text-muted-foreground">Example: "0 0 1 * *" for the 1st day of every month</p>
                  </div>

                  <div className="space-y-3 mt-6">
                    <Label className="text-lg">Target Allocation</Label>
                    <div className="flex flex-wrap gap-2 my-4">
                      {formData.basketConfig?.targetAllocation &&
                        Object.entries(formData.basketConfig.targetAllocation).map(([symbol, allocation]) => (
                          <Badge
                            key={symbol}
                            variant="secondary"
                            className="flex items-center gap-1 text-base py-2 px-3"
                          >
                            {symbol}: {(allocation * 100).toFixed(0)}%
                            <button
                              type="button"
                              onClick={() => handleRemoveAllocation(symbol)}
                              className="ml-2 rounded-full hover:bg-muted p-1"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove {symbol}</span>
                            </button>
                          </Badge>
                        ))}
                    </div>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Symbol (e.g. AAPL)"
                        value={newAllocationSymbol}
                        onChange={(e) => setNewAllocationSymbol(e.target.value)}
                        className="flex-1 text-lg p-6"
                      />
                      <Input
                        type="number"
                        placeholder="Allocation %"
                        min={1}
                        max={100}
                        value={newAllocationValue || ""}
                        onChange={(e) => setNewAllocationValue(Number.parseFloat(e.target.value))}
                        className="w-32 text-lg p-6"
                      />
                      <Button type="button" onClick={handleAddAllocation} className="px-6">
                        <Plus className="h-5 w-5" />
                        <span className="sr-only">Add</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Total allocation:{" "}
                      {formData.basketConfig?.targetAllocation
                        ? Object.values(formData.basketConfig.targetAllocation).reduce((sum, val) => sum + val, 0) * 100
                        : 0}
                      % (should equal 100%)
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 5: Review & Create */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Review Your Bot Configuration</h3>

              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bot Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bot Type:</span>
                    <span className="font-medium capitalize">{formData.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trading Assets:</span>
                    <span className="font-medium">{formData.assets?.join(", ")}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stop Loss:</span>
                    <span className="font-medium">{formData.stopLoss}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Take Profit:</span>
                    <span className="font-medium">{formData.takeProfit}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Drawdown:</span>
                    <span className="font-medium">{formData.maxDrawdown}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Strategy Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {formData.type === "indicator" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Indicator Type:</span>
                        <span className="font-medium">{formData.indicatorConfig?.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timeframe:</span>
                        <span className="font-medium">{formData.indicatorConfig?.timeframe}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entry Threshold:</span>
                        <span className="font-medium">{formData.indicatorConfig?.entryThreshold}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Exit Threshold:</span>
                        <span className="font-medium">{formData.indicatorConfig?.exitThreshold}</span>
                      </div>
                    </>
                  )}

                  {formData.type === "grid" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Grid Size:</span>
                        <span className="font-medium">{formData.gridConfig?.gridSize}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Upper Limit:</span>
                        <span className="font-medium">${formData.gridConfig?.upperLimit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lower Limit:</span>
                        <span className="font-medium">${formData.gridConfig?.lowerLimit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantity per Order:</span>
                        <span className="font-medium">{formData.gridConfig?.quantity}</span>
                      </div>
                    </>
                  )}

                  {formData.type === "dca" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Interval:</span>
                        <span className="font-medium">{formData.dcaConfig?.interval}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount per Purchase:</span>
                        <span className="font-medium">${formData.dcaConfig?.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{formData.dcaConfig?.duration || "Indefinite"}</span>
                      </div>
                    </>
                  )}

                  {formData.type === "basket" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rebalance Period:</span>
                        <span className="font-medium">{formData.basketConfig?.rebalancePeriod}</span>
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                        <span className="text-muted-foreground">Target Allocation:</span>
                        <div className="flex flex-wrap gap-2">
                          {formData.basketConfig?.targetAllocation &&
                            Object.entries(formData.basketConfig.targetAllocation).map(([symbol, allocation]) => (
                              <Badge key={symbol} variant="secondary">
                                {symbol}: {(allocation * 100).toFixed(0)}%
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="p-6 border-t flex justify-between">
        <Button type="button" variant="outline" onClick={currentStep === 0 ? onCancel : prevStep}>
          {currentStep === 0 ? "Cancel" : "Previous"}
        </Button>

        <Button
          type={currentStep === steps.length - 1 ? "submit" : "button"}
          onClick={currentStep === steps.length - 1 ? undefined : nextStep}
        >
          {currentStep === steps.length - 1 ? (initialBot ? "Update Bot" : "Create Bot") : "Next"}
        </Button>
      </div>
    </form>
  )
}

// Add these helper functions after the return statement in the component

function getSymbolsByCategory(category: string): string[] {
  switch (category) {
    case "FAANG (FB,AAPL,AMZN,NFLX,GOOG)":
      return ["META", "AAPL", "AMZN", "NFLX", "GOOGL"]
    case "Growth Stocks":
      return ["TSLA", "NVDA", "AMD", "SHOP", "SQ"]
    case "Value Stocks":
      return ["BRK.B", "JPM", "JNJ", "PG", "KO"]
    case "Dividend Aristocrats":
      return ["JNJ", "PG", "KO", "XOM", "MMM"]
    case "Internet Stocks":
      return ["AMZN", "GOOGL", "META", "NFLX", "BABA"]
    case "WSB Favorites":
      return ["GME", "AMC", "PLTR", "BB", "WISH"]
    default:
      return []
  }
}

function getCryptoByPortfolio(portfolio: string): string[] {
  switch (portfolio) {
    case "BTC:ETH:SOL:DOGE:ADA (Equal)":
      return ["BTC", "ETH", "SOL", "DOGE", "ADA"]
    case "BTC:ETH:SOL:DOGE:ADA (Market Cap)":
      return ["BTC", "ETH", "SOL", "DOGE", "ADA"]
    case "BTC:ETH:SOL:DOGE:ADA (Inverse Cap)":
      return ["BTC", "ETH", "SOL", "DOGE", "ADA"]
    case "BTC:ETH (3:5)":
      return ["BTC", "ETH"]
    case "Blue Chip Crypto":
      return ["BTC", "ETH", "BNB", "XRP", "ADA"]
    case "DeFi Tokens":
      return ["UNI", "AAVE", "COMP", "MKR", "SUSHI"]
    default:
      return []
  }
}
