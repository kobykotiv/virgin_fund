import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ComposedChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Scatter, PieChart, Pie, Cell
} from "recharts"

export function ComplexDataView({ data }: { data: any }) {
  const [timeframe, setTimeframe] = useState<'1H' | '1D' | '1W' | '1M'>('1D')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['equity', 'volume'])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Advanced Performance Metrics</CardTitle>
                <div className="flex gap-2">
                  {['1H', '1D', '1W', '1M'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf as any)}
                      className={`px-2 py-1 text-sm rounded ${
                        timeframe === tf ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="equity"
                      fill="hsl(var(--primary)/0.2)"
                      stroke="hsl(var(--primary))"
                      name="Equity"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="volume"
                      fill="hsl(var(--primary)/0.5)"
                      name="Volume"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="ma"
                      stroke="hsl(var(--primary))"
                      strokeDasharray="5 5"
                      name="Moving Average"
                    />
                    <Scatter
                      yAxisId="left"
                      dataKey="trades"
                      fill="hsl(var(--primary))"
                      name="Trades"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Additional performance visualizations */}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Trading patterns analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Trading Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.patterns}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        label
                      >
                        {data.patterns.map((entry: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`hsl(${index * 45} 70% 50%)`} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* More analysis components */}
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          {/* Risk metrics and visualizations */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
