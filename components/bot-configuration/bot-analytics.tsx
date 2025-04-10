"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
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
  PieChart,
  Pie,
  Cell,
  Scatter,
  ScatterChart,
} from "recharts"

interface BotAnalyticsData {
  equityCurve: Array<{
    date: string
    equity: number
    drawdown: number
  }>
  rollingReturns: Array<{
    date: string
    daily: number
    weekly: number
    monthly: number
  }>
  tradeDistribution: Array<{
    range: string
    count: number
    pnl: number
  }>
  tradeTiming: Array<{
    hour: number
    winRate: number
    volume: number
  }>
  assetAllocation: Array<{
    asset: string
    allocation: number
    pnl: number
  }>
  strategyAttribution: Array<{
    strategy: string
    contribution: number
  }>
  correlationMatrix: Array<{
    x: number
    y: number
    value: number
  }>
}

interface BotAnalyticsProps {
  data: BotAnalyticsData
}

export function BotAnalytics({ data }: BotAnalyticsProps) {
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Bot Analytics</CardTitle>
        <CardDescription>Detailed performance metrics and analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="correlation">Correlation</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Equity Curve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.equityCurve}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => [
                            formatCurrency(value),
                            "Equity",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="equity"
                          stroke="#0088FE"
                          fill="#0088FE"
                          fillOpacity={0.1}
                        />
                        <Area
                          type="monotone"
                          dataKey="drawdown"
                          stroke="#FF0000"
                          fill="#FF0000"
                          fillOpacity={0.1}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Rolling Returns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.rollingReturns}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => [
                            formatPercentage(value),
                            "Return",
                          ]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="daily"
                          stroke="#0088FE"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="weekly"
                          stroke="#00C49F"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="monthly"
                          stroke="#FFBB28"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trades" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Trade Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.tradeDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis yAxisId="left" />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tickFormatter={formatCurrency}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar
                          yAxisId="left"
                          dataKey="count"
                          fill="#0088FE"
                          name="Number of Trades"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="pnl"
                          fill="#00C49F"
                          name="P&L"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Trade Timing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.tradeTiming}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="hour"
                          tickFormatter={(hour) =>
                            `${hour.toString().padStart(2, "0")}:00`
                          }
                        />
                        <YAxis
                          yAxisId="left"
                          tickFormatter={(value) => `${value}%`}
                        />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="winRate"
                          stroke="#0088FE"
                          name="Win Rate"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="volume"
                          stroke="#00C49F"
                          name="Volume"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="allocation" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Asset Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.assetAllocation}
                          dataKey="allocation"
                          nameKey="asset"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) =>
                            `${entry.asset} (${formatPercentage(
                              entry.allocation
                            )})`
                          }
                        >
                          {data.assetAllocation.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [
                            formatPercentage(value),
                            "Allocation",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Strategy Attribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.strategyAttribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="strategy" />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip
                          formatter={(value: number) => [
                            formatPercentage(value),
                            "Contribution",
                          ]}
                        />
                        <Bar dataKey="contribution">
                          {data.strategyAttribution.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="correlation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Strategy Correlation Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="x" name="X" />
                      <YAxis type="number" dataKey="y" name="Y" />
                      <Tooltip
                        formatter={(value: number) => [
                          formatPercentage(value),
                          "Correlation",
                        ]}
                      />
                      <Scatter
                        data={data.correlationMatrix}
                        fill="#0088FE"
                        fillOpacity={0.6}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
