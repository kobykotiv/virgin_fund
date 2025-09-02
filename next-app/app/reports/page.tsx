'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsClient } from '@/lib/api/apiClients';
import { FileText, Download, TrendingUp, BarChart3, DollarSign, Activity } from 'lucide-react';

/**
 * Reports Page - Portfolio Analytics & Performance Reports
 */

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [exportFormat, setExportFormat] = useState('csv');

  // Fetch P&L report
  const { data: pnlReport, isLoading: pnlLoading } = useQuery({
    queryKey: ['reports', 'pnl', selectedPeriod],
    queryFn: () => reportsClient.getPnLReport(selectedPeriod),
  });

  // Fetch metrics report
  const { data: metricsReport, isLoading: metricsLoading } = useQuery({
    queryKey: ['reports', 'metrics'],
    queryFn: reportsClient.getMetrics,
  });

  const handleExport = async () => {
    try {
      const result = await reportsClient.exportData(exportFormat);
      window.open(result.exportUrl, '_blank');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Performance Reports</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive portfolio analytics and performance metrics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 3 Months</option>
                <option value="1y">Last Year</option>
              </select>
              
              {/* Export Button */}
              <div className="flex items-center space-x-2">
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="p-2 border border-border rounded-lg bg-background"
                >
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                  <option value="xlsx">Excel</option>
                </select>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* P&L Report */}
        <div className="mb-8">
          <div className="trading-card p-6">
            <div className="flex items-center space-x-2 mb-6">
              <DollarSign className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Profit & Loss Report</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedPeriod} performance summary
                </p>
              </div>
            </div>

            {pnlLoading ? (
              <PnLSkeleton />
            ) : pnlReport ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <MetricCard
                  title="Total P&L"
                  value={`$${pnlReport.totalPnL.toLocaleString()}`}
                  trend={pnlReport.totalPnL >= 0 ? 'positive' : 'negative'}
                />
                <MetricCard
                  title="Realized P&L"
                  value={`$${pnlReport.realizedPnL.toLocaleString()}`}
                  trend={pnlReport.realizedPnL >= 0 ? 'positive' : 'negative'}
                />
                <MetricCard
                  title="Unrealized P&L"
                  value={`$${pnlReport.unrealizedPnL.toLocaleString()}`}
                  trend={pnlReport.unrealizedPnL >= 0 ? 'positive' : 'negative'}
                />
                <MetricCard
                  title="Win Rate"
                  value={`${pnlReport.winRate.toFixed(1)}%`}
                  trend={pnlReport.winRate > 50 ? 'positive' : 'negative'}
                />
                <MetricCard
                  title="Sharpe Ratio"
                  value={pnlReport.sharpeRatio.toFixed(2)}
                  trend={pnlReport.sharpeRatio > 1 ? 'positive' : 'negative'}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No P&L data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <div className="trading-card p-6">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Performance Metrics</h2>
                <p className="text-sm text-muted-foreground">
                  Risk and return analysis
                </p>
              </div>
            </div>

            {metricsLoading ? (
              <MetricsSkeleton />
            ) : metricsReport ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Return</span>
                      <span className="font-medium">{metricsReport.performance.totalReturn.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annualized Return</span>
                      <span className="font-medium">{metricsReport.performance.annualizedReturn.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volatility</span>
                      <span className="font-medium">{metricsReport.performance.volatility.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Drawdown</span>
                      <span className="font-medium text-red-600">{metricsReport.performance.maxDrawdown.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Beta</span>
                      <span className="font-medium">{metricsReport.performance.beta.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Risk */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Risk Analysis</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VaR (Daily)</span>
                      <span className="font-medium">${metricsReport.risk.varDaily.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VaR (Weekly)</span>
                      <span className="font-medium">${metricsReport.risk.varWeekly.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Shortfall</span>
                      <span className="font-medium">${metricsReport.risk.expectedShortfall.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Correlation</span>
                      <span className="font-medium">{metricsReport.risk.correlation.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Allocation */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Asset Allocation</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Equity</span>
                      <span className="font-medium">{metricsReport.allocation.equity.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bonds</span>
                      <span className="font-medium">{metricsReport.allocation.bonds.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cash</span>
                      <span className="font-medium">{metricsReport.allocation.cash.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Alternatives</span>
                      <span className="font-medium">{metricsReport.allocation.alternatives.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No metrics data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="trading-card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Monthly Summary</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Detailed monthly performance breakdown
            </p>
            <button className="w-full p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              Generate Monthly Report
            </button>
          </div>

          <div className="trading-card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Risk Report</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive risk analysis and stress testing
            </p>
            <button className="w-full p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              Generate Risk Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Metric Card Component
 */
interface MetricCardProps {
  title: string;
  value: string;
  trend?: 'positive' | 'negative' | 'neutral';
}

function MetricCard({ title, value, trend = 'neutral' }: MetricCardProps) {
  const trendClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className="text-center p-4 bg-muted/50 rounded-lg">
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <p className={`text-xl font-bold ${trendClasses[trend]}`}>{value}</p>
    </div>
  );
}

/**
 * Loading Skeletons
 */
function PnLSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-20 mx-auto"></div>
        </div>
      ))}
    </div>
  );
}

function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}