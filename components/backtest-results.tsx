"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import BacktestCharts, { ComparisonLegend } from "@/components/backtest/BacktestCharts"
import ComparisonPanel from "@/components/backtest/ComparisonPanel"
import { Download, Save, FileText } from "lucide-react"
import { useMemo, useState } from "react"
import type { BacktestResult } from "@/types/backtest"

interface BacktestResultsProps {
  result: BacktestResult
  onSave: (result: BacktestResult) => void
  comparisonResults?: BacktestResult[]
}

export function BacktestResults({ result, onSave, comparisonResults }: BacktestResultsProps) {
  // Format equity curve data for chart
  const equityData = result.equityCurve.map((point) => ({
    date: point.timestamp,
    equity: point.equity,
  }))

  // Format asset performance data for chart
  const assetPerformanceData = result.assetPerformance.map((asset) => ({
    name: asset.symbol,
    performance: asset.performance,
  }))

  // Format monthly returns data for chart
  const monthlyReturnsData =
    result.monthlyReturns?.map((month) => ({
      month: month.month,
      return: month.return,
    })) || []

  // Format drawdowns data for chart
  const drawdownsData =
    result.drawdowns?.map((dd, index) => ({
      id: index + 1,
      start: dd.start,
      end: dd.end,
      depth: dd.depth,
      duration: dd.duration,
    })) || []

  // Format optimization results data for chart
  const optimizationData =
    result.optimizationResults?.map((opt) => ({
      parameter: opt.parameter,
      value: opt.value,
      performance: opt.performance,
    })) || []

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  // Helper function to format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Export backtest results as CSV
  const exportCSV = () => {
    // Create CSV header
    let csv = "Date,Equity\n"

    // Add equity curve data
    result.equityCurve.forEach((point) => {
      csv += `${point.timestamp},${point.equity}\n`
    })

    // Create a download link
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", `backtest-${result.botName}-${result.id}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Export detailed report as text
  const exportReport = () => {
    let report = `Backtest Report: ${result.botName}\n`
    report += `Period: ${formatDate(result.startDate)} to ${formatDate(result.endDate)}\n\n`
    report += `Initial Capital: ${formatCurrency(result.initialCapital)}\n`
    report += `Final Capital: ${formatCurrency(result.finalCapital)}\n`
    report += `Total P&L: ${formatCurrency(result.totalPnL)} (${formatPercentage(result.pnlPercentage)})\n`
    report += `Max Drawdown: ${formatPercentage(-result.maxDrawdown)}\n`
    report += `Sharpe Ratio: ${result.sharpeRatio.toFixed(2)}\n\n`

    report += `Trade Statistics:\n`
    report += `Total Trades: ${result.statistics.totalTrades}\n`
    report += `Win Rate: ${(result.statistics.winRate * 100).toFixed(2)}%\n`
    report += `Profit Factor: ${result.statistics.profitFactor.toFixed(2)}\n`
    report += `Average Win: ${formatCurrency(result.statistics.averageWin)}\n`
    report += `Average Loss: ${formatCurrency(-result.statistics.averageLoss)}\n`
    report += `Largest Win: ${formatCurrency(result.statistics.largestWin)}\n`
    report += `Largest Loss: ${formatCurrency(-result.statistics.largestLoss)}\n`

    // Create a download link
    const blob = new Blob([report], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", `backtest-report-${result.botName}-${result.id}.txt`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Comparison visibility state (controls which comparison series are shown)
  const [visibleIds, setVisibleIds] = useState<string[] | null>(null)

  const filteredComparisonResults = useMemo(() => {
    if (!comparisonResults) return []
    if (visibleIds === null) return comparisonResults
    return comparisonResults.filter((cr, idx) => {
      const id = cr.id ? String(cr.id) : `cmp-${idx}`
      return visibleIds.includes(id)
    })
  }, [comparisonResults, visibleIds])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Backtest Results: {result.botName}</CardTitle>
            <CardDescription>
              {formatDate(result.startDate)} to {formatDate(result.endDate)}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button className={`${buttonVariants({ variant: "outline", size: "sm" })}`} onClick={() => onSave(result)}>
              <Save className="h-4 w-4 mr-2" />
              Save Results
            </Button>
            <Button className={`${buttonVariants({ variant: "outline", size: "sm" })}`} onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button className={`${buttonVariants({ variant: "outline", size: "sm" })}`} onClick={exportReport}>
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="equity">Equity Curve</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="assets">Asset Performance</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Returns</TabsTrigger>
            <TabsTrigger value="drawdowns">Drawdowns</TabsTrigger>
            {result.optimizationResults && result.optimizationResults.length > 0 && (
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-sm font-medium">Initial Capital</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <div className="text-xl font-bold">{formatCurrency(result.initialCapital)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-sm font-medium">Final Capital</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <div className="text-xl font-bold">{formatCurrency(result.finalCapital)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <div className={`text-xl font-bold ${result.totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {formatCurrency(result.totalPnL)} ({formatPercentage(result.pnlPercentage)})
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <div className="text-xl font-bold text-red-500">{formatPercentage(-result.maxDrawdown)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Trade Statistics</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Trades</span>
                      <span className="font-medium">{result.statistics.totalTrades}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Win Rate</span>
                      <span className="font-medium">{(result.statistics.winRate * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Profit Factor</span>
                      <span className="font-medium">{result.statistics.profitFactor.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Expectancy</span>
                      <span className="font-medium">{formatCurrency(result.statistics.expectancy)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sharpe Ratio</span>
                      <span className="font-medium">{result.sharpeRatio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sortino Ratio</span>
                      <span className="font-medium">{result.statistics.sortinoRatio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Calmar Ratio</span>
                      <span className="font-medium">{result.statistics.calmarRatio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Annualized Return</span>
                      <span className="font-medium">{formatPercentage(result.statistics.annualizedReturn * 100)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Trade Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Win</span>
                      <span className="font-medium text-green-500">{formatCurrency(result.statistics.averageWin)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Loss</span>
                      <span className="font-medium text-red-500">{formatCurrency(-result.statistics.averageLoss)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Largest Win</span>
                      <span className="font-medium text-green-500">{formatCurrency(result.statistics.largestWin)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Largest Loss</span>
                      <span className="font-medium text-red-500">{formatCurrency(-result.statistics.largestLoss)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Max Consecutive Wins</span>
                      <span className="font-medium">{result.statistics.maxConsecutiveWins}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Max Consecutive Losses</span>
                      <span className="font-medium">{result.statistics.maxConsecutiveLosses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Holding Period</span>
                      <span className="font-medium">{result.statistics.averageHoldingPeriod.toFixed(1)} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Daily Return</span>
                      <span className="font-medium">
                        {formatPercentage(result.statistics.averageDailyReturn * 100)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Equity Curve</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <ComparisonPanel comparisonResults={comparisonResults} onChange={setVisibleIds} />
                <BacktestCharts result={result} comparisonResults={filteredComparisonResults} height={300} />
                <div className="mt-3">
                  <ComparisonLegend comparisonResults={filteredComparisonResults} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equity">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Equity Curve</CardTitle>
                <CardDescription>Portfolio value over time</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <ComparisonPanel comparisonResults={comparisonResults} onChange={setVisibleIds} />
                <BacktestCharts result={result} comparisonResults={filteredComparisonResults} height={400} />
                <div className="mt-3">
                  <ComparisonLegend comparisonResults={filteredComparisonResults} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trades">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Trade History</CardTitle>
                <CardDescription>All trades executed during the backtest</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="max-h-[400px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Fees</TableHead>
                        <TableHead>Slippage</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.trades.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                            No trades executed during this backtest
                          </TableCell>
                        </TableRow>
                      ) : (
                        result.trades.map((trade, index) => (
                          <TableRow key={index}>
                            <TableCell>{formatDate(trade.timestamp)}</TableCell>
                            <TableCell>{trade.symbol}</TableCell>
                            <TableCell>
                              <Badge className={`${badgeVariants({ variant: trade.type === "buy" ? "default" : "secondary" })}`}>
                                {trade.type.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>${trade.price.toFixed(2)}</TableCell>
                            <TableCell>{trade.quantity.toFixed(4)}</TableCell>
                            <TableCell>{trade.fees ? `$${trade.fees.toFixed(2)}` : "-"}</TableCell>
                            <TableCell>{trade.slippage ? `$${trade.slippage.toFixed(2)}` : "-"}</TableCell>
                            <TableCell className="text-right">{formatCurrency(trade.value)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Asset Performance</CardTitle>
                <CardDescription>Performance breakdown by asset</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={assetPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: "Performance (%)", angle: -90, position: "insideLeft" }} />
                      <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, "Performance"]} />
                      <Legend />
                      <Bar
                        dataKey="performance"
                        fill="hsl(var(--primary))"
                        name="Performance (%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Trades</TableHead>
                        <TableHead className="text-right">Contribution</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.assetPerformance.map((asset) => {
                        const assetTrades = result.trades.filter((t) => t.symbol === asset.symbol).length
                        const contribution =
                          (asset.performance / 100) * (result.initialCapital / result.assetPerformance.length)

                        return (
                          <TableRow key={asset.symbol}>
                            <TableCell className="font-medium">{asset.symbol}</TableCell>
                            <TableCell className={asset.performance >= 0 ? "text-green-500" : "text-red-500"}>
                              {formatPercentage(asset.performance)}
                            </TableCell>
                            <TableCell>{assetTrades}</TableCell>
                            <TableCell className="text-right">{formatCurrency(contribution)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Monthly Returns</CardTitle>
                <CardDescription>Performance breakdown by month</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyReturnsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis label={{ value: "Return (%)", angle: -90, position: "insideLeft" }} />
                      <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, "Return"]} />
                      <Legend />
                      <Bar
                        dataKey="return"
                        fill="hsl(var(--primary))"
                        name="Monthly Return (%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Return</TableHead>
                        <TableHead className="text-right">Equity Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyReturnsData.map((month, index) => {
                        const equityChange = (month.return / 100) * result.initialCapital

                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{month.month}</TableCell>
                            <TableCell className={month.return >= 0 ? "text-green-500" : "text-red-500"}>
                              {formatPercentage(month.return)}
                            </TableCell>
                            <TableCell
                              className={`text-right ${equityChange >= 0 ? "text-green-500" : "text-red-500"}`}
                            >
                              {formatCurrency(equityChange)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drawdowns">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Drawdowns</CardTitle>
                <CardDescription>Major drawdown periods</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="duration" name="Duration (days)" />
                      <YAxis type="number" dataKey="depth" name="Depth (%)" />
                      <ZAxis type="number" dataKey="id" range={[100, 1000]} />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(value, name) => {
                          if (name === "Duration (days)") return [`${value} days`, name]
                          if (name === "Depth (%)") return [`${Number(value).toFixed(2)}%`, name]
                          return [value, name]
                        }}
                      />
                      <Legend />
                      <Scatter name="Drawdowns" data={drawdownsData} fill="hsl(var(--destructive))" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Duration (days)</TableHead>
                        <TableHead className="text-right">Depth (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drawdownsData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No significant drawdowns detected
                          </TableCell>
                        </TableRow>
                      ) : (
                        drawdownsData.map((dd) => (
                          <TableRow key={dd.id}>
                            <TableCell>{dd.id}</TableCell>
                            <TableCell>{formatDate(dd.start)}</TableCell>
                            <TableCell>{formatDate(dd.end)}</TableCell>
                            <TableCell>{dd.duration}</TableCell>
                            <TableCell className="text-right text-red-500">{formatPercentage(-dd.depth)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {result.optimizationResults && result.optimizationResults.length > 0 && (
            <TabsContent value="optimization">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Parameter Optimization</CardTitle>
                  <CardDescription>Performance across different parameter values</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={optimizationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="value" />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === "Performance") return [Number(value).toFixed(2), "Sharpe Ratio"]
                            return [value, name]
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="performance"
                          stroke="hsl(var(--primary))"
                          name="Performance"
                          dot={{ r: 4 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parameter Value</TableHead>
                          <TableHead>Performance (Sharpe)</TableHead>
                          <TableHead className="text-right">Rank</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {optimizationData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                              No optimization data available
                            </TableCell>
                          </TableRow>
                        ) : (
                          optimizationData
                            .sort((a, b) => b.performance - a.performance)
                            .map((opt, index) => (
                              <TableRow key={index}>
                                <TableCell>{opt.value.toFixed(2)}</TableCell>
                                <TableCell>{opt.performance.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{index + 1}</TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
