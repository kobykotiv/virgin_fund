import React from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';
import SummaryWidget from '../components/summary-widget';
import QuickActions from '../components/quick-actions';
import BasicChart from '../components/BasicChart';

const Dashboard = () => {
  return (
    <AppLayout>
      <Card>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Summary Widgets */}
          <SummaryWidget title="Portfolio Value" value="$120,000" color="border-green-500" />
          <SummaryWidget title="Active Bots" value={4} color="border-blue-500" />
          <SummaryWidget title="Available Cash" value="$15,000" color="border-yellow-500" />
        </div>
        {/* Quick Actions */}
        <QuickActions actions={[{
          label: 'Add Fund',
          onClick: () => window.location.href = '/funds',
          icon: <span>💰</span>
        }, {
          label: 'Create Bot',
          onClick: () => window.location.href = '/bots',
          icon: <span>🤖</span>
        }, {
          label: 'Deposit',
          onClick: () => window.location.href = '/transactions',
          icon: <span>➕</span>
        }]} />
        {/* Chart Placeholder */}
        <div className="mt-8">
          <div className="text-lg font-semibold mb-2">Performance Chart</div>
          <div className="h-48 bg-muted rounded flex items-center justify-center text-muted">
            <BasicChart />
          </div>
        </div>
        {/* Notification Placeholder */}
        <div className="mt-8">
          <div className="text-lg font-semibold mb-2">Notifications</div>
          <div className="bg-muted rounded p-4 text-muted">No new notifications.</div>
        </div>
      </Card>
    </AppLayout>
  );
}

export default Dashboard;
