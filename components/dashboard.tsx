"use client"

import { useState, useEffect } from "react"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import { BasicDashboard } from "@/components/basic-dashboard"
import { DashboardSwitcher } from "@/components/dashboard-switcher"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { Bot } from "@/types/bot"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchPortfolio } from "@/lib/api"
import type { Portfolio } from "@/types/portfolio"
import { PORTFOLIO_SCENARIOS, ScenarioKey } from "@/lib/portfolio-scenarios"
import { formatCurrency } from "@/lib/portfolio-utils"
import type { Position } from "@/types/portfolio"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Stepper, Step } from "@/components/ui/stepper"
import { Grid, GridIcon } from "@/components/ui/grid"
import { DollarSign, Settings, TrendingUp } from "lucide-react"
import { BotConfigurationForm } from "./bot-configuration-form"
import { BotReviewForm } from "./bot-review-form"
import { BotRiskForm } from "./bot-risk-form"
import { Plus } from "lucide-react"
import { BotList } from "@/components/bot-list"
import { AddBotForm } from "@/components/AddBotForm"
import { BotType } from "@/types/bot"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export interface BotTemplate {
  id: string
  name: string
  description: string
  type: 'grid' | 'dca' | 'momentum' | 'trend' | 'custom'
  icon: React.ReactNode
  defaultConfig: Partial<BotWithPortfolio>
}

// Add exports for type definitions
export interface BotWithPortfolio extends Bot {
  portfolio?: Position[]
  performance?: {
    totalValue: number
    totalPnL: number
    pnlPercentage: number
    totalTrades: number
    winRate: number
    lastUpdated: string
  }
}

interface DashboardProps {
  bots: Bot[]
  apiConfig?: {
    keyId: string
    secretKey: string
    baseUrl: string
    isPaper: boolean
  } | null
}

