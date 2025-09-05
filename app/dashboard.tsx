import React from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';

const Dashboard = () => (
  <AppLayout>
    <Card>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <div className="text-muted">Portfolio snapshot, active bots, balances, quick actions.</div>
    </Card>
  </AppLayout>
);

export default Dashboard;
