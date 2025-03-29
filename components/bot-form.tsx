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
import { X, Plus, Info, Lock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSubscription } from "@/providers/subscription-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface BotFormProps {
  initialBot: Bot | null
  onSubmit: (bot: any) => void
  onCancel: () => void
  presentationMode?: boolean
}

export function BotForm({ initialBot, onSubmit, onCancel, presentationMode = false }: BotFormProps) {
  const { subscription } = useSubscription()
  const [formData, setFormData] = useState<Partial<Bot>>(initialBot || {
    name: "",
    type: "indicator",
    assets: [],
    status: "paused",
  })

  const [selectedAsset, setSelectedAsset] = useState("")
  const [activeTab, setActiveTab] = useState<string>("general")

  // Available assets based on subscription tier
  const availableAssets = {
    "free-insta": ["AAPL", "MSFT", "BTC-USD", "ETH-USD"],
    baby: ["AAPL", "MSFT", "GOOGL", "BTC-USD", "ETH-USD", "SPY"],
    middle: ["AAPL", "MSFT", "GOOGL", "AMZN", "BTC-USD", "ETH-USD", "SPY", "QQQ", "VTI"],
    big: ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "BTC-USD", "ETH-USD", "SOL-USD", "SPY", "QQQ", "VTI"],
    xl: [] // Unlimited assets
  }[subscription?.tier || "free-insta"]

  const maxBots = {
    "free-insta": 5,
    baby: 10,
    middle: 15,
    big: 25,
    xl: Infinity
  }[subscription?.tier || "free-insta"]

  const strategyTypes = {
    "free-insta": ["grid", "dca"],
    baby: ["grid", "dca"],
    middle: ["grid", "dca", "indicator"],
    big: ["grid", "dca", "indicator", "basket"],
    xl: ["grid", "dca", "indicator", "basket"]
  }[subscription?.tier || "free-insta"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addAsset = () => {
    if (selectedAsset && !formData.assets?.includes(selectedAsset)) {
      setFormData({
        ...formData,
        assets: [...(formData.assets || []), selectedAsset]
      })
      setSelectedAsset("")
    }
  }

  const removeAsset = (asset: string) => {
    setFormData({
      ...formData,
      assets: formData.assets?.filter(a => a !== asset)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Bot Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Trading Bot"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Bot Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as BotType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {strategyTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!strategyTypes.includes(formData.type as string) && (
                <Alert className="mt-2">
                  <Lock className="h-4 w-4" />
                  <AlertTitle>Strategy Unavailable</AlertTitle>
                  <AlertDescription>
                    This strategy type requires a higher subscription tier.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="flex gap-2">
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {availableAssets.map(asset => (
                    <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addAsset} variant="secondary">
                <Plus className="h-4 w-4 mr-2" /> Add Asset
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.assets?.map(asset => (
                <Badge key={asset} variant="secondary" className="py-2">
                  {asset}
                  <button
                    type="button"
                    onClick={() => removeAsset(asset)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4 mt-4">
          {formData.type === "indicator" && (
            <Card>
              <CardHeader>
                <CardTitle>Indicator Settings</CardTitle>
                <CardDescription>Configure technical indicators for your strategy</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Indicator Type</Label>
                  <Select
                    value={formData.indicatorConfig?.type}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      indicatorConfig: { ...formData.indicatorConfig, type: value }
                    })}
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
                {/* Add more indicator-specific settings */}
              </CardContent>
            </Card>
          )}

          {formData.type === "grid" && (
            <Card>
              <CardHeader>
                <CardTitle>Grid Settings</CardTitle>
                <CardDescription>Configure grid trading parameters</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Grid Size (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.gridConfig?.gridSize || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      gridConfig: { ...formData.gridConfig, gridSize: parseFloat(e.target.value) }
                    })}
                  />
                </div>
                {/* Add more grid-specific settings */}
              </CardContent>
            </Card>
          )}

          {/* Add DCA and Basket strategy configurations */}
        </TabsContent>

        <TabsContent value="risk" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Parameters</CardTitle>
              <CardDescription>Set risk management rules for your bot</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Stop Loss (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.stopLoss || ""}
                    onChange={(e) => setFormData({ ...formData, stopLoss: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Take Profit (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.takeProfit || ""}
                    onChange={(e) => setFormData({ ...formData, takeProfit: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Max Drawdown (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.maxDrawdown || ""}
                    onChange={(e) => setFormData({ ...formData, maxDrawdown: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialBot ? "Update Bot" : "Create Bot"}
        </Button>
      </div>
    </form>
  )
}

