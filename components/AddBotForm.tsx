"use client"

import * as React from "react"
import { useState } from "react"
import { Stepper, Step } from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Bot, BotType, GridConfig, DCAConfig, IndicatorConfig, BasketConfig } from "@/types/bot"

import { PORTFOLIO_SCENARIOS } from "@/lib/portfolio-scenarios"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

interface AddBotFormProps {
  open?: boolean
  onClose?: () => void
  onSubmit: (data: any) => void
}

export function AddBotForm({ open, onClose, onSubmit }: AddBotFormProps) {
  const [step, setStep] = useState(1)
  const [botType, setBotType] = useState<BotType>()
  const [botName, setBotName] = useState("")
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [config, setConfig] = useState<GridConfig | DCAConfig | IndicatorConfig | BasketConfig>()

  const availableAssets = [
    "BTC-USD", "ETH-USD", "AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"
  ]

  const handleSubmit = async () => {
    const newBot: Partial<Bot> = {
      name: botName,
      type: botType,
      assets: selectedAssets,
      status: "paused",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      performance: {
        totalPnL: 0,
        pnlPercentage: 0,
        totalTrades: 0,
        winRate: 0,
        lastUpdated: new Date().toISOString()
      }
    }

    // Add type-specific configuration
    switch (botType) {
      case "grid":
        newBot.gridConfig = config as GridConfig
        break
      case "dca":
        newBot.dcaConfig = config as DCAConfig
        break
      case "indicator":
        newBot.indicatorConfig = config as IndicatorConfig
        break
      case "basket":
        newBot.basketConfig = config as BasketConfig
        break
    }

    // Save bot logic here
    
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Trading Bot</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="botName">Bot Name</Label>
              <Input
                id="botName"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="My Trading Bot"
              />
            </div>

            <div className="space-y-2">
              <Label>Bot Type</Label>
              <Select onValueChange={(value) => setBotType(value as BotType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bot type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid Trading</SelectItem>
                  <SelectItem value="dca">Dollar Cost Averaging</SelectItem>
                  <SelectItem value="indicator">Indicator Based</SelectItem>
                  <SelectItem value="basket">Basket Trading</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!botName || !botType}
              className="w-full"
            >
              Next
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {botType === "grid" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Trading Pair</Label>
                  <Select onValueChange={(value) => setSelectedAssets([value])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trading pair" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAssets.map((asset) => (
                        <SelectItem key={asset} value={asset}>
                          {asset}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gridSize">Grid Size (%)</Label>
                  <Input
                    id="gridSize"
                    type="number"
                    min="0.1"
                    step="0.1"
                    onChange={(e) => setConfig({
                      ...config as GridConfig,
                      gridSize: parseFloat(e.target.value)
                    })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upperLimit">Upper Limit</Label>
                    <Input
                      id="upperLimit"
                      type="number"
                      onChange={(e) => setConfig({
                        ...config as GridConfig,
                        upperLimit: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lowerLimit">Lower Limit</Label>
                    <Input
                      id="lowerLimit"
                      type="number"
                      onChange={(e) => setConfig({
                        ...config as GridConfig,
                        lowerLimit: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {botType === "dca" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Assets</Label>
                  <Select onValueChange={(value) => setSelectedAssets([value])}>
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Investment Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    onChange={(e) => setConfig({
                      ...config as DCAConfig,
                      amount: parseFloat(e.target.value)
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interval">Interval (hours)</Label>
                  <Input
                    id="interval"
                    type="number"
                    min="1"
                    onChange={(e) => setConfig({
                      ...config as DCAConfig,
                      interval: `0 */${e.target.value} * * *`
                    })}
                  />
                </div>
              </div>
            )}

            {botType === "indicator" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Asset</Label>
                  <Select onValueChange={(value) => setSelectedAssets([value])}>
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label>Indicator Type</Label>
                  <Select onValueChange={(value) => setConfig({
                    ...config as IndicatorConfig,
                    type: value as "rsi" | "macd" | "bollinger"
                  })}>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entryThreshold">Entry Threshold</Label>
                    <Input
                      id="entryThreshold"
                      type="number"
                      onChange={(e) => setConfig({
                        ...config as IndicatorConfig,
                        entryThreshold: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exitThreshold">Exit Threshold</Label>
                    <Input
                      id="exitThreshold"
                      type="number"
                      onChange={(e) => setConfig({
                        ...config as IndicatorConfig,
                        exitThreshold: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {botType === "basket" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Assets</Label>
                  <Select onValueChange={(value) => {
                    if (!selectedAssets.includes(value)) {
                      setSelectedAssets([...selectedAssets, value])
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add assets" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAssets
                        .filter(asset => !selectedAssets.includes(asset))
                        .map((asset) => (
                          <SelectItem key={asset} value={asset}>
                            {asset}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedAssets.map((asset) => (
                  <div key={asset} className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label>{asset}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Allocation %"
                        onChange={(e) => {
                          const allocation = parseFloat(e.target.value)
                          setConfig({
                            ...config as BasketConfig,
                            targetAllocation: {
                              ...(config as BasketConfig)?.targetAllocation,
                              [asset]: allocation / 100
                            }
                          })
                        }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAssets(selectedAssets.filter(a => a !== asset))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between gap-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit}>
                Create Bot
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
