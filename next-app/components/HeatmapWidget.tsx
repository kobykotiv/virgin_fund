'use client';

import { HeatmapData } from '@/lib/schemas/schemas';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

/**
 * Heatmap Widget Component
 * Visualizes portfolio performance and sector allocation as an interactive heatmap
 */

interface HeatmapWidgetProps {
  data?: HeatmapData;
  isLoading?: boolean;
}

export function HeatmapWidget({ data, isLoading }: HeatmapWidgetProps) {
  if (isLoading) {
    return <HeatmapSkeleton />;
  }

  if (!data) {
    return (
      <div className="trading-card p-6">
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Heatmap Unavailable</h3>
          <p className="text-muted-foreground">Unable to load heatmap data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trading-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Market Heatmap</h2>
          <p className="text-sm text-muted-foreground">
            Portfolio performance by sector and asset
          </p>
        </div>
        <BarChart3 className="h-6 w-6 text-muted-foreground" />
      </div>

      {/* Sector Performance */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Sector Performance</h3>
        <div className="grid grid-cols-2 gap-3">
          {data.sectors.map((sector, index) => (
            <SectorCard key={sector.name} sector={sector} />
          ))}
        </div>
      </div>

      {/* Asset Performance */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Top Assets</h3>
        <div className="space-y-2">
          {data.assets.map((asset, index) => (
            <AssetRow key={asset.symbol} asset={asset} />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Positive</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Negative</span>
            </div>
          </div>
          <span>Size = Market Value</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Sector Performance Card
 */
interface SectorCardProps {
  sector: {
    name: string;
    value: number;
    change: number;
    color: string;
  };
}

function SectorCard({ sector }: SectorCardProps) {
  const isPositive = sector.change > 0;
  
  return (
    <div 
      className="p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer"
      style={{ 
        borderColor: sector.color,
        backgroundColor: `${sector.color}15`
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm">{sector.name}</h4>
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-lg font-bold">${sector.value.toLocaleString()}</p>
        <p className={`text-sm font-medium ${
          isPositive ? 'positive-trend' : 'negative-trend'
        }`}>
          {isPositive ? '+' : ''}{sector.change.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

/**
 * Asset Performance Row
 */
interface AssetRowProps {
  asset: {
    symbol: string;
    name: string;
    value: number;
    change: number;
    size: 'small' | 'medium' | 'large';
  };
}

function AssetRow({ asset }: AssetRowProps) {
  const isPositive = asset.change > 0;
  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="flex flex-col justify-center">
          <div 
            className={`w-12 ${sizeClasses[asset.size]} rounded ${
              isPositive ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></div>
        </div>
        <div>
          <p className="font-medium">{asset.symbol}</p>
          <p className="text-xs text-muted-foreground">{asset.name}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-semibold">${asset.value.toLocaleString()}</p>
        <p className={`text-sm ${isPositive ? 'positive-trend' : 'negative-trend'}`}>
          {isPositive ? '+' : ''}{asset.change.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for HeatmapWidget
 */
function HeatmapSkeleton() {
  return (
    <div className="trading-card p-6">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>

        {/* Sector skeleton */}
        <div className="mb-6">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assets skeleton */}
        <div>
          <div className="h-5 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-3 bg-gray-200 rounded"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}