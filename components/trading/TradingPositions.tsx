import React, { useEffect, useState } from 'react';

interface Position {
  asset_id: string;
  symbol: string;
  qty: string;
  avg_entry_price: string;
  market_value: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  current_price: string;
  side: 'long' | 'short';
}

const TradingPositions: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/alpaca/positions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch positions');
        }
        
        const data = await response.json();
        setPositions(data);
      } catch (err) {
        setError(err.message || 'An error occurred fetching positions');
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const handleClosePosition = async (symbol: string) => {
    if (confirm(`Are you sure you want to close your ${symbol} position?`)) {
      try {
        const response = await fetch(`/api/alpaca/positions?symbol=${symbol}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to close position');
        }
        
        // Remove the closed position from the state
        setPositions(positions.filter(position => position.symbol !== symbol));
      } catch (err) {
        setError(err.message || 'An error occurred closing the position');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading positions...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">You don't have any open positions.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Symbol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Side
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Entry Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Market Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unrealized P/L
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {positions.map((position) => (
            <tr key={position.asset_id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{position.symbol}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  position.side === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {position.side.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{parseFloat(position.qty).toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${parseFloat(position.avg_entry_price).toFixed(2)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${parseFloat(position.current_price).toFixed(2)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${parseFloat(position.market_value).toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${
                  parseFloat(position.unrealized_pl) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${parseFloat(position.unrealized_pl).toFixed(2)} ({(parseFloat(position.unrealized_plpc) * 100).toFixed(2)}%)
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleClosePosition(position.symbol)}
                  className="text-red-600 hover:text-red-900"
                >
                  Close
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradingPositions;
