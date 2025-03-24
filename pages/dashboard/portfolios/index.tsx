import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Link from 'next/link';

const PortfoliosPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolios');
        if (response.ok) {
          const data = await response.json();
          setPortfolios(data);
        }
      } catch (error) {
        setError('Failed to load portfolios');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Portfolios</h1>
        <Link href="/dashboard/portfolios/new">
          <a className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md">Create Portfolio</a>
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}

      {loading ? (
        <p className="text-center py-4">Loading portfolios...</p>
      ) : portfolios.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">You don't have any portfolios yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium">{portfolio.name}</h3>
              <p className="text-sm text-gray-500 mt-2">{portfolio.description || 'No description'}</p>
              <Link href={`/dashboard/portfolios/${portfolio.id}`}>
                <a className="mt-4 inline-block text-blue-600 hover:text-blue-800">View Details</a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PortfoliosPage;
