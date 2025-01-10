import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useConfetti } from './ui/confetti';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import type { StrategyResult } from '@/types';

interface BacktestResultsProps {
  results: StrategyResult;
  onSave: () => void;
  onRetest: () => void;
}

export function BacktestResults({ results, onSave, onRetest }: BacktestResultsProps) {
  const triggerConfetti = useConfetti();
  const isPositiveROI = results.roi > 0;

  React.useEffect(() => {
    if (isPositiveROI) {
      triggerConfetti();
    }
  }, [isPositiveROI, triggerConfetti]);

  const chartData = {
    labels: results.transactions.map(t => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Portfolio Value',
        data: results.transactions.map(t => t.amount),
        fill: true,
        borderColor: isPositiveROI ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
        backgroundColor: isPositiveROI ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(255, 255, 255)',
        borderColor: isPositiveROI ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Backtest Results</CardTitle>
          <CardDescription>
            Strategy performance analysis and metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium text-primary">Total Investment</p>
              </div>
              <p className="text-2xl font-bold">${results.totalInvestment.toLocaleString()}</p>
            </div>
            
            <div className={`bg-gradient-to-br ${
              isPositiveROI 
                ? 'from-green-500/10 to-green-500/5 border-green-500/20' 
                : 'from-red-500/10 to-red-500/5 border-red-500/20'
            } p-4 rounded-lg border`}>
              <div className="flex items-center gap-2 mb-2">
                {isPositiveROI 
                  ? <TrendingUp className="w-5 h-5 text-green-500" />
                  : <TrendingDown className="w-5 h-5 text-red-500" />
                }
                <p className="text-sm font-medium">Current Value</p>
              </div>
              <p className="text-2xl font-bold">${results.currentValue.toLocaleString()}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-4 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-purple-500" />
                <p className="text-sm font-medium text-purple-600">ROI</p>
              </div>
              <p className="text-2xl font-bold">{results.roi.toFixed(2)}%</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 p-4 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <p className="text-sm font-medium text-red-600">Max Drawdown</p>
              </div>
              <p className="text-2xl font-bold">{(results.maxDrawdown * 100).toFixed(2)}%</p>
            </div>
          </div>

          <div className="h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={onRetest}>
              Edit & Retest
            </Button>
            <Button onClick={onSave}>
              Save Strategy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}