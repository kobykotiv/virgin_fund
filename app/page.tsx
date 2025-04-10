"use client"

import * as React from "react"
import { AddBotForm, Grid } from "@/components"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import { LiveTicker } from "@/components/live-ticker"

const Home: React.FC = () => {
  const [bots, setBots] = React.useState([
    { name: "Bot 1", description: "This is bot 1" },
    { name: "Bot 2", description: "This is bot 2" },
    // Add more bots as needed
  ])

  const handleSubmit = (formData: any) => {
    setBots([...bots, formData])
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Trading Bots Dashboard</h1>
        <p className="text-muted-foreground">Create and manage your automated trading strategies</p>
      </div>
      </div>

      {/* Main Dashboard */}
      <EnhancedDashboard
      apiConfig={apiConfig}
      onBotAction={async (botId, action) => {
        // Handle bot actions (start/stop/delete)
        const bot = bots.find(b => b.id === botId)
        if (bot) {
        switch (action) {
          case 'start':
          setBots(bots.map(b => 
            b.id === botId ? {...b, status: 'active'} : b
          ))
          break
          case 'stop':
          setBots(bots.map(b =>
            b.id === botId ? {...b, status: 'paused'} : b
          ))
          break
          case 'delete':
          setBots(bots.filter(b => b.id !== botId))
          break
        }
        }
      }}
      isLoading={false}
      portfolio={{
        positions: [],
        totalValue: 0,
        cashBalance: 0
      }}
      scenarios={[]}
      selectedScenario={null}
      onScenarioSelect={() => {}}
      managedBots={bots}
      selectedBot={null}
      onBotSelect={(bot) => {
        // Handle bot selection
      }}
      onBotCreate={(botData) => {
        const newBot = {
        id: Date.now().toString(),
        ...botData,
        status: 'paused',
        performance: {
          totalValue: 0,
          totalPnL: 0,
          pnlPercentage: 0,
          totalTrades: 0,
          winRate: 0,
          lastUpdated: new Date().toISOString()
        }
        }
        setBots([...bots, newBot])
      }}
      onBotUpdate={(botId, updates) => {
        setBots(bots.map(b => 
        b.id === botId ? {...b, ...updates} : b
        ))
      }}
      onBotDelete={(botId) => {
        setBots(bots.filter(b => b.id !== botId))
      }}
      />

      {/* Bot Creation Dialog */}
      <AddBotForm 
      onSubmit={handleSubmit}
      availableAssets={[
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA',
        'BTC/USD', 'ETH/USD', 'SOL/USD'
      ]}
      botTypes={[
        { value: "grid", label: "Grid Trading" },
        { value: "dca", label: "DCA" },
        { value: "indicator", label: "Indicator" },
        { value: "basket", label: "Basket" },
      ]}
      />

      {/* Live Market Data Ticker */}
      <LiveTicker 
      symbols={bots.flatMap(bot => bot.assets || [])}
      refreshInterval={15000}
      />
    </div>
  )
}

export default Home

