import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, LineChart, Clock, Wallet } from "lucide-react"
import type { DemoAccount } from "@/types"

/**
 * Demo account configuration for showcasing different trading strategies
 * @todo Add proper error handling for failed demo account loading
 * @todo Implement proper loading states
 */
const demoAccounts: DemoAccount[] = [
  {
    name: "DCA Bot",
    type: "Conservative",
    balance: "$100,000",
    returns: "+15.8%",
    monthlyVolume: "$24,320",
    trades: 156,
    portfolio: [
      { symbol: "BTC", allocation: 40, return: "+12.4%" },
      { symbol: "ETH", allocation: 30, return: "+18.2%" },
      { symbol: "SOL", allocation: 30, return: "+16.8%" }
    ]
  },
  {
    name: "Momentum Trader",
    type: "Aggressive",
    balance: "$250,000",
    returns: "+42.3%",
    monthlyVolume: "$156,780",
    trades: 892,
    portfolio: [
      { symbol: "AAPL", allocation: 25, return: "+45.6%" },
      { symbol: "TSLA", allocation: 25, return: "+38.9%" },
      { symbol: "NVDA", allocation: 50, return: "+42.4%" }
    ]
  },
  {
    name: "Grid Bot",
    type: "Moderate",
    balance: "$50,000",
    returns: "+28.4%",
    monthlyVolume: "$89,450",
    trades: 445,
    portfolio: [
      { symbol: "BNB", allocation: 35, return: "+26.7%" },
      { symbol: "ADA", allocation: 35, return: "+31.2%" },
      { symbol: "DOT", allocation: 30, return: "+27.3%" }
    ]
  }
]

/**
 * Displays a grid of demo trading accounts with their performance metrics
 * @component
 * @example
 * ```tsx
 * <DemoAccountsDisplay />
 * ```
 */
export function DemoAccountsDisplay() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {demoAccounts.map((account, index) => (
        <Card key={index} className="relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 right-0 p-3">
            <Badge variant="outline" className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              {account.type}
            </Badge>
          </div>
          
          <CardHeader>
            <h3 className="text-lg font-semibold">{account.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-4 w-4" />
              <span>Balance: {account.balance}</span>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Return</span>
                </div>
                <span className="font-medium text-green-500">{account.returns}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  <span>Monthly Volume</span>
                </div>
                <span className="font-medium">{account.monthlyVolume}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Total Trades</span>
                </div>
                <span className="font-medium">{account.trades}</span>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium mb-2">Current Portfolio</p>
                {account.portfolio.map((asset, i) => (
                  <div key={i} className="flex justify-between items-center mb-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span>{asset.symbol}</span>
                      <span className="text-muted-foreground">{asset.allocation}%</span>
                    </div>
                    <span className="text-green-500">{asset.return}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="mt-auto">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Start with {account.name}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
