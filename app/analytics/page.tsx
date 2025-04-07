"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Newspaper, ArrowUpRight, Calendar, Clock, Share2 } from "lucide-react"

const mockData = {
  trending: Array.from({ length: 20 }, (_, i) => ({
    date: `2024-${(i + 1).toString().padStart(2, '0')}-01`,
    value: Math.floor(Math.random() * 1000) + 500
  })),
  sentiment: Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    positive: Math.random() * 100,
    negative: Math.random() * 50
  }))
}

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("1W")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Market Insights</h1>
        <div className="space-x-2">
          {["1D", "1W", "1M", "3M", "1Y"].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              onClick={() => setTimeframe(tf)}
              size="sm"
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Trend Card */}
        <Card className="md:col-span-8 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Market Trend Analysis</CardTitle>
                <CardDescription>Global market momentum indicators</CardDescription>
              </div>
              <Badge variant="secondary" className="flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12.5%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData.trending}>
                  <defs>
                    <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1}
                    fill="url(#trend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Cards */}
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Clock className="mr-2 h-4 w-4" />
                Latest Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-3 text-sm">
                  <Badge variant="outline" className="mt-0.5">New</Badge>
                  <div>
                    <p className="font-medium">Market volatility index spikes</p>
                    <p className="text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Market Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.sentiment}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="positive" fill="hsl(var(--primary))" />
                    <Bar dataKey="negative" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <DollarSign className="mr-2 h-4 w-4" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">#{i}</Badge>
                  <span className="font-medium">AAPL</span>
                </div>
                <div className="flex items-center text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +3.45%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Calendar className="mr-2 h-4 w-4" />
              Economic Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Fed Interest Rate Decision</p>
                    <p className="text-sm text-muted-foreground">14:00 GMT</p>
                  </div>
                  <Badge>High Impact</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Newspaper className="mr-2 h-4 w-4" />
              News & Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group flex items-start space-x-3">
                  <Share2 className="h-4 w-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div>
                    <p className="font-medium line-clamp-2">Tech stocks rally on positive earnings reports</p>
                    <p className="text-sm text-muted-foreground">5 min read</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
