import { Line } from "react-chartjs-2";
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
import { Strategy } from "../types";
import { calculateMetrics } from "../lib/calculations";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface Props {
  strategies: Strategy[];
}

export function PerformanceMetrics({ strategies }: Props) {
  const currentPrices: Record<string, number> = {};
  const metrics = strategies.map((strategy) =>
    calculateMetrics(strategy.transactions, currentPrices),
  );

  const totalInvestment = strategies.reduce(
    (sum, s) => sum + s.initial_investment,
    0,
  );
  const totalValue = metrics.reduce((sum, m) => sum + m.currentValue, 0);
  const avgROI = metrics.reduce((sum, m) => sum + m.roi, 0) / metrics.length;
  const maxDrawdown = Math.max(...metrics.map((m) => m.maxDrawdown));

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Portfolio Value",
        data: [totalInvestment /* ... historical values ... */, , totalValue],
        fill: true,
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
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
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "rgb(255, 255, 255)",
        bodyColor: "rgb(255, 255, 255)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "nearest" as const,
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
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
              ${totalInvestment.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-4 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <p className="text-sm font-medium text-green-600">
                Current Value
              </p>
            </div>
            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-4 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-purple-500" />
              <p className="text-sm font-medium text-purple-600">Average ROI</p>
            </div>
            <p className="text-2xl font-bold">{avgROI.toFixed(2)}%</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 p-4 rounded-lg border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <p className="text-sm font-medium text-red-600">Max Drawdown</p>
            </div>
            <p className="text-2xl font-bold">
              {(maxDrawdown * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="h-[300px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}
