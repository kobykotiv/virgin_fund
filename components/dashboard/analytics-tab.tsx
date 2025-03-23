import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart } from "lucide-react"
import { Chart } from "@/components/ui/chart"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Line,
} from "recharts"

export default function AnalyticsTab() {
  // Sample data for charts
  const performanceData = [
    { name: "Jan", value: 2400 },
    { name: "Feb", value: 1398 },
    { name: "Mar", value: 9800 },
    { name: "Apr", value: 3908 },
    { name: "May", value: 4800 },
    { name: "Jun", value: 3800 },
    { name: "Jul", value: 4300 },
  ]

  const distributionData = [
    { name: "BTC", value: 45 },
    { name: "ETH", value: 30 },
    { name: "SOL", value: 15 },
    { name: "Other", value: 10 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const correlationData = [
    { name: "BTC/ETH", value: 0.85 },
    { name: "BTC/SOL", value: 0.65 },
    { name: "ETH/SOL", value: 0.72 },
    { name: "BTC/USD", value: 0.45 },
    { name: "ETH/USD", value: 0.38 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <div className="flex space-x-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="signals">Signal Analysis</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard title="Total Profit" value="+$12,458.32" change="+15.3%" />
            <MetricCard title="Win Rate" value="68%" change="+5.2%" />
            <MetricCard title="Sharpe Ratio" value="1.85" change="+0.23" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Equity Curve</CardTitle>
                <CardDescription>Performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Chart>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorValue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Chart>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Asset Distribution</CardTitle>
                <CardDescription>Portfolio allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Chart>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </Chart>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Drawdown Analysis</CardTitle>
              <CardDescription>Maximum and average drawdowns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Chart>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff4d4f" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ff4d4f" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#ff4d4f"
                        fillOpacity={1}
                        fill="url(#colorDrawdown)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Chart>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Signal Performance</CardTitle>
                <CardDescription>Effectiveness of custom signals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Chart>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={correlationData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </Chart>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Signal Correlation</CardTitle>
                <CardDescription>Relationship between signals and price action</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Chart>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={correlationData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </Chart>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Correlation Heatmap</CardTitle>
                <CardDescription>Asset correlation analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground">Correlation heatmap visualization will be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volatility Analysis</CardTitle>
                <CardDescription>Asset volatility over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Chart>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Chart>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monte Carlo Simulation</CardTitle>
                <CardDescription>Risk assessment projections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Monte Carlo simulation results will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: string
}

function MetricCard({ title, value, change }: MetricCardProps) {
  const isPositive = change.startsWith("+")

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs mt-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {change} from previous period
        </p>
      </CardContent>
    </Card>
  )
}

