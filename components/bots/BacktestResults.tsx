import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function BacktestResults({ results }: { results: any }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Backtesting Results</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={results.timeseries}>
            <XAxis dataKey="t" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="balance" stroke="#4F46E5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
