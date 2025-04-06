import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts"

export function SimpleDataView({ data }: { data: any }) {
  return (
    <div className="grid gap-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard 
          title="Win Rate"
          value={`${(data.metrics.winRate * 100).toFixed(1)}%`}
          trend={data.metrics.winRate > 0.5 ? 'up' : 'down'}
        />
        <StatsCard 
          title="Profit/Loss"
          value={`${data.metrics.pnl > 0 ? '+' : ''}${data.metrics.pnl.toFixed(2)}%`}
          trend={data.metrics.pnl > 0 ? 'up' : 'down'}
        />
        <StatsCard 
          title="Active Trades"
          value={data.metrics.activeTrades}
          trend="neutral"
        />
      </div>

      {/* Simple Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.performance}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary)/0.2)"
                />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.recentTrades.map((trade: any) => (
            <div key={trade.id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant={trade.side === 'buy' ? 'default' : 'secondary'}>
                  {trade.side.toUpperCase()}
                </Badge>
                <span>{trade.symbol}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(trade.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({ title, value, trend }: any) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold mb-1">
          {value}
        </div>
        <div className="text-sm text-muted-foreground">
          {title}
        </div>
      </CardContent>
    </Card>
  )
}
