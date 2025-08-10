import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function FeeImpactCalculator() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Fee Impact Calculator</h1>
      <form className="space-y-4 bg-muted/10 p-4 rounded shadow mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Investment Amount</label>
          <input type="number" className="w-full px-3 py-2 border rounded" placeholder="$" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Annual Fee (%)</label>
          <input type="number" className="w-full px-3 py-2 border rounded" placeholder="%" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Years</label>
          <input type="number" className="w-full px-3 py-2 border rounded" placeholder="Years" />
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Calculate</button>
      </form>
      <div className="bg-muted/10 p-4 rounded shadow">
        {/* Result chart stub */}
        <div className="h-32 flex items-center justify-center text-muted-foreground">Result Chart Placeholder</div>
      </div>
    </DashboardLayout>
  );
}
