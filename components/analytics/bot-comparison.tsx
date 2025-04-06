import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function BotComparison({ bots }) {
  const data = bots.map(bot => ({
    name: bot.name,
    pnl: bot.performance?.pnlPercentage || 0,
    trades: bot.performance?.totalTrades || 0,
    winRate: (bot.performance?.winRate || 0) * 100
  }))

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Bot Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="pnl" fill="#10b981" name="P&L %" />
              <Bar yAxisId="right" dataKey="winRate" fill="#6366f1" name="Win Rate" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
