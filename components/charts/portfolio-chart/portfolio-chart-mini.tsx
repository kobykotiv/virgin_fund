import { Line } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import '@/lib/chart-config';

interface PortfolioChartMiniProps {
  historicalData?: Array<{ timestamp: string; value: number }>;
  isLoading?: boolean;
}

export function PortfolioChartMini({ historicalData, isLoading }: PortfolioChartMiniProps) {
  // ...existing mini chart code...
}
