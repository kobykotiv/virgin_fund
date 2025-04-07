import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, Calendar, BarChart2, Settings2 } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const INDICATORS = [
  { name: "SMA", params: ["period"] },
  { name: "EMA", params: ["period"] },
  { name: "RSI", params: ["period", "overbought", "oversold"] },
  { name: "MACD", params: ["fastPeriod", "slowPeriod", "signalPeriod"] },
  { name: "Bollinger Bands", params: ["period", "standardDeviation"] }
]

export function BotBacktester() {
  return (
    <div className="grid grid-cols-12 gap-4 h-[800px]">
      {/* Configuration Panel */}
      <Card className="col-span-4 h-full">
        <CardHeader>
          <CardTitle>Backtest Configuration</CardTitle>
          <CardDescription>Configure your strategy parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[700px] pr-4">
            <div className="space-y-6">
              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" placeholder="Start Date" />
                  <Input type="date" placeholder="End Date" />
                </div>
              </div>

              {/* Symbol Selection */}
              <div className="space-y-2">
                <Label>Trading Symbol</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select symbol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AAPL">AAPL</SelectItem>
                    <SelectItem value="GOOG">GOOG</SelectItem>
                    <SelectItem value="BTC-USD">BTC-USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Indicators */}
              <div className="space-y-4">
                <Label>Technical Indicators</Label>
                {INDICATORS.map((indicator) => (
                  <Card key={indicator.name}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">{indicator.name}</span>
                        <Switch />
                      </div>
                      <div className="space-y-2">
                        {indicator.params.map((param) => (
                          <div key={param} className="grid grid-cols-2 gap-2">
                            <Label className="self-center">{param}</Label>
                            <Input type="number" className="w-24" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button className="w-full">
                Run Backtest <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <div className="col-span-8 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Performance Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="strategy"
                    stroke="#8884d8"
                    name="Strategy"
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#82ca9d"
                    name="Benchmark"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            title="Total Return"
            value="+24.5%"
            icon={BarChart2}
            trend="up"
          />
          <MetricCard
            title="Sharpe Ratio"
            value="1.8"
            icon={Settings2}
            trend="neutral"
          />
          <MetricCard
            title="Max Drawdown"
            value="-12.3%"
            icon={Settings2}
            trend="down"
          />
        </div>

        {/* Trade List */}
        <Card>
          <CardHeader>
            <CardTitle>Trade History</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add trade history table */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, trend }: any) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <div className={`text-sm ${
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 
            'text-muted-foreground'
          }`}>
            {value}
          </div>
        </div>
        <div className="mt-2 text-sm font-medium">{title}</div>
      </CardContent>
    </Card>
  )
}
