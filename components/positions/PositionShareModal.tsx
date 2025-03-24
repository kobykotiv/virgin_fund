import React, { useState } from 'react';

interface PositionShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { reasoning: string }) => void;
  position: {
    symbol: string;
    entryPrice: number;
    direction: string;
  };
}

const PositionShareModal: React.FC<PositionShareModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  position 
}) => {
  const [reasoning, setReasoning] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reasoning.trim()) {
      setError('Please provide your trading thesis');
      return;
    }
    
    onSubmit({ reasoning });
    setReasoning('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Share Position</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">{position.symbol}</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                position.direction === 'LONG' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {position.direction}
              </span>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Entry Price: </span>
              <span className="text-gray-800 font-medium">${position.entryPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="reasoning" className="block text-sm font-medium text-gray-700 mb-1">
                Why are you sharing this position?
              </label>
              <textarea
                id="reasoning"
                rows={4}
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder="Share your trading thesis, analysis or reasons for taking this position..."
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
              >
                Share Position
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PositionShareModal;
