"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { RefreshCw } from 'lucide-react';

interface HistoricalChartProps {
  symbol: string;
  initialTimeframe?: string;
  initialRange?: number;
  height?: number;
  showControls?: boolean;
}

export function HistoricalChart({
  symbol,
  initialTimeframe = '1Day',
  initialRange = 30,
  height = 400,
  showControls = true
}: HistoricalChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState(initialTimeframe);
  const [range, setRange] = useState(initialRange);
  const [chartType, setChartType] = useState<'line' | 'area' | 'candle' | 'bar'>('area');

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Calculate the start date based on range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - range);
      
      const response = await fetch(
        `/api/alpaca/historical?symbol=${symbol}&timeframe=${timeframe}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch historical data');
      }
      
      // Transform the data for the chart
      const chartData = result.data.map((bar: any) => ({
        date: new Date(bar.t).toLocaleDateString(),
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v
      }));
      
      setData(chartData);
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [symbol, timeframe, range]);

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="close" stroke="#8884d8" name="Close Price" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="close" stroke="#8884d8" fillOpacity={1} fill="url(#colorClose)" name="Close Price" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="volume" fill="#82ca9d" name="Volume" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="close" stroke="#8884d8" fillOpacity={1} fill="url(#colorClose)" name="Close Price" />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{symbol} Historical Data</CardTitle>
          {showControls && (
            <Button variant="outline" size="sm" onClick={fetchHistoricalData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showControls && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1Min">1 Minute</SelectItem>
                <SelectItem value="5Min">5 Minutes</SelectItem>
                <SelectItem value="15Min">15 Minutes</SelectItem>
                <SelectItem value="1Hour">1 Hour</SelectItem>
                <SelectItem value="1Day">1 Day</SelectItem>
                <SelectItem value="1Week">1 Week</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={range.toString()} onValueChange={(val) => setRange(parseInt(val, 10))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="180">180 Days</SelectItem>
                <SelectItem value="365">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Tabs defaultValue={chartType} onValueChange={(val) => setChartType(val as any)}>
              <TabsList>
                <TabsTrigger value="area">Area</TabsTrigger>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Volume</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
            <Skeleton className="w-full h-full" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-6 border rounded text-red-500" style={{ height: `${height}px` }}>
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center p-6 border rounded" style={{ height: `${height}px` }}>
            No data available for {symbol}
          </div>
        ) : (
          renderChart()
        )}
      </CardContent>
    </Card>
  );
}
