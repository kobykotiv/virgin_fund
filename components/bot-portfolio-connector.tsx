"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowRightCircle, LinkIcon } from "lucide-react"
import type { Bot } from "@/types/bot"

interface BotPortfolioConnectorProps {
  botId: string
  onConnect?: () => void
}

export function BotPortfolioConnector({ botId, onConnect }: BotPortfolioConnectorProps) {
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>("")
  const [loadingPortfolios, setLoadingPortfolios] = useState(true)
  const [canTrade, setCanTrade] = useState(true)
  const [canWithdraw, setCanWithdraw] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [botDetails, setBotDetails] = useState<Bot | null>(null)
  
  useEffect(() => {
    fetchPortfolios()
    fetchBotDetails()
  }, [botId])
  
  const fetchPortfolios = async () => {
    try {
      setLoadingPortfolios(true)
      const response = await fetch('/api/db/portfolios')
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolios')
      }
      
      const data = await response.json()
      setPortfolios(data)
    } catch (error) {
      console.error('Error fetching portfolios:', error)
      toast({
        title: "Error",
        description: "Failed to load portfolios",
        variant: "destructive"
      })
    } finally {
      setLoadingPortfolios(false)
    }
  }
  
  const fetchBotDetails = async () => {
    try {
      const response = await fetch(`/api/db/bots/${botId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch bot details')
      }
      
      const data = await response.json()
      setBotDetails(data)
    } catch (error) {
      console.error('Error fetching bot details:', error)
    }
  }
  
  const handleConnect = async () => {
    if (!selectedPortfolioId) {
      toast({
        title: "No Portfolio Selected",
        description: "Please select a portfolio to connect this bot",
        variant: "destructive"
      })
      return
    }
    
    try {
      setConnecting(true)
      
      // Build permissions array
      const permissions = ['read']
      if (canTrade) permissions.push('trade')
      if (canWithdraw) permissions.push('withdraw')
      
      const response = await fetch('/api/db/portfolios/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portfolioId: selectedPortfolioId,
          botId,
          status: 'paused', // Always start paused for safety
          permissions
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to connect bot to portfolio')
      }
      
      toast({
        title: "Bot Connected",
        description: "Bot has been successfully connected to the selected portfolio",
      })
      
      if (onConnect) {
        onConnect()
      }
    } catch (error: any) {
      console.error('Error connecting bot:', error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect bot to portfolio",
        variant: "destructive"
      })
    } finally {
      setConnecting(false)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect to Portfolio</CardTitle>
        <CardDescription>
          Link this bot to one of your portfolios to start trading
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="portfolio">Select Portfolio</Label>
          <Select 
            value={selectedPortfolioId} 
            onValueChange={setSelectedPortfolioId}
            disabled={loadingPortfolios}
          >
            <SelectTrigger id="portfolio">
              <SelectValue placeholder={loadingPortfolios ? "Loading portfolios..." : "Select a portfolio"} />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map(portfolio => (
                <SelectItem key={portfolio._id} value={portfolio._id}>
                  {portfolio.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3 border p-3 rounded-md">
          <h4 className="font-medium">Bot Permissions</h4>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="canTrade" 
              checked={canTrade} 
              onCheckedChange={(checked) => setCanTrade(checked === true)} 
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="canTrade" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Allow Trading
              </Label>
              <p className="text-sm text-muted-foreground">
                Bot can execute trades on your behalf
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="canWithdraw" 
              checked={canWithdraw} 
              onCheckedChange={(checked) => setCanWithdraw(checked === true)} 
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="canWithdraw" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Allow Withdrawals
              </Label>
              <p className="text-sm text-muted-foreground">
                Bot can transfer funds between portfolio accounts
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-start p-3 rounded-md bg-amber-50 border border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
          <div className="text-sm text-amber-700">
            <p className="font-medium mb-1">Important Security Notice</p>
            <p>
              Connecting a bot to your portfolio grants it permission to perform actions based on 
              your selected permissions. Bots will start in paused mode for security.
            </p>
          </div>
        </div>
        
        {botDetails && (
          <div className="p-3 rounded-md bg-muted">
            <p className="font-medium">Selected Bot</p>
            <div className="flex items-center mt-2">
              <div className="mr-4">
                <p className="text-sm">{botDetails.name}</p>
                <p className="text-xs text-muted-foreground">Type: {botDetails.type}</p>
              </div>
              <div className="ml-auto">
                <ArrowRightCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        )}
        
        <Button 
          className="w-full"
          disabled={!selectedPortfolioId || connecting}
          onClick={handleConnect}
        >
          {connecting ? (
            <>Connecting...</>
          ) : (
            <>
              <LinkIcon className="h-4 w-4 mr-2" />
              Connect Bot to Portfolio
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
