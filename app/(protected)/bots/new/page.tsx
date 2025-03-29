"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Bot } from "lucide-react"
import type { Bot as BotType, BotType as BotTypeEnum } from "@/types/bot"
import { createBot } from "@/lib/bot-api"

const steps = [
  {
    title: "Choose Bot Type",
    description: "Select the type of trading bot you want to create",
  },
  {
    title: "Configure Settings",
    description: "Set up your bot's trading parameters",
  },
  {
    title: "Risk Management",
    description: "Define risk parameters and limits",
  },
  {
    title: "Review & Create",
    description: "Review your configuration and create your bot",
  },
]

const botTypes = [
  {
    type: "indicator" as BotTypeEnum,
    title: "Technical Indicator Bot",
    description: "Trade based on technical indicators like RSI, MACD, or Bollinger Bands",
    icon: <Bot className="w-8 h-8" />,
    features: ["Multiple indicator support", "Customizable parameters", "Advanced backtesting"],
  },
  {
    type: "grid" as BotTypeEnum,
    title: "Grid Trading Bot",
    description: "Place buy and sell orders at regular price intervals",
    icon: <Bot className="w-8 h-8" />,
    features: ["1% grid spacing", "Auto-rebalancing", "Works best in sideways markets"],
  },
  {
    type: "dca" as BotTypeEnum,
    title: "DCA Bot",
    description: "Dollar Cost Averaging - invest fixed amounts at regular intervals",
    icon: <Bot className="w-8 h-8" />,
    features: ["Scheduled investments", "Supports multiple assets", "Risk reduction"],
  },
  {
    type: "basket" as BotTypeEnum,
    title: "Basket Trading Bot",
    description: "Manage a portfolio of assets with periodic rebalancing",
    icon: <Bot className="w-8 h-8" />,
    features: ["Portfolio rebalancing", "Custom allocations", "Correlation analysis"],
  },
]

export default function CreateBotPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedType, setSelectedType] = useState<BotTypeEnum | null>(null)
  const [botConfig, setBotConfig] = useState({
    name: "",
    description: "",
    assets: [] as string[],
    risk: {
      maxDrawdown: 10,
      stopLoss: 5,
      takeProfit: 15,
      maxPositionSize: 20,
    },
    parameters: {},
  })

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSelectType = (type: BotTypeEnum) => {
    setSelectedType(type)
    handleNextStep()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Bot</h1>
          <p className="text-muted-foreground">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {currentStep === 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {botTypes.map((bot) => (
              <Card
                key={bot.type}
                className="cursor-pointer hover:border-primary transition-all"
                onClick={() => handleSelectType(bot.type)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {bot.icon}
                    <div>
                      <CardTitle>{bot.title}</CardTitle>
                      <CardDescription>{bot.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {bot.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Configuration</CardTitle>
              <CardDescription>Configure your bot's basic settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Bot Name</Label>
                  <Input 
                    id="name" 
                    value={botConfig.name}
                    onChange={(e) => setBotConfig({...botConfig, name: e.target.value})}
                    placeholder="My Trading Bot"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    value={botConfig.description}
                    onChange={(e) => setBotConfig({...botConfig, description: e.target.value})}
                    placeholder="A brief description of your bot's strategy"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trading Assets</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {["AAPL", "GOOGL", "MSFT", "AMZN", "BTC/USD", "ETH/USD"].map((asset) => (
                      <Button
                        key={asset}
                        variant={botConfig.assets.includes(asset) ? "default" : "outline"}
                        onClick={() => {
                          setBotConfig({
                            ...botConfig,
                            assets: botConfig.assets.includes(asset)
                              ? botConfig.assets.filter(a => a !== asset)
                              : [...botConfig.assets, asset]
                          })
                        }}
                        className="justify-start"
                      >
                        {asset}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Risk Management</CardTitle>
              <CardDescription>Define risk parameters and safety limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxDrawdown">Max Drawdown (%)</Label>
                  <Input 
                    id="maxDrawdown" 
                    type="number"
                    value={botConfig.risk.maxDrawdown}
                    onChange={(e) => setBotConfig({
                      ...botConfig,
                      risk: {...botConfig.risk, maxDrawdown: parseFloat(e.target.value)}
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                  <Input 
                    id="stopLoss" 
                    type="number"
                    value={botConfig.risk.stopLoss}
                    onChange={(e) => setBotConfig({
                      ...botConfig,
                      risk: {...botConfig.risk, stopLoss: parseFloat(e.target.value)}
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit (%)</Label>
                  <Input 
                    id="takeProfit" 
                    type="number"
                    value={botConfig.risk.takeProfit}
                    onChange={(e) => setBotConfig({
                      ...botConfig,
                      risk: {...botConfig.risk, takeProfit: parseFloat(e.target.value)}
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPositionSize">Max Position Size (%)</Label>
                  <Input 
                    id="maxPositionSize" 
                    type="number"
                    value={botConfig.risk.maxPositionSize}
                    onChange={(e) => setBotConfig({
                      ...botConfig,
                      risk: {...botConfig.risk, maxPositionSize: parseFloat(e.target.value)}
                    })}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Configuration</CardTitle>
              <CardDescription>Review your bot settings before creating</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-1">
                  <p className="font-medium">Bot Type</p>
                  <p className="text-sm text-muted-foreground">{selectedType}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{botConfig.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{botConfig.description}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Trading Assets</p>
                  <div className="flex flex-wrap gap-2">
                    {botConfig.assets.map((asset) => (
                      <Badge key={asset} variant="secondary">{asset}</Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Risk Parameters</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Max Drawdown: {botConfig.risk.maxDrawdown}%</li>
                    <li>Stop Loss: {botConfig.risk.stopLoss}%</li>
                    <li>Take Profit: {botConfig.risk.takeProfit}%</li>
                    <li>Max Position Size: {botConfig.risk.maxPositionSize}%</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={currentStep === 0 && !selectedType}
          >
            {currentStep === steps.length - 1 ? "Create Bot" : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}