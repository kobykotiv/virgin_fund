import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const mockData = [
  { id: 1, strategy: 'Momentum', result: '12.5%' },
  { id: 2, strategy: 'Mean Reversion', result: '8.2%' },
];

export default function Backtest() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Backtest</h1>
      <div className="bg-muted/10 p-4 rounded shadow">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Strategy</th>
              <th className="text-left py-2">Result</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row) => (
              <tr key={row.id}>
                <td className="py-2">{row.strategy}</td>
                <td className="py-2">{row.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
