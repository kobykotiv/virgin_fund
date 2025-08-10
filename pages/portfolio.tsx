import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function Portfolio() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Portfolio</h1>
      <div className="bg-muted/10 p-4 rounded shadow">
        {/* Portfolio chart/table stub */}
        <div className="h-48 flex items-center justify-center text-muted-foreground">Portfolio Chart/Table Placeholder</div>
      </div>
    </DashboardLayout>
  );
}
