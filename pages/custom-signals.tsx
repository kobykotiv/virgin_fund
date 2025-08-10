import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function CustomSignals() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Custom Signals</h1>
      <form className="space-y-4 bg-muted/10 p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Signal Name</label>
          <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter signal name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Parameters</label>
          <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter parameters" />
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Create Signal</button>
      </form>
    </DashboardLayout>
  );
}
