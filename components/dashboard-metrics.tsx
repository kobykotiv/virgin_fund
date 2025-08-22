import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Activity, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

export function PerformanceMetrics({ data, timeframe = '1D' }: { 
  data: any
  timeframe?: '1D' | '1W' | '1M' | '3M' | '1Y'
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard 
        title="Win Rate"
        value={`${(data.winRate * 100).toFixed(1)}%`}
        change={data.winRateChange}
        chart={data.winRateHistory}
      />
      <MetricCard 
        title="Profit Factor"
        value={data.profitFactor.toFixed(2)}
        change={data.profitFactorChange}
        chart={data.profitFactorHistory}
      />
      <MetricCard 
        title="Sharpe Ratio"
        value={data.sharpeRatio.toFixed(2)}
        change={data.sharpeRatioChange}
        chart={data.sharpeHistory}
      />
      <MetricCard 
        title="Max Drawdown"
        value={`${data.maxDrawdown.toFixed(1)}%`}
        change={data.drawdownChange}
        chart={data.drawdownHistory}
        isNegative
      />
    </div>
  )
}

function MetricCard({ title, value, change, chart, isNegative }: any) {
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend === 'up' ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : trend === 'down' ? (
          <TrendingDown className="h-4 w-4 text-red-500" />
        ) : (
          <Activity className="h-4 w-4 text-gray-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center gap-2">
            <Badge className={trend === 'up' ? 'success' : 'destructive'}>
              {change > 0 ? '+' : ''}{change.toFixed(2)}%
            </Badge>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        </div>
        <div className="h-16 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart}>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="text-sm">{payload[0].value}</div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={isNegative ? '#ef4444' : '#22c55e'}
                fill={isNegative ? '#fee2e2' : '#dcfce7'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
