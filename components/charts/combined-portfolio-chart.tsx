import { useEffect, useRef } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { formatCurrency } from '@/lib/utils/format';
import { Loader2 } from 'lucide-react';
import '@/lib/chart-config';

interface CombinedChartProps {
  isLoading: boolean;
  historicalData?: {
    timestamp: string;
    value: number;
  }[];
  allocation: {
    name: string;
    value: number;
    color?: string;
  }[];
  totalValue: number;
}

export function CombinedPortfolioChart({ 
  isLoading,
  historicalData = [],
  allocation = [],
  totalValue 
}: CombinedChartProps) {
  const chartRef = useRef(null);

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (!historicalData.length || !allocation.length) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  const lineChartData = {
    labels: historicalData.map(d => new Date(d.timestamp).toLocaleDateString()),
    datasets: [{
      label: 'Portfolio Value',
      data: historicalData.map(d => d.value),
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.4,
      fill: false
    }]
  };

  const lineChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'category' as const,
        display: true,
      },
      y: {
        type: 'linear' as const,
        display: true,
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatCurrency(value)
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => formatCurrency(context.parsed.y)
        }
      }
    }
  };

  const pieChartData = {
    labels: allocation.map(a => a.name),
    datasets: [{
      data: allocation.map(a => a.value),
      backgroundColor: allocation.map(a => a.color || `hsl(${Math.random() * 360}, 70%, 50%)`),
    }]
  };

  return (
    <div className="relative min-h-[300px]">
      {/* Line chart */}
      <Line
        data={lineChartData}
        options={lineChartOptions}
      />
      
      {/* Pie chart overlay */}
      <div className="absolute top-4 right-4 w-32 h-32">
        <Pie
          data={pieChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.parsed;
                    const percentage = ((value / totalValue) * 100).toFixed(1);
                    return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                  }
                }
              }
            }
          }}
        />
      </div>

      {/* Total value display */}
      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md">
        <p className="text-sm text-muted-foreground">Total Value</p>
        <p className="text-lg font-bold">{formatCurrency(totalValue)}</p>
      </div>
    </div>
  );
}
