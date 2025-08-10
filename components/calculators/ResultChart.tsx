import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ResultChartProps {
  data: Array<{ x: string | number; y: number }>;
  xLabel?: string;
  yLabel?: string;
}

export default function ResultChart({ data, xLabel, yLabel }: ResultChartProps) {
  return (
    <div className="w-full h-64 mt-4">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" label={{ value: xLabel, position: 'insideBottomRight', offset: 0 }} />
          <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#6366f1" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
