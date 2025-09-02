'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { portfolioClient } from '@/lib/api/apiClients';
import { queryKeys, queryOptions } from '@/components/ReactQueryProvider';
import { PortfolioCard } from '@/components/PortfolioCard';
import { HeatmapWidget } from '@/components/HeatmapWidget';
import { AgentPanel } from '@/components/AgentPanel';
import { TradeBox } from '@/components/TradeBox';
import { Activity, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';

/**
 * Main Dashboard Page - Trading Agent Overview
 * 
 * Features:
 * - Real-time portfolio overview
 * - Market heatmap visualization
 * - Agent status and quick actions
 * - Recent trades and positions
 * - Performance metrics
 */
export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering for dynamic data
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch portfolio data with real-time updates
  const { 
    data: portfolio, 
    isLoading: portfolioLoading, 
    error: portfolioError 
  } = useQuery({
    queryKey: queryKeys.portfolio.status(),
    queryFn: portfolioClient.getPortfolio,
    ...queryOptions.portfolio,
    enabled: isClient,
  });

  // Fetch heatmap data
  const { 
    data: heatmapData, 
    isLoading: heatmapLoading 
  } = useQuery({
    queryKey: queryKeys.portfolio.heatmap(),
    queryFn: portfolioClient.getHeatmap,
    ...queryOptions.portfolio,
    enabled: isClient,
  });

  if (!isClient) {
    return <DashboardSkeleton />;
  }

  if (portfolioError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load dashboard</h2>
          <p className="text-muted-foreground mb-4">
            Unable to connect to the trading backend
          </p>
          <p className="text-sm text-muted-foreground">
            Make sure the Bun server is running on port 3001
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Trading Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Monitor your portfolio and manage trading agents
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Portfolio Overview - Spans 2 columns */}
          <div className="lg:col-span-2">
            <PortfolioCard 
              portfolio={portfolio} 
              isLoading={portfolioLoading} 
            />
          </div>

          {/* Agent Panel */}
          <div>
            <AgentPanel />
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Market Heatmap */}
          <div>
            <HeatmapWidget 
              data={heatmapData} 
              isLoading={heatmapLoading} 
            />
          </div>

          {/* Quick Trade Box */}
          <div>
            <TradeBox />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Value"
            value={portfolio?.totalValue ? `$${portfolio.totalValue.toLocaleString()}` : '--'}
            change={portfolio?.dayChange}
            changePercent={portfolio?.dayChangePercent}
            icon={TrendingUp}
            loading={portfolioLoading}
          />
          <StatCard
            title="Positions"
            value={portfolio?.positions?.length.toString() || '--'}
            icon={BarChart3}
            loading={portfolioLoading}
          />
          <StatCard
            title="Day P&L"
            value={portfolio?.dayChange ? `$${portfolio.dayChange.toLocaleString()}` : '--'}
            change={portfolio?.dayChange}
            changePercent={portfolio?.dayChangePercent}
            icon={Activity}
            loading={portfolioLoading}
          />
          <StatCard
            title="Cash"
            value={portfolio?.cashBalance ? `$${portfolio.cashBalance.toLocaleString()}` : '--'}
            icon={Activity}
            loading={portfolioLoading}
          />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Trading Agent Dashboard v1.0.0</p>
          <p>Connected to Bun Backend • Real-time updates enabled</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Stat Card Component
 */
interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  changePercent?: number;
  icon: any;
  loading?: boolean;
}

function StatCard({ title, value, change, changePercent, icon: Icon, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="metric-card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {(change !== undefined && changePercent !== undefined) && (
            <p className={`text-sm ${isPositive ? 'positive-trend' : isNegative ? 'negative-trend' : 'neutral-trend'}`}>
              {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
            </p>
          )}
        </div>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
    </div>
  );
}

/**
 * Loading Skeleton
 */
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}