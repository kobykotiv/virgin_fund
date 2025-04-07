import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { PortfolioChart } from "./portfolio-chart"
import { PortfolioLineChart } from "./portfolio-line-chart"
import { Loader2, LucideIcon, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "./ui/progress"

interface PortfolioDemoCardProps {
  portfolio: {
    id: string
    name: string
    focus: string
    risk: string
    tags: string[]
    value: string
    return: string
    returnClass: string
    chartVariant: "up" | "down" | "volatile"
    allocation: { name: string; value: number }[]
    icon: LucideIcon // Change icon type to LucideIcon
    historicalData?: Array<{ date: string; value: number }> // Make historical data optional
    sentiment?: "bullish" | "bearish" | "neutral"
    sentimentStrength?: number // 0-100
    fearGreedIndex?: number // 0-100
    fearGreedLabel?: string // "Extreme Fear" to "Extreme Greed"
  }
  onSelect: (id: string) => void
  isLoading?: boolean
  activeDemo?: string | null
  className?: string
}

export function PortfolioDemoCard({
  portfolio,
  onSelect,
  isLoading,
  activeDemo,
  className,
}: PortfolioDemoCardProps) {
  // Create icon element from the icon component
  const Icon = portfolio.icon
  
  const renderSentimentBadge = () => {
    if (!portfolio.sentiment) return null;
    
    return (
      <Badge 
        variant={portfolio.sentiment === "bullish" ? "success" : 
                portfolio.sentiment === "bearish" ? "destructive" : "secondary"} 
        className="flex items-center gap-1">
        {portfolio.sentiment === "bullish" ? <TrendingUp className="h-3 w-3" /> : 
         portfolio.sentiment === "bearish" ? <TrendingDown className="h-3 w-3" /> : null}
        {portfolio.sentiment === "bullish" ? "Bullish" : 
         portfolio.sentiment === "bearish" ? "Bearish" : "Neutral"}
      </Badge>
    );
  };
  
  const getFearGreedColor = (index: number) => {
    if (index < 25) return "bg-red-500"; // Extreme Fear
    if (index < 40) return "bg-orange-500"; // Fear
    if (index < 60) return "bg-yellow-500"; // Neutral
    if (index < 75) return "bg-green-500"; // Greed
    return "bg-emerald-500"; // Extreme Greed
  };
  
  return (
    <Card className={cn("overflow-hidden h-full flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Icon className="h-4 w-4" /> {/* Render icon with proper sizing */}
              {portfolio.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">{portfolio.focus}</CardDescription>
          </div>
          <Badge 
            variant={portfolio.risk === "Low" ? "outline" : 
                    portfolio.risk === "Moderate" ? "secondary" : "destructive"}>
            {portfolio.risk}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square relative bg-muted/20 rounded-lg overflow-hidden">
            <PortfolioChart 
              portfolioType={portfolio.id} 
              className="absolute inset-0"
            />
          </div>
          {portfolio.historicalData && (
            <div className="aspect-square relative bg-muted/20 rounded-lg overflow-hidden">
              <PortfolioLineChart
                data={portfolio.historicalData}
                className="absolute inset-0"
              />
            </div>
          )}
        </div>
        
        {/* Sentiment and Fear/Greed Section */}
        {(portfolio.sentiment || portfolio.fearGreedIndex) && (
          <div className="space-y-2 border-t border-b py-2">
            <div className="flex justify-between items-center">
              {renderSentimentBadge()}
              
              {portfolio.sentimentStrength && (
                <span className="text-xs font-medium">
                  Strength: {portfolio.sentimentStrength}%
                </span>
              )}
            </div>
            
            {portfolio.fearGreedIndex !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Fear & Greed</span>
                  <span className="font-medium">{portfolio.fearGreedLabel || `${portfolio.fearGreedIndex}/100`}</span>
                </div>
                <div className="relative h-2 w-full bg-muted rounded overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all ${getFearGreedColor(portfolio.fearGreedIndex)}`}
                    style={{ width: `${portfolio.fearGreedIndex}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex flex-wrap gap-1">
          {portfolio.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center text-sm">
          <div>
            <p className="font-medium">Value</p>
            <p className="text-lg font-bold">{portfolio.value}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">Return</p>
            <p className={`text-base font-semibold ${portfolio.returnClass} flex items-center justify-end gap-1`}>
              {portfolio.return.charAt(0) === '+' ? 
                <ArrowUpRight className="h-3 w-3" /> : 
                portfolio.return.charAt(0) === '-' ? 
                <ArrowDownRight className="h-3 w-3" /> : null}
              {portfolio.return}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          className="w-full"
          onClick={() => onSelect(portfolio.id)}
          disabled={isLoading}
        >
          {isLoading && activeDemo === portfolio.id ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Try This Demo
        </Button>
      </CardFooter>
    </Card>
  )
}
