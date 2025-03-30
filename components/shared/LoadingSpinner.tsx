import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message = 'Loading...'
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'small': return 'spinner-small';
      case 'large': return 'spinner-large';
      default: return 'spinner-medium';
    }
  };

  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${getSpinnerSize()}`}>
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};
