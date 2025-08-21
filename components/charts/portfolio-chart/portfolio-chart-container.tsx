import { Line, Pie } from 'react-chartjs-2';
import { AnimatedWave } from '../animated-wave';
import { formatCurrency } from '@/lib/utils/format';
import '@/lib/chart-config';

// Minimal props shape used by callers in the codebase. Expand later as needed.
interface PortfolioChartContainerProps {
  historicalData?: Array<{ timestamp: string; value: number }>
  allocation?: Array<{ symbol: string; percent: number }>
  isLoading?: boolean
  isMock?: boolean
}

export function PortfolioChartContainer({ 
  historicalData = [], 
  allocation = [], 
  isLoading = false,
  isMock = false,
}: PortfolioChartContainerProps) {
  // Minimal render to keep imports and types satisfied. Full implementation can be restored later.
  return (
    <div className="w-full">
      {isLoading ? (
        <div>Loading chart…</div>
      ) : (
        <div>
          <AnimatedWave />
          <div className="text-sm">{historicalData.length} points · {allocation.length} allocations</div>
        </div>
      )}
    </div>
  )
}
