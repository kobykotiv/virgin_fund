import React from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';

const mockData = [
  { id: 1, strategy: 'Momentum', result: '12.5%' },
  { id: 2, strategy: 'Mean Reversion', result: '8.2%' },
];

export default function Backtest() {
  return (
    <AppLayout>
      <Card>
        <h1 className="text-2xl font-bold mb-2">Backtest</h1>
        <div className="text-muted">Configure backtests, show results in charts.</div>
        {/* Chart placeholder */}
        <div className="mt-4 h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center text-muted">TradingView-style chart stub</div>
      </Card>
    </AppLayout>
}
