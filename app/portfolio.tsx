import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import dynamic from 'next/dynamic';

const DemoPicker = dynamic(() => import('@/components/portfolio/DemoPicker'), { ssr: false });

export default function Portfolio() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Portfolio</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-1">
          <DemoPicker />
        </div>

        <div className="md:col-span-2 bg-muted/10 p-4 rounded shadow">
          {/* Portfolio chart/table stub */}
          <div className="h-48 flex items-center justify-center text-muted-foreground">Portfolio Chart/Table Placeholder</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
