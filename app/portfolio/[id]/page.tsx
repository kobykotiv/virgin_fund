import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { portfolios } from '@/lib/demo-portfolios'
import { PortfolioChart } from '@/components/portfolio-chart'
import { PortfolioLineChart } from '@/components/portfolio-line-chart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  ChevronLeft, 
  Info, 
  TrendingDown, 
  TrendingUp, 
  BookOpen, 
  BarChart4, 
  ListChecks,
  Calendar,
  DollarSign
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { calculatePositionValue, formatCurrency } from '@/lib/portfolio-utils'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
 
interface Props {
  params: { id: string }
}
 
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const portfolio = portfolios.find(p => p.id === params.id)
 
  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
    }
  }
 
  return {
    title: `${portfolio.name} - Portfolio Details`,
    description: portfolio.focus,
    openGraph: {
      title: `${portfolio.name} - Portfolio Details`,
      description: portfolio.focus,
      images: [{
        url: `/api/og/portfolio?id=${params.id}`,
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${portfolio.name} - Portfolio Details`,
      description: portfolio.focus,
      images: [`/api/og/portfolio?id=${params.id}`],
    },
  }
}

export default function PortfolioPage({ params }: Props) {
  const portfolio = portfolios.find(p => p.id === params.id)
  
  if (!portfolio) {
    return notFound()
  }

  // Calculate total portfolio value and cost basis
  const totalValue = typeof portfolio.value === 'string' 
    ? parseFloat(portfolio.value.replace(/[^0-9.-]+/g, ''))
    : portfolio.value

  // Calculate total cost basis from all positions
  const calculateTotalCostBasis = () => {
    let totalCost = 0;
    
    const processSinglePosition = (position: any) => {
      if (position.quantity && position.avgPrice) {
        totalCost += position.quantity * position.avgPrice;
      }
    };
    
    portfolio.positions.forEach(position => {
      if (position.assetType === 'basket' && position.positions) {
        position.positions.forEach(processSinglePosition);
      } else {
        processSinglePosition(position);
      }
    });
    
    return totalCost;
  };
  
  const totalCostBasis = calculateTotalCostBasis();

  // Calculate total P&L and P&L percentage
  const totalPnL = totalValue - totalCostBasis;
  const totalPnLPercent = totalCostBasis > 0 ? (totalPnL / totalCostBasis) * 100 : 0;

  // Get sentiment badge color
  const getSentimentColor = (sentiment?: string) => {
    if (sentiment === "bullish") return "success"
    if (sentiment === "bearish") return "destructive"
    return "secondary"
  }

  // Get fear/greed color
  const getFearGreedColor = (index?: number) => {
    if (!index) return "bg-gray-500"
    if (index < 25) return "bg-red-500" // Extreme Fear
    if (index < 40) return "bg-orange-500" // Fear
    if (index < 60) return "bg-yellow-500" // Neutral
    if (index < 75) return "bg-green-500" // Greed
    return "bg-emerald-500" // Extreme Greed
  }

  const Icon = portfolio.icon

  return (
    <div className="container mx-auto py-4 md:py-8 px-4">
      <div className="mb-6 md:mb-8">
        <Link 
          href="/login"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Portfolios
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{portfolio.name}</h1>
              <p className="text-muted-foreground">{portfolio.focus}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge className="outline">{portfolio.risk} Risk</Badge>
            {portfolio.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
            {portfolio.sentiment && (
              <Badge 
                className={`${getSentimentColor(portfolio.sentiment)} flex items-center gap-1`}
              >
                {portfolio.sentiment === "bullish" ? <TrendingUp className="h-3 w-3" /> : 
                 portfolio.sentiment === "bearish" ? <TrendingDown className="h-3 w-3" /> : null}
                {portfolio.sentiment.charAt(0).toUpperCase() + portfolio.sentiment.slice(1)}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Top Level Tabs for Mobile View */}
      <div className="block md:hidden mb-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <MobileOverviewSection 
              portfolio={portfolio} 
              totalValue={totalValue} 
              totalCostBasis={totalCostBasis} 
              totalPnL={totalPnL} 
              totalPnLPercent={totalPnLPercent} 
              getFearGreedColor={getFearGreedColor} 
            />
          </TabsContent>
          
          <TabsContent value="positions">
            <MobilePositionsSection portfolio={portfolio} />
          </TabsContent>
          
          <TabsContent value="strategy">
            <MobileStrategySection 
              portfolio={portfolio} 
              getSentimentColor={getSentimentColor} 
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main metrics and charts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Historical performance and key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="text-2xl font-semibold">{formatCurrency(totalValue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cost Basis: {formatCurrency(totalCostBasis)}
                  </p>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Return</p>
                  <p className={`text-2xl font-semibold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                    {totalPnL >= 0 ? 
                      <ArrowUpRight className="h-5 w-5 mr-1" /> : 
                      <ArrowDownRight className="h-5 w-5 mr-1" />}
                    {formatCurrency(totalPnL)}
                  </p>
                  <p className={`text-xs ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
                    {totalPnLPercent.toFixed(2)}%
                  </p>
                </div>
                
                {portfolio.fearGreedIndex && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-muted-foreground">Fear & Greed</p>
                      <p className="text-sm font-medium">{portfolio.fearGreedLabel || portfolio.fearGreedIndex}</p>
                    </div>
                    <div className="h-2 w-full bg-muted rounded overflow-hidden">
                      <div 
                        className={`h-full transition-all ${getFearGreedColor(portfolio.fearGreedIndex)}`}
                        style={{ width: `${portfolio.fearGreedIndex}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            
              {/* Performance chart */}
              <div className="aspect-[3/2] bg-muted/30 rounded-lg overflow-hidden">
                {portfolio.historicalData ? (
                  <PortfolioLineChart 
                    data={portfolio.historicalData} 
                    className="w-full h-full" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No historical data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Strategy Details Card - Desktop */}
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Strategy & Reasoning</CardTitle>
                  <CardDescription>Investment approach and rationale</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/portfolio/${params.id}/strategy`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Full Analysis
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <BarChart4 className="h-4 w-4 mr-2 text-primary" />
                    Investment Thesis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {portfolio.focus}
                    {portfolio.sentiment && ` This portfolio adopts a ${portfolio.sentiment} outlook on the market.`}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <ListChecks className="h-4 w-4 mr-2 text-primary" />
                    Key Strategies
                  </h3>
                  <ul className="list-disc text-sm text-muted-foreground pl-5 space-y-1">
                    <li>Focused on {portfolio.tags.slice(0, 3).join(", ")} sectors</li>
                    <li>{portfolio.risk} risk profile with appropriate diversification</li>
                    {portfolio.sentiment === "bullish" && <li>Overweight in growth-oriented assets</li>}
                    {portfolio.sentiment === "bearish" && <li>Defensive positioning with focus on value</li>}
                    <li>Asset allocation optimized for current market conditions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    Time Horizon
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {portfolio.risk === "Low" ? "Long-term investment approach (5+ years)" : 
                     portfolio.risk === "Moderate" ? "Medium to long-term approach (3-5 years)" : 
                     "Shorter-term approach (1-3 years) with higher risk tolerance"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asset allocation */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription>Portfolio composition by asset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square mb-6">
                <PortfolioChart 
                  portfolioType={portfolio.id} 
                  className="w-full h-full" 
                />
              </div>
              
              <div className="space-y-2">
                {portfolio.allocation.map(item => (
                  <div key={item.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Cost Basis:</span>
                <span className="font-medium">{formatCurrency(totalCostBasis)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-muted-foreground">Total Current Value:</span>
                <span className="font-medium">{formatCurrency(totalValue)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-muted-foreground">Total P&L:</span>
                <span className={`font-medium ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(totalPnL)} ({totalPnLPercent.toFixed(2)}%)
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/login?tab=demos">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Try This Portfolio
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Holdings section - Desktop Only */}
      <div className="hidden md:block mt-6">
        <Tabs defaultValue="positions">
          <TabsList>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="trades">Trade History</TabsTrigger>
            <TabsTrigger value="details">Portfolio Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="positions" className="pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Portfolio Holdings</CardTitle>
                <CardDescription>Current positions and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium">Asset</th>
                        <th className="pb-3 font-medium">Quantity</th>
                        <th className="pb-3 font-medium">Avg Price</th>
                        <th className="pb-3 font-medium">Current Price</th>
                        <th className="pb-3 font-medium">Cost Basis</th>
                        <th className="pb-3 font-medium">Value</th>
                        <th className="pb-3 font-medium">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.positions.map((position, index) => {
                        if (position.assetType === 'basket') {
                          // Handle basket positions
                          return (
                            <tr key={position.id} className="border-b">
                              <td className="py-3 font-medium">
                                {position.name}
                                <span className="ml-2 text-xs text-muted-foreground">(Basket)</span>
                              </td>
                              <td className="py-3" colSpan={6}>
                                Contains {position.positions.length} positions
                                <Button variant="link" size="sm" className="ml-2" asChild>
                                  <Link href={`/portfolio/${params.id}/positions/${position.id}`}>
                                    View Basket Details
                                  </Link>
                                </Button>
                              </td>
                            </tr>
                          )
                        } else {
                          // Handle single positions
                          const metrics = position.currentPrice && position.quantity && position.avgPrice 
                            ? calculatePositionValue(position)
                            : { totalValue: 0, totalCost: 0, pnl: 0, pnlPercent: 0, trades: 0 };
                          
                          return (
                            <tr key={position.id} className="border-b">
                              <td className="py-3 font-medium">{position.ticker}</td>
                              <td className="py-3">{position.quantity?.toLocaleString()}</td>
                              <td className="py-3">{formatCurrency(position.avgPrice || 0)}</td>
                              <td className="py-3">{formatCurrency(position.currentPrice || 0)}</td>
                              <td className="py-3">{formatCurrency(metrics.totalCost)}</td>
                              <td className="py-3">{formatCurrency(metrics.totalValue)}</td>
                              <td className={`py-3 ${metrics.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatCurrency(metrics.pnl)} ({metrics.pnlPercent.toFixed(2)}%)
                              </td>
                            </tr>
                          )
                        }
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trades" className="pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Trade History</CardTitle>
                <CardDescription>Past trades for this portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Asset</th>
                        <th className="pb-3 font-medium">Action</th>
                        <th className="pb-3 font-medium">Price</th>
                        <th className="pb-3 font-medium">Quantity</th>
                        <th className="pb-3 font-medium">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.positions.flatMap(position => {
                        // If it's a basket, get trades from all its positions
                        if (position.assetType === 'basket' && position.positions) {
                          return position.positions.flatMap(p => 
                            (p.trades || []).map(trade => ({
                              ...trade,
                              ticker: p.ticker,
                              basketName: position.name
                            }))
                          );
                        }
                        
                        // Regular position trades
                        return (position.trades || []).map(trade => ({
                          ...trade,
                          ticker: position.ticker
                        }));
                      })
                      .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
                      .map((trade, index) => (
                        <tr key={trade.tradeId} className="border-b">
                          <td className="py-3">
                            {new Date(trade.datetime).toLocaleDateString()}
                          </td>
                          <td className="py-3 font-medium">
                            {trade.ticker}
                            {trade.basketName && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                ({trade.basketName})
                              </span>
                            )}
                          </td>
                          <td className={`py-3 ${
                            trade.action === 'BUY' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {trade.action} {trade.side}
                          </td>
                          <td className="py-3">{formatCurrency(trade.price)}</td>
                          <td className="py-3">{trade.quantity.toLocaleString()}</td>
                          <td className="py-3">{formatCurrency(trade.price * trade.quantity)}</td>
                        </tr>
                      ))}
                      
                      {/* Show message if no trades */}
                      {portfolio.positions.every(p => !p.trades || p.trades.length === 0) && (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-muted-foreground">
                            No trade history available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Portfolio Information</CardTitle>
                <CardDescription>Detailed portfolio characteristics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Strategy Overview</h3>
                      <p className="text-muted-foreground">{portfolio.focus}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Risk Profile</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          portfolio.risk === "Low" ? "outline" : 
                          portfolio.risk === "Moderate" ? "secondary" : 
                          "destructive"
                        }>
                          {portfolio.risk} Risk
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {portfolio.risk === "Low" ? "Conservative approach with lower volatility" : 
                           portfolio.risk === "Moderate" ? "Balanced approach with moderate volatility" : 
                           "Aggressive approach with higher volatility"}
                        </span>
                      </div>
                    </div>
                    
                    {portfolio.sentiment && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Market Outlook</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={getSentimentColor(portfolio.sentiment)}>
                            {portfolio.sentiment.charAt(0).toUpperCase() + portfolio.sentiment.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {portfolio.sentimentStrength ? `Strength: ${portfolio.sentimentStrength}%` : ''}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Portfolio Characteristics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Number of Positions</p>
                          <p className="font-medium">{portfolio.positions.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Portfolio Tags</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {portfolio.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="flex items-center gap-1 text-lg font-medium mb-2">
                        Investment Considerations
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        This portfolio is a simulation for demonstration purposes. Past performance 
                        is not indicative of future results. All investments involve risk and may 
                        result in loss.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/login?tab=demos">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Try This Portfolio
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Mobile-specific components to keep the main component cleaner
function MobileOverviewSection({ 
  portfolio, 
  totalValue, 
  totalCostBasis, 
  totalPnL, 
  totalPnLPercent, 
  getFearGreedColor 
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Current Value</p>
              <p className="text-lg font-semibold">{formatCurrency(totalValue)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Cost: {formatCurrency(totalCostBasis)}
              </p>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Total P&L</p>
              <p className={`text-lg font-semibold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {totalPnL >= 0 ? 
                  <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                  <ArrowDownRight className="h-4 w-4 mr-1" />}
                {formatCurrency(totalPnL)}
              </p>
              <p className={`text-xs ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
                {totalPnLPercent.toFixed(2)}%
              </p>
            </div>
          </div>
          
          {portfolio.fearGreedIndex && (
            <div className="p-3 bg-muted/50 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">Fear & Greed</p>
                <p className="text-xs font-medium">{portfolio.fearGreedLabel || portfolio.fearGreedIndex}</p>
              </div>
              <div className="h-2 w-full bg-muted rounded overflow-hidden">
                <div 
                  className={`h-full transition-all ${getFearGreedColor(portfolio.fearGreedIndex)}`}
                  style={{ width: `${portfolio.fearGreedIndex}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="aspect-[3/2] bg-muted/30 rounded-lg overflow-hidden">
            {portfolio.historicalData ? (
              <PortfolioLineChart 
                data={portfolio.historicalData} 
                className="w-full h-full" 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No historical data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square mb-4">
            <PortfolioChart 
              portfolioType={portfolio.id} 
              className="w-full h-full" 
            />
          </div>
          
          <div className="space-y-1">
            {portfolio.allocation.map(item => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
          
          <Button variant="default" size="sm" className="w-full mt-4" asChild>
            <Link href="/login?tab=demos">
              <DollarSign className="h-4 w-4 mr-2" />
              Try This Portfolio
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function MobilePositionsSection({ portfolio }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Holdings</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4">
          {portfolio.positions.map((position) => {
            if (position.assetType === 'basket') {
              // Basket position card
              return (
                <Card key={position.id} className="overflow-hidden">
                  <CardHeader className="py-3 px-3">
                    <CardTitle className="text-base">{position.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Basket with {position.positions.length} positions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-0 px-3">
                    <div className="text-xs text-muted-foreground mb-2">
                      Contains: {position.positions.map(p => p.ticker).join(", ")}
                    </div>
                  </CardContent>
                  <CardFooter className="py-2 px-3 border-t bg-muted/30">
                    <Button variant="link" size="sm" className="px-0 h-auto text-xs" asChild>
                      <Link href={`/portfolio/${portfolio.id}/positions/${position.id}`}>
                        View Basket Details
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            } else {
              // Single position card
              const metrics = position.currentPrice && position.quantity && position.avgPrice 
                ? calculatePositionValue(position)
                : { totalValue: 0, totalCost: 0, pnl: 0, pnlPercent: 0, trades: 0 };

              return (
                <Card key={position.id} className="overflow-hidden">
                  <CardHeader className="py-3 px-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{position.ticker}</span>
                      <span className={metrics.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {metrics.pnlPercent.toFixed(2)}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2 text-sm py-2 px-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Quantity</p>
                      <p>{position.quantity?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Price</p>
                      <p>{formatCurrency(position.avgPrice || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Current Price</p>
                      <p>{formatCurrency(position.currentPrice || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Value</p>
                      <p>{formatCurrency(metrics.totalValue)}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="py-2 px-3 border-t bg-muted/30 flex justify-between">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Cost Basis: </span>
                      <span>{formatCurrency(metrics.totalCost)}</span>
                    </div>
                    <div className={`text-xs ${metrics.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      P&L: {formatCurrency(metrics.pnl)}
                    </div>
                  </CardFooter>
                </Card>
              );
            }
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function MobileStrategySection({ portfolio, getSentimentColor }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Strategy & Reasoning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1 flex items-center">
              <BarChart4 className="h-3 w-3 mr-1 text-primary" />
              Investment Thesis
            </h3>
            <p className="text-xs text-muted-foreground">
              {portfolio.focus}
              {portfolio.sentiment && ` This portfolio adopts a ${portfolio.sentiment} outlook on the market.`}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1 flex items-center">
              <ListChecks className="h-3 w-3 mr-1 text-primary" />
              Key Strategies
            </h3>
            <ul className="list-disc text-xs text-muted-foreground pl-4 space-y-1">
              <li>Focused on {portfolio.tags.slice(0, 3).join(", ")} sectors</li>
              <li>{portfolio.risk} risk profile with appropriate diversification</li>
              {portfolio.sentiment === "bullish" && <li>Overweight in growth-oriented assets</li>}
              {portfolio.sentiment === "bearish" && <li>Defensive positioning with focus on value</li>}
              <li>Asset allocation optimized for current market conditions</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1 flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-primary" />
              Time Horizon
            </h3>
            <p className="text-xs text-muted-foreground">
              {portfolio.risk === "Low" ? "Long-term investment approach (5+ years)" : 
               portfolio.risk === "Moderate" ? "Medium to long-term approach (3-5 years)" : 
               "Shorter-term approach (1-3 years) with higher risk tolerance"}
            </p>
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-2" asChild>
            <Link href={`/portfolio/${portfolio.id}/strategy`}>
              <BookOpen className="h-4 w-4 mr-2" />
              Full Strategy Analysis
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Risk & Market Outlook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium mb-1">Risk Profile</h3>
              <div className="flex items-center gap-2">
                <Badge className={
                  portfolio.risk === "Low" ? "outline" : 
                  portfolio.risk === "Moderate" ? "secondary" : 
                  "destructive"
                }>
                  {portfolio.risk} Risk
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {portfolio.risk === "Low" ? "Conservative" : 
                   portfolio.risk === "Moderate" ? "Balanced" : 
                   "Aggressive"}
                </span>
              </div>
            </div>
            
            {portfolio.sentiment && (
              <div>
                <h3 className="text-sm font-medium mb-1">Market Sentiment</h3>
                <div className="flex items-center gap-2">
                  <Badge className={getSentimentColor(portfolio.sentiment)}>
                    {portfolio.sentiment.charAt(0).toUpperCase() + portfolio.sentiment.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {portfolio.sentimentStrength ? `Strength: ${portfolio.sentimentStrength}%` : ''}
                  </span>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-1">Portfolio Tags</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {portfolio.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                <Info className="h-3 w-3 inline-block mr-1" />
                This portfolio is a simulation for demonstration purposes. Past performance 
                is not indicative of future results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
