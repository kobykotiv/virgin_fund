"use client";

import React, { useEffect, useState } from 'react';
import { AggregatedPortfolioPosition } from '@/types/database';

interface PortfolioSummary {
  totalBots: number;
  totalPositions: number;
  totalMarketValue: number;
  totalUnrealizedPnl: number;
  totalRealizedPnl: number;
}

interface PortfolioResponse {
  aggregated: AggregatedPortfolioPosition[];
  summary: PortfolioSummary;
  bots: Array<{
    id: string;
    name: string;
    status: string;
    capital_allocated: number;
    total_pnl: number;
    positions_count: number;
    active_orders_count: number;
  }>;
}

export default function PortfolioOverview() {
  const [portfolioData, setPortfolioData] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch aggregated portfolio data from the new API
        const response = await fetch('/v1/portfolio/aggregate', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // TODO: Add auth header when authentication is implemented
            'x-user-id': 'demo-user' // Demo mode
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: PortfolioResponse = await response.json();
        setPortfolioData(data);

      } catch (err) {
        console.error('Error loading portfolio data:', err);
        setError('Failed to load portfolio data');
        
        // Fallback to demo data that matches the new schema
        setPortfolioData({
          aggregated: [
            {
              symbol: 'AAPL',
              totalShares: 150,
              totalMarketValue: 26250.00,
              totalUnrealizedPnl: 1250.00,
              totalRealizedPnl: 500.00,
              controllingBots: [
                { id: '1', name: 'Growth Bot', shares: 100, marketValue: 17500.00 },
                { id: '2', name: 'Value Bot', shares: 50, marketValue: 8750.00 }
              ],
              positions: [
                { botId: '1', positionId: 'pos1', shares: 100, avgPrice: 170.00, marketValue: 17500.00, unrealizedPnl: 800.00 },
                { botId: '2', positionId: 'pos2', shares: 50, avgPrice: 165.00, marketValue: 8750.00, unrealizedPnl: 450.00 }
              ]
            },
            {
              symbol: 'TSLA',
              totalShares: 75,
              totalMarketValue: 15750.00,
              totalUnrealizedPnl: -500.00,
              totalRealizedPnl: 200.00,
              controllingBots: [
                { id: '1', name: 'Growth Bot', shares: 75, marketValue: 15750.00 }
              ],
              positions: [
                { botId: '1', positionId: 'pos3', shares: 75, avgPrice: 220.00, marketValue: 15750.00, unrealizedPnl: -500.00 }
              ]
            }
          ],
          summary: {
            totalBots: 2,
            totalPositions: 3,
            totalMarketValue: 42000.00,
            totalUnrealizedPnl: 750.00,
            totalRealizedPnl: 700.00
          },
          bots: [
            { id: '1', name: 'Growth Bot', status: 'active', capital_allocated: 25000, total_pnl: 800, positions_count: 2, active_orders_count: 1 },
            { id: '2', name: 'Value Bot', status: 'active', capital_allocated: 15000, total_pnl: 450, positions_count: 1, active_orders_count: 0 }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadPortfolioData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPnLClass = (pnl: number) => {
    if (pnl > 0) return 'text-green-600';
    if (pnl < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Portfolio Overview</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Portfolio Overview</h3>
        <div className="text-red-600">{error || 'No portfolio data available'}</div>
      </div>
    );
  }

  const { aggregated, summary, bots } = portfolioData;

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Portfolio Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{summary.totalBots}</div>
            <div className="text-sm text-gray-600">Active Bots</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{summary.totalPositions}</div>
            <div className="text-sm text-gray-600">Positions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalMarketValue)}</div>
            <div className="text-sm text-gray-600">Market Value</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${formatPnLClass(summary.totalUnrealizedPnl)}`}>
              {formatCurrency(summary.totalUnrealizedPnl)}
            </div>
            <div className="text-sm text-gray-600">Unrealized P&L</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${formatPnLClass(summary.totalRealizedPnl)}`}>
              {formatCurrency(summary.totalRealizedPnl)}
            </div>
            <div className="text-sm text-gray-600">Realized P&L</div>
          </div>
        </div>
      </div>

      {/* Bot Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Bot Performance</h3>
        <div className="space-y-3">
          {bots.map((bot) => (
            <div key={bot.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">{bot.name}</h4>
                <div className="text-sm text-gray-600">
                  {bot.positions_count} positions • {bot.active_orders_count} active orders
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${formatPnLClass(bot.total_pnl)}`}>
                  {formatCurrency(bot.total_pnl)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(bot.capital_allocated)} allocated
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Position Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Position Holdings</h3>
        
        {aggregated.length === 0 ? (
          <p className="text-gray-600">No positions found across your bots.</p>
        ) : (
          <div className="space-y-4">
            {aggregated.map((position) => (
              <div key={position.symbol} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-lg">{position.symbol}</h4>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(position.totalMarketValue)}</div>
                    <div className="text-sm text-gray-600">{position.totalShares} shares</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className={`text-sm font-medium ${formatPnLClass(position.totalUnrealizedPnl)}`}>
                      Unrealized: {formatCurrency(position.totalUnrealizedPnl)}
                    </div>
                    <div className={`text-sm font-medium ${formatPnLClass(position.totalRealizedPnl)}`}>
                      Realized: {formatCurrency(position.totalRealizedPnl)}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600 mb-2">Controlled by:</p>
                  <div className="space-y-1">
                    {position.controllingBots.map((bot) => (
                      <div key={bot.id} className="flex justify-between text-sm">
                        <span>{bot.name}</span>
                        <span>{bot.shares} shares • {formatCurrency(bot.marketValue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
