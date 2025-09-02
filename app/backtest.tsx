import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import BacktestPage from '@/components/pages/Backtest';

export default function Backtest() {
  return (
    <DashboardLayout>
      <BacktestPage />
    </DashboardLayout>
  );
}
