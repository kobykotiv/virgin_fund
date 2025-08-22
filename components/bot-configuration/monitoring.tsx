import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Activity, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

interface BotMetrics {
  status: 'active' | 'paused' | 'error'
  lastUpdate: string
  pnl: number
  trades: number
  winRate: number
  positions: {
    symbol: string
    side: 'long' | 'short'
    quantity: number
    entryPrice: number
    currentPrice: number
    pnl: number
  }[]
  recentTrades: {
    id: string
    symbol: string
    side: 'buy' | 'sell'
    type: 'market' | 'limit'
    quantity: number
    price: number
    timestamp: string
  }[]
}

export function BotMonitoring({ metrics, onPositionSelect }: { 
  metrics: BotMetrics
  onPositionSelect?: (symbol: string) => void 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Performance</CardTitle>
              <CardDescription>Real-time bot metrics</CardDescription>
            </div>
            <Badge 
              className={
                metrics.status === 'active' ? 'success' : 
                metrics.status === 'error' ? 'destructive' : 
                'secondary'
              }
            >
              {metrics.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  {metrics.pnl >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={metrics.pnl >= 0 ? "text-green-500" : "text-red-500"}>
                    {metrics.pnl.toFixed(2)}%
                  </span>
                </div>
                <p className="text-sm font-medium mt-2">Total P&L</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span>{metrics.trades}</span>
                </div>
                <p className="text-sm font-medium mt-2">Total Trades</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Active Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Positions</CardTitle>
          <CardDescription>Currently open trades</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.positions.map(position => (
                <TableRow 
                  key={position.symbol}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onPositionSelect?.(position.symbol)}
                >
                  <TableCell>{position.symbol}</TableCell>
                  <TableCell>
                    <Badge className={position.side === 'long' ? 'default' : 'secondary'}>
                      {position.side.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{position.quantity}</TableCell>
                  <TableCell className={position.pnl >= 0 ? "text-green-500" : "text-red-500"}>
                    {position.pnl.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest trades and events</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {metrics.recentTrades.map(trade => (
              <div
                key={trade.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-4">
                  <Badge className={trade.side === 'buy' ? 'default' : 'secondary'}>
                    {trade.side.toUpperCase()}
                  </Badge>
                  <div>
                    <p className="font-medium">{trade.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      {trade.quantity} @ ${trade.price}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(trade.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
