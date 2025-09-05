import React from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';

const StrategyBuilder = () => (
  <AppLayout>
    <Card>
      <h1 className="text-2xl font-bold mb-2">Strategy Builder</h1>
      <div className="text-muted">Rule editor (drag/drop or form builder).</div>
    </Card>
  </AppLayout>
);

export default StrategyBuilder;