export function Dashboard({ bots, apiConfig }: DashboardProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState<string[]>([])
  const [dashboardMode, setDashboardMode] = useState<'basic' | 'enhanced'>('enhanced')
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey | null>(null)
  const [selectedBot, setSelectedBot] = useState<BotWithPortfolio | null>(null)
  const [managedBots, setManagedBots] = useState<BotWithPortfolio[]>([])
  const [isBotFormOpen, setIsBotFormOpen] = useState(false)
  const [botCreationStep, setBotCreationStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<BotTemplate | null>(null)
  const [botFormData, setBotFormData] = useState<Partial<BotWithPortfolio>>({})
  const [selectedBotType, setSelectedBotType] = useState<BotType | "all">("all")
  const [showAddBot, setShowAddBot] = useState(false)

  const botTemplates: BotTemplate[] = [
    {
      id: 'basket-trading',
      name: 'Basket Trading Bot',
      description: 'Trade and rebalance a custom portfolio of assets',
      type: 'custom',
      icon: <GridIcon className="h-8 w-8" />,
      defaultConfig: {
        name: 'Basket Trading Bot',
        type: 'custom',
        status: 'paused',
        settings: {
          type: 'basket',
          targetAllocation: {},
          rebalancePeriod: '0 0 * * 1', // Weekly rebalance
          baskets: []
        }
      }
    },
    {
      id: 'signal-bot',
      name: 'Signal Trading Bot',
      description: 'Trade based on technical indicators and signals',
      type: 'custom',
      icon: <TrendingUp className="h-8 w-8" />,
      defaultConfig: {
        name: 'Signal Trading Bot',
        type: 'custom',
        status: 'paused',
        settings: {
          type: 'signal',
          indicators: [{
            type: 'rsi',
            timeframe: '1hour',
            entryThreshold: 30,
            exitThreshold: 70
          }],
          symbol: '',
          positionSize: 0
        }
      }
    },
    {
      id: 'grid-trading',
      name: 'Grid Trading Bot',
      description: 'Buy low and sell high within a defined price range',
      type: 'grid',
      icon: <GridIcon className="h-8 w-8" />,
      defaultConfig: {
        name: 'Grid Trading Bot',
        type: 'grid',
        status: 'paused',
        settings: {
          symbol: 'BTC/USD',
          gridLevels: 5,
          upperLimit: 40000,
          lowerLimit: 30000,
          investment: 5000
        }
      }
    },
    {
      id: 'dca-bot',
      name: 'DCA Bot',
      description: 'Dollar-cost averaging for long-term investing',
      type: 'dca',
      icon: <DollarSign className="h-8 w-8" />,
      defaultConfig: {
        name: 'DCA Bot',
        type: 'dca',
        status: 'paused',
        settings: {
          symbol: 'AAPL',
          interval: 'weekly',
          amount: 100
        }
      }
    },
    {
      id: 'momentum-bot',
      name: 'Momentum Bot',
      description: 'Trade based on price momentum indicators',
      type: 'momentum',
      icon: <TrendingUp className="h-8 w-8" />,
      defaultConfig: {
        name: 'Momentum Bot',
        type: 'momentum',
        status: 'paused',
        settings: {
          symbol: 'TSLA',
          lookbackPeriod: 14,
          threshold: 0.1
        }
      }
    },
    {
      id: 'custom-bot',
      name: 'Custom Bot',
      description: 'Build your own trading bot from scratch',
      type: 'custom',
      icon: <Settings className="h-8 w-8" />,
      defaultConfig: {
        name: 'Custom Bot',
        type: 'custom',
        status: 'paused',
        settings: {}
      }
    }
  ]

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await fetchPortfolio()
        setPortfolio(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load portfolio data",
          variant: "destructive",
        })
      }
    }

    loadPortfolio()
  }, [toast])

  // Load bots on mount
  useEffect(() => {
    if (bots?.length) {
      const botsWithPortfolio = bots.map(bot => ({
        ...bot,
        portfolio: [],
        performance: {
          totalValue: 0,
          totalPnL: 0,
          pnlPercentage: 0,
          totalTrades: 0,
          winRate: 0,
          lastUpdated: new Date().toISOString()
        }
      }))
      setManagedBots(botsWithPortfolio)
      // Initialize selectedBot if none is selected
      if (!selectedBot && botsWithPortfolio.length > 0) {
        setSelectedBot(botsWithPortfolio[0])
      }
    }
  }, [bots, selectedBot])

  const handleCreateBot = async (botData: Partial<BotWithPortfolio>) => {
    try {
      // If we're not in the final step, just update the form data
      if (botCreationStep < 3) {
        handleBotFormUpdate(botData)
        handleNextStep()
        return
      }
      
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...botFormData,
          ...botData,
          createdAt: new Date().toISOString()
        })
      })
      
      if (!response.ok) throw new Error('Failed to create bot')
      
      const newBot = await response.json()
      const botWithPortfolio: BotWithPortfolio = {
        ...newBot,
        portfolio: [],
        performance: {
          totalValue: 0,
          totalPnL: 0,
          pnlPercentage: 0,
          totalTrades: 0,
          winRate: 0,
          lastUpdated: new Date().toISOString()
        }
      }
      
      setManagedBots(prev => [...prev, botWithPortfolio])
      setSelectedBot(botWithPortfolio) // Set the newly created bot as selected
      
      toast({
        title: 'Success',
        description: 'Bot created successfully',
      })
      
      // Close the form and reset creation state
      setIsBotFormOpen(false)
      setBotCreationStep(0)
      setSelectedTemplate(null)
      setBotFormData({})
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create bot',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateBot = async (botId: string, updates: Partial<BotWithPortfolio>) => {
    try {
      const response = await fetch(`/api/bots/${botId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) throw new Error('Failed to update bot')
      
      const updatedBot = await response.json()
      setManagedBots(prev => prev.map(bot => 
        bot.id === botId ? { ...bot, ...updatedBot } : bot
      ))
      
      if (selectedBot?.id === botId) {
        setSelectedBot({ ...selectedBot, ...updatedBot })
      }

      toast({
        title: 'Success',
        description: 'Bot updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update bot',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteBot = async (botId: string) => {
    try {
      const response = await fetch(`/api/bots/${botId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete bot')
      
      setManagedBots(prev => prev.filter(bot => bot.id !== botId))
      
      if (selectedBot?.id === botId) {
        setSelectedBot(null)
      }

      toast({
        title: 'Success',
        description: 'Bot deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete bot',
        variant: 'destructive',
      })
    }
  }

  // Update handleBotAction to work with managed bots
  const handleBotAction = async (botId: string, action: 'start' | 'stop' | 'delete') => {
    setLoading(prev => [...prev, botId])
    try {
      if (action === 'delete') {
        await handleDeleteBot(botId)
        return
      }

      const response = await fetch(`/api/bots/${botId}/${action}`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to perform action')
      
      // Update bot status
      setManagedBots(prev => prev.map(bot => 
        bot.id === botId 
          ? { ...bot, status: action === 'start' ? 'active' : 'paused' }
          : bot
      ))

      toast({
        title: 'Success',
        description: `Bot ${action} successful`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} bot`,
        variant: 'destructive',
      })
    } finally {
      setLoading(prev => prev.filter(id => id !== botId))
    }
  }

  const handleScenarioSelect = (scenarioKey: ScenarioKey) => {
    setSelectedScenario(scenarioKey)
  }

  const handleScenarioCreate = async (data: Partial<Portfolio>) => {
    try {
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) throw new Error('Failed to create scenario')
      
      toast({
        title: 'Success',
        description: 'Portfolio scenario created',
      })

      // Refresh portfolio data
      const updated = await fetchPortfolio()
      setPortfolio(updated)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create portfolio scenario',
        variant: 'destructive',
      })
    }
  }

  const handleScenarioUpdate = async (id: string, data: Partial<Portfolio>) => {
    try {
      const response = await fetch(`/api/portfolios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) throw new Error('Failed to update scenario')
      
      toast({
        title: 'Success',
        description: 'Portfolio scenario updated',
      })

      // Refresh portfolio data
      const updated = await fetchPortfolio()
      setPortfolio(updated)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update portfolio scenario',
        variant: 'destructive',
      })
    }
  }

  const handleScenarioDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolios/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete scenario')
      
      toast({
        title: 'Success',
        description: 'Portfolio scenario deleted',
      })

      // Refresh portfolio data
      const updated = await fetchPortfolio()
      setPortfolio(updated)
      setSelectedScenario(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete portfolio scenario',
        variant: 'destructive',
      })
    }
  }

  const handleStartBotCreation = () => {
    setIsBotFormOpen(true)
    setBotCreationStep(0)
    setSelectedTemplate(null)
    setBotFormData({})
  }

  const handleSelectTemplate = (template: BotTemplate) => {
    setSelectedTemplate(template)
    setBotFormData(template.defaultConfig)
    setBotCreationStep(1)
  }

  const handleBotFormUpdate = (data: Partial<BotWithPortfolio>) => {
    setBotFormData(prev => ({
      ...prev,
      ...data
    }))
  }

  const handleNextStep = () => {
    setBotCreationStep(prev => Math.min(prev + 1, 3))
  }

  const handlePrevStep = () => {
    setBotCreationStep(prev => Math.max(prev - 1, 0))
  }

  const renderBotCreationStep = () => {
    switch (botCreationStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {botTemplates.map(template => (
              <Card 
                key={template.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleSelectTemplate(template)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configure Bot Settings</h3>
            <BotConfigurationForm 
              botType={selectedTemplate?.type || 'custom'} 
              initialData={botFormData}
              onSubmit={(data) => {
                handleBotFormUpdate(data)
                handleNextStep()
              }}
            />
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Risk and Portfolio Settings</h3>
            <BotRiskForm
              initialData={botFormData}
              onSubmit={(data) => {
                handleBotFormUpdate(data)
                handleNextStep()
              }}
            />
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review and Create</h3>
            <BotReviewForm 
              botData={botFormData} 
              onSubmit={handleCreateBot}
            />
          </div>
        )
      default:
        return null
    }
  }

  const botTypes: { value: BotType | "all"; label: string }[] = [
    { value: "all", label: "All Bots" },
    { value: "grid", label: "Grid Trading" },
    { value: "dca", label: "DCA" },
    { value: "indicator", label: "Indicator" },
    { value: "basket", label: "Basket" },
  ]

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Trading Bots"
        text="Create and manage your automated trading strategies."
      >
        <Button onClick={() => setShowAddBot(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Bot
        </Button>
      </DashboardHeader>

      <Tabs
        defaultValue="all"
        onValueChange={(value) => setSelectedBotType(value as BotType | "all")}
      >
        <TabsList className="grid w-full grid-cols-5">
          {botTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {botTypes.map((type) => (
          <TabsContent key={type.value} value={type.value}>
            <div className="grid gap-4">
              <Card className="p-6">
                <BotList filter={type.value} />
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <AddBotForm 
        open={showAddBot} 
        onClose={() => setShowAddBot(false)} 
      />

      {/* Bot creation dialog */}
      <Dialog 
        open={isBotFormOpen} 
        onOpenChange={setIsBotFormOpen}
        aria-labelledby="bot-creation-title"
        aria-describedby="bot-creation-description"
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle id="bot-creation-title">
              {botCreationStep === 0 ? 'Create New Bot' : selectedTemplate?.name || 'Configure Bot'}
            </DialogTitle>
            <DialogDescription id="bot-creation-description">
              {botCreationStep === 0 
                ? 'Choose a template to get started or create a custom bot'
                : 'Configure your bot settings and parameters'
              }
            </DialogDescription>
          </DialogHeader>
          
          {/* Stepper for multi-step form */}
          {botCreationStep > 0 && (
            <div className="mb-8" role="progressbar" aria-valuenow={botCreationStep} aria-valuemin={0} aria-valuemax={3}>
              <Stepper activeStep={botCreationStep}>
                <Step>Select Template</Step>
                <Step>Bot Configuration</Step>
                <Step>Risk Management</Step>
                <Step>Review & Create</Step>
              </Stepper>
            </div>
          )}
          
          {renderBotCreationStep()}
          
          {/* Navigation buttons */}
          {botCreationStep > 0 && (
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={botCreationStep === 1 ? () => setBotCreationStep(0) : handlePrevStep}
                aria-label={botCreationStep === 1 ? "Back to template selection" : "Previous step"}
              >
                Back
              </Button>
              {botCreationStep < 3 && (
                <Button 
                  onClick={handleNextStep}
                  aria-label="Next step"
                >
                  Next
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}

