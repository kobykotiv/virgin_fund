import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import Marquee from "react-fast-marquee"
import Image from "next/image"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { MarketTicker } from "@/components/market/market-ticker";

export function MarqueesSection() {
  // Create multiplied content for strategies
  const strategies = [
    { name: "Trend Following", performance: "+18.2%", positive: true, timeframe: "3m" },
    { name: "Mean Reversion", performance: "+12.5%", positive: true, timeframe: "3m" },
    { name: "Breakout Strategy", performance: "+15.7%", positive: true, timeframe: "3m" },
    { name: "Grid Trading", performance: "+9.8%", positive: true, timeframe: "3m" },
    { name: "Momentum Strategy", performance: "+21.3%", positive: true, timeframe: "3m" },
    { name: "Bollinger Bands", performance: "+14.2%", positive: true, timeframe: "3m" },
    { name: "MACD Crossover", performance: "-2.4%", positive: false, timeframe: "3m" },
    { name: "RSI Strategy", performance: "+10.9%", positive: true, timeframe: "3m" }
  ].flatMap(strategy => Array(6).fill(strategy)); // Repeat 6 times
  
  // Multiply demo bots for each category
  const demoBotRows = [
    {
      title: "Crypto Trading Bots",
      bots: [
        { name: "BTC Momentum", market: "Crypto", returns: "+31.2%", trades: 234 },
        { name: "ETH Scalper", market: "Crypto", returns: "+28.7%", trades: 567 },
        { name: "SOL DCA", market: "Crypto", returns: "+45.3%", trades: 123 },
        { name: "DeFi Index", market: "Crypto", returns: "+19.8%", trades: 89 },
        { name: "Crypto Grid", market: "Crypto", returns: "+22.4%", trades: 445 }
      ].flatMap(bot => Array(4).fill(bot)) // Repeat 4 times
    },
    {
      title: "Stock Trading Bots",
      bots: [
        { name: "Tech Giants", market: "Stocks", returns: "+18.9%", trades: 156 },
        { name: "Blue Chip DCA", market: "Stocks", returns: "+12.4%", trades: 324 },
        { name: "Growth Scanner", market: "Stocks", returns: "+26.7%", trades: 234 },
        { name: "Value Finder", market: "Stocks", returns: "+15.3%", trades: 178 },
        { name: "Dividend Elite", market: "Stocks", returns: "+11.8%", trades: 145 }
      ].flatMap(bot => Array(4).fill(bot)) // Repeat 4 times
    },
    {
      title: "Forex Trading Bots",
      bots: [
        { name: "EUR/USD Trend", market: "Forex", returns: "+9.4%", trades: 789 },
        { name: "GBP/JPY Swing", market: "Forex", returns: "+12.8%", trades: 567 },
        { name: "USD Index", market: "Forex", returns: "+7.6%", trades: 432 },
        { name: "Forex Reversal", market: "Forex", returns: "+15.2%", trades: 654 },
        { name: "Currency Grid", market: "Forex", returns: "+8.9%", trades: 321 }
      ].flatMap(bot => Array(4).fill(bot)) // Repeat 4 times
    }
  ];

  const assets = [
    // Low Risk - Blue (Indexes & Large Cap)
    { name: "S&P 500", symbol: "SPX", logo: "/images/assets/spy.png", type: "Index", risk: "low" },
    { name: "Nasdaq", symbol: "NDX", logo: "/images/assets/ndx.png", type: "Index", risk: "low" },
    { name: "Dow Jones", symbol: "DJI", logo: "/images/assets/dji.png", type: "Index", risk: "low" },
    { name: "Russell 2000", symbol: "RUT", logo: "/images/assets/rut.png", type: "Index", risk: "low" },
    { name: "FTSE 100", symbol: "UKX", logo: "/images/assets/ftse.png", type: "Index", risk: "low" },
    { name: "DAX", symbol: "DAX", logo: "/images/assets/dax.png", type: "Index", risk: "low" },

    // Medium Risk - Green (Blue Chip Stocks)
    { name: "Apple", symbol: "AAPL", logo: "/images/assets/aapl.png", type: "Stock", risk: "medium" },
    { name: "Microsoft", symbol: "MSFT", logo: "/images/assets/msft.png", type: "Stock", risk: "medium" },
    { name: "Amazon", symbol: "AMZN", logo: "/images/assets/amzn.png", type: "Stock", risk: "medium" },
    { name: "Tesla", symbol: "TSLA", logo: "/images/assets/tsla.png", type: "Stock", risk: "medium" },
    { name: "Nvidia", symbol: "NVDA", logo: "/images/assets/nvda.png", type: "Stock", risk: "medium" },
    { name: "JPMorgan", symbol: "JPM", logo: "/images/assets/jpm.png", type: "Stock", risk: "medium" },

    // Medium-High Risk - Yellow (Growth Stocks & ETFs)
    { name: "ARK Innovation", symbol: "ARKK", logo: "/images/assets/arkk.png", type: "ETF", risk: "medium-high" },
    { name: "Palantir", symbol: "PLTR", logo: "/images/assets/pltr.png", type: "Stock", risk: "medium-high" },
    { name: "Cloudflare", symbol: "NET", logo: "/images/assets/net.png", type: "Stock", risk: "medium-high" },
    { name: "Unity", symbol: "U", logo: "/images/assets/unity.png", type: "Stock", risk: "medium-high" },
    { name: "Robinhood", symbol: "HOOD", logo: "/images/assets/hood.png", type: "Stock", risk: "medium-high" },
    { name: "Block", symbol: "SQ", logo: "/images/assets/sq.png", type: "Stock", risk: "medium-high" },

    // High Risk - Orange (Crypto)
    { name: "Bitcoin", symbol: "BTC", logo: "/images/assets/btc.png", type: "Crypto", risk: "high" },
    { name: "Ethereum", symbol: "ETH", logo: "/images/assets/eth.png", type: "Crypto", risk: "high" },
    { name: "Solana", symbol: "SOL", logo: "/images/assets/sol.png", type: "Crypto", risk: "high" },
    { name: "Cardano", symbol: "ADA", logo: "/images/assets/ada.png", type: "Crypto", risk: "high" },
    { name: "Polkadot", symbol: "DOT", logo: "/images/assets/dot.png", type: "Crypto", risk: "high" },
    { name: "Avalanche", symbol: "AVAX", logo: "/images/assets/avax.png", type: "Crypto", risk: "high" },

    // Ultra High Risk - Red (Leveraged ETFs)
    { name: "TQQQ", symbol: "TQQQ", logo: "/images/assets/tqqq.png", type: "Leveraged", risk: "ultra" },
    { name: "SQQQ", symbol: "SQQQ", logo: "/images/assets/sqqq.png", type: "Leveraged", risk: "ultra" },
    { name: "SPXL", symbol: "SPXL", logo: "/images/assets/spxl.png", type: "Leveraged", risk: "ultra" },
    { name: "FNGU", symbol: "FNGU", logo: "/images/assets/fngu.png", type: "Leveraged", risk: "ultra" },
    { name: "YINN", symbol: "YINN", logo: "/images/assets/yinn.png", type: "Leveraged", risk: "ultra" },
    { name: "SVXY", symbol: "SVXY", logo: "/images/assets/svxy.png", type: "Leveraged", risk: "ultra" },

    // Safe Haven - Purple (Bonds & Precious Metals)
    { name: "US 10Y Treasury", symbol: "US10Y", logo: "/images/assets/us10y.png", type: "Bond", risk: "safe" },
    { name: "Gold", symbol: "GLD", logo: "/images/assets/gold.png", type: "Commodity", risk: "safe" },
    { name: "Silver", symbol: "SLV", logo: "/images/assets/silver.png", type: "Commodity", risk: "safe" },
    { name: "TIPS", symbol: "TIP", logo: "/images/assets/tips.png", type: "Bond", risk: "safe" },
    { name: "Municipal Bonds", symbol: "MUB", logo: "/images/assets/mub.png", type: "Bond", risk: "safe" },
    { name: "Treasury Bills", symbol: "BIL", logo: "/images/assets/bil.png", type: "Bond", risk: "safe" }
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-blue-500 bg-blue-500/10'
      case 'medium': return 'text-green-500 bg-green-500/10'
      case 'medium-high': return 'text-yellow-500 bg-yellow-500/10'
      case 'high': return 'text-orange-500 bg-orange-500/10'
      case 'ultra': return 'text-red-500 bg-red-500/10'
      case 'safe': return 'text-purple-500 bg-purple-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  // Group and multiply assets
  const assetRows = [
    {
      title: "Major Indices",
      assets: assets.filter(a => a.type === "Index")
        .flatMap(asset => Array(3).fill(asset)) // Repeat 3 times
    },
    {
      title: "Blue Chip Stocks",
      assets: assets.filter(a => a.type === "Stock" && a.risk === "medium")
        .flatMap(asset => Array(3).fill(asset))
    },
    {
      title: "Growth Stocks",
      assets: assets.filter(a => a.type === "Stock" && a.risk === "medium-high")
        .flatMap(asset => Array(3).fill(asset))
    },
    {
      title: "Cryptocurrency",
      assets: assets.filter(a => a.type === "Crypto")
        .flatMap(asset => Array(3).fill(asset))
    },
    {
      title: "ETFs & Funds",
      assets: assets.filter(a => a.type === "ETF" || a.type === "Leveraged")
        .flatMap(asset => Array(3).fill(asset))
    },
    {
      title: "Safe Haven Assets",
      assets: assets.filter(a => a.risk === "safe")
        .flatMap(asset => Array(3).fill(asset))
    }
  ];

  // Increase the marquee speeds slightly for better flow on large screens
  return (
    <BackgroundPaths title="Trading Bots" webEra="4.0">
      <div className="relative space-y-12 py-32">
        {/* Live Market Data Section */}
        <div className="relative">
          <div className="container mb-6">
            <h3 className="text-xl font-semibold">Live Market Data</h3>
          </div>
          <MarketTicker 
            symbols={[
              'SPY', 'QQQ', 'IWM', 'DIA',
              'AAPL', 'MSFT', 'GOOGL', 'AMZN',
              'BTC-USD', 'ETH-USD'
            ]} 
          />
        </div>

        {/* Trading Strategies Section */}
        <div className="relative">
          <div className="container mb-6">
            <h3 className="text-xl font-semibold">Popular Trading Strategies</h3>
          </div>
          <div className="relative backdrop-blur-sm bg-background/30">
            <Marquee gradient={false} speed={50}>
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
        </div>
        
        {/* Demo Bots Section - Multiple Rows */}
        {demoBotRows.map((row, index) => (
          <div key={index} className="relative">
            <div className="container mb-6">
              <h3 className="text-xl font-semibold">{row.title}</h3>
            </div>
            <div className="relative backdrop-blur-sm bg-background/30">
              <Marquee 
                gradient={false} 
                speed={35 + (index * 5)} 
                direction={index % 2 === 0 ? "left" : "right"}
              >
                <div className="flex gap-4 py-4">
                  {row.bots.map((bot, idx) => (
                    <Card key={idx} className="w-72 shrink-0">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{bot.name}</h4>
                          <Badge>{bot.market}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Return: <span className="text-green-500">{bot.returns}</span></span>
                          <span>Trades: {bot.trades}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Marquee>
            </div>
          </div>
        ))}
        
        {/* Asset Rows Section - Multiple Categories */}
        {assetRows.map((row, index) => (
          <div key={index} className="relative">
            <div className="container mb-6">
              <h3 className="text-xl font-semibold">{row.title}</h3>
            </div>
            <div className="relative backdrop-blur-sm bg-background/30">
              <Marquee 
                gradient={false} 
                speed={25 + (index * 3)} 
                direction={index % 2 === 0 ? "left" : "right"}
              >
                <div className="flex gap-8 py-4">
                  {row.assets.map((asset, idx) => (
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
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{asset.symbol}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getRiskColor(asset.risk)}`}
                          >
                            {asset.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{asset.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Marquee>
            </div>
          </div>
        ))}
      </div>
    </BackgroundPaths>
  );
}
