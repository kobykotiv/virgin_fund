"use client";

import { Bot, Trade, Order } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BotStatusCard } from "@/components/bot-status-card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { TradingViewWidget } from "@/components/trading-view-widget";

interface BotDetailsProps {
  bot: Bot;
  onClose?: () => void;
}

interface PerformanceData {
  trades: Trade[];
  orders: Order[];
  metrics: {
    totalTrades: number;
    winRate: number;
    totalProfit: number;
    totalFees: number;
    averageReturn: number;
    largestGain: number;
    largestLoss: number;
  };
}

export function BotDetails({ bot, onClose }: BotDetailsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    const fetchPerformanceData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/bots/${bot.id}/performance?timeframe=${timeframe}`);
        if (!response.ok) {
          throw new Error('Failed to fetch performance data');
        }
        const data = await response.json();
        setPerformanceData(data);
      } catch (error) {
        console.error('Error fetching performance:', error);
        toast({
          title: "Error",
          description: "Failed to load bot performance data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [bot.id, timeframe, toast]);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Bot Status</h3>
          <BotStatusCard bot={bot} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
          {performanceData && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">
                  {performanceData.metrics.winRate.toFixed(2)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className="text-2xl font-bold">
                  ${performanceData.metrics.totalProfit.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg Return</p>
                <p className="text-2xl font-bold">
                  {performanceData.metrics.averageReturn.toFixed(2)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">
                  {performanceData.metrics.totalTrades}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Tabs defaultValue="chart">
        <TabsList>
          <TabsTrigger value="chart">Performance Chart</TabsTrigger>
          <TabsTrigger value="trades">Trade History</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4">
          <Card className="p-4">
            <div className="h-[400px]">
              {performanceData && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData.trades}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp"
                      tickFormatter={(value) => format(new Date(value), 'MM/dd HH:mm')}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Profit/Loss']}
                      labelFormatter={(value) => format(new Date(value), 'MM/dd/yyyy HH:mm')}
                    />
                    <Line
                      type="monotone"
                      dataKey="profitLoss"
                      stroke="#8884d8"
                      name="Profit/Loss"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {bot.type === 'indicator' && (
            <Card className="p-4">
              <TradingViewWidget
                symbol={bot.settings.symbol}
                theme="dark"
                interval={bot.settings.timeframe}
              />
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trades">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>P/L</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceData?.trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>
                      {format(new Date(trade.timestamp), 'MM/dd HH:mm')}
                    </TableCell>
                    <TableCell>{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={trade.side === 'buy' ? 'default' : 'secondary'}>
                        {trade.side}
                      </Badge>
                    </TableCell>
                    <TableCell>{trade.quantity}</TableCell>
                    <TableCell>${trade.price.toFixed(2)}</TableCell>
                    <TableCell className={
                      trade.profitLoss && trade.profitLoss > 0 
                        ? "text-green-500" 
                        : "text-red-500"
                    }>
                      ${trade.profitLoss?.toFixed(2) || '0.00'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{trade.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceData?.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {format(new Date(order.createdAt), 'MM/dd HH:mm')}
                    </TableCell>
                    <TableCell>{order.symbol}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.side === 'buy' ? 'default' : 'secondary'}>
                        {order.side}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>${order.price?.toFixed(2) || 'Market'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
