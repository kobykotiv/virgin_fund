"use client"

import * as React from "react"
import { AddBotForm, Grid } from "@/components"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import { LiveTicker } from "@/components/live-ticker"
import { AlpacaConfig } from "@/lib/alpaca-client"; // Assuming AlpacaConfig type is exported

const Home: React.FC = () => {
  const [bots, setBots] = React.useState<any[]>([]); // Initialize with empty array or fetch initial bots
  const [apiConfig, setApiConfig] = React.useState<AlpacaConfig | null>(null); // State for API config
  const [isLoadingConfig, setIsLoadingConfig] = React.useState(true);

  // TODO: Fetch or retrieve API config securely, e.g., from context or API route
  React.useEffect(() => {
    // Placeholder: Replace with actual logic to get API config
    const fetchConfig = async () => {
      try {
        // Example: Fetch from an API route '/api/user/config'
        // const response = await fetch('/api/user/config');
        // if (!response.ok) throw new Error('Failed to fetch config');
        // const config = await response.json();
        // setApiConfig(config);

        // For now, using placeholder or null
        setApiConfig(null); // Or set mock data if needed for development
      } catch (error) {
        console.error("Error fetching API config:", error);
        setApiConfig(null); // Ensure it's null on error
      } finally {
        setIsLoadingConfig(false);
      }
    };

    fetchConfig();
  }, []);

  // TODO: Fetch initial bots list
  React.useEffect(() => {
    // Placeholder: Fetch bots associated with the user
    const fetchBots = async () => {
      // Example: Fetch from '/api/bots'
      // const response = await fetch('/api/bots');
      // const userBots = await response.json();
      // setBots(userBots);
      setBots([ // Using placeholder data for now
        { id: '1', name: "Bot 1", description: "This is bot 1", status: 'paused' },
        { id: '2', name: "Bot 2", description: "This is bot 2", status: 'active' },
      ]);
    };
    fetchBots();
  }, []);
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
      {isLoadingConfig ? (
        <div>Loading configuration...</div>
      ) : (
        <EnhancedDashboard
          apiConfig={apiConfig} // Pass the state variable
          onBotAction={async (botId, action) => {
            // Handle bot actions (start/stop/delete)
            // TODO: Replace state update with API calls to backend
            const bot = bots.find(b => b.id === botId);
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
      // Pass isLoading state based on config loading and potentially portfolio loading
      isLoading={isLoadingConfig /* || isLoadingPortfolio */}
      portfolio={{ // Placeholder portfolio data
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
        console.log("Selected bot:", bot);
        // Handle bot selection logic
      }}
      onBotCreate={async (botData) => {
        // TODO: Replace with API call to create bot
        console.log("Creating bot:", botData);
        const newBot = {
          id: Date.now().toString(), // Use proper ID generation
          ...botData,
          status: 'paused',
          performance: { // Placeholder performance data
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
      onBotUpdate={async (botId, updates) => {
        // TODO: Replace with API call to update bot
        console.log("Updating bot:", botId, updates);
        setBots(bots.map(b =>
          b.id === botId ? { ...b, ...updates } : b
        ));
      }}
      onBotDelete={async (botId) => {
        // TODO: Replace with API call to delete bot
        console.log("Deleting bot:", botId);
        setBots(bots.filter(b => b.id !== botId));
      }}
      />
      )}

      {/* Bot Creation Dialog - Consider moving inside EnhancedDashboard or managing visibility */}
      <AddBotForm
        onSubmit={handleSubmit} // This likely needs adjustment - should call onBotCreate prop
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
      // Extract symbols from bots for the ticker
      symbols={bots.reduce((acc, bot) => {
        // Assuming bot settings contain symbol or assets array
        const botSymbols = bot.settings?.symbol ? [bot.settings.symbol] : (bot.settings?.assets || []);
        return [...acc, ...botSymbols];
      }, [] as string[])}
      refreshInterval={15000}
      />
    </div>
  )
}

export default Home
