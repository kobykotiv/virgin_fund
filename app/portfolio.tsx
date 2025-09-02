import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import PortfolioOverview from '@/components/pages/PortfolioOverview';

export default function Portfolio() {
  return (
    <DashboardLayout>
      <PortfolioOverview />
    </DashboardLayout>
  );
}
