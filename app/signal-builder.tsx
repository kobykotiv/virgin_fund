import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function SignalBuilder() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Signal Builder</h1>
      <div className="bg-muted/10 p-4 rounded shadow">
        {/* Stub chart/table placeholder */}
        <div className="h-48 flex items-center justify-center text-muted-foreground">Chart/Table Placeholder</div>
      </div>
    </DashboardLayout>
  );
}
