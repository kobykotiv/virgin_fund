import React from 'react';

interface QuickAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => (
  <div className="flex gap-2 flex-wrap">
    {actions.map((action, idx) => (
      <button
        key={idx}
        className="flex items-center gap-2 px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark transition"
        onClick={action.onClick}
      >
        {action.icon}
        {action.label}
      </button>
    ))}
  </div>
);

export default QuickActions;
