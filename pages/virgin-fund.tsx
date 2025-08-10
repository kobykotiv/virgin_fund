import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function VirginFund() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Virgin Fund : GenEric TraDer AI</h1>
      <div className="bg-muted/10 p-4 rounded shadow">
        {/* Overview stub */}
        <div className="h-48 flex items-center justify-center text-muted-foreground">Overview Placeholder</div>
      </div>
    </DashboardLayout>
  );
}
