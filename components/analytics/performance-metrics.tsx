import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, BarChart } from "@/components/ui/charts"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface PerformanceMetricsProps {
  data: {
    returns: {
      daily: number[]
      cumulative: number[]
      dates: string[]
    }
    metrics: {
      sharpeRatio: number
      sortino: number
      maxDrawdown: number
      winRate: number
      profitFactor: number
    }
    positions: {
      symbol: string
      pnl: number
      trades: number
    }[]
  }
}

export function PerformanceMetrics({ data }: PerformanceMetricsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Sharpe Ratio"
          value={data.metrics.sharpeRatio.toFixed(2)}
          interpretation={data.metrics.sharpeRatio > 1 ? "Good" : "Poor"}
        />
        <MetricCard
          title="Max Drawdown"
          value={`${data.metrics.maxDrawdown.toFixed(2)}%`}
          interpretation="Risk Measure"
        />
        <MetricCard
          title="Win Rate"
          value={`${data.metrics.winRate.toFixed(2)}%`}
          interpretation={data.metrics.winRate > 50 ? "Profitable" : "Unprofitable"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="returns">
            <TabsList>
              <TabsTrigger value="returns">Returns</TabsTrigger>
              <TabsTrigger value="positions">Positions</TabsTrigger>
            </TabsList>
            <TabsContent value="returns">
              <LineChart
                data={data.returns.cumulative.map((value, i) => ({
                  date: data.returns.dates[i],
                  value
                }))}
                height={300}
              />
            </TabsContent>
            <TabsContent value="positions">
              <BarChart
                data={data.positions}
                xField="symbol"
                yField="pnl"
                height={300}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ title, value, interpretation }: { 
  title: string
  value: string
  interpretation: string 
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{interpretation}</p>
      </CardContent>
    </Card>
  )
}
