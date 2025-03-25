"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PerformanceChart } from "@/components/performance-chart"
import { PortfolioAllocation } from "@/components/portfolio-allocation"

export default function PerformanceTab() {
  const [timeframe, setTimeframe] = useState("1M")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1W">1 Week</SelectItem>
            <SelectItem value="1M">1 Month</SelectItem>
            <SelectItem value="3M">3 Months</SelectItem>
            <SelectItem value="6M">6 Months</SelectItem>
            <SelectItem value="1Y">1 Year</SelectItem>
            <SelectItem value="ALL">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bots">Bot Performance</TabsTrigger>
          <TabsTrigger value="assets">Asset Performance</TabsTrigger>
          <TabsTrigger value="trades">Trade History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Return</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+24.5%</div>
                <p className="text-xs text-muted-foreground">+5.2% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.85</div>
                <p className="text-xs text-muted-foreground">Good risk-adjusted return</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-12.3%</div>
                <p className="text-xs text-muted-foreground">Occurred on May 12, 2023</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.5%</div>
                <p className="text-xs text-muted-foreground">Based on 214 trades</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Performance compared to S&P 500</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <PerformanceChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Current Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <PortfolioAllocation />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Returns (%)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-2 text-center text-xs">
                <div className="font-medium">Year</div>
                <div className="font-medium">Jan</div>
                <div className="font-medium">Feb</div>
                <div className="font-medium">Mar</div>
                <div className="font-medium">Apr</div>
                <div className="font-medium">May</div>
                <div className="font-medium">Jun</div>
                <div className="font-medium">Jul</div>
                <div className="font-medium">Aug</div>
                <div className="font-medium">Sep</div>
                <div className="font-medium">Oct</div>
                <div className="font-medium">Nov</div>
                <div className="font-medium">Dec</div>

                <div className="font-medium">2023</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+2.1</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+1.8</div>
                <div className="bg-red-100 dark:bg-red-900/20 p-1 rounded">-0.7</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+3.2</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+2.5</div>
                <div className="bg-red-100 dark:bg-red-900/20 p-1 rounded">-1.2</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+4.1</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+0.8</div>
                <div className="bg-red-100 dark:bg-red-900/20 p-1 rounded">-2.3</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+1.9</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+3.5</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+2.7</div>

                <div className="font-medium">2022</div>
                <div className="bg-red-100 dark:bg-red-900/20 p-1 rounded">-1.5</div>
                <div className="bg-red-100 dark:bg-red-900/20 p-1 rounded">-2.8</div>
                <div className="bg-red-100 dark:bg-red-900/20 p-1 rounded">-0.9</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+1.2</div>
                <div className="bg-red-100 dark:bg-red-900/20 p-1 rounded">-3.1</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+0.5</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+2.2</div>
                <div className="bg-red-100 dark:bg-red-900/20 p-1 rounded">-1.7</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+1.1</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+2.9</div>
                <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">+1.6</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bot Performance</CardTitle>
              <CardDescription>Performance metrics for your trading bots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4 font-medium text-sm">
                  <div>Bot Name</div>
                  <div>Strategy</div>
                  <div>Return</div>
                  <div>Win Rate</div>
                  <div>Status</div>
                </div>
                <div className="grid grid-cols-5 gap-4 text-sm border-t pt-4">
                  <div>Alpha Trader</div>
                  <div>Moving Average Crossover</div>
                  <div className="text-green-600">+18.2%</div>
                  <div>72.5%</div>
                  <div>
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Active</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4 text-sm border-t pt-4">
                  <div>Beta Scanner</div>
                  <div>RSI Divergence</div>
                  <div className="text-green-600">+7.5%</div>
                  <div>65.2%</div>
                  <div>
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Active</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4 text-sm border-t pt-4">
                  <div>Gamma Hunter</div>
                  <div>Bollinger Band Breakout</div>
                  <div className="text-red-600">-3.8%</div>
                  <div>48.1%</div>
                  <div>
                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Paused</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Performance</CardTitle>
              <CardDescription>Performance breakdown by asset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4 font-medium text-sm">
                  <div>Asset</div>
                  <div>Allocation</div>
                  <div>Return</div>
                  <div>Trades</div>
                  <div>Contribution</div>
                </div>
                <div className="grid grid-cols-5 gap-4 text-sm border-t pt-4">
                  <div>AAPL</div>
                  <div>15.2%</div>
                  <div className="text-green-600">+22.7%</div>
                  <div>18</div>
                  <div>+3.45%</div>
                </div>
                <div className="grid grid-cols-5 gap-4 text-sm border-t pt-4">
                  <div>MSFT</div>
                  <div>12.8%</div>
                  <div className="text-green-600">+18.3%</div>
                  <div>15</div>
                  <div>+2.34%</div>
                </div>
                <div className="grid grid-cols-5 gap-4 text-sm border-t pt-4">
                  <div>TSLA</div>
                  <div>8.5%</div>
                  <div className="text-red-600">-5.2%</div>
                  <div>22</div>
                  <div>-0.44%</div>
                </div>
                <div className="grid grid-cols-5 gap-4 text-sm border-t pt-4">
                  <div>AMZN</div>
                  <div>10.3%</div>
                  <div className="text-green-600">+15.8%</div>
                  <div>12</div>
                  <div>+1.63%</div>
                </div>
                <div className="grid grid-cols-5 gap-4 text-sm border-t pt-4">
                  <div>GOOGL</div>
                  <div>9.7%</div>
                  <div className="text-green-600">+12.1%</div>
                  <div>10</div>
                  <div>+1.17%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>Recent trades executed by your bots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-4 font-medium text-sm">
                  <div>Date</div>
                  <div>Bot</div>
                  <div>Asset</div>
                  <div>Type</div>
                  <div>Price</div>
                  <div>P&L</div>
                </div>
                <div className="grid grid-cols-6 gap-4 text-sm border-t pt-4">
                  <div>2023-06-15</div>
                  <div>Alpha Trader</div>
                  <div>AAPL</div>
                  <div>BUY</div>
                  <div>$182.63</div>
                  <div>-</div>
                </div>
                <div className="grid grid-cols-6 gap-4 text-sm border-t pt-4">
                  <div>2023-06-12</div>
                  <div>Beta Scanner</div>
                  <div>MSFT</div>
                  <div>SELL</div>
                  <div>$335.40</div>
                  <div className="text-green-600">+$1,250.00</div>
                </div>
                <div className="grid grid-cols-6 gap-4 text-sm border-t pt-4">
                  <div>2023-06-10</div>
                  <div>Gamma Hunter</div>
                  <div>TSLA</div>
                  <div>SELL</div>
                  <div>$248.50</div>
                  <div className="text-red-600">-$320.00</div>
                </div>
                <div className="grid grid-cols-6 gap-4 text-sm border-t pt-4">
                  <div>2023-06-08</div>
                  <div>Alpha Trader</div>
                  <div>AMZN</div>
                  <div>BUY</div>
                  <div>$125.30</div>
                  <div>-</div>
                </div>
                <div className="grid grid-cols-6 gap-4 text-sm border-t pt-4">
                  <div>2023-06-05</div>
                  <div>Beta Scanner</div>
                  <div>GOOGL</div>
                  <div>SELL</div>
                  <div>$124.67</div>
                  <div className="text-green-600">+$780.00</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

