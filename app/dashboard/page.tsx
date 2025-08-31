"use client"
import { useToast } from '@/hooks/use-toast'
// import React from 'react'
import DashboardApp from '@/components/DashboardApp'

// export default function DashboardPage() {
//   return <DashboardApp />
// }
// "use client"

import React, { useState, useEffect } from "react"
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
import { StrategySidebar } from "@/components/StrategySidebar";
import { StrategyPanel } from "@/components/StrategyPanel";
import { StrategyBuilder } from "@/components/strategy-builder"
import { LayoutToggle } from '@/components/layout/LayoutToggle'

const strategies = [
  '1% Grid',
  'Momentum',
  'RSI',
  'Overbought/Oversold',
  'Mean Reversion',
  'Trend Following',
  'Arbitrage',
];

export default function DashboardPage() {
  const [bots, setBots] = useState<Bot[]>([])
  const [isLoading, setIsLoading] = useState(false)
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
  const { toast } = useToast()

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
          void loadBots()
        }
      } catch (error) {
        console.error("Error checking API configuration:", error)
      }
    }

    checkApiConfig()
  }, [])

  const loadBots = async () => {
    setIsLoading(true)
    try {
      const botData = await fetchBots()
      setBots(botData)
    } catch (error) {
  console.error("Error loading bots:", error)
  toast({ title: 'Error', description: `Could not load bots: ${error instanceof Error ? error.message : String(error)}` })
    } finally {
      setIsLoading(false)
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
    toast({ title: 'Bot created', description: `${newBot.name || 'New bot'} created successfully` })
    setIsFormOpen(false)
    } catch (error) {
  console.error("Error creating bot:", error)
  toast({ title: 'Error', description: `Failed to create bot: ${error instanceof Error ? error.message : String(error)}` })
    }
  }

  const handleUpdateBot = async (bot: Bot) => {
    try {
      const updatedBot = await updateBot(bot)
    setBots(bots.map((b) => (b.id === bot.id ? updatedBot : b)))
    setSelectedBot(null)
    toast({ title: 'Bot updated', description: `${updatedBot.name || 'Bot'} updated` })
    setIsFormOpen(false)
    } catch (error) {
  console.error("Error updating bot:", error)
  toast({ title: 'Error', description: `Failed to update bot: ${error instanceof Error ? error.message : String(error)}` })
    }
  }

  const handleDeleteBot = async (botId: string) => {
    try {
      await deleteBot(botId)
    setBots(bots.filter((bot) => bot.id !== botId))
    toast({ title: 'Bot deleted', description: 'Bot removed successfully' })
    } catch (error) {
  console.error("Error deleting bot:", error)
  toast({ title: 'Error', description: `Failed to delete bot: ${error instanceof Error ? error.message : String(error)}` })
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
  toast({ title: 'Error', description: `Failed to update bot status: ${error instanceof Error ? error.message : 'Unknown error'}` })
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
  const [selectedStrategy, setSelectedStrategy] = useState<string>(strategies[0]);
  // Layout toggle: show/hide sidebar (persist in localStorage)
  const [useSidebar, setUseSidebar] = useState<boolean>(() => {
    try {
      const v = typeof window !== 'undefined' ? localStorage.getItem('dashboardUseSidebar') : null
      return v === null ? true : v === '1'
    } catch (e) {
      return true
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('dashboardUseSidebar', useSidebar ? '1' : '0')
    } catch (e) {
      /* ignore */
    }
  }, [useSidebar])

  // Analytics placeholder used by the tabs
  function DashboardPageAnalyticsPlaceholder() {
    return (
      <div>
        <h2 className="text-xl font-semibold">Platform Analytics (Preview)</h2>
        <p className="text-sm text-muted-foreground">Overview of system health, API usage, and bot performance trends.</p>
      </div>
    )
  }

  // Small File menu used in desktop layout
  const FileMenu = () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="relative">
        <button data-testid="filemenu-button" onClick={() => setOpen(!open)} className="px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800">
          File
        </button>
        {open && (
          <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
            <ul className="py-1">
              <li>
                <button onClick={() => { setIsFormOpen(true); setSelectedBot(null); setActiveTab('bots'); setIsFormOpen(true); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">New Bot</button>
              </li>
              <li>
                <button onClick={() => router.push('/calculators')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Calculators</button>
              </li>
              <li>
                <button onClick={() => router.push('/backtest')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Backtest</button>
              </li>
              <li>
                <button onClick={() => router.push('/bots')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Manage Bots</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-mono font-bold">Virgin Fund : GenEric TraDer AI</h1>
          <p className="text-muted-foreground text-sm">Alpaca Markets Trading Bot Manager</p>
          <div className="mt-2 flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Sidebar</label>
            <input
              type="checkbox"
              checked={useSidebar}
              onChange={(e) => setUseSidebar(e.target.checked)}
              aria-label="Toggle sidebar layout"
            />
            <div className="ml-4">
              <LayoutToggle />
            </div>
          </div>
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

      <div className="px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <FileMenu />
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-2 rounded ${activeTab === 'dashboard' ? 'bg-slate-200' : ''}`}>Dashboard</button>
            <button onClick={() => setActiveTab('bots')} className={`px-3 py-2 rounded ${activeTab === 'bots' ? 'bg-slate-200' : ''}`}>Bots</button>
            <button onClick={() => setActiveTab('strategies')} className={`px-3 py-2 rounded ${activeTab === 'strategies' ? 'bg-slate-200' : ''}`}>Strategies</button>
            <button onClick={() => setActiveTab('performance')} className={`px-3 py-2 rounded ${activeTab === 'performance' ? 'bg-slate-200' : ''}`}>Performance</button>
            <button onClick={() => setActiveTab('analytics')} className={`px-3 py-2 rounded ${activeTab === 'analytics' ? 'bg-slate-200' : ''}`}>Analytics</button>
            <button onClick={() => setActiveTab('settings')} className={`px-3 py-2 rounded ${activeTab === 'settings' ? 'bg-slate-200' : ''}`}>Settings</button>
          </div>
        </div>

        <div style={{ display: 'flex', height: '70vh' }}>
          {useSidebar && (
            <StrategySidebar
              strategies={strategies}
              selected={selectedStrategy}
              onSelect={setSelectedStrategy}
            />
          )}

          <main style={{ flex: 1, padding: 24 }}>
            {activeTab === 'dashboard' && <StrategyPanel strategy={selectedStrategy} />}

            {activeTab === 'bots' && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Bots</h2>
                  <div className="flex gap-2">
                    <Button onClick={() => { setSelectedBot(null); setIsFormOpen(true); }}>New Bot</Button>
                    <Button variant="outline" onClick={() => void loadBots()} title="Refresh"> <RefreshCw className="h-4 w-4" /> </Button>
                  </div>
                </div>
                <div>
                  <BotList
                    bots={bots}
                    onEdit={(b) => { setSelectedBot(b); setIsFormOpen(true) }}
                    onDelete={handleDeleteBot}
                    onToggleStatus={handleToggleBotStatus}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}

      {activeTab === 'strategies' && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Strategy Builder</h2>
        <StrategyBuilder onSave={(data: any) => void handleCreateBot(data)} availableAssets={["AAPL","MSFT","GOOGL","AMZN","TSLA","BTC-USD","ETH-USD","SPY"]} />
              </div>
            )}

            {activeTab === 'performance' && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Backtesting & Performance</h2>
                <div className="p-4 border rounded bg-card">Run in-depth backtests in the Backtest studio or view saved results.</div>
                <div className="mt-3">
                  <Button onClick={() => router.push('/backtest')}>Open Backtest Studio</Button>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && <DashboardPageAnalyticsPlaceholder />}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Account & API Settings</h2>
                <p className="text-sm text-muted-foreground mb-3">Manage your Alpaca API keys and account preferences.</p>
                <Button onClick={() => setIsApiKeyFormOpen(true)}>Open API Settings</Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {isApiKeyFormOpen && (
        // Finally, update the ApiKeyForm component call to pass the current configuration
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <ApiKeyForm
              onSave={() => {
                // ApiKeyForm's documented onSave has no args; adapt by closing modal and refreshing
                setIsApiKeyFormOpen(false)
                setApiConfigured(true)
                // reload bots after keys saved
                void loadBots()
              }}
              onCancel={() => setIsApiKeyFormOpen(false)}
              currentConfig={apiConfig ?? undefined}
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

