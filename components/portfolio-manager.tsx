"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { PortfolioAssetManager } from "@/components/portfolio-asset-manager"
import { PortfolioAllocation } from "@/components/portfolio-allocation"
import { PortfolioPerformance } from "@/components/portfolio-performance"
import { PlusCircle, Share2, Settings, Trash2, Bot } from "lucide-react"
import Link from "next/link"

export function PortfolioManager() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false)
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showBotDialog, setShowBotDialog] = useState(false)
  const [availableBots, setAvailableBots] = useState<any[]>([])
  
  // Form state for new portfolio
  const [portfolioName, setPortfolioName] = useState("")
  const [portfolioDescription, setPortfolioDescription] = useState("")
  const [accountType, setAccountType] = useState<"standard" | "margin" | "retirement" | "managed">("standard")
  const [strategy, setStrategy] = useState<"passive" | "active" | "automated" | "copy">("passive")
  const [riskProfile, setRiskProfile] = useState<"conservative" | "moderate" | "aggressive">("moderate")
  
  // Share settings
  const [isPublic, setIsPublic] = useState(false)
  const [allowCopy, setAllowCopy] = useState(false)
  const [twitterLink, setTwitterLink] = useState("")
  const [telegramLink, setTelegramLink] = useState("")
  
  // Bot settings
  const [selectedBot, setSelectedBot] = useState<string>("")
  
  // Sync settings
  const [autoSync, setAutoSync] = useState(false)
  const [syncFrequency, setSyncFrequency] = useState<"daily" | "hourly" | "realtime">("daily")
  
  useEffect(() => {
    fetchPortfolios()
  }, [])
  
  useEffect(() => {
    if (showBotDialog) {
      fetchAvailableBots()
    }
  }, [showBotDialog])
  
  const fetchPortfolios = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/db/portfolios')
      if (!response.ok) throw new Error('Failed to fetch portfolios')
      
      const data = await response.json()
      setPortfolios(data)
      
      // Set first portfolio as selected if any exist and none is selected
      if (data.length > 0 && !selectedPortfolio) {
        setSelectedPortfolio(data[0].id)
      }
    } catch (err: any) {
      console.error('Error fetching portfolios:', err)
      setError(err.message || 'Failed to load portfolios')
    } finally {
      setLoading(false)
    }
  }
  
  const fetchAvailableBots = async () => {
    try {
      const response = await fetch('/api/db/bots')
      if (!response.ok) throw new Error('Failed to fetch bots')
      
      const data = await response.json()
      setAvailableBots(data)
    } catch (err: any) {
      console.error('Error fetching bots:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load available bots"
      })
    }
  }
  
  const syncPortfolio = async (portfolioId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/db/portfolios/${portfolioId}/sync`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to sync portfolio')
      
      toast({
        title: "Portfolio Synchronized",
        description: "Your portfolio has been updated with the latest market data"
      })
      
      await fetchPortfolios()
    } catch (err: any) {
      console.error('Error syncing portfolio:', err)
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: err.message || "Failed to synchronize portfolio"
      })
    } finally {
      setLoading(false)
    }
  }
  
  const createPortfolio = async () => {
    try {
      if (!portfolioName) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please enter a portfolio name"
        })
        return
      }
      
      const response = await fetch('/api/db/portfolios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: portfolioName,
          description: portfolioDescription,
          accountType,
          strategy,
          riskProfile,
          sharing: {
            isPublic: false,
            allowCopy: false
          }
        })
      })
      
      if (!response.ok) throw new Error('Failed to create portfolio')
      
      const newPortfolio = await response.json()
      
      // Reset form and refresh portfolios
      setShowCreatePortfolio(false)
      resetPortfolioForm()
      
      await fetchPortfolios()
      
      // Select the newly created portfolio
      setSelectedPortfolio(newPortfolio.id)
      
      toast({
        title: "Portfolio created",
        description: "Your new portfolio was successfully created"
      })
    } catch (err: any) {
      console.error('Error creating portfolio:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || 'Failed to create portfolio'
      })
    }
  }
  
  const updatePortfolioSharing = async () => {
    if (!selectedPortfolio) return
    
    try {
      const response = await fetch('/api/portfolios/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portfolioId: selectedPortfolio,
          isPublic,
          allowCopy,
          socialLinks: {
            twitter: twitterLink,
            telegram: telegramLink
          }
        })
      })
      
      if (!response.ok) throw new Error('Failed to update sharing settings')
      
      setShowShareDialog(false)
      
      toast({
        title: "Sharing updated",
        description: "Portfolio sharing settings have been updated"
      })
      
      // Refresh portfolios to get updated data
      fetchPortfolios()
    } catch (err: any) {
      console.error('Error updating sharing settings:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || 'Failed to update sharing settings'
      })
    }
  }
  
  const addBotToPortfolio = async () => {
    if (!selectedPortfolio || !selectedBot) return
    
    try {
      const response = await fetch('/api/db/portfolios/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portfolioId: selectedPortfolio,
          botId: selectedBot,
          status: 'paused',
          permissions: ['read', 'trade']
        })
      })
      
      if (!response.ok) throw new Error('Failed to add bot to portfolio')
      
      setShowBotDialog(false)
      setSelectedBot("")
      
      toast({
        title: "Bot added",
        description: "Trading bot has been added to your portfolio"
      })
      
      // Refresh portfolios to get updated data
      fetchPortfolios()
    } catch (err: any) {
      console.error('Error adding bot to portfolio:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || 'Failed to add bot to portfolio'
      })
    }
  }
  
  const deletePortfolio = async (id: string) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this portfolio? This action cannot be undone.")
      if (!confirmed) return
      
      const response = await fetch(`/api/db/portfolios/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete portfolio')
      
      // Remove from local state and select another portfolio if possible
      setPortfolios(portfolios.filter(p => p.id !== id))
      
      if (selectedPortfolio === id) {
        const remainingPortfolios = portfolios.filter(p => p.id !== id)
        setSelectedPortfolio(remainingPortfolios.length > 0 ? remainingPortfolios[0].id : null)
      }
      
      toast({
        title: "Portfolio deleted",
        description: "Your portfolio has been permanently deleted"
      })
    } catch (err: any) {
      console.error('Error deleting portfolio:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || 'Failed to delete portfolio'
      })
    }
  }
  
  const resetPortfolioForm = () => {
    setPortfolioName("")
    setPortfolioDescription("")
    setAccountType("standard")
    setStrategy("passive")
    setRiskProfile("moderate")
  }
  
  const getCurrentPortfolio = () => {
    return portfolios.find(p => p.id === selectedPortfolio)
  }
  
  const handleShareClick = () => {
    const portfolio = getCurrentPortfolio()
    
    if (portfolio) {
      // Initialize share dialog with current settings
      setIsPublic(portfolio.sharing?.isPublic || false)
      setAllowCopy(portfolio.sharing?.allowCopy || false)
      setTwitterLink(portfolio.sharing?.socialLinks?.twitter || '')
      setTelegramLink(portfolio.sharing?.socialLinks?.telegram || '')
      setShowShareDialog(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Portfolios</h2>
        <Button onClick={() => setShowCreatePortfolio(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> New Portfolio
        </Button>
      </div>

      {/* Display portfolios in a simplified table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead>Assets</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portfolios.map((portfolio) => (
            // ...existing portfolio row code...
          ))}
        </TableBody>
      </Table>

      {/* Simplified create/edit dialogs */}
      <Dialog open={showCreatePortfolio} onOpenChange={setShowCreatePortfolio}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Portfolio</DialogTitle>
            <DialogDescription>
              Set up a new portfolio with your preferred investment strategy.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Portfolio Name</Label>
              <Input 
                id="name" 
                placeholder="My Investment Portfolio" 
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your portfolio strategy and goals" 
                value={portfolioDescription}
                onChange={(e) => setPortfolioDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type</Label>
              <Select 
                value={accountType} 
                onValueChange={(value: "standard" | "margin" | "retirement" | "managed") => setAccountType(value)}
              >
                <SelectTrigger id="accountType">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="margin">Margin</SelectItem>
                  <SelectItem value="retirement">Retirement</SelectItem>
                  <SelectItem value="managed">Managed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy">Investment Strategy</Label>
              <Select 
                value={strategy} 
                onValueChange={(value: "passive" | "active" | "automated" | "copy") => setStrategy(value)}
              >
                <SelectTrigger id="strategy">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passive">Passive</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="automated">Automated</SelectItem>
                  <SelectItem value="copy">Copy Trading</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="riskProfile">Risk Profile</Label>
              <Select 
                value={riskProfile} 
                onValueChange={(value: "conservative" | "moderate" | "aggressive") => setRiskProfile(value)}
              >
                <SelectTrigger id="riskProfile">
                  <SelectValue placeholder="Select risk profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreatePortfolio(false)}>Cancel</Button>
            <Button onClick={createPortfolio}>Create Portfolio</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Portfolio</DialogTitle>
            <DialogDescription>
              Configure how your portfolio is shared with others.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isPublic">Make Portfolio Public</Label>
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="toggle"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="allowCopy">Allow Copy Trading</Label>
              <input
                type="checkbox"
                id="allowCopy"
                checked={allowCopy}
                onChange={(e) => setAllowCopy(e.target.checked)}
                className="toggle"
                disabled={!isPublic}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitterLink">Twitter Share Link (Optional)</Label>
              <Input 
                id="twitterLink" 
                placeholder="https://twitter.com/yourusername" 
                value={twitterLink}
                onChange={(e) => setTwitterLink(e.target.value)}
                disabled={!isPublic}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telegramLink">Telegram Share Link (Optional)</Label>
              <Input 
                id="telegramLink" 
                placeholder="https://t.me/yourgroup" 
                value={telegramLink}
                onChange={(e) => setTelegramLink(e.target.value)}
                disabled={!isPublic}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>Cancel</Button>
            <Button onClick={updatePortfolioSharing}>Save Sharing Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showBotDialog} onOpenChange={setShowBotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Trading Bot</DialogTitle>
            <DialogDescription>
              Connect an automated trading bot to this portfolio.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="botSelect">Select Bot</Label>
              <Select 
                value={selectedBot} 
                onValueChange={setSelectedBot}
              >
                <SelectTrigger id="botSelect">
                  <SelectValue placeholder="Choose a trading bot" />
                </SelectTrigger>
                <SelectContent>
                  {availableBots.length === 0 ? (
                    <SelectItem value="none" disabled>No bots available</SelectItem>
                  ) : (
                    availableBots.map(bot => (
                      <SelectItem key={bot.id} value={bot.id}>
                        {bot.name} ({bot.type})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {selectedBot && (
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-medium mb-2">Bot Details</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  This bot will start in paused mode. You can activate it after review.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Trading bots can execute trades automatically based on their strategy.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBotDialog(false)}>Cancel</Button>
            <Button onClick={addBotToPortfolio} disabled={!selectedBot}>
              Add Bot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
