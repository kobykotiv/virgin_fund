"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Chart } from "@/components/ui/chart"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Save, Play, Code, LineChartIcon, ArrowLeft } from "lucide-react"

export default function SignalBuilder() {
  const [signalType, setSignalType] = useState<"formula" | "script">("formula")
  const [signalName, setSignalName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [formula, setFormula] = useState<string>("")
  const [script, setScript] = useState<string>(`// Custom signal script
// Available variables: price, volume, open, high, low, close

function calculateSignal(data) {
  // Example: Simple Moving Average crossover
  const shortPeriod = 10;
  const longPeriod = 20;
  
  // Calculate short SMA
  const shortSMA = data.slice(-shortPeriod).reduce((sum, bar) => sum + bar.close, 0) / shortPeriod;
  
  // Calculate long SMA
  const longSMA = data.slice(-longPeriod).reduce((sum, bar) => sum + bar.close, 0) / longPeriod;
  
  // Return signal value (1 for buy, -1 for sell, 0 for neutral)
  if (shortSMA > longSMA) {
    return 1;
  } else if (shortSMA < longSMA) {
    return -1;
  } else {
    return 0;
  }
}

return calculateSignal(data);`)

  const [selectedAsset, setSelectedAsset] = useState<string>("BTC/USD")
  const [timeframe, setTimeframe] = useState<string>("1h")
  const [useRealTimeRates, setUseRealTimeRates] = useState<boolean>(true)

  // Sample data for the chart preview
  const sampleData = [
    { time: "2023-01-01", price: 16500, signal: 0 },
    { time: "2023-01-02", price: 16700, signal: 0 },
    { time: "2023-01-03", price: 16900, signal: 1 },
    { time: "2023-01-04", price: 17200, signal: 1 },
    { time: "2023-01-05", price: 17100, signal: 0 },
    { time: "2023-01-06", price: 16800, signal: -1 },
    { time: "2023-01-07", price: 16600, signal: -1 },
    { time: "2023-01-08", price: 16900, signal: 0 },
    { time: "2023-01-09", price: 17300, signal: 1 },
    { time: "2023-01-10", price: 17500, signal: 1 },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Signals
        </Button>
        <h1 className="text-3xl font-bold">Custom Signal Builder</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Signal Details</CardTitle>
              <CardDescription>Define your custom signal properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signalName">Signal Name</Label>
                <Input
                  id="signalName"
                  placeholder="e.g., RSI Crossover"
                  value={signalName}
                  onChange={(e) => setSignalName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this signal does..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Signal Type</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="formula"
                      checked={signalType === "formula"}
                      onChange={() => setSignalType("formula")}
                      className="h-4 w-4 text-primary"
                    />
                    <Label htmlFor="formula" className="cursor-pointer">
                      Formula
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="script"
                      checked={signalType === "script"}
                      onChange={() => setSignalType("script")}
                      className="h-4 w-4 text-primary"
                    />
                    <Label htmlFor="script" className="cursor-pointer">
                      Script
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Data</CardTitle>
              <CardDescription>Select the asset and timeframe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asset">Asset</Label>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC/USD">Bitcoin (BTC/USD)</SelectItem>
                    <SelectItem value="ETH/USD">Ethereum (ETH/USD)</SelectItem>
                    <SelectItem value="SOL/USD">Solana (SOL/USD)</SelectItem>
                    <SelectItem value="XRP/USD">Ripple (XRP/USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 minute</SelectItem>
                    <SelectItem value="5m">5 minutes</SelectItem>
                    <SelectItem value="15m">15 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="4h">4 hours</SelectItem>
                    <SelectItem value="1d">1 day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="realtime-rates" checked={useRealTimeRates} onCheckedChange={setUseRealTimeRates} />
                <Label htmlFor="realtime-rates">Use real-time exchange rates</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {signalType === "formula" ? (
                  <LineChartIcon className="mr-2 h-5 w-5" />
                ) : (
                  <Code className="mr-2 h-5 w-5" />
                )}
                {signalType === "formula" ? "Formula Builder" : "Script Editor"}
              </CardTitle>
              <CardDescription>
                {signalType === "formula"
                  ? "Create your signal using mathematical formulas"
                  : "Write custom JavaScript code for complex signals"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {signalType === "formula" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="formula">Formula</Label>
                    <Textarea
                      id="formula"
                      placeholder="e.g., (SMA(close, 10) > SMA(close, 20)) ? 1 : -1"
                      value={formula}
                      onChange={(e) => setFormula(e.target.value)}
                      rows={5}
                      className="font-mono"
                    />
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Available Functions</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>SMA(data, period)</div>
                      <div>EMA(data, period)</div>
                      <div>RSI(data, period)</div>
                      <div>MACD(data, fast, slow, signal)</div>
                      <div>ATR(high, low, close, period)</div>
                      <div>STOCH(high, low, close, period)</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    id="script"
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    rows={15}
                    className="font-mono"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Play className="mr-2 h-4 w-4" />
                Test Signal
              </Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Signal
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Signal Preview</CardTitle>
              <CardDescription>Visualize how your signal performs with historical data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Chart>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sampleData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[-1.5, 1.5]} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="price" name="Price" stroke="#8884d8" />
                      <Line yAxisId="right" type="monotone" dataKey="signal" name="Signal" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </Chart>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

