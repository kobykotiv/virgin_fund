"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, RefreshCw, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { executeOrder, fetchDemoOrders } from "@/lib/bot-api"
import { useAuth } from "@/providers/auth-provider"

interface Order {
  id: string
  symbol: string
  side: "buy" | "sell"
  type: "market" | "limit"
  quantity: number
  price?: number
  status: "open" | "filled" | "canceled"
  createdAt: string
  filledAt?: string
  filledPrice?: number
  filledQuantity?: number
  botId?: string
  value?: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false)
  const [newOrder, setNewOrder] = useState({
    symbol: "AAPL",
    side: "buy",
    type: "market",
    quantity: 1,
    price: undefined,
  })
  const { toast } = useToast()
  const { isDemoMode } = useAuth()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      if (isDemoMode) {
        // Fetch demo orders
        const demoOrders = await fetchDemoOrders()
        setOrders(demoOrders)
      } else {
        // In a real app, this would fetch from your API
        // For demo, we'll create mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockOrders: Order[] = [
          {
            id: "ord_1",
            symbol: "AAPL",
            side: "buy",
            type: "market",
            quantity: 10,
            status: "filled",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            filledAt: new Date(Date.now() - 3540000).toISOString(),
            filledPrice: 182.45,
            filledQuantity: 10,
            botId: "1",
          },
          {
            id: "ord_2",
            symbol: "MSFT",
            side: "sell",
            type: "limit",
            quantity: 5,
            price: 350.0,
            status: "open",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: "ord_3",
            symbol: "GOOGL",
            side: "buy",
            type: "market",
            quantity: 2,
            status: "filled",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            filledAt: new Date(Date.now() - 86340000).toISOString(),
            filledPrice: 131.22,
            filledQuantity: 2,
            botId: "3",
          },
        ]

        setOrders(mockOrders)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrder = async () => {
    try {
      // Validate order
      if (newOrder.type === "limit" && !newOrder.price) {
        throw new Error("Price is required for limit orders")
      }

      if (newOrder.quantity <= 0) {
        throw new Error("Quantity must be greater than 0")
      }

      // Execute order
      const result = await executeOrder(newOrder)

      // Add to orders list
      const createdOrder: Order = {
        id: result.id,
        symbol: newOrder.symbol,
        side: newOrder.side as "buy" | "sell",
        type: newOrder.type as "market" | "limit",
        quantity: newOrder.quantity,
        price: newOrder.price,
        status: result.status === "filled" ? "filled" : "open",
        createdAt: new Date().toISOString(),
        filledAt: result.filledAt,
        filledPrice: result.filledPrice,
        filledQuantity: result.filledQuantity,
      }

      setOrders([createdOrder, ...orders])
      setIsCreateOrderOpen(false)

      toast({
        title: "Order Created",
        description: `${newOrder.side.toUpperCase()} order for ${newOrder.quantity} ${newOrder.symbol} submitted successfully`,
      })

      // Reset form
      setNewOrder({
        symbol: "AAPL",
        side: "buy",
        type: "market",
        quantity: 1,
        price: undefined,
      })
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create order",
        variant: "destructive",
      })
    }
  }

  const filteredOrders =
    activeTab === "all"
      ? orders
      : activeTab === "open"
        ? orders.filter((order) => order.status === "open")
        : orders.filter((order) => order.status === "filled")

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchOrders} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" /> New Order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>Place a new order on Alpaca Markets</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="symbol" className="text-right">
                    Symbol
                  </Label>
                  <Input
                    id="symbol"
                    value={newOrder.symbol}
                    onChange={(e) => setNewOrder({ ...newOrder, symbol: e.target.value.toUpperCase() })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="side" className="text-right">
                    Side
                  </Label>
                  <Select value={newOrder.side} onValueChange={(value) => setNewOrder({ ...newOrder, side: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select side" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Order Type
                  </Label>
                  <Select value={newOrder.type} onValueChange={(value) => setNewOrder({ ...newOrder, type: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder({ ...newOrder, quantity: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                {newOrder.type === "limit" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Limit Price
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={newOrder.price}
                      onChange={(e) => setNewOrder({ ...newOrder, price: Number(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOrder}>Place Order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="open">Open Orders</TabsTrigger>
              <TabsTrigger value="filled">Filled Orders</TabsTrigger>
            </TabsList>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Filled</TableHead>
                    {isDemoMode && <TableHead className="text-right">Value</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={isDemoMode ? 9 : 8} className="h-24 text-center">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                        <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isDemoMode ? 9 : 8} className="h-24 text-center">
                        <AlertCircle className="h-5 w-5 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">No orders found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.symbol}</TableCell>
                        <TableCell>
                          <Badge variant={order.side === "buy" ? "default" : "secondary"}>
                            {order.side.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.type.toUpperCase()}</TableCell>
                        <TableCell>{order.quantity.toLocaleString()}</TableCell>
                        <TableCell>
                          {order.status === "filled"
                            ? `$${order.filledPrice?.toFixed(2)}`
                            : order.price
                              ? `$${order.price.toFixed(2)}`
                              : "Market"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.status === "filled" ? "success" : "outline"}>
                            {order.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{order.filledAt ? new Date(order.filledAt).toLocaleString() : "-"}</TableCell>
                        {isDemoMode && (
                          <TableCell className="text-right">
                            {order.value ? `$${order.value.toLocaleString()}` : "-"}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

