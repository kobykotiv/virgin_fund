"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface PortfolioHistoryData {
  timestamp: string;
  equity: number;
  profit_loss: number;
  profit_loss_pct: number;
}

export function PortfolioHistoryChart() {
  const [timeframe, setTimeframe] = useState('1M');
  const [data, setData] = useState<PortfolioHistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistoryData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/market/portfolio?timeframe=${timeframe}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch portfolio history');
        }
        
        // Transform the data for the chart
        const transformedData = result.data.equity.map((value: number, index: number) => ({
          timestamp: new Date(result.data.timestamp[index] * 1000).toLocaleDateString(),
          equity: value,
          profit_loss: result.data.profit_loss[index],
          profit_loss_pct: result.data.profit_loss_pct[index],
        }));
        
        setData(transformedData);
      } catch (err) {
        console.error('Error fetching portfolio history:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchHistoryData();
  }, [timeframe]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm">Equity: {formatCurrency(payload[0].value)}</p>
          <p className={`text-sm ${payload[1].value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            P&L: {formatCurrency(payload[1].value)} ({(payload[2].value * 100).toFixed(2)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>Portfolio Performance</CardTitle>
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="3M">3M</TabsTrigger>
              <TabsTrigger value="1A">1Y</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : error ? (
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
            Error: {error}
          </div>
        ) : data.length > 0 ? (
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="timestamp" />
                <YAxis 
                  type="number" 
                  domain={['dataMin - 100', 'dataMax + 100']} 
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="equity" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1}
                  fill="url(#colorEquity)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="profit_loss" 
                  stroke="transparent" 
                  fillOpacity={0} 
                />
                <Area 
                  type="monotone" 
                  dataKey="profit_loss_pct" 
                  stroke="transparent" 
                  fillOpacity={0} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No portfolio history available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
