'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analysisClient } from '@/lib/api/apiClients';
import { queryKeys } from '@/components/ReactQueryProvider';
import { BarChart3, TrendingUp, Activity, Brain, AlertCircle, Clock } from 'lucide-react';

/**
 * Analysis Page - Advanced Trading Analysis
 * 
 * Features:
 * - Technical indicator analysis
 * - Market sentiment analysis  
 * - AI-powered trading signals
 * - Historical performance metrics
 */

export default function AnalysisPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');

  // Fetch technical indicators
  const { 
    data: indicators, 
    isLoading: indicatorsLoading,
    error: indicatorsError 
  } = useQuery({
    queryKey: queryKeys.analysis.indicators(selectedSymbol, selectedTimeframe),
    queryFn: () => analysisClient.getIndicators(selectedSymbol, selectedTimeframe),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch news for sentiment analysis
  const { 
    data: news, 
    isLoading: newsLoading 
  } = useQuery({
    queryKey: queryKeys.analysis.news(selectedSymbol),
    queryFn: () => analysisClient.getNews(selectedSymbol),
    refetchInterval: 60000, // Refetch every minute
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Market Analysis</h1>
              <p className="text-muted-foreground mt-1">
                Advanced technical analysis and trading signals
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Symbol Selector */}
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="AAPL">AAPL</option>
                <option value="GOOGL">GOOGL</option>
                <option value="MSFT">MSFT</option>
                <option value="TSLA">TSLA</option>
                <option value="AMZN">AMZN</option>
              </select>
              
              {/* Timeframe Selector */}
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="1m">1 Minute</option>
                <option value="5m">5 Minutes</option>
                <option value="15m">15 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="4h">4 Hours</option>
                <option value="1d">1 Day</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Technical Indicators - Spans 2 columns */}
          <div className="xl:col-span-2">
            <TechnicalIndicatorsPanel 
              symbol={selectedSymbol}
              timeframe={selectedTimeframe}
              indicators={indicators}
              isLoading={indicatorsLoading}
              error={indicatorsError}
            />
          </div>

          {/* News & Sentiment */}
          <div>
            <NewsSentimentPanel 
              symbol={selectedSymbol}
              news={news}
              isLoading={newsLoading}
            />
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="mt-8">
          <AnalysisSummaryPanel 
            symbol={selectedSymbol}
            indicators={indicators}
            news={news}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Technical Indicators Panel
 */
interface TechnicalIndicatorsPanelProps {
  symbol: string;
  timeframe: string;
  indicators: any;
  isLoading: boolean;
  error: any;
}

function TechnicalIndicatorsPanel({ 
  symbol, 
  timeframe, 
  indicators, 
  isLoading, 
  error 
}: TechnicalIndicatorsPanelProps) {
  if (error) {
    return (
      <div className="trading-card p-6">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Analysis Unavailable</h3>
          <p className="text-muted-foreground">Unable to load technical indicators</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trading-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Technical Indicators</h2>
            <p className="text-sm text-muted-foreground">
              {symbol} • {timeframe} timeframe
            </p>
          </div>
        </div>
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <IndicatorsSkeleton />
      ) : indicators ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {/* RSI */}
          <IndicatorCard
            title="RSI (14)"
            value={indicators.data.rsi.toFixed(2)}
            interpretation={getRSIInterpretation(indicators.data.rsi)}
            color={getRSIColor(indicators.data.rsi)}
          />
          
          {/* MACD */}
          <IndicatorCard
            title="MACD"
            value={indicators.data.macd.toFixed(3)}
            interpretation={indicators.data.macd > indicators.data.macd_signal ? 'Bullish' : 'Bearish'}
            color={indicators.data.macd > indicators.data.macd_signal ? 'green' : 'red'}
          />
          
          {/* Moving Averages */}
          <IndicatorCard
            title="SMA 20"
            value={`$${indicators.data.sma_20.toFixed(2)}`}
            interpretation="Support/Resistance"
            color="blue"
          />
          
          <IndicatorCard
            title="SMA 50"
            value={`$${indicators.data.sma_50.toFixed(2)}`}
            interpretation="Trend Direction"
            color="blue"
          />
          
          {/* Bollinger Bands */}
          <IndicatorCard
            title="BB Upper"
            value={`$${indicators.data.bollinger_upper.toFixed(2)}`}
            interpretation="Resistance Level"
            color="orange"
          />
          
          <IndicatorCard
            title="BB Lower"
            value={`$${indicators.data.bollinger_lower.toFixed(2)}`}
            interpretation="Support Level"
            color="orange"
          />
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No indicator data available</p>
        </div>
      )}
      
      {indicators && (
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(indicators.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * News & Sentiment Panel
 */
interface NewsSentimentPanelProps {
  symbol: string;
  news?: any[];
  isLoading: boolean;
}

function NewsSentimentPanel({ symbol, news, isLoading }: NewsSentimentPanelProps) {
  return (
    <div className="trading-card p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Market Sentiment</h2>
          <p className="text-sm text-muted-foreground">{symbol} news & analysis</p>
        </div>
      </div>

      {isLoading ? (
        <NewsSkeleton />
      ) : news && news.length > 0 ? (
        <div className="space-y-4">
          {news.map((item, index) => (
            <div key={item.id || index} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm line-clamp-2">{item.headline}</h3>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  item.sentiment === 'positive' 
                    ? 'bg-green-100 text-green-800' 
                    : item.sentiment === 'negative'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.sentiment}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{item.summary}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.source}</span>
                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No news available</p>
        </div>
      )}
    </div>
  );
}

/**
 * Analysis Summary Panel
 */
interface AnalysisSummaryPanelProps {
  symbol: string;
  indicators: any;
  news?: any[];
}

function AnalysisSummaryPanel({ symbol, indicators, news }: AnalysisSummaryPanelProps) {
  // Calculate overall sentiment
  const overallSentiment = calculateOverallSentiment(indicators, news || []);
  
  return (
    <div className="trading-card p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Activity className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Analysis Summary</h2>
          <p className="text-sm text-muted-foreground">AI-powered trading recommendation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2">Technical Signal</h3>
          <p className={`text-2xl font-bold ${
            overallSentiment.technical === 'Bullish' ? 'text-green-600' : 
            overallSentiment.technical === 'Bearish' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {overallSentiment.technical}
          </p>
        </div>

        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2">News Sentiment</h3>
          <p className={`text-2xl font-bold ${
            overallSentiment.news === 'Positive' ? 'text-green-600' : 
            overallSentiment.news === 'Negative' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {overallSentiment.news}
          </p>
        </div>

        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2">Recommendation</h3>
          <p className={`text-2xl font-bold ${
            overallSentiment.recommendation === 'BUY' ? 'text-green-600' : 
            overallSentiment.recommendation === 'SELL' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {overallSentiment.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper Components and Functions
 */
function IndicatorCard({ title, value, interpretation, color }: any) {
  const colorClasses: Record<string, string> = {
    green: 'border-green-500 bg-green-50',
    red: 'border-red-500 bg-red-50',
    blue: 'border-blue-500 bg-blue-50',
    orange: 'border-orange-500 bg-orange-50',
    gray: 'border-gray-500 bg-gray-50'
  };

  return (
    <div className={`p-3 rounded-lg border-2 ${colorClasses[color] || colorClasses.gray}`}>
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <p className="text-lg font-bold my-1">{value}</p>
      <p className="text-xs text-muted-foreground">{interpretation}</p>
    </div>
  );
}

function getRSIInterpretation(rsi: number) {
  if (rsi > 70) return 'Overbought';
  if (rsi < 30) return 'Oversold';
  return 'Neutral';
}

function getRSIColor(rsi: number) {
  if (rsi > 70) return 'red';
  if (rsi < 30) return 'green';
  return 'gray';
}

function calculateOverallSentiment(indicators: any, news: any[]) {
  // Simple sentiment calculation
  let technical = 'Neutral';
  let newsScore = 'Neutral';
  let recommendation = 'HOLD';

  if (indicators) {
    const rsi = indicators.data.rsi;
    const macd = indicators.data.macd;
    const macdSignal = indicators.data.macd_signal;
    
    if (rsi < 30 && macd > macdSignal) {
      technical = 'Bullish';
      recommendation = 'BUY';
    } else if (rsi > 70 && macd < macdSignal) {
      technical = 'Bearish';
      recommendation = 'SELL';
    }
  }

  if (news && news.length > 0) {
    const positiveCount = news.filter(n => n.sentiment === 'positive').length;
    const negativeCount = news.filter(n => n.sentiment === 'negative').length;
    
    if (positiveCount > negativeCount) {
      newsScore = 'Positive';
    } else if (negativeCount > positiveCount) {
      newsScore = 'Negative';
    }
  }

  return {
    technical,
    news: newsScore,
    recommendation
  };
}

function IndicatorsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="p-3 bg-muted/50 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 bg-muted/30 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}