'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tradingClient } from '@/lib/api/apiClients';
import { queryKeys } from '@/components/ReactQueryProvider';
import { TradeBox } from '@/components/TradeBox';
import { Activity, TrendingUp, BarChart3, Clock, DollarSign } from 'lucide-react';

/**
 * Trading Page - Active Trading Interface
 */

export default function TradingPage() {
  const [historyLimit, setHistoryLimit] = useState(20);

  // Fetch open trades
  const { data: openTrades, isLoading: openTradesLoading } = useQuery({
    queryKey: queryKeys.trading.open(),
    queryFn: tradingClient.getOpenTrades,
    refetchInterval: 5000,
  });

  // Fetch trade history
  const { data: tradeHistory, isLoading: historyLoading } = useQuery({
    queryKey: queryKeys.trading.history(historyLimit, 0),
    queryFn: () => tradingClient.getTradeHistory(historyLimit, 0),
    refetchInterval: 10000,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Trading Center</h1>
          <p className="text-muted-foreground mt-1">
            Execute trades and monitor your trading activity
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Trading Interface */}
          <div className="xl:col-span-1">
            <TradeBox />
          </div>

          {/* Open Positions */}
          <div className="xl:col-span-2">
            <div className="trading-card p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Activity className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold">Open Positions</h2>
                  <p className="text-sm text-muted-foreground">
                    Monitor your active trades and positions
                  </p>
                </div>
              </div>

              {openTradesLoading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : openTrades && openTrades.length > 0 ? (
                <div className="space-y-3">
                  {openTrades.map((trade) => (
                    <div key={trade.tradeId} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          trade.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <p className="font-medium">{trade.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {trade.side.toUpperCase()} {trade.quantity} @ ${trade.price?.toFixed(2) || 'Market'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold capitalize">{trade.status}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(trade.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>No open positions</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trade History */}
        <div className="trading-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Trade History</h2>
                <p className="text-sm text-muted-foreground">
                  Recent trading activity and executed orders
                </p>
              </div>
            </div>
            <select
              value={historyLimit}
              onChange={(e) => setHistoryLimit(parseInt(e.target.value))}
              className="p-2 border border-border rounded-lg bg-background"
            >
              <option value={10}>Last 10</option>
              <option value={20}>Last 20</option>
              <option value={50}>Last 50</option>
            </select>
          </div>

          {historyLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : tradeHistory?.trades && tradeHistory.trades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="text-left">
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Symbol</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Side</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Quantity</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Value</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Time</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {tradeHistory.trades.map((trade) => (
                    <tr key={trade.tradeId} className="border-b border-border/50">
                      <td className="py-3 font-medium">{trade.symbol}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trade.side === 'buy' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.side.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3">{trade.quantity}</td>
                      <td className="py-3">${trade.executedPrice.toFixed(2)}</td>
                      <td className="py-3">${(trade.quantity * trade.executedPrice).toLocaleString()}</td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {new Date(trade.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trade.status === 'executed' 
                            ? 'bg-green-100 text-green-800' 
                            : trade.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {trade.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4" />
              <p>No trade history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}