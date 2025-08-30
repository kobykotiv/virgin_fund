"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "@/components/dashboard"
import { BotList } from "@/components/bot-list"
import { BotForm } from "@/components/bot-form"
import { ApiKeyForm } from "@/components/api-key-form"
import type { Bot, BotStatus } from "@/types/bot"
import { fetchBots, createBot, updateBot, deleteBot, toggleBotStatus } from "@/lib/bot-api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Settings, Plus, BarChart2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

// Import the useSubscription hook at the top of the file
import { useSubscription } from "@/providers/subscription-provider"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function DashboardPage() {
  const [bots, setBots] = useState<Bot[]>([])
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isApiKeyFormOpen, setIsApiKeyFormOpen] = useState(false)
  const [apiConfigured, setApiConfigured] = useState(false)
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "bots" | "strategies" | "performance" | "analytics" | "settings"
  >("dashboard")
  const router = useRouter()

  // Add this inside the DashboardPage component, after the useState declarations
  const { canCreateMoreBots, tierLimits, currentTier } = useSubscription()

  // Update the Home component to fetch and pass the current API configuration

  // First, add a state for the API configuration
  const [apiConfig, setApiConfig] = useState<{
    keyId: string
    secretKey: string
    baseUrl: string
    isPaper: boolean
  } | null>(null)

  useEffect(() => {
    // Check if API keys are configured
    // Then update the checkApiConfig function to store the configuration
    const checkApiConfig = async () => {
      try {
        const response = await fetch("/api/alpaca/status")
        const data = await response.json()
        setApiConfigured(data.configured)
        if (data.config) {
          setApiConfig(data.config)
        }
        if (!data.configured) {
          setIsApiKeyFormOpen(true)
        } else {
          loadBots()
        }
      } catch (error) {
        console.error("Error checking API configuration:", error)
      }
    }

    checkApiConfig()
  }, [])

  const loadBots = async () => {
    try {
      const botData = await fetchBots()
      setBots(botData)
    } catch (error) {
      console.error("Error loading bots:", error)
    }
  }

  // Modify the handleCreateBot function to check subscription limits
  const handleCreateBot = async (botData: Partial<Bot>) => {
    try {
      // Check if user can create more bots
      if (!canCreateMoreBots(bots.length)) {
        alert(
          `You've reached the maximum number of bots (${tierLimits.maxBots}) for your ${currentTier} plan. Please upgrade to create more bots.`,
        )
        setIsFormOpen(false)
        router.push("/pricing")
        return
      }

      const newBot = await createBot(botData)
      setBots([...bots, newBot])
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error creating bot:", error)
    }
  }

  const handleUpdateBot = async (bot: Bot) => {
    try {
      const updatedBot = await updateBot(bot)
      setBots(bots.map((b) => (b.id === bot.id ? updatedBot : b)))
      setSelectedBot(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error updating bot:", error)
    }
  }

  const handleDeleteBot = async (botId: string) => {
    try {
      await deleteBot(botId)
      setBots(bots.filter((bot) => bot.id !== botId))
    } catch (error) {
      console.error("Error deleting bot:", error)
    }
  }

  // Update the handleToggleBotStatus function to better handle errors

  const handleToggleBotStatus = async (botId: string) => {
    try {
      const bot = bots.find((b) => b.id === botId)
      if (!bot) {
        console.error(`Bot with ID ${botId} not found in current state`)
        return
      }

      const newStatus: BotStatus = bot.status === "active" ? "paused" : "active"

      // Log the bot being toggled for debugging
      console.log(`Toggling bot status: ${botId} from ${bot.status} to ${newStatus}`)

      const updatedBot = await toggleBotStatus(botId, newStatus)

      // Update the local state with the updated bot
      setBots(bots.map((b) => (b.id === botId ? updatedBot : b)))
    } catch (error) {
      console.error("Error toggling bot status:", error)
      // Show an error notification to the user
      alert(`Failed to update bot status: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handleApiKeySave = async (config: any) => {
    setApiConfig(config)
    setIsApiKeyFormOpen(false)
    setApiConfigured(true)
    
    // Load bots after API config is saved
    await loadBots()
  }

  const handleEditBot = (bot: Bot) => {
    setSelectedBot(bot)
    setIsFormOpen(true)
  }

  const [isDemoMode, setIsDemoMode] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-mono font-bold">Virgin Fund : GenEric TraDer AI</h1>
          <p className="text-muted-foreground text-sm">Alpaca Markets Trading Bot Manager</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => router.push("/backtest")}>
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Backtest</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsApiKeyFormOpen(true)} title="API Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Add a subscription banner below the header */}
      <div className="px-4 py-2 mb-4">
        {currentTier !== "xl" && (
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-medium">
                {currentTier === "free"
                  ? "You are on the Free plan. Upgrade to enable live trading."
                  : `You are on the ${currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} plan. Using ${bots.length}/${tierLimits.maxBots} bots.`}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push("/pricing")}
              disabled={isDemoMode}
              title={isDemoMode ? "Upgrade not available in demo mode" : "Upgrade your plan"}
            >
              Upgrade Plan
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab as any} className="flex-1">
        <TabsList className="w-full justify-start border-b rounded-none px-4">
          <TabsTrigger value="dashboard">Overview</TabsTrigger>
          <TabsTrigger value="bots">Bots</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="flex-1 p-4">
          {apiConfigured && (
            <Dashboard 
              bots={bots} 
              apiConfig={apiConfig}
            />
          )}
        </TabsContent>

        <TabsContent value="bots" className="mt-0 h-full">
          {apiConfigured && (
            <div className="h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Trading Bots</h2>
                <Button
                  onClick={() => {
                    setSelectedBot(null)
                    setIsFormOpen(true)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" /> New Bot
                </Button>
              </div>
              <BotList
                bots={bots}
                onEdit={handleEditBot}
                onDelete={handleDeleteBot}
                onToggleStatus={handleToggleBotStatus}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="strategies" className="mt-0 h-full">
          {apiConfigured && (
            <div className="h-full p-4">
              <h2 className="text-xl font-semibold mb-4">Trading Strategies</h2>
              <p className="text-muted-foreground mb-4">Manage and customize your trading strategies.</p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Technical Analysis Strategies */}
                <div className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Mean Reversion</h3>
                    <Badge variant="outline" className="text-xs">
                      Popular
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Buy low, sell high based on price deviations from historical averages.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Apply to Watchlist
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Momentum Trading</h3>
                    <Badge variant="outline" className="text-xs">
                      High Risk
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Capitalize on continuing market trends and price movements.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Apply to Watchlist
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Breakout Strategy</h3>
                    <Badge variant="outline" className="text-xs">
                      Technical
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enter positions when price breaks above resistance or below support.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Apply to Watchlist
                  </Button>
                </div>

                {/* Indicator-Based Strategies */}
                <div className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">RSI Divergence</h3>
                    <Badge variant="outline" className="text-xs">
                      Indicator
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Identify potential reversals when price and RSI move in opposite directions.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Apply to Watchlist
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">MACD Crossover</h3>
                    <Badge variant="outline" className="text-xs">
                      Indicator
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Trade when the MACD line crosses above or below the signal line.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Apply to Watchlist
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Bollinger Squeeze</h3>
                    <Badge variant="outline" className="text-xs">
                      Volatility
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Identify potential breakouts when Bollinger Bands contract significantly.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Apply to Watchlist
                  </Button>
                </div>

                {/* Advanced Strategies */}
                <div className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Pairs Trading</h3>
                    <Badge variant="outline" className="text-xs">
                      Advanced
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Trade correlated securities when their price relationship deviates from historical norms.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Apply to Watchlist
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Sector Rotation</h3>
                    <Badge variant="outline" className="text-xs">
                      Macro
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Shift investments between sectors based on economic cycle phases.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Apply to Watchlist
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Options Wheel</h3>
                    <Badge variant="outline" className="text-xs">
                      Options
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Generate income by selling puts and calls on quality stocks you want to own.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Apply to Watchlist
                  </Button>
                </div>
              </div>

              {/* Watchlist Comparison Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Compare Watchlist Tickers</h3>
                <div className="border rounded-lg p-4 bg-card">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="strategy-select">Select Strategy</Label>
                      <Select defaultValue="rsi">
                        <SelectTrigger id="strategy-select">
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rsi">RSI Comparison</SelectItem>
                          <SelectItem value="macd">MACD Signals</SelectItem>
                          <SelectItem value="volume">Volume Analysis</SelectItem>
                          <SelectItem value="correlation">Correlation Matrix</SelectItem>
                          <SelectItem value="volatility">Volatility Ranking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeframe-select">Timeframe</Label>
                      <Select defaultValue="1d">
                        <SelectTrigger id="timeframe-select">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">1 Hour</SelectItem>
                          <SelectItem value="4h">4 Hours</SelectItem>
                          <SelectItem value="1d">1 Day</SelectItem>
                          <SelectItem value="1w">1 Week</SelectItem>
                          <SelectItem value="1m">1 Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button className="w-full">Compare Tickers</Button>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Your Watchlist</h4>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        Refresh
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "BTC-USD"].map((ticker) => (
                        <div key={ticker} className="flex items-center space-x-2 border rounded p-2">
                          <Checkbox id={`ticker-${ticker}`} defaultChecked />
                          <Label htmlFor={`ticker-${ticker}`} className="flex-1">
                            {ticker}
                          </Label>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 h-64 border rounded-lg bg-muted/30 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart2 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Select a strategy and click "Compare Tickers" to see analysis
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="mt-0 h-full">
          {apiConfigured && (
            <div className="h-full p-4">
              <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4 bg-card">
                  <h3 className="font-medium mb-2">Portfolio Performance</h3>
                  <div className="h-40 bg-muted rounded flex items-center justify-center">
                    Performance Chart Placeholder
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-card">
                  <h3 className="font-medium mb-2">Bot Performance</h3>
                  <div className="h-40 bg-muted rounded flex items-center justify-center">
                    Bot Performance Chart Placeholder
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-0 h-full">
          {apiConfigured && (
            <div className="h-full p-4">
              <h2 className="text-xl font-semibold mb-4">Advanced Analytics</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border rounded-lg p-4 bg-card md:col-span-2">
                  <h3 className="font-medium mb-2">Market Correlation</h3>
                  <div className="h-60 bg-muted rounded flex items-center justify-center">
                    Correlation Matrix Placeholder
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-card">
                  <h3 className="font-medium mb-2">Risk Metrics</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Sharpe Ratio</span>
                      <span>1.42</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Max Drawdown</span>
                      <span>-8.3%</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Volatility</span>
                      <span>12.7%</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Beta</span>
                      <span>0.85</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-0 h-full">
          {apiConfigured && (
            <div className="h-full p-4">
              <h2 className="text-xl font-semibold mb-4">Dashboard Settings</h2>
              <div className="space-y-6 max-w-2xl">
                <div className="border rounded-lg p-4 bg-card">
                  <h3 className="font-medium mb-4">Display Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Show real-time updates</span>
                      <div className="h-5 w-10 bg-muted rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Compact view</span>
                      <div className="h-5 w-10 bg-muted rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Show notifications</span>
                      <div className="h-5 w-10 bg-muted rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-card">
                  <h3 className="font-medium mb-4">Data Refresh Rate</h3>
                  <div className="h-5 w-full bg-muted rounded-full"></div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>5s</span>
                    <span>30s</span>
                    <span>1m</span>
                    <span>5m</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {isApiKeyFormOpen && (
        // Finally, update the ApiKeyForm component call to pass the current configuration
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <ApiKeyForm
              onSave={handleApiKeySave}
              onCancel={() => setIsApiKeyFormOpen(false)}
              currentConfig={apiConfig}
            />
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-sm z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">{selectedBot ? "Edit Bot" : "Create New Bot"}</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <BotForm
              initialBot={selectedBot}
              onSubmit={selectedBot ? handleUpdateBot : handleCreateBot}
              onCancel={() => setIsFormOpen(false)}
              presentationMode={true}
            />
          </div>
        </div>
      )}

      <footer className="p-3 border-t text-center text-xs text-muted-foreground">
        Virgin Fund : GenEric TraDer AI • Connected to Alpaca Markets • {new Date().getFullYear()}
      </footer>
    </div>
  )
}

