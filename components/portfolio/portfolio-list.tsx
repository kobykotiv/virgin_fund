import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Portfolio {
  _id: string;
  name: string;
  description: string;
  totalValue: number;
  createdAt: string;
}

const PortfolioList: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch('/api/portfolios');
        const data = await response.json();
        setPortfolios(data);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  if (loading) {
    return <div>Loading portfolios...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Portfolios</h2>
        <Link href="/portfolios/new">
          <a className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create New Portfolio
          </a>
        </Link>
      </div>
      
      {portfolios.length === 0 ? (
        <p>No portfolios found. Create your first portfolio to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolios.map((portfolio) => (
            <Link key={portfolio._id} href={`/portfolios/${portfolio._id}`}>
              <a className="block p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg">{portfolio.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{portfolio.description}</p>
                <p className="font-semibold">${portfolio.totalValue.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Created: {new Date(portfolio.createdAt).toLocaleDateString()}
                </p>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioList;
