import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import Marquee from "react-fast-marquee"
import Image from "next/image"

export function MarqueesSection() {
  const strategies = [
    { name: "Trend Following", performance: "+18.2%", positive: true, timeframe: "3m" },
    { name: "Mean Reversion", performance: "+12.5%", positive: true, timeframe: "3m" },
    { name: "Breakout Strategy", performance: "+15.7%", positive: true, timeframe: "3m" },
    { name: "Grid Trading", performance: "+9.8%", positive: true, timeframe: "3m" },
    { name: "Momentum Strategy", performance: "+21.3%", positive: true, timeframe: "3m" },
    { name: "Bollinger Bands", performance: "+14.2%", positive: true, timeframe: "3m" },
    { name: "MACD Crossover", performance: "-2.4%", positive: false, timeframe: "3m" },
    { name: "RSI Strategy", performance: "+10.9%", positive: true, timeframe: "3m" }
  ]
  
  const demoBots = [
    { name: "CryptoTrend", market: "Crypto", returns: "+24.7%", trades: 143 },
    { name: "StockMomentum", market: "Stocks", returns: "+16.2%", trades: 89 },
    { name: "ForexScalper", market: "Forex", returns: "+8.5%", trades: 312 },
    { name: "ETF Rotator", market: "ETFs", returns: "+12.9%", trades: 26 },
    { name: "CommodityTracker", market: "Commodities", returns: "+19.3%", trades: 67 }
  ]
  
  const assets = [
    { name: "Bitcoin", symbol: "BTC", logo: "/images/assets/btc.png" },
    { name: "Ethereum", symbol: "ETH", logo: "/images/assets/eth.png" },
    { name: "Apple", symbol: "AAPL", logo: "/images/assets/aapl.png" },
    { name: "Tesla", symbol: "TSLA", logo: "/images/assets/tsla.png" },
    { name: "Amazon", symbol: "AMZN", logo: "/images/assets/amzn.png" },
    { name: "EUR/USD", symbol: "EUR/USD", logo: "/images/assets/eurusd.png" },
    { name: "Gold", symbol: "XAU", logo: "/images/assets/gold.png" },
    { name: "S&P 500", symbol: "SPY", logo: "/images/assets/spy.png" }
  ]
  
  return (
    <section className="py-16">
      <div className="space-y-12">
        <div>
          <div className="container mb-6">
            <h3 className="text-xl font-semibold">Popular Trading Strategies</h3>
          </div>
          <Marquee gradient={false} speed={40}>
            <div className="flex gap-4 py-4">
              {strategies.map((strategy, idx) => (
                <Card key={idx} className="w-64 shrink-0">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{strategy.name}</h4>
                      <Badge variant={strategy.positive ? "success" : "destructive"}>
                        {strategy.positive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {strategy.performance}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Performance over last {strategy.timeframe}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Marquee>
        </div>
        
        <div>
          <div className="container mb-6">
            <h3 className="text-xl font-semibold">Live Demo Bots</h3>
          </div>
          <Marquee gradient={false} speed={30} direction="right">
            <div className="flex gap-4 py-4">
              {demoBots.map((bot, idx) => (
                <Card key={idx} className="w-72 shrink-0">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{bot.name}</h4>
                      <Badge>{bot.market}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>3-month return: <span className="text-green-500">{bot.returns}</span></span>
                      <span>Trades: {bot.trades}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Marquee>
        </div>
        
        <div>
          <div className="container mb-6">
            <h3 className="text-xl font-semibold">Supported Assets</h3>
          </div>
          <Marquee gradient={false} speed={20}>
            <div className="flex gap-8 py-4">
              {assets.map((asset, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="relative h-8 w-8">
                    <Image 
                      src={asset.logo} 
                      alt={asset.name} 
                      fill 
                      className="object-contain" 
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{asset.symbol}</p>
                    <p className="text-xs text-muted-foreground">{asset.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </section>
  )
}
