"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface PortfolioAssetManagerProps {
  portfolioId: string
  userId?: string
  readOnly?: boolean
}

export function PortfolioAssetManager({ portfolioId, userId, readOnly = false }: PortfolioAssetManagerProps) {
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddAsset, setShowAddAsset] = useState(false)
  const [showTradeAsset, setShowTradeAsset] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  
  // New asset form state
  const [newAssetSymbol, setNewAssetSymbol] = useState("")
  const [newAssetQuantity, setNewAssetQuantity] = useState(0)
  const [newAssetPrice, setNewAssetPrice] = useState(0)
  const [newAssetType, setNewAssetType] = useState<"long" | "short" | "option" | "future">("long")
  
  // Trade form state
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy")
  const [tradeQuantity, setTradeQuantity] = useState(0)
  const [tradePrice, setTradePrice] = useState(0)
  
  // Automation dialog state
  const [showAutomation, setShowAutomation] = useState(false)
  const [automationType, setAutomationType] = useState<"dca" | "grid" | "martingale" | "rebalancing">("dca")
  const [automationInterval, setAutomationInterval] = useState("1w")
  const [automationAmount, setAutomationAmount] = useState(100)
  
  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/db/assets?portfolioId=${portfolioId}`)
        if (!response.ok) throw new Error("Failed to fetch assets")
        
        const data = await response.json()
        setAssets(data)
      } catch (err: any) {
        console.error("Error fetching assets:", err)
        setError(err.message || "Failed to load assets")
      } finally {
        setLoading(false)
      }
    }
    
    fetchAssets()
  }, [portfolioId])
  
  const handleAddAsset = async () => {
    try {
      if (!newAssetSymbol || newAssetQuantity <= 0 || newAssetPrice <= 0) {
        toast({
          title: "Invalid input",
          description: "Please fill in all required fields with valid values",
          variant: "destructive"
        })
        return
      }
      
      const response = await fetch("/api/db/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioId,
          symbol: newAssetSymbol,
          quantity: newAssetQuantity,
          averagePrice: newAssetPrice,
          holdingType: newAssetType
        })
      })
      
      if (!response.ok) throw new Error("Failed to add asset")
      
      const result = await response.json()
      setAssets([...assets, result])
      setShowAddAsset(false)
      
      // Reset form
      setNewAssetSymbol("")
      setNewAssetQuantity(0)
      setNewAssetPrice(0)
      
      toast({
        title: "Asset added",
        description: `Successfully added ${newAssetSymbol} to your portfolio`
      })
    } catch (err: any) {
      console.error("Error adding asset:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to add asset",
        variant: "destructive"
      })
    }
  }
  
  const handleTrade = async () => {
    try {
      if (!selectedAsset || tradeQuantity <= 0 || tradePrice <= 0) {
        toast({
          title: "Invalid input",
          description: "Please fill in all required fields with valid values",
          variant: "destructive"
        })
        return
      }
      
      // Check if selling more than owned
      if (tradeType === "sell" && tradeQuantity > selectedAsset.quantity) {
        toast({
          title: "Invalid quantity",
          description: "You cannot sell more than you own",
          variant: "destructive"
        })
        return
      }
      
      const response = await fetch("/api/db/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: selectedAsset.id,
          type: tradeType,
          quantity: tradeQuantity,
          price: tradePrice
        })
      })
      
      if (!response.ok) throw new Error("Failed to execute trade")
      
      // Refresh assets
      const assetsResponse = await fetch(`/api/db/assets?portfolioId=${portfolioId}`)
      if (!assetsResponse.ok) throw new Error("Failed to refresh assets")
      
      const assetsData = await assetsResponse.json()
      setAssets(assetsData)
      setShowTradeAsset(false)
      
      toast({
        title: "Trade executed",
        description: `Successfully ${tradeType === "buy" ? "bought" : "sold"} ${tradeQuantity} of ${selectedAsset.symbol}`
      })
    } catch (err: any) {
      console.error("Error executing trade:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to execute trade",
        variant: "destructive"
      })
    }
  }
  
  const setupAutomation = async () => {
    try {
      if (!selectedAsset) return;
      
      const automationData = {
        type: automationType,
        parameters: {
          interval: automationInterval,
          amount: automationAmount
        },
        automationRules: []
      }
      
      const response = await fetch(`/api/db/assets/${selectedAsset.id}/automate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(automationData)
      })
      
      if (!response.ok) throw new Error("Failed to set up automation")
      
      // Refresh assets
      const assetsResponse = await fetch(`/api/db/assets?portfolioId=${portfolioId}`)
      if (!assetsResponse.ok) throw new Error("Failed to refresh assets")
      
      const assetsData = await assetsResponse.json()
      setAssets(assetsData)
      setShowAutomation(false)
      
      toast({
        title: "Automation set up",
        description: `Successfully set up ${automationType} automation for ${selectedAsset.symbol}`
      })
    } catch (err: any) {
      console.error("Error setting up automation:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to set up automation",
        variant: "destructive"
      })
    }
  }
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[100px]">
            <p className="text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Portfolio Assets</CardTitle>
        {!readOnly && (
          <Button variant="outline" onClick={() => setShowAddAsset(true)}>Add Asset</Button>
        )}
      </CardHeader>
      <CardContent>
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[100px]">
            <p className="text-muted-foreground mb-2">No assets in this portfolio</p>
            {!readOnly && (
              <Button variant="secondary" size="sm" onClick={() => setShowAddAsset(true)}>Add your first asset</Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Avg. Price</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Automation</TableHead>
                {!readOnly && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.symbol}</TableCell>
                  <TableCell>
                    <Badge variant={
                      asset.holdingType === "long" ? "default" :
                      asset.holdingType === "short" ? "destructive" :
                      "secondary"
                    }>
                      {asset.holdingType}
                    </Badge>
                  </TableCell>
                  <TableCell>{asset.quantity}</TableCell>
                  <TableCell>${asset.averagePrice.toFixed(2)}</TableCell>
                  <TableCell>${(asset.quantity * asset.averagePrice).toFixed(2)}</TableCell>
                  <TableCell>
                    {asset.automatedHolding ? (
                      <Badge variant="outline">{asset.automatedHolding.type}</Badge>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  {!readOnly && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => {
                            setSelectedAsset(asset)
                            setTradePrice(asset.averagePrice)
                            setShowTradeAsset(true)
                          }}
                        >
                          Trade
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedAsset(asset)
                            setShowAutomation(true)
                          }}
                        >
                          Automate
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {/* Add Asset Dialog */}
        <Dialog open={showAddAsset} onOpenChange={setShowAddAsset}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
              <DialogDescription>
                Enter the details of the asset you want to add to your portfolio.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input 
                  id="symbol" 
                  placeholder="AAPL" 
                  value={newAssetSymbol}
                  onChange={(e) => setNewAssetSymbol(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  min="0"
                  step="0.0001"
                  value={newAssetQuantity || ""}
                  onChange={(e) => setNewAssetQuantity(Number(e.target.value))}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Average Price</Label>
                <Input 
                  id="price" 
                  type="number" 
                  min="0"
                  step="0.01"
                  value={newAssetPrice || ""}
                  onChange={(e) => setNewAssetPrice(Number(e.target.value))}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Holding Type</Label>
                <Select 
                  value={newAssetType} 
                  onValueChange={(value: "long" | "short" | "option" | "future") => setNewAssetType(value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="option">Option</SelectItem>
                    <SelectItem value="future">Future</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddAsset(false)}>Cancel</Button>
              <Button onClick={handleAddAsset}>Add Asset</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Trade Asset Dialog */}
        <Dialog open={showTradeAsset} onOpenChange={setShowTradeAsset}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Trade {selectedAsset?.symbol}</DialogTitle>
              <DialogDescription>
                Execute a buy or sell order for this asset.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tradeType">Trade Type</Label>
                <Select 
                  value={tradeType} 
                  onValueChange={(value: "buy" | "sell") => setTradeType(value)}
                >
                  <SelectTrigger id="tradeType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tradeQuantity">Quantity</Label>
                <Input 
                  id="tradeQuantity" 
                  type="number" 
                  min="0"
                  step="0.0001"
                  value={tradeQuantity || ""}
                  onChange={(e) => setTradeQuantity(Number(e.target.value))}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tradePrice">Price</Label>
                <Input 
                  id="tradePrice" 
                  type="number" 
                  min="0"
                  step="0.01"
                  value={tradePrice || ""}
                  onChange={(e) => setTradePrice(Number(e.target.value))}
                />
              </div>
              
              {selectedAsset && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">Current Position</p>
                  <p className="text-sm">Quantity: {selectedAsset.quantity}</p>
                  <p className="text-sm">Average Price: ${selectedAsset.averagePrice.toFixed(2)}</p>
                  <p className="text-sm">Total Value: ${(selectedAsset.quantity * selectedAsset.averagePrice).toFixed(2)}</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTradeAsset(false)}>Cancel</Button>
              <Button 
                onClick={handleTrade}
                variant={tradeType === "buy" ? "default" : "destructive"}
              >
                {tradeType === "buy" ? "Buy" : "Sell"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Asset Automation Dialog */}
        <Dialog open={showAutomation} onOpenChange={setShowAutomation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Setup Automation for {selectedAsset?.symbol}</DialogTitle>
              <DialogDescription>
                Configure automated trading strategies for this asset.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="dca">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="dca" onClick={() => setAutomationType("dca")}>DCA</TabsTrigger>
                <TabsTrigger value="grid" onClick={() => setAutomationType("grid")}>Grid</TabsTrigger>
                <TabsTrigger value="rebalance" onClick={() => setAutomationType("rebalancing")}>Rebalance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dca" className="py-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="interval">Purchase Interval</Label>
                    <Select 
                      value={automationInterval} 
                      onValueChange={setAutomationInterval}
                    >
                      <SelectTrigger id="interval">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1d">Daily</SelectItem>
                        <SelectItem value="1w">Weekly</SelectItem>
                        <SelectItem value="2w">Bi-weekly</SelectItem>
                        <SelectItem value="1m">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Purchase Amount ($)</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      min="1"
                      value={automationAmount || ""}
                      onChange={(e) => setAutomationAmount(Number(e.target.value))}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="grid" className="py-4">
                <div className="p-4 rounded-md bg-muted text-center">
                  <p>Grid trading automation allows you to set up a range of buy and sell orders at different price levels.</p>
                  <p className="mt-2 text-sm text-muted-foreground">Configure in the advanced settings panel.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="rebalance" className="py-4">
                <div className="p-4 rounded-md bg-muted text-center">
                  <p>Rebalancing automation will maintain this asset at a target percentage of your portfolio.</p>
                  <p className="mt-2 text-sm text-muted-foreground">Configure in the advanced settings panel.</p>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAutomation(false)}>Cancel</Button>
              <Button onClick={setupAutomation}>Setup Automation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
