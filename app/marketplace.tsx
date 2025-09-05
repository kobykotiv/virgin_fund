import React from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';

const Marketplace = () => (
  <AppLayout>
    <Card>
      <h1 className="text-2xl font-bold mb-2">Marketplace</h1>
      <div className="text-muted">Discover bots & copy-trading strategies.</div>
    </Card>
  </AppLayout>
);

export default Marketplace;
