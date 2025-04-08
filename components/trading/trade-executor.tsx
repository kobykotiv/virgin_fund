import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Trade, Position } from "@/types/bot"

interface TradeExecutorProps {
  position?: Position
  onExecute: (trade: Partial<Trade>) => Promise<void>
}

export function TradeExecutor({ position, onExecute }: TradeExecutorProps) {
  const [quantity, setQuantity] = useState<number>(0)
  const [price, setPrice] = useState<number>(0)
  const [isExecuting, setIsExecuting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (position) {
      setPrice(position.currentPrice)
    }
  }, [position])

  const handleExecute = async (side: "buy" | "sell") => {
    try {
      setIsExecuting(true)
      await onExecute({
        symbol: position?.symbol,
        side,
        quantity,
        price,
        type: "market",
        timestamp: new Date().toISOString()
      })
      
      toast({
        title: "Trade Executed",
        description: `Successfully ${side} ${quantity} shares of ${position?.symbol}`
      })
    } catch (error) {
      toast({
        title: "Trade Failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Execution</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="market">
          <TabsList>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="limit">Limit</TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="Quantity"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => handleExecute("buy")}
                disabled={isExecuting || !quantity}
                className="bg-green-500 hover:bg-green-600"
              >
                Buy
              </Button>
              <Button
                onClick={() => handleExecute("sell")}
                disabled={isExecuting || !quantity}
                className="bg-red-500 hover:bg-red-600"
              >
                Sell
              </Button>
            </div>
          </TabsContent>
        </CardContent>
    </Card>
  )
}
