"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  TrendingUp,
  Copy,
  MessageCircle,
  Heart,
  Share2,
  Star,
  Trophy,
  Target,
  BarChart3
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Trader {
  id: string
  username: string
  avatar?: string
  bio: string
  followers: number
  following: number
  totalReturn: number
  winRate: number
  riskScore: number
  strategy: string
  isFollowing: boolean
  isVerified: boolean
  lastActive: string
  portfolioValue: number
  monthlyReturn: number
  totalTrades: number
}

interface TradeSignal {
  id: string
  traderId: string
  traderName: string
  symbol: string
  action: 'BUY' | 'SELL'
  price: number
  quantity: number
  timestamp: string
  confidence: number
  reasoning: string
  likes: number
  comments: number
  isLiked: boolean
}

interface SocialTradingProps {
  userId?: string
}

export function SocialTradingNetwork({ userId }: SocialTradingProps) {
  const [traders, setTraders] = useState<Trader[]>([])
  const [signals, setSignals] = useState<TradeSignal[]>([])
  const [activeTab, setActiveTab] = useState("discover")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadSocialData()
  }, [])

  const loadSocialData = async () => {
    try {
      setIsLoading(true)

      // Fetch top traders
      const tradersResponse = await fetch('/api/social/traders')
      const tradersData = await tradersResponse.json()
      setTraders(tradersData)

      // Fetch recent signals
      const signalsResponse = await fetch('/api/social/signals')
      const signalsData = await signalsResponse.json()
      setSignals(signalsData)

    } catch (error) {
      console.error('Error loading social data:', error)
      toast({
        title: "Error",
        description: "Failed to load social trading data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollowTrader = async (traderId: string) => {
    try {
      const response = await fetch(`/api/social/traders/${traderId}/follow`, {
        method: 'POST',
      })

      if (response.ok) {
        setTraders(prev => prev.map(trader =>
          trader.id === traderId
            ? { ...trader, isFollowing: !trader.isFollowing, followers: trader.isFollowing ? trader.followers - 1 : trader.followers + 1 }
            : trader
        ))

        toast({
          title: "Success",
          description: "Trader follow status updated",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      })
    }
  }

  const handleCopyTrade = async (signalId: string) => {
    try {
      const response = await fetch(`/api/social/signals/${signalId}/copy`, {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: "Trade Copied",
          description: "Signal has been copied to your portfolio",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy trade",
        variant: "destructive",
      })
    }
  }

  const handleLikeSignal = async (signalId: string) => {
    try {
      const response = await fetch(`/api/social/signals/${signalId}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        setSignals(prev => prev.map(signal =>
          signal.id === signalId
            ? { ...signal, isLiked: !signal.isLiked, likes: signal.isLiked ? signal.likes - 1 : signal.likes + 1 }
            : signal
        ))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like signal",
        variant: "destructive",
      })
    }
  }

  const renderTraderCard = (trader: Trader) => (
    <Card key={trader.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={trader.avatar} />
            <AvatarFallback>{trader.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg">{trader.username}</CardTitle>
              {trader.isVerified && <Badge variant="secondary">Verified</Badge>}
            </div>
            <CardDescription className="text-sm">{trader.bio}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              +{trader.totalReturn.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Total Return</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{trader.winRate.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>{trader.followers} followers</span>
          <span>{trader.totalTrades} trades</span>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={trader.isFollowing ? "outline" : "default"}
            size="sm"
            onClick={() => handleFollowTrader(trader.id)}
            className="flex-1"
          >
            {trader.isFollowing ? "Following" : "Follow"}
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderSignalCard = (signal: TradeSignal) => (
    <Card key={signal.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {signal.traderName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">{signal.traderName}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(signal.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
          <Badge variant={signal.action === 'BUY' ? 'default' : 'destructive'}>
            {signal.action}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">{signal.symbol}</div>
            <div className="text-sm text-muted-foreground">
              ${signal.price.toFixed(2)}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {signal.reasoning}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className={`h-4 w-4 ${signal.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{signal.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{signal.comments}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLikeSignal(signal.id)}
              >
                <Heart className={`h-4 w-4 ${signal.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyTrade(signal.id)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Trading Network</h2>
          <p className="text-muted-foreground">
            Discover top traders, follow strategies, and copy successful trades
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{traders.length} Traders</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4" />
            <span>{signals.length} Signals</span>
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover Traders</TabsTrigger>
          <TabsTrigger value="signals">Trade Signals</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {traders.map(renderTraderCard)}
          </div>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <div className="space-y-4">
            {signals.map(renderSignalCard)}
          </div>
        </TabsContent>

        <TabsContent value="following" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {traders.filter(t => t.isFollowing).map(renderTraderCard)}
          </div>
          {traders.filter(t => t.isFollowing).length === 0 && (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No traders followed yet</h3>
              <p className="text-muted-foreground mb-4">
                Start following top traders to see their signals and performance
              </p>
              <Button onClick={() => setActiveTab("discover")}>
                Discover Traders
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
