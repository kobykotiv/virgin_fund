import { useState } from "react"
import { LineChart, BarChart } from "@/components/ui/charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { BacktestResult } from "@/types/backtest"

interface PerformanceDashboardProps {
  data: BacktestResult;
  timeframe?: "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";
}

export function PerformanceDashboard({ data, timeframe = "ALL" }: PerformanceDashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<"return" | "drawdown" | "sharpe">("return")

  const metrics = {
    return: data.metrics.daily.map(d => ({ 
      date: new Date(d.timestamp),
      value: d.return 
    })),
    drawdown: data.metrics.daily.map(d => ({
      date: new Date(d.timestamp),
      value: d.drawdown
    })),
    sharpe: data.metrics.rolling.map(d => ({
      date: new Date(d.timestamp),
      value: d.sharpe
    }))
  }

  const summaryCards = [
    {
      title: "Total Return",
      value: `${data.summary.totalReturn.toFixed(2)}%`,
      color: data.summary.totalReturn >= 0 ? "text-green-500" : "text-red-500"
    },
    {
      title: "Max Drawdown",
      value: `${data.summary.maxDrawdown.toFixed(2)}%`,
      color: "text-red-500"
    },
    {
      title: "Sharpe Ratio",
      value: data.summary.sharpeRatio.toFixed(2),
      color: data.summary.sharpeRatio >= 1 ? "text-green-500" : "text-yellow-500"
    },
    {
      title: "Win Rate",
      value: `${data.summary.winRate.toFixed(2)}%`,
      color: data.summary.winRate >= 50 ? "text-green-500" : "text-red-500"
    }
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <Card key={card.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Metrics</CardTitle>
            <Select
              value={selectedMetric}
              onValueChange={(value: any) => setSelectedMetric(value)}
              options={[
                { label: "Return", value: "return" },
                { label: "Drawdown", value: "drawdown" },
                { label: "Sharpe Ratio", value: "sharpe" }
              ]}
            />
          </div>
        </CardHeader>
        <CardContent>
          <LineChart
            data={metrics[selectedMetric]}
            xField="date"
            yField="value"
            height={300}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={data.metrics.monthly}
              xField="timestamp"
              yField="return"
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={[
                { label: "Wins", value: data.summary.winRate },
                { label: "Losses", value: 100 - data.summary.winRate }
              ]}
              xField="label"
              yField="value"
              height={200}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
