import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Link from 'next/link';

interface Strategy {
  id: string;
  name: string;
  version: string;
  config: any;
  createdAt: string;
  updatedAt: string;
}

const StrategiesPage = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/strategies');
        if (response.ok) {
          const data = await response.json();
          setStrategies(data);
        }
      } catch (error) {
        console.error('Error fetching strategies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  const handleDeleteStrategy = async (id: string) => {
    if (confirm('Are you sure you want to delete this strategy?')) {
      try {
        const response = await fetch(`/api/strategies?strategyId=${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setStrategies(strategies.filter(strategy => strategy.id !== id));
        }
      } catch (error) {
        console.error('Error deleting strategy:', error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Strategies</h1>
        <Link href="/dashboard/strategies/new">
          <a className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Create Strategy
          </a>
        </Link>
      </div>

      {loading ? (
        <p>Loading strategies...</p>
      ) : strategies.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">You don't have any strategies yet.</p>
          <Link href="/dashboard/strategies/new">
            <a className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Create your first strategy
            </a>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
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
              {strategies.map((strategy) => (
                <tr key={strategy.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{strategy.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{strategy.version}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(strategy.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/dashboard/strategies/${strategy.id}`}>
                      <a className="text-blue-600 hover:text-blue-900 mr-4">View</a>
                    </Link>
                    <Link href={`/dashboard/strategies/${strategy.id}/edit`}>
                      <a className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</a>
                    </Link>
                    <button
                      onClick={() => handleDeleteStrategy(strategy.id)}
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

export default StrategiesPage;
