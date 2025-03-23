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

  const handleCreateBot = async (botData: Partial<Bot>) => {
    try {
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

  const handleApiKeySave = async () => {
    setIsApiKeyFormOpen(false)
    setApiConfigured(true)
    loadBots()
  }

  const handleEditBot = (bot: Bot) => {
    setSelectedBot(bot)
    setIsFormOpen(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-mono font-bold">OctoBot Dashboard</h1>
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

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "dashboard" | "bots" | "strategies" | "performance" | "analytics" | "settings")
        }
        className="flex-1 flex flex-col"
      >
        <div className="border-b px-4">
          <TabsList className="h-10 flex-wrap">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="bots"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Bots
            </TabsTrigger>
            <TabsTrigger
              value="strategies"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Strategies
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          {!apiConfigured && (
            <div className="text-center p-8 border rounded-lg bg-card">
              <p className="mb-4">Please configure your Alpaca API keys to get started.</p>
              <Button onClick={() => setIsApiKeyFormOpen(true)}>Configure API</Button>
            </div>
          )}

          <TabsContent value="dashboard" className="mt-0 h-full">
            {apiConfigured && <Dashboard bots={bots} apiConfig={apiConfig} />}
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
                  <div className="border rounded-lg p-4 bg-card">
                    <h3 className="font-medium mb-2">Mean Reversion</h3>
                    <p className="text-sm text-muted-foreground">
                      Buy low, sell high based on price deviations from historical averages.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 bg-card">
                    <h3 className="font-medium mb-2">Momentum Trading</h3>
                    <p className="text-sm text-muted-foreground">
                      Capitalize on continuing market trends and price movements.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 bg-card">
                    <h3 className="font-medium mb-2">Breakout Strategy</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter positions when price breaks above resistance or below support.
                    </p>
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
        </div>
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
        OctoBot Trading System • Connected to Alpaca Markets • {new Date().getFullYear()}
      </footer>
    </div>
  )
}

