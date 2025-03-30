"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RefreshCw, Share2, Settings, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { PortfolioPerformance } from "@/components/portfolio-performance"
import { PortfolioAllocation } from "@/components/portfolio-allocation"
import { PortfolioAssetManager } from "@/components/portfolio-asset-manager"
import { PortfolioBotManager } from "@/components/portfolio-bot-manager"

export default function PortfolioPage() {
  const params = useParams()
  const router = useRouter()
  const portfolioId = params.id as string
  
  const [portfolio, setPortfolio] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/db/portfolios/${portfolioId}`)
        if (!response.ok) throw new Error("Failed to fetch portfolio details")
        
        const data = await response.json()
        setPortfolio(data)
      } catch (err: any) {
        console.error("Error loading portfolio:", err)
        setError(err.message || "Failed to load portfolio details")
      } finally {
        setLoading(false)
      }
    }
    
    fetchPortfolio()
  }, [portfolioId])
  
  const handleSyncPortfolio = async () => {
    try {
      const response = await fetch(`/api/db/portfolios/${portfolioId}/sync`, {
        method: "POST"
      })
      
      if (!response.ok) throw new Error("Failed to sync portfolio")
      
      toast({
        title: "Portfolio Synced",
        description: "Your portfolio has been synchronized with the latest market data"
      })
      
      // Refresh portfolio data
      const updatedResponse = await fetch(`/api/db/portfolios/${portfolioId}`)
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json()
        setPortfolio(updatedData)
      }
    } catch (err: any) {
      console.error("Error syncing portfolio:", err)
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: err.message || "Failed to synchronize portfolio"
      })
    }
  }
  
  const handleDeletePortfolio = async () => {
    if (!confirm("Are you sure you want to delete this portfolio? This action cannot be undone.")) {
      return
    }
    
    try {
      const response = await fetch(`/api/db/portfolios/${portfolioId}`, {
        method: "DELETE"
      })
      
      if (!response.ok) throw new Error("Failed to delete portfolio")
      
      toast({
        title: "Portfolio Deleted",
        description: "Your portfolio has been permanently deleted"
      })
      
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Error deleting portfolio:", err)
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: err.message || "Failed to delete portfolio"
      })
    }
  }
  
  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Loading Portfolio...</h1>
          </div>
        </div>
        
        <div className="h-[500px] flex items-center justify-center">
          <p>Loading portfolio details...</p>
        </div>
      </div>
    )
  }
  
  if (error || !portfolio) {
    return (
      <div className="container py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Portfolio Error</h1>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-4">{error || "Portfolio not found"}</p>
            <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{portfolio.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{portfolio.type}</Badge>
              <Badge variant="outline" className={
                portfolio.risk === "aggressive" ? "bg-red-100 text-red-800" :
                portfolio.risk === "moderate" ? "bg-amber-100 text-amber-800" :
                "bg-green-100 text-green-800"
              }>
                {portfolio.risk}
              </Badge>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Created {new Date(portfolio.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSyncPortfolio}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDeletePortfolio} className="text-red-500 hover:text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <PortfolioPerformance portfolioId={portfolioId} />
        <PortfolioAllocation portfolioId={portfolioId} />
      </div>
      
      <Tabs defaultValue="assets">
        <TabsList>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="bots">Trading Bots</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets" className="mt-4">
          <PortfolioAssetManager portfolioId={portfolioId} />
        </TabsContent>
        
        <TabsContent value="bots" className="mt-4">
          <PortfolioBotManager portfolioId={portfolioId} />
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All transactions for this portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No transactions recorded yet
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
