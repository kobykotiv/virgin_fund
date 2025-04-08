import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart } from "@/components/ui/charts"
import { BacktestResult } from "@/types/backtest"

interface BacktestResultsProps {
  results: BacktestResult
}

export function BacktestResults({ results }: BacktestResultsProps) {
  // Calculate monthly returns
  const monthlyReturns = results.equityCurve.reduce<Record<string, number>>((acc, point) => {
    const month = point.date.substring(0, 7) // YYYY-MM
    if (!acc[month]) {
      const monthPoints = results.equityCurve.filter(p => p.date.startsWith(month))
      const monthReturn = ((monthPoints[monthPoints.length - 1].value / monthPoints[0].value) - 1) * 100
      acc[month] = monthReturn
    }
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Return"
          value={`${results.roi.toFixed(2)}%`}
          trend={results.roi >= 0 ? "up" : "down"}
        />
        <MetricCard
          title="Win Rate"
          value={`${results.winRate.toFixed(2)}%`}
          trend={results.winRate >= 50 ? "up" : "down"}
        />
        <MetricCard
          title="Max Drawdown"
          value={`${results.maxDrawdown.toFixed(2)}%`}
          trend="down"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="equity">
            <TabsList>
              <TabsTrigger value="equity">Equity Curve</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Returns</TabsTrigger>
              <TabsTrigger value="trades">Trade Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="equity">
              <LineChart
                data={results.equityCurve}
                xField="date"
                yField="value"
                height={400}
              />
            </TabsContent>

            <TabsContent value="monthly">
              <BarChart
                data={Object.entries(monthlyReturns).map(([month, value]) => ({
                  month,
                  value
                }))}
                xField="month"
                yField="value"
                height={400}
              />
            </TabsContent>

            <TabsContent value="trades">
              <div className="space-y-4">
                <BarChart
                  data={results.trades.map(t => ({
                    date: t.date,
                    pnl: t.action === 'sell' ? (t.price - t.avgEntryPrice) * t.shares : 0
                  }))}
                  xField="date"
                  yField="pnl"
                  height={300}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ title, value, trend }: { 
  title: string
  value: string
  trend: 'up' | 'down' 
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className={`text-2xl font-bold ${
          trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {value}
        </div>
      </CardContent>
    </Card>
  )
}
