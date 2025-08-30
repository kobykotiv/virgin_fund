"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Star, Target, TrendingUp, Award, Zap, Shield, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  progress: number
  maxProgress: number
  unlocked: boolean
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: 'trading' | 'analysis' | 'social' | 'streak'
  points: number
  unlockedAt?: Date
}

interface TradingStats {
  totalTrades: number
  winningTrades: number
  totalPnL: number
  bestTrade: number
  currentStreak: number
  longestStreak: number
  totalVolume: number
  favoriteAsset: string
}

export function TradingAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-trade",
      title: "First Trade",
      description: "Execute your first trade",
      icon: <Target className="h-5 w-5" />,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      rarity: "common",
      category: "trading",
      points: 10,
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: "profit-streak",
      title: "Profit Streak",
      description: "5 consecutive profitable trades",
      icon: <TrendingUp className="h-5 w-5" />,
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      rarity: "rare",
      category: "streak",
      points: 50
    },
    {
      id: "portfolio-growth",
      title: "Portfolio Growth",
      description: "Grow portfolio by 10%",
      icon: <Trophy className="h-5 w-5" />,
      progress: 7,
      maxProgress: 10,
      unlocked: false,
      rarity: "epic",
      category: "trading",
      points: 100
    },
    {
      id: "analysis-master",
      title: "Analysis Master",
      description: "Complete 20 technical analysis sessions",
      icon: <Award className="h-5 w-5" />,
      progress: 12,
      maxProgress: 20,
      unlocked: false,
      rarity: "rare",
      category: "analysis",
      points: 75
    },
    {
      id: "social-trader",
      title: "Social Trader",
      description: "Follow 10 successful traders",
      icon: <Users className="h-5 w-5" />,
      progress: 6,
      maxProgress: 10,
      unlocked: false,
      rarity: "common",
      category: "social",
      points: 25
    },
    {
      id: "risk-manager",
      title: "Risk Manager",
      description: "Maintain 95% win rate with proper risk management",
      icon: <Shield className="h-5 w-5" />,
      progress: 85,
      maxProgress: 95,
      unlocked: false,
      rarity: "legendary",
      category: "trading",
      points: 200
    }
  ])

  const [stats, setStats] = useState<TradingStats>({
    totalTrades: 47,
    winningTrades: 32,
    totalPnL: 1250.75,
    bestTrade: 450.25,
    currentStreak: 3,
    longestStreak: 7,
    totalVolume: 25000,
    favoriteAsset: "AAPL"
  })

  const [showAll, setShowAll] = useState(false)

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500'
      case 'rare': return 'bg-blue-500'
      case 'epic': return 'bg-purple-500'
      case 'legendary': return 'bg-yellow-500'
    }
  }

  const getRarityBadgeColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      case 'rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
      case 'epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200'
      case 'legendary': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
    }
  }

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'trading': return <Target className="h-3 w-3" />
      case 'analysis': return <TrendingUp className="h-3 w-3" />
      case 'social': return <Users className="h-3 w-3" />
      case 'streak': return <Zap className="h-3 w-3" />
    }
  }

  const displayedAchievements = showAll ? achievements : achievements.slice(0, 4)
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)
  const completionRate = Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Trading Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalTrades}</div>
              <div className="text-xs text-muted-foreground">Total Trades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((stats.winningTrades / stats.totalTrades) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                +${stats.totalPnL.toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Total P&L</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Achievements
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {totalPoints} Points
              </Badge>
              <Badge variant="outline" className="text-xs">
                {completionRate}% Complete
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayedAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center space-x-4 p-4 rounded-lg border transition-all",
                  achievement.unlocked
                    ? "bg-accent/50 border-accent"
                    : "bg-muted/30 hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "p-3 rounded-full flex-shrink-0",
                  achievement.unlocked ? getRarityColor(achievement.rarity) : "bg-muted"
                )}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-sm truncate">{achievement.title}</h4>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getRarityBadgeColor(achievement.rarity))}
                    >
                      {achievement.rarity}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {getCategoryIcon(achievement.category)}
                      <span className="ml-1 capitalize">{achievement.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Progress
                      value={(achievement.progress / achievement.maxProgress) * 100}
                      className="flex-1 h-2"
                    />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </div>
                  )}
                </div>
                {achievement.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-yellow-500 flex-shrink-0"
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {!showAll && achievements.length > 4 && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(true)}
                className="w-full"
              >
                Show All Achievements ({achievements.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-accent/30 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Completed 3 profitable trades</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="outline" className="text-xs">+15 XP</Badge>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-accent/30 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Unlocked "Profit Streak" achievement</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <Badge variant="outline" className="text-xs">+50 XP</Badge>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-accent/30 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Followed 2 new traders</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
              <Badge variant="outline" className="text-xs">+10 XP</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
