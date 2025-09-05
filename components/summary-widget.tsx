import React from 'react';

interface SummaryWidgetProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

const SummaryWidget: React.FC<SummaryWidgetProps> = ({ title, value, icon, color }) => (
  <div className={`flex items-center gap-3 p-4 rounded shadow bg-white dark:bg-gray-900 border ${color || 'border-primary'}`}>
    {icon && <div className="text-2xl">{icon}</div>}
    <div>
      <div className="text-sm text-muted font-medium">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  </div>
);

export default SummaryWidget;
