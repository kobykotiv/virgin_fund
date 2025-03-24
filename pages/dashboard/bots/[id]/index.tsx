import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';

const BotDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [bot, setBot] = useState({
    id: '',
    name: '',
    status: '',
    config: {},
    strategyId: '',
    strategy: {
      name: '',
      id: ''
    },
    createdAt: '',
    updatedAt: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchBot = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bots/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bot');
        }
        const data = await response.json();
        setBot(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBot();
  }, [id]);

  const handleToggleStatus = async () => {
    try {
      const newStatus = bot.status === 'active' ? 'inactive' : 'active';
      const response = await fetch(`/api/bots/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (response.ok) {
        setBot({ ...bot, status: newStatus });
      } else {
        throw new Error('Failed to update bot status');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p className="text-gray-500">Loading bot...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{bot.name}</h1>
          <p className="text-gray-500">
            Status: <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              bot.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>{bot.status}</span>
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleToggleStatus}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              bot.status === 'active' 
                ? 'bg-yellow-600 hover:bg-yellow-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {bot.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
          <Link href={`/dashboard/bots/${id}/edit`}>
            <a className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Edit Bot
            </a>
          </Link>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Bot Configuration</h2>
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-xs max-h-96">
              {JSON.stringify(bot.config, null, 2)}
            </pre>
          </div>
        </div>
        
        <div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Bot Details</h2>
            <dl className="divide-y divide-gray-200">
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Strategy</dt>
                <dd className="text-sm text-blue-600">
                  <Link href={`/dashboard/strategies/${bot.strategyId}`}>
                    <a>{bot.strategy.name}</a>
                  </Link>
                </dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(bot.createdAt).toLocaleString()}
                </dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(bot.updatedAt).toLocaleString()}
                </dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Current Status</dt>
                <dd className={`text-sm font-medium ${
                  bot.status === 'active' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-lg font-medium mb-4">Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => router.push(`/dashboard/bots/${id}/logs`)}
                className="w-full flex justify-between items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded hover:bg-gray-100"
              >
                <span>View Logs</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={() => router.push(`/dashboard/bots/${id}/performance`)}
                className="w-full flex justify-between items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded hover:bg-gray-100"
              >
                <span>View Performance</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={() => router.push(`/dashboard/bots/${id}/duplicate`)}
                className="w-full flex justify-between items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded hover:bg-gray-100"
              >
                <span>Duplicate Bot</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BotDetailPage;
