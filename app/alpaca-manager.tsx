import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const bots = [
  { id: 1, name: 'Bot Alpha', status: 'Running' },
  { id: 2, name: 'Bot Beta', status: 'Stopped' },
];

export default function AlpacaManager() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Alpaca Markets Trading Bot Manager</h1>
      <div className="bg-muted/10 p-4 rounded shadow">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Bot Name</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((bot) => (
              <tr key={bot.id}>
                <td className="py-2">{bot.name}</td>
                <td className="py-2">{bot.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
