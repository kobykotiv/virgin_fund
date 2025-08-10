import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function DebtPayoffCalculator() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Debt Payoff Calculator</h1>
      <form className="space-y-4 bg-muted/10 p-4 rounded shadow mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Debt Amount</label>
          <input type="number" className="w-full px-3 py-2 border rounded" placeholder="$" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Monthly Payment</label>
          <input type="number" className="w-full px-3 py-2 border rounded" placeholder="$" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
          <input type="number" className="w-full px-3 py-2 border rounded" placeholder="%" />
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Calculate</button>
      </form>
      <div className="bg-muted/10 p-4 rounded shadow">
        {/* Result table stub */}
        <div className="h-32 flex items-center justify-center text-muted-foreground">Result Table Placeholder</div>
      </div>
    </DashboardLayout>
  );
}
