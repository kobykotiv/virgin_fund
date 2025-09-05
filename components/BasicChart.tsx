import React from 'react';

// Dummy data for chart
const data = [
  { label: 'Jan', value: 10000 },
  { label: 'Feb', value: 12000 },
  { label: 'Mar', value: 15000 },
  { label: 'Apr', value: 14000 },
  { label: 'May', value: 17000 },
  { label: 'Jun', value: 16000 },
];

const BasicChart: React.FC = () => {
  // Simple SVG bar chart
  const maxValue = Math.max(...data.map(d => d.value));
  return (
    <svg width="100%" height="120" viewBox={`0 0 ${data.length * 60} 120`}>
      {data.map((d, i) => (
        <g key={d.label}>
          <rect
            x={i * 60 + 10}
            y={120 - (d.value / maxValue) * 100}
            width={40}
            height={(d.value / maxValue) * 100}
            fill="#3b82f6"
            rx={6}
          />
          <text x={i * 60 + 30} y={115} textAnchor="middle" fontSize={12} fill="#888">{d.label}</text>
        </g>
      ))}
    </svg>
  );
};

export default BasicChart;
