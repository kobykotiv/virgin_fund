"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/user-avatar"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { Settings, DollarSign, BarChart2, Newspaper, Link as LinkIcon } from "lucide-react"

export function UserProfileWidget() {
  const { user, isDemoMode } = useAuth()
  const router = useRouter()

  // Mock statistics for the demo
  const stats = {
    botsCreated: 10,
    activeTrading: 7,
    totalTrades: 245,
    successRate: "68%",
    memberSince: "Oct 2023",
    portfolioValue: "$124,853",
    monthlyReturn: "+3.2%",
    portfoliosCreated: 5,
    activePortfolios: 3
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col items-center">
          <UserAvatar user={user} size="lg" />
          <h3 className="mt-2 font-semibold text-lg">{user?.name || "User"}</h3>
          <p className="text-sm text-muted-foreground">{user?.email}</p>

          {isDemoMode && (
            <Badge className="mt-2 bg-green-500 hover:bg-green-600">
              <DollarSign className="h-3 w-3 mr-1" />
              Demo Account
            </Badge>
          )}

          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.portfoliosCreated}</p>
              <p className="text-xs text-muted-foreground">Portfolios</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.activePortfolios}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.totalTrades}</p>
              <p className="text-xs text-muted-foreground">Total Trades</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.successRate}</p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>
          
          <div className="w-full mt-4 pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Portfolio Value</p>
              <p className="text-sm font-bold">{stats.portfolioValue}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Monthly Return</p>
              <p className="text-sm font-bold text-green-500">{stats.monthlyReturn}</p>
            </div>
          </div>

          <div className="w-full mt-4 space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/profile")}>
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/backtest")}>
              <BarChart2 className="mr-2 h-4 w-4" />
              View Backtests
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/news")}>
              <Newspaper className="mr-2 h-4 w-4" />
              Latest News
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <LinkIcon className="mr-2 h-4 w-4" />
              Connect Broker
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

