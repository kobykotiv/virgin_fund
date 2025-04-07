import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getMarketData } from "@/lib/market-data"

export function MarketFeed({ 
  symbols,
  interval = 5000 
}: { 
  symbols: string[]
  interval?: number 
}) {
  const [data, setData] = useState<Record<string, any>>({})
  const [view, setView] = useState<'list' | 'grid'>('list')
  
  useEffect(() => {
    const fetchData = async () => {
      const marketData = await getMarketData(symbols)
      setData(marketData)
    }
    
    fetchData()
    const timer = setInterval(fetchData, interval)
    return () => clearInterval(timer)
  }, [symbols, interval])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Market Data</CardTitle>
        <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'grid')}>
          <TabsList className="grid w-[160px] grid-cols-2">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="grid">Grid</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className={view === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-2'}>
            {Object.entries(data).map(([symbol, quote]) => (
              <MarketQuote key={symbol} symbol={symbol} data={quote} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function MarketQuote({ symbol, data }: { symbol: string; data: any }) {
  const changeColor = data.change >= 0 ? 'text-green-500' : 'text-red-500'
  
  return (
    <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
      <div className="space-y-1">
        <div className="font-medium">{symbol}</div>
        <div className="text-sm text-muted-foreground">
          Vol: {data.volume.toLocaleString()}
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono">${data.price.toFixed(2)}</div>
        <div className={`text-sm ${changeColor}`}>
          {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
