import React from 'react';

interface MiniDonutChartProps {
  data: { name: string; value: number; color?: string }[];
}

export function MiniDonutChart({ data }: MiniDonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g transform="translate(50,50)">
        {data.map((item, i) => {
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;
          
          return (
            <path
              key={item.name}
              d={describeArc(0, 0, 40, startAngle, startAngle + angle)}
              fill={item.color || `hsl(${i * 60}, 70%, 50%)`}
            />
          );
        })}
      </g>
    </svg>
  );
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", x, y,
    "Z"
  ].join(" ");
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}