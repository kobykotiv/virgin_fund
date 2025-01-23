import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { useConfetti } from "../ui/confetti";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import type { BacktestResult, PeriodReturns } from "@/types/backtest";
import type { ChartDatasetWithBorderDashAndYAxis } from "@/types/chart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BacktestResultsProps {
  results: BacktestResult;
  onSave: () => void;
  onRetest: () => void;
}

const CHART_COLORS = [
  "rgb(34, 197, 94)",   // Green
  "rgb(59, 130, 246)",  // Blue
  "rgb(168, 85, 247)",  // Purple
  "rgb(234, 179, 8)",   // Yellow
  "rgb(239, 68, 68)",   // Red
];

const PERIOD_LABELS = {
  "1w": "1 Week",
  "1m": "1 Month",
  "3m": "3 Months",
  "6m": "6 Months",
  "1y": "1 Year"
};

type ChartView = "portfolio" | "technical";

export function BacktestResults({
  results,
  onSave,
  onRetest,
}: BacktestResultsProps) {
  const [chartView, setChartView] = useState<ChartView>("portfolio");
  const triggerConfetti = useConfetti();
  const isPositiveROI = results.metrics.roi > 0;

  React.useEffect(() => {
    if (isPositiveROI) {
      triggerConfetti();
    }
  }, [isPositiveROI, triggerConfetti]);

  const getPortfolioChartData = () => {
    const primaryData = {
      labels: results.metrics.positions.map((p) =>
        new Date(p.date).toLocaleDateString()
      ),
      datasets: [
        {
          label: results.metrics.transactions[0].symbol,
          data: results.metrics.positions.map((p) => p.totalValue),
          fill: true,
          borderColor: CHART_COLORS[0],
          backgroundColor: `${CHART_COLORS[0]}1a`, // 10% opacity
          tension: 0.4,
        } as ChartDatasetWithBorderDashAndYAxis,
      ],
    };

    // Add benchmark if available
    if (results.benchmarkMetrics) {
      primaryData.datasets.push({
        label: results.benchmarkMetrics.transactions[0].symbol,
        data: results.benchmarkMetrics.positions.map((p) => p.totalValue),
        fill: false,
        borderColor: CHART_COLORS[1],
        borderDash: [5, 5],
        tension: 0.4,
      } as ChartDatasetWithBorderDashAndYAxis);
    }

    return primaryData;
  };

  const getTechnicalChartData = () => {
    const { technicalIndicators, positions } = results.metrics;
    
    return {
      labels: positions.map((p) => new Date(p.date).toLocaleDateString()),
      datasets: [
        {
          label: "RSI",
          data: technicalIndicators.rsi,
          borderColor: CHART_COLORS[0],
          fill: false,
          tension: 0.4,
          yAxisID: "rsi",
        } as ChartDatasetWithBorderDashAndYAxis,
        {
          label: "MACD",
          data: technicalIndicators.macd.macd,
          borderColor: CHART_COLORS[1],
          fill: false,
          tension: 0.4,
          yAxisID: "macd",
        } as ChartDatasetWithBorderDashAndYAxis,
        {
          label: "Signal",
          data: technicalIndicators.macd.signal,
          borderColor: CHART_COLORS[2],
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          yAxisID: "macd",
        } as ChartDatasetWithBorderDashAndYAxis,
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "rgb(255, 255, 255)",
        bodyColor: "rgb(255, 255, 255)",
        borderColor: isPositiveROI ? CHART_COLORS[0] : CHART_COLORS[4],
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: chartView === "technical" ? {
      rsi: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "RSI",
        },
      },
      macd: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "MACD",
        },
      },
    } : {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value: any) => `$${value.toLocaleString()}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const renderPeriodReturns = (returns: PeriodReturns) => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {Object.entries(returns).map(([period, value]) => (
        <div
          key={period}
          className={`p-4 rounded-lg border ${
            value >= 0
              ? "border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5"
              : "border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5"
          }`}
        >
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {PERIOD_LABELS[period as keyof PeriodReturns]}
          </p>
          <p className={`text-lg font-bold ${value >= 0 ? "text-green-500" : "text-red-500"}`}>
            {value.toFixed(2)}%
          </p>
        </div>
      ))}
    </div>
  );

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
                <p className="text-sm font-medium text-primary">
                  Total Investment
                </p>
              </div>
              <p className="text-2xl font-bold">
                ${results.metrics.totalInvestment.toLocaleString()}
              </p>
            </div>

            <div
              className={`bg-gradient-to-br ${
                isPositiveROI
                  ? "from-green-500/10 to-green-500/5 border-green-500/20"
                  : "from-red-500/10 to-red-500/5 border-red-500/20"
              } p-4 rounded-lg border`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isPositiveROI ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
                <p className="text-sm font-medium">Current Value</p>
              </div>
              <p className="text-2xl font-bold">
                ${results.metrics.currentValue.toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-4 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-purple-500" />
                <p className="text-sm font-medium text-purple-600">ROI</p>
              </div>
              <p className="text-2xl font-bold">
                {results.metrics.roi.toFixed(2)}%
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 p-4 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <p className="text-sm font-medium text-red-600">Max Drawdown</p>
              </div>
              <p className="text-2xl font-bold">
                {(results.metrics.maxDrawdown * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          {renderPeriodReturns(results.metrics.returns)}

          <div className="mb-6">
            <div className="flex justify-center space-x-4 mb-4">
              <Button
                variant={chartView === "portfolio" ? "default" : "outline"}
                onClick={() => setChartView("portfolio")}
              >
                Portfolio Value
              </Button>
              <Button
                variant={chartView === "technical" ? "default" : "outline"}
                onClick={() => setChartView("technical")}
              >
                Technical Indicators
              </Button>
            </div>
          </div>

          <div className="h-[400px]">
            <Line 
              data={chartView === "portfolio" ? getPortfolioChartData() : getTechnicalChartData()}
              options={chartOptions}
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={onRetest}>
              Edit & Retest
            </Button>
            <Button onClick={onSave}>Save Strategy</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
