"use client";

import { Bot, Trade, Order } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
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
import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TradingViewWidget } from "@/components/trading-view-widget";
import { useBotUpdates, getConnectionStatus } from "@/hooks/use-bot-updates";
import { toasts } from "@/providers/toast-provider";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  BarChart2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  
  // Set up real-time updates
  const { lastUpdate, isConnected, error, reconnect } = useBotUpdates(bot.id, {
    onNewTrade: (trade) => {
      // Show trade notification
      toasts.trade(trade);

      // Check for milestones
      if (trade.profitLoss) {
        const currentProfit = performanceData?.metrics.totalProfit || 0;
        const newProfit = currentProfit + trade.profitLoss;

        // Milestone notifications for significant profits/losses
        if (Math.abs(trade.profitLoss) >= 1000) {
          toasts.milestone(
            trade.profitLoss,
            `Large ${trade.profitLoss > 0 ? 'profit' : 'loss'} on ${trade.symbol}`
          );
        }

        // Milestone for crossing profit thresholds
        const thresholds = [1000, 5000, 10000, 50000, 100000];
        const crossedThreshold = thresholds.find(t => 
          (currentProfit < t && newProfit >= t) || 
          (currentProfit > -t && newProfit <= -t)
        );
        
        if (crossedThreshold) {
          toasts.milestone(
            newProfit,
            `Total P&L crossed ${crossedThreshold > 0 ? '+' : '-'}$${crossedThreshold}`
          );
        }
      }

      // Update performance data
      if (performanceData) {
        const updatedTrades = [trade, ...performanceData.trades];
        const metrics = calculateMetrics(updatedTrades);
        setPerformanceData({
          ...performanceData,
          trades: updatedTrades,
          metrics,
        });
      }
    },
    onStatusChange: (status) => {
      toasts.botStatus(
        `Bot status changed to ${status.state}`,
        status.state === 'error' ? 'error' : 'info'
      );
    },
  });

  const calculateMetrics = (trades: Trade[]) => {
    const totalTrades = trades.length;
    const profitableTrades = trades.filter(t => (t.profitLoss || 0) > 0).length;
    const totalProfit = trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);
    const totalFees = trades.reduce((sum, t) => sum + (t.commission || 0), 0);
    
    // Calculate additional metrics
    const returns = trades.map(t => {
      if (!t.profitLoss || !t.price || !t.quantity) return 0;
      const investment = t.price * t.quantity;
      return (t.profitLoss / investment) * 100;
    });

    const averageReturn = returns.length > 0
      ? returns.reduce((sum, r) => sum + r, 0) / returns.length
      : 0;

    const profitLosses = trades.map(t => t.profitLoss || 0);
    const largestGain = Math.max(0, ...profitLosses);
    const largestLoss = Math.min(0, ...profitLosses);

    return {
      totalTrades,
      winRate: totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0,
      totalProfit,
      totalFees,
      averageReturn,
      largestGain,
      largestLoss,
    };
  };

  const fetchPerformanceData = useCallback(async () => {
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
      toasts.botStatus(
        "Failed to load bot performance data",
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [bot.id, timeframe]);

  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  const connectionStatus = getConnectionStatus(isConnected, error);

  const renderConnectionStatus = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={error ? reconnect : undefined}
            className={cn(
              "gap-2",
              error && "text-destructive hover:text-destructive",
              isConnected && "text-green-500 hover:text-green-600"
            )}
          >
            {error ? (
              <AlertCircle className="h-4 w-4" />
            ) : isConnected ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            {connectionStatus.message}
            {error && <RefreshCw className="h-3 w-3 ml-1" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{error || (isConnected ? "Receiving real-time updates" : "Connecting...")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const renderTimeframeSelector = () => (
    <div className="flex items-center gap-2 mb-4">
      {(['24h', '7d', '30d', 'all'] as const).map((tf) => (
        <Button
          key={tf}
          variant={timeframe === tf ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeframe(tf)}
        >
          {tf.toUpperCase()}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={fetchPerformanceData}
        className="ml-2"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );

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
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold tracking-tight">{bot.name}</h3>
          <Badge variant="outline">{bot.type}</Badge>
        </div>
        {renderConnectionStatus()}
      </div>

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
                <p className={cn(
                  "text-2xl font-bold",
                  performanceData.metrics.totalProfit >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  ${performanceData.metrics.totalProfit.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg Return</p>
                <p className={cn(
                  "text-2xl font-bold",
                  performanceData.metrics.averageReturn >= 0 ? "text-green-500" : "text-red-500"
                )}>
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

      {renderTimeframeSelector()}

      <Tabs defaultValue="chart" className="w-full">
        <TabsList>
          <TabsTrigger value="chart">
            <BarChart2 className="h-4 w-4 mr-2" />
            Performance Chart
          </TabsTrigger>
          <TabsTrigger value="trades">
            <Clock className="h-4 w-4 mr-2" />
            Trade History
          </TabsTrigger>
          <TabsTrigger value="orders">
            <TrendingUp className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
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
                    <RechartsTooltip
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
                    <TableCell className={cn(
                      trade.profitLoss && trade.profitLoss > 0 
                        ? "text-green-500" 
                        : "text-red-500"
                    )}>
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
