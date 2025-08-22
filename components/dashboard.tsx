"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { EnhancedDashboard } from "@/components/enhanced-dashboard";
import { BasicDashboard } from "@/components/basic-dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { fetchPortfolio } from "@/lib/api";
import type { Bot } from "@/types/bot";
import type { Portfolio } from "@/types/portfolio";
import type { Position } from "@/lib/utils/positions";
import { PORTFOLIO_SCENARIOS, ScenarioKey } from "@/lib/portfolio-scenarios";

interface DashboardProps {
  bots: Bot[];
  apiConfig?: {
    keyId: string;
    secretKey: string;
    baseUrl: string;
    isPaper: boolean;
  } | null;
}

interface EnhancedDashboardProps {
  apiConfig?: {
    keyId: string;
    secretKey: string;
    baseUrl: string;
    isPaper: boolean;
  } | null;
  onBotAction: (botId: string, action: 'start' | 'stop' | 'delete') => Promise<void>;
  isLoading: boolean;
  portfolio?: {
    positions: Position[];
    totalValue: number;
    cashBalance: number;
  };
  scenarios?: typeof PORTFOLIO_SCENARIOS;
  selectedScenario?: ScenarioKey | null;
  onScenarioSelect?: (scenario: ScenarioKey | null) => void;
}

export function Dashboard({ bots, apiConfig }: DashboardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string[]>([]);
  const [dashboardMode, setDashboardMode] = useState<'basic' | 'enhanced'>('enhanced');
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey | null>(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await fetchPortfolio();
        setPortfolio(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load portfolio data",
          variant: "destructive",
        });
      }
    };

    loadPortfolio();
  }, [toast]);

  const handleBotAction = async (botId: string, action: 'start' | 'stop' | 'delete') => {
    setLoading(prev => [...prev, botId]);
    try {
      const response = await fetch(`/api/bots/${botId}/${action}`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to perform bot action');

      toast({
        title: 'Success',
        description: `Bot action ${action} completed successfully`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Error',
        description: `Failed to perform bot action: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => prev.filter(id => id !== botId));
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Manage your trading bots, portfolios, and strategies." />
      <Card className="mb-4">
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Dashboard Mode:</span>
              <Badge className="outline">
                {dashboardMode === 'enhanced' ? 'Enhanced' : 'Basic'}
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDashboardMode(mode => mode === 'enhanced' ? 'basic' : 'enhanced')}
            >
              Switch View
            </Button>
          </div>
        </CardContent>
      </Card>

      {dashboardMode === 'enhanced' ? (
        <EnhancedDashboard 
          apiConfig={apiConfig}
          onBotAction={handleBotAction}
          isLoading={loading.length > 0}
          portfolio={portfolio ? {
            positions: portfolio.positions.map(pos => ({
              symbol: pos.symbol, // Ensure this property is mapped
              value: pos.value, // Ensure this property is mapped
              pnl: pos.pnl, // Ensure this property is mapped
              pnlPercentage: pos.pnlPercentage, // Ensure this property is mapped
              quantity: pos.quantity, // Ensure this property is mapped
              avgPrice: pos.avgPrice, // Ensure this property is mapped
              currentPrice: pos.currentPrice, // Ensure this property is mapped
            })),
            totalValue: portfolio.value,
            cashBalance: portfolio.value - portfolio.positions.reduce((sum, pos) => sum + pos.value, 0),
          } : undefined}
          scenarios={PORTFOLIO_SCENARIOS}
          selectedScenario={selectedScenario}
          onScenarioSelect={setSelectedScenario}
        />
      ) : (
        <BasicDashboard onBotAction={function (botId: string, action: "start" | "stop" | "delete"): Promise<void> {
            throw new Error("Function not implemented.");
          } } isLoading={false} />
      )}
    </DashboardShell>
  );
}

