import React from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';

const Calculators = () => (
  <AppLayout>
    <Card>
      <h1 className="text-2xl font-bold mb-2">Calculators</h1>
      <div className="text-muted">Grid of financial + trading calculators.</div>
    </Card>
  </AppLayout>
);

export default Calculators;
