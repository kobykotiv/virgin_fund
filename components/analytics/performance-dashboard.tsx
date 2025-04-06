import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function PerformanceDashboard() {
  const [timeframe, setTimeframe] = useState('1M')

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>
        <Tabs value={timeframe} onValueChange={setTimeframe}>
          <TabsList>
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="3M">3M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
            <TabsTrigger value="ALL">ALL</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total P&L"
          value="$12,450.75"
          change={8.2}
          trend="up"
        />
        <MetricCard
          title="Win Rate"
          value="72.5%"
          change={2.1}
          trend="up"
        />
        <MetricCard
          title="Sharpe Ratio"
          value="2.15"
          change={0.3}
          trend="up"
        />
        <MetricCard
          title="Max Drawdown"
          value="8.3%"
          change={-1.2}
          trend="down"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <EquityChart timeframe={timeframe} />
        <PerformanceBreakdown />
      </div>
    </div>
  )
}
