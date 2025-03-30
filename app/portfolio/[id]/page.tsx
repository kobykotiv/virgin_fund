import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ArrowUp, ArrowDown, BarChart2, DollarSign, PlusCircle, Settings } from "lucide-react"

// This would normally be fetched based on the ID param
const mockPortfolio = {
  id: "1",
  name: "Growth Portfolio",
  type: "standard",
  risk: "aggressive",
  totalValue: 54298.76,
  initialValue: 50000,
  pnl: 4298.76,
  pnlPercentage: 8.6,
  createdAt: "2023-10-15T00:00:00Z",
  assets: [
    { id: "a1", symbol: "AAPL", name: "Apple Inc.", quantity: 15, averagePrice: 178.25, currentPrice: 189.84, pnl: 174.85, pnlPercentage: 6.5 },
    { id: "a2", symbol: "MSFT", name: "Microsoft Corp.", quantity: 10, averagePrice: 330.12, currentPrice: 378.85, pnl: 487.30, pnlPercentage: 14.8 },
    { id: "a3", symbol: "AMZN", name: "Amazon Inc.", quantity: 12, averagePrice: 145.78, currentPrice: 152.12, pnl: 76.08, pnlPercentage: 4.3 },
    { id: "a4", symbol: "NVDA", name: "NVIDIA Corp.", quantity: 8, averagePrice: 420.56, currentPrice: 593.28, pnl: 1381.76, pnlPercentage: 41.1 },
  ],
  transactions: [
    { id: "t1", assetId: "a1", symbol: "AAPL", type: "buy", quantity: 10, price: 175.60, timestamp: "2023-10-16T14:23:00Z" },
    { id: "t2", assetId: "a2", symbol: "MSFT", type: "buy", quantity: 5, price: 328.45, timestamp: "2023-10-16T14:25:00Z" },
    { id: "t3", assetId: "a1", symbol: "AAPL", type: "buy", quantity: 5, price: 183.55, timestamp: "2023-11-02T10:12:00Z" },
    { id: "t4", assetId: "a3", symbol: "AMZN", type: "buy", quantity: 12, price: 145.78, timestamp: "2023-11-05T09:45:00Z" },
    { id: "t5", assetId: "a2", symbol: "MSFT", type: "buy", quantity: 5, price: 331.79, timestamp: "2023-11-10T15:30:00Z" },
    { id: "t6", assetId: "a4", symbol: "NVDA", type: "buy", quantity: 8, price: 420.56, timestamp: "2023-12-01T11:20:00Z" },
  ]
}

export default function PortfolioPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{mockPortfolio.name}</h1>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="capitalize">
              {mockPortfolio.type}
            </Badge>
            <Badge 
              className={`capitalize ${
                mockPortfolio.risk === 'conservative' ? 'bg-blue-100 text-blue-800' : 
                mockPortfolio.risk === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}
            >
              {mockPortfolio.risk}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">${mockPortfolio.totalValue.toLocaleString()}</p>
              <div 
                className={`flex items-center text-sm mt-1 ${
                  mockPortfolio.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {mockPortfolio.pnl >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                ${Math.abs(mockPortfolio.pnl).toLocaleString()} ({Math.abs(mockPortfolio.pnlPercentage).toFixed(2)}%)
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Asset Count</p>
              <p className="text-2xl font-bold">{mockPortfolio.assets.length}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Last purchase: {new Date(mockPortfolio.transactions[0].timestamp).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Best Performer</p>
              {mockPortfolio.assets.sort((a, b) => b.pnlPercentage - a.pnlPercentage)[0] && (
                <>
                  <p className="text-xl font-bold">{mockPortfolio.assets.sort((a, b) => b.pnlPercentage - a.pnlPercentage)[0].symbol}</p>
                  <p className="text-sm text-green-500 mt-1">
                    +{mockPortfolio.assets.sort((a, b) => b.pnlPercentage - a.pnlPercentage)[0].pnlPercentage.toFixed(2)}%
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Worst Performer</p>
              {mockPortfolio.assets.sort((a, b) => a.pnlPercentage - b.pnlPercentage)[0] && (
                <>
                  <p className="text-xl font-bold">{mockPortfolio.assets.sort((a, b) => a.pnlPercentage - b.pnlPercentage)[0].symbol}</p>
                  <p className={`text-sm ${mockPortfolio.assets.sort((a, b) => a.pnlPercentage - b.pnlPercentage)[0].pnlPercentage < 0 ? 'text-red-500' : 'text-green-500'} mt-1`}>
                    {mockPortfolio.assets.sort((a, b) => a.pnlPercentage - b.pnlPercentage)[0].pnlPercentage < 0 ? '-' : '+'}
                    {Math.abs(mockPortfolio.assets.sort((a, b) => a.pnlPercentage - b.pnlPercentage)[0].pnlPercentage).toFixed(2)}%
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="assets" className="w-full">
        <TabsList>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Assets</CardTitle>
              <CardDescription>Manage your portfolio holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Symbol</th>
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-right">Quantity</th>
                      <th className="py-3 px-4 text-right">Avg. Price</th>
                      <th className="py-3 px-4 text-right">Current Price</th>
                      <th className="py-3 px-4 text-right">Value</th>
                      <th className="py-3 px-4 text-right">P&L</th>
                      <th className="py-3 px-4 text-right">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPortfolio.assets.map(asset => (
                      <tr key={asset.id} className="border-b">
                        <td className="py-3 px-4 font-medium">{asset.symbol}</td>
                        <td className="py-3 px-4">{asset.name}</td>
                        <td className="py-3 px-4 text-right">{asset.quantity}</td>
                        <td className="py-3 px-4 text-right">${asset.averagePrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">${asset.currentPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">${(asset.currentPrice * asset.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className={`py-3 px-4 text-right ${asset.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {asset.pnl >= 0 ? '+' : '-'}${Math.abs(asset.pnl).toFixed(2)}
                        </td>
                        <td className={`py-3 px-4 text-right ${asset.pnlPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {asset.pnlPercentage >= 0 ? '+' : '-'}{Math.abs(asset.pnlPercentage).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent trading activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Symbol</th>
                      <th className="py-3 px-4 text-left">Type</th>
                      <th className="py-3 px-4 text-right">Quantity</th>
                      <th className="py-3 px-4 text-right">Price</th>
                      <th className="py-3 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPortfolio.transactions.map(txn => (
                      <tr key={txn.id} className="border-b">
                        <td className="py-3 px-4">{new Date(txn.timestamp).toLocaleString()}</td>
                        <td className="py-3 px-4 font-medium">{txn.symbol}</td>
                        <td className="py-3 px-4">
                          <Badge variant={txn.type === 'buy' ? 'default' : 'destructive'} className="capitalize">
                            {txn.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">{txn.quantity}</td>
                        <td className="py-3 px-4 text-right">${txn.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">${(txn.price * txn.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>Track your portfolio performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                {/* Chart visualization placeholder */}
                <BarChart2 className="h-16 w-16 opacity-20" />
                <p className="ml-4">Performance chart visualization will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
