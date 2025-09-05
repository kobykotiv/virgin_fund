import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`rounded-xl shadow-lg bg-card p-6 ${className}`}>
    {children}
  </div>
);

export default Card;
