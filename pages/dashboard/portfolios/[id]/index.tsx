import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import Link from 'next/link';
import PositionShareModal from '../../../../components/positions/PositionShareModal';

interface Position {
  id: string;
  symbol: string;
  entryPrice: number;
  quantity: number;
  direction: string;
  openedAt: string;
  closedAt: string | null;
  pnl: number | null;
}

interface Portfolio {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  positions: Position[];
}

const PortfolioDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewPositionForm, setShowNewPositionForm] = useState(false);
  const [newPosition, setNewPosition] = useState({
    symbol: '',
    entryPrice: 0,
    quantity: 0,
    direction: 'LONG'
  });
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/portfolios/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio');
        }
        const data = await response.json();
        setPortfolio(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewPosition({
      ...newPosition,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPosition,
          portfolioId: id
        }),
      });

      if (response.ok) {
        const createdPosition = await response.json();
        setPortfolio({
          ...portfolio!,
          positions: [...portfolio!.positions, createdPosition]
        });
        setNewPosition({
          symbol: '',
          entryPrice: 0,
          quantity: 0,
          direction: 'LONG'
        });
        setShowNewPositionForm(false);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add position');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClosePosition = async (positionId: string) => {
    try {
      // Get current market price (in a real app, this would come from an API)
      const marketPrice = 150; // Example price
      
      const response = await fetch(`/api/positions/${positionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          closedAt: new Date().toISOString(),
          pnl: calculatePnL(
            positionId, 
            marketPrice,
            portfolio!.positions.find(p => p.id === positionId)!
          )
        }),
      });

      if (response.ok) {
        const updatedPosition = await response.json();
        setPortfolio({
          ...portfolio!,
          positions: portfolio!.positions.map(position => 
            position.id === positionId ? updatedPosition : position
          )
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to close position');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const calculatePnL = (positionId: string, marketPrice: number, position: Position) => {
    const { entryPrice, quantity, direction } = position;
    if (direction === 'LONG') {
      return (marketPrice - entryPrice) * quantity;
    } else {
      return (entryPrice - marketPrice) * quantity;
    }
  };

  const handleSharePosition = async (positionId: string) => {
    try {
      const position = portfolio!.positions.find(p => p.id === positionId)!;
      setSelectedPosition(position);
      setShowShareModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShareSubmit = async ({ reasoning }: { reasoning: string }) => {
    if (!selectedPosition || !portfolio) return;

    try {
      const response = await fetch('/api/shared-positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId: portfolio.id,
          positionId: selectedPosition.id,
          symbol: selectedPosition.symbol,
          entryPrice: selectedPosition.entryPrice,
          direction: selectedPosition.direction,
          reasoning,
        }),
      });

      if (response.ok) {
        alert('Position shared successfully!');
        setShowShareModal(false);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to share position');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p className="text-gray-500">Loading portfolio...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!portfolio) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p className="text-red-500">Portfolio not found</p>
          <Link href="/dashboard/portfolios">
            <a className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Back to portfolios
            </a>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{portfolio.name}</h1>
          <p className="text-gray-500">{portfolio.description || 'No description'}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowNewPositionForm(!showNewPositionForm)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {showNewPositionForm ? 'Cancel' : 'Add Position'}
          </button>
          <Link href={`/dashboard/portfolios/${id}/edit`}>
            <a className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
              Edit Portfolio
            </a>
          </Link>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}

      {showNewPositionForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Add New Position</h2>
          <form onSubmit={handleAddPosition}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                  Symbol
                </label>
                <input
                  type="text"
                  id="symbol"
                  name="symbol"
                  value={newPosition.symbol}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-700">
                  Entry Price
                </label>
                <input
                  type="number"
                  id="entryPrice"
                  name="entryPrice"
                  min="0"
                  step="0.01"
                  value={newPosition.entryPrice}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="0"
                  step="0.01"
                  value={newPosition.quantity}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="direction" className="block text-sm font-medium text-gray-700">
                  Direction
                </label>
                <select
                  id="direction"
                  name="direction"
                  value={newPosition.direction}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="LONG">Long</option>
                  <option value="SHORT">Short</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
              >
                Add Position
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Positions</h2>
        </div>
        {portfolio.positions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No positions in this portfolio yet.</p>
            <button
              onClick={() => setShowNewPositionForm(true)}
              className="text-blue-600 hover:text-blue-800 mt-2"
            >
              Add your first position
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Direction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PnL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolio.positions.map((position) => (
                <tr key={position.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{position.symbol}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">${position.entryPrice.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{position.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      position.direction === 'LONG' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {position.direction}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      position.closedAt 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {position.closedAt ? 'Closed' : 'Open'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {position.pnl !== null ? (
                      <div className={`text-sm ${
                        position.pnl >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        ${position.pnl.toFixed(2)}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">-</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!position.closedAt ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleClosePosition(position.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Close
                        </button>
                        {portfolio.isPublic && (
                          <button
                            onClick={() => handleSharePosition(position.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Share
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {selectedPosition && (
        <PositionShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onSubmit={handleShareSubmit}
          position={selectedPosition}
        />
      )}
    </DashboardLayout>
  );
};

export default PortfolioDetailPage;
