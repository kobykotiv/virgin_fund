"use client";

import * as React from "react";
import { EnhancedDashboard } from "@/components/enhanced-dashboard";
import { LiveTicker } from "@/components/live-ticker";
import { AlpacaConfig } from "@/lib/alpaca-client";
import BotForm from "@/components/bot-form"; // Corrected import
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Portfolio {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  positions: any[];
  totalValue: number;
  cashBalance: number;
}

const Home: React.FC = () => {
  const [bots, setBots] = useState<any[]>([]);
  const [apiConfig, setApiConfig] = useState<AlpacaConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoadingConfig(true);
      try {
        setApiConfig(null); // Placeholder
      } catch (error) {
        console.error("Error fetching API config:", error);
        setApiConfig(null);
      } finally {
        setIsLoadingConfig(false);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchBots = async () => {
      setBots([
        { id: '1', name: "Bot 1", description: "This is bot 1", status: 'paused' },
        { id: '2', name: "Bot 2", description: "This is bot 2", status: 'active' },
      ]);
    };
    fetchBots();
  }, []);

  const handleFormSubmit = (formData: any) => {
    setBots([...bots, formData]);
    setShowForm(false); // Close the form after submission
  };

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
      {/* {isLoadingConfig ? (
        <div>Loading configuration...</div>
      ) : (
        // Commenting out EnhancedDashboard and AddBotForm for now to focus on core bot management
        <>
          <div>Dashboard Content (Commented Out)</div>
          {/* <EnhancedDashboard
            apiConfig={apiConfig ? {
                keyId: apiConfig.apiKey,
                secretKey: apiConfig.secretKey,
                baseUrl: apiConfig.isPaper ? "https://paper-api.alpaca.markets" : "https://api.alpaca.markets",
                isPaper: apiConfig.isPaper
              } : undefined}
            onBotAction={async (botId, action) => {
              setBots(bots.map(b =>
                b.id === botId ? { ...b, status: action === 'start' ? 'active' : 'paused' } : b
              ));
            }}
            isLoading={isLoadingConfig}
            portfolio={{
              id: 'placeholder-id',
              name: 'Placeholder Portfolio',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              userId: 'placeholder-user',
              positions: [],
              totalValue: 0,
              cashBalance: 0
            }}
            scenarios={[]}
            selectedScenario={null}
            onScenarioSelect={() => { }}
            managedBots={bots}
            selectedBot={null}
            onBotSelect={() => { }}
            onBotCreate={async (botData) => {
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
              };
              setBots([...bots, newBot]);
            }}
            onBotUpdate={async (botId, updates) => {
              setBots(bots.map(b =>
                b.id === botId ? { ...b, ...updates } : b
              ));
            }}
            onBotDelete={async (botId) => {
              setBots(bots.filter(b => b.id !== botId));
            }}
            onAddBot={() => setShowForm(true)} // Show the form when Add Bot is clicked
          />
          <AddBotForm
            onCancel={() => setShowForm(false)}
            onSuccess={handleFormSubmit}
          />
        </>}
      )} */}

      {/* Live Market Data Ticker */}
      <LiveTicker
        symbols={bots.reduce((acc, bot) => {
          const botSymbols = bot.settings?.symbol ? [bot.settings.symbol] : (bot.settings?.assets || []);
          return [...acc, ...botSymbols];
        }, [] as string[])}
        refreshInterval={15000}
      />
    </div>
  );
}
