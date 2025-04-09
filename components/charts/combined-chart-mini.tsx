import { Loader2 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '@/lib/utils/format';
import '@/lib/chart-config';

interface CombinedChartMiniProps {
  portfolio: {
    historicalData?: Array<{ timestamp: string; value: number }>;
    value: string | number;
  };
  isLoading: boolean;
}

export function CombinedChartMini({ portfolio, isLoading }: CombinedChartMiniProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const data = {
    labels: portfolio.historicalData?.map(d => new Date(d.timestamp).toLocaleDateString()) || [],
    datasets: [{
      data: portfolio.historicalData?.map(d => d.value) || [],
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.4,
      fill: false,
      pointRadius: 0,
      borderWidth: 1.5,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => formatCurrency(context.parsed.y)
        }
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };

  return (
    <div className="h-full">
      <Line data={data} options={options} />
    </div>
  );
}
