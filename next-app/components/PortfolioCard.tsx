'use client';

import { Portfolio } from '@/lib/schemas/schemas';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

/**
 * Portfolio Overview Card Component
 * Displays current portfolio status, positions, and performance metrics
 */

interface PortfolioCardProps {
  portfolio?: Portfolio;
  isLoading?: boolean;
}

export function PortfolioCard({ portfolio, isLoading }: PortfolioCardProps) {
  if (isLoading) {
    return <PortfolioCardSkeleton />;
  }

  if (!portfolio) {
    return (
      <div className="trading-card p-6">
        <div className="text-center py-8">
          <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Portfolio Unavailable</h3>
          <p className="text-muted-foreground">Unable to load portfolio data</p>
        </div>
      </div>
    );
  }

  const isPositiveDay = portfolio.dayChange > 0;
  const totalPositions = portfolio.positions.length;
  const totalValue = portfolio.totalValue;

  return (
    <div className="trading-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Portfolio Overview</h2>
          <p className="text-sm text-muted-foreground">
            {totalPositions} position{totalPositions !== 1 ? 's' : ''} • Updated now
          </p>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
          isPositiveDay 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {isPositiveDay ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>{isPositiveDay ? '+' : ''}{portfolio.dayChangePercent.toFixed(2)}%</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-5 w-5 text-primary mr-1" />
            <span className="text-sm font-medium text-muted-foreground">Total Value</span>
          </div>
          <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
        </div>

        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Activity className="h-5 w-5 text-primary mr-1" />
            <span className="text-sm font-medium text-muted-foreground">Day Change</span>
          </div>
          <p className={`text-2xl font-bold ${isPositiveDay ? 'positive-trend' : 'negative-trend'}`}>
            {isPositiveDay ? '+' : ''}${portfolio.dayChange.toLocaleString()}
          </p>
        </div>

        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-primary mr-1" />
            <span className="text-sm font-medium text-muted-foreground">Total Return</span>
          </div>
          <p className="text-2xl font-bold positive-trend">
            {portfolio.performance.totalReturnPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Top Positions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Top Positions</h3>
        <div className="space-y-3">
          {portfolio.positions.slice(0, 3).map((position, index) => (
            <div
              key={position.symbol}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {position.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{position.symbol}</p>
                  <p className="text-sm text-muted-foreground">
                    {position.shares} shares @ ${position.avgPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold">${position.marketValue.toLocaleString()}</p>
                <p className={`text-sm ${
                  position.unrealizedPnL >= 0 ? 'positive-trend' : 'negative-trend'
                }`}>
                  {position.unrealizedPnL >= 0 ? '+' : ''}${position.unrealizedPnL.toFixed(2)}
                  ({position.unrealizedPnLPercent.toFixed(2)}%)
                </p>
              </div>
            </div>
          ))}
        </div>

        {totalPositions > 3 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-primary hover:underline">
              View all {totalPositions} positions →
            </button>
          </div>
        )}
      </div>

      {/* Cash Balance */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Cash Balance</span>
          <span className="font-semibold">${portfolio.cashBalance.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for PortfolioCard
 */
function PortfolioCardSkeleton() {
  return (
    <div className="trading-card p-6">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded-full w-20"></div>
        </div>

        {/* Metrics skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16 mx-auto"></div>
            </div>
          ))}
        </div>

        {/* Positions skeleton */}
        <div>
          <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}