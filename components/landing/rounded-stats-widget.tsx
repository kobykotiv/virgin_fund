"use client"

import { useState, useEffect } from 'react';
import { CircleCheckBig, CircleDollarSign, CircleClock } from 'lucide-react';

export function RoundedStatsWidget() {
  const [stats, setStats] = useState({
    totalSuccessfulTrades: 27834589,
    averageReturnPercent: 16.7,
    averageResponseTimeMs: 42.3
  });

  // Animation effect for numbers counting up
  const [animatedStats, setAnimatedStats] = useState({
    totalSuccessfulTrades: 0,
    averageReturnPercent: 0,
    averageResponseTimeMs: 0
  });

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000; // 2 seconds for animation

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimatedStats({
        totalSuccessfulTrades: Math.round(progress * stats.totalSuccessfulTrades),
        averageReturnPercent: parseFloat((progress * stats.averageReturnPercent).toFixed(1)),
        averageResponseTimeMs: parseFloat((progress * stats.averageResponseTimeMs).toFixed(1))
      });

      if (progress === 1) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [stats]);

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <section className="py-16 bg-gray-950 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {/* Successful Trades Stat */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-36 h-36 rounded-full bg-blue-600/10 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-blue-600/30 flex items-center justify-center">
                    <CircleCheckBig className="h-10 w-10 text-blue-400" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs py-1 px-2 rounded-full">
                100% Automated
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold">
              {formatNumber(animatedStats.totalSuccessfulTrades)}
            </p>
            <p className="text-gray-400 text-sm">Successful Trades</p>
          </div>

          {/* Average Return Stat */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-36 h-36 rounded-full bg-green-600/10 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-green-600/20 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-600/30 flex items-center justify-center">
                    <CircleDollarSign className="h-10 w-10 text-green-400" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs py-1 px-2 rounded-full">
                Verified Results
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{animatedStats.averageReturnPercent}%</p>
            <p className="text-gray-400 text-sm">Average Return</p>
          </div>

          {/* Response Time Stat */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-36 h-36 rounded-full bg-purple-600/10 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-purple-600/30 flex items-center justify-center">
                    <CircleClock className="h-10 w-10 text-purple-400" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs py-1 px-2 rounded-full">
                Ultra-Fast
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{animatedStats.averageResponseTimeMs}ms</p>
            <p className="text-gray-400 text-sm">Average Response Time</p>
          </div>
        </div>
      </div>
    </section>
  );
}
