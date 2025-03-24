import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

interface Portfolio {
  id: string;
  currency: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

const PortfolioPage = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPortfolioForm, setNewPortfolioForm] = useState({
    currency: 'USD',
    amount: 0,
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio');
        if (response.ok) {
          const data = await response.json();
          setPortfolios(data);
        }
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPortfolioForm({
      ...newPortfolioForm,
      [name]: name === 'amount' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPortfolioForm),
      });

      if (response.ok) {
        const newPortfolio = await response.json();
        setPortfolios([...portfolios, newPortfolio]);
        setNewPortfolioForm({
          currency: 'USD',
          amount: 0,
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio?')) {
      try {
        const response = await fetch(`/api/portfolio?portfolioId=${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setPortfolios(portfolios.filter(portfolio => portfolio.id !== id));
        }
      } catch (error) {
        console.error('Error deleting portfolio:', error);
      }
    }
  };

  const getTotalValue = () => {
    // For simplicity, we're just summing USD amounts
    // In a real app, you'd convert to a base currency
    const usdPortfolios = portfolios.filter(p => p.currency === 'USD');
    return usdPortfolios.reduce((sum, p) => sum + p.amount, 0);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {showForm ? 'Cancel' : 'Add Portfolio'}
        </button>
      </div>

      {/* Total portfolio value */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium mb-2">Total Portfolio Value (USD)</h2>
        <p className="text-3xl font-bold">${getTotalValue().toLocaleString()}</p>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Add New Portfolio</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  name="currency"
                  value={newPortfolioForm.currency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={newPortfolioForm.amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Save Portfolio
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading portfolios...</p>
      ) : portfolios.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">You don't have any portfolios yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:text-blue-800 mt-2"
          >
            Add your first portfolio
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolios.map((portfolio) => (
                <tr key={portfolio.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{portfolio.currency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {portfolio.amount.toLocaleString()} {portfolio.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(portfolio.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeletePortfolio(portfolio.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PortfolioPage;
