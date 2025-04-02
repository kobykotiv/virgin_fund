"use client"

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Cpu, 
  ArrowUpRight, 
  DollarSign, 
  LineChart, 
  BarChart 
} from 'lucide-react';
import { 
  getTradingVolumeStats, 
  getUserStats, 
  getPerformanceStats, 
  getBotStats,
  TradingVolumeStats,
  UserStats,
  PerformanceStats,
  BotStats
} from '@/services/statisticsService';

export function AggregateStatsSection() {
  const [tradingStats, setTradingStats] = useState<TradingVolumeStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [botStats, setBotStats] = useState<BotStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from a database
    const loadStats = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setTradingStats(getTradingVolumeStats());
        setUserStats(getUserStats());
        setPerformanceStats(getPerformanceStats());
        setBotStats(getBotStats());
      } catch (error) {
        console.error('Error loading statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Format currency
  const formatCurrency = (num: number) => {
    if (num >= 1000000000) {
      return '$' + (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return '$' + (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return '$' + (num / 1000).toFixed(1) + 'K';
    }
    return '$' + num.toFixed(2);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Platform Statistics</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Aggregated trading data from our global user base
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Key Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Total Trading Volume</p>
                    <h3 className="text-3xl font-bold">{formatCurrency(tradingStats?.totalVolumeUsd || 0)}</h3>
                  </div>
                  <div className="p-3 bg-blue-900/30 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>{tradingStats?.percentIncrease || 0}% increase this month</span>
                </div>
              </div>
              
              <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <h3 className="text-3xl font-bold">{formatNumber(userStats?.totalUsers || 0)}</h3>
                  </div>
                  <div className="p-3 bg-purple-900/30 rounded-lg">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>{userStats?.userGrowth || 0}% growth this quarter</span>
                </div>
              </div>
              
              <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Average Return</p>
                    <h3 className="text-3xl font-bold">{performanceStats?.averageReturnPercentage || 0}%</h3>
                  </div>
                  <div className="p-3 bg-green-900/30 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <span>Win Rate: {performanceStats?.winRate || 0}%</span>
                </div>
              </div>
              
              <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Total Bots</p>
                    <h3 className="text-3xl font-bold">{formatNumber(botStats?.totalBots || 0)}</h3>
                  </div>
                  <div className="p-3 bg-amber-900/30 rounded-lg">
                    <Cpu className="h-6 w-6 text-amber-400" />
                  </div>
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>{botStats?.botGrowth || 0}% more bots this month</span>
                </div>
              </div>
            </div>
            
            {/* Trading Volume Stats */}
            <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center mb-6">
                <DollarSign className="h-6 w-6 text-blue-400 mr-2" />
                <h3 className="text-xl font-bold">Trading Volume Breakdown</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-2">Total Trades</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold mr-2">{formatNumber(tradingStats?.totalTrades || 0)}</span>
                      <span className="text-sm text-gray-400">trades completed</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-2">Average Trade Size</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold mr-2">${tradingStats?.averageTradeSize.toFixed(2) || 0}</span>
                      <span className="text-sm text-gray-400">per trade</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Volume By Period</p>
                    <div className="space-y-3">
                      {tradingStats?.volumeByTimeframe.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{item.period}</span>
                          <span className="font-medium">{formatCurrency(item.volume)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-4">Volume by Top Assets</p>
                  <div className="space-y-4">
                    {tradingStats?.topAssets.map((asset, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span>{asset.asset}</span>
                          <span>{formatCurrency(asset.volume)}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ 
                              width: `${asset.percentOfTotal}%`,
                              backgroundColor: index === 0 ? '#3B82F6' : 
                                index === 1 ? '#8B5CF6' : 
                                index === 2 ? '#10B981' : 
                                index === 3 ? '#F59E0B' : '#EC4899'
                            }}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500 mt-1">{asset.percentOfTotal}% of total</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bot Strategy Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50">
                <div className="flex items-center mb-6">
                  <Cpu className="h-6 w-6 text-amber-400 mr-2" />
                  <h3 className="text-xl font-bold">Bot Distribution</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-400 mb-4">By Strategy Type</p>
                    <div className="space-y-4">
                      {botStats?.botsByStrategy.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span>{item.strategy}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full" 
                              style={{ 
                                width: `${item.percentage}%`,
                                backgroundColor: index === 0 ? '#F59E0B' : 
                                  index === 1 ? '#3B82F6' : 
                                  index === 2 ? '#10B981' : 
                                  index === 3 ? '#8B5CF6' : '#EC4899' 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-4">By Asset Class</p>
                    <div className="space-y-4">
                      {botStats?.botsByAssetClass.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span>{item.assetClass}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full" 
                              style={{ 
                                width: `${item.percentage}%`,
                                backgroundColor: index === 0 ? '#3B82F6' : 
                                  index === 1 ? '#10B981' : 
                                  index === 2 ? '#8B5CF6' : 
                                  index === 3 ? '#F59E0B' : '#EC4899' 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">Active Bots</p>
                      <p className="text-xl font-bold">{formatNumber(botStats?.activeBots || 0)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {botStats?.activeBots && botStats?.totalBots ? 
                          ((botStats.activeBots / botStats.totalBots) * 100).toFixed(1) : 0}% of total
                      </p>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">Avg. Trades/Bot</p>
                      <p className="text-xl font-bold">{botStats?.averageTradesPerBot || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">trades per day</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Performance Distribution */}
              <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50">
                <div className="flex items-center mb-6">
                  <LineChart className="h-6 w-6 text-green-400 mr-2" />
                  <h3 className="text-xl font-bold">Performance Metrics</h3>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Best Strategy</span>
                    <span className="text-green-400 font-bold">+{performanceStats?.bestStrategyPerformance || 0}%</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Median Return</span>
                    <span className="font-semibold">+{performanceStats?.medianStrategyPerformance || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Worst Strategy</span>
                    <span className="text-red-400 font-bold">{performanceStats?.worstStrategyPerformance || 0}%</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-4">Return Distribution</p>
                <div className="space-y-4">
                  {performanceStats?.performanceDistribution.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span>{item.range}</span>
                        <span>{formatNumber(item.count)} users ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${item.percentage}%`,
                            backgroundColor: 
                              item.range === '<0%' ? '#EF4444' : 
                              item.range === '0-5%' ? '#F59E0B' : 
                              item.range === '5-10%' ? '#10B981' : 
                              item.range === '10-20%' ? '#3B82F6' : 
                              item.range === '20-50%' ? '#8B5CF6' : 
                              '#EC4899'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <p className="text-sm text-gray-400 mb-3">Performance Summary</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <BarChart className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Win Rate</p>
                      <p className="text-lg font-bold">{performanceStats?.winRate || 0}%</p>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <TrendingUp className="h-5 w-5 text-green-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Avg Return</p>
                      <p className="text-lg font-bold">{performanceStats?.averageReturnPercentage || 0}%</p>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <Users className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Profitable</p>
                      <p className="text-lg font-bold">
                        {performanceStats?.performanceDistribution
                          ? 100 - performanceStats.performanceDistribution[0].percentage
                          : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-purple-400 mr-2" />
                <h3 className="text-xl font-bold">User Demographics</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-400 mb-4">By Experience Level</p>
                  <div className="space-y-4">
                    {userStats?.usersByExperience.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span>{item.level}</span>
                          <span>{formatNumber(item.count)} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: 
                                index === 0 ? '#10B981' : 
                                index === 1 ? '#3B82F6' : 
                                index === 2 ? '#8B5CF6' : '#EC4899'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-4">Top Countries</p>
                  <div className="grid grid-cols-2 gap-4">
                    {userStats?.usersByCountry.slice(0, 5).map((item, index) => (
                      <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                        <p className="font-medium mb-1">{item.country}</p>
                        <p className="text-2xl font-bold">{formatNumber(item.count)}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.percentage}% of users</p>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                          <div 
                            className="h-1.5 rounded-full" 
                            style={{ 
                              width: `${item.percentage * 3}%`, // Scale for visual effect
                              backgroundColor: 
                                index === 0 ? '#3B82F6' : 
                                index === 1 ? '#10B981' : 
                                index === 2 ? '#8B5CF6' : 
                                index === 3 ? '#F59E0B' : '#EC4899'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex flex-wrap gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4 flex-1">
                    <p className="text-xs text-gray-400 mb-1">Active Users</p>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold mr-2">{formatNumber(userStats?.activeUsers || 0)}</span>
                      <span className="text-xs text-gray-500">
                        ({userStats?.totalUsers && userStats?.activeUsers 
                          ? ((userStats.activeUsers / userStats.totalUsers) * 100).toFixed(1) 
                          : 0}% of total)
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4 flex-1">
                    <p className="text-xs text-gray-400 mb-1">Avg Bots/User</p>
                    <p className="text-2xl font-bold">{userStats?.averageBotCount || 0}</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4 flex-1">
                    <p className="text-xs text-gray-400 mb-1">Growth Rate</p>
                    <p className="text-2xl font-bold text-green-400">+{userStats?.userGrowth || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
