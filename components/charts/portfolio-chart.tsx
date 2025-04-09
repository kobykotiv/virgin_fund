import { Line, Pie } from 'react-chartjs-2';
import { AnimatedWave } from './animated-wave';
import { formatCurrency } from '@/lib/utils/format';
import '@/lib/chart-config';

interface PortfolioChartProps {
  historicalData?: Array<{ timestamp: string; value: number }>;
  allocation?: Array<{ name: string; value: number; color?: string }>;
  isLoading?: boolean;
  isMock?: boolean;
}

export function PortfolioChart({ 
  historicalData, 
  allocation = [], 
  isLoading,
  isMock 
}: PortfolioChartProps) {
  if (isLoading) {
    return (
      <div className="h-[120px] flex items-center justify-center">
        <div className="animate-pulse w-full h-full bg-muted rounded-md" />
      </div>
    );
  }

  if (isMock || !historicalData?.length) {
    return (
      <div className="h-[120px] relative">
        <AnimatedWave />
        {allocation.length > 0 && (
          <div className="absolute top-2 right-2 w-20 h-20">
            <Pie
              data={{
                labels: allocation.map(a => a.name),
                datasets: [{
                  data: allocation.map(a => a.value),
                  backgroundColor: allocation.map(a => a.color || `hsl(${Math.random() * 360}, 70%, 50%)`)
                }]
              }}
              options={{
                plugins: {
                  legend: { display: false }
                }
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-[120px]">
      <Line
        data={{
          labels: historicalData.map(d => new Date(d.timestamp).toLocaleDateString()),
          datasets: [{
            label: 'Portfolio Value',
            data: historicalData.map(d => d.value),
            borderColor: 'rgb(99, 102, 241)',
            tension: 0.4,
            fill: false
          }]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => formatCurrency(context.parsed.y)
              }
            }
          },
          scales: {
            x: { display: false },
            y: { display: false }
          }
        }}
      />
      {allocation.length > 0 && (
        <div className="absolute top-2 right-2 w-20 h-20">
          <Pie
            data={{
              labels: allocation.map(a => a.name),
              datasets: [{
                data: allocation.map(a => a.value),
                backgroundColor: allocation.map(a => a.color || `hsl(${Math.random() * 360}, 70%, 50%)`)
              }]
            }}
            options={{
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
