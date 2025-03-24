import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';

interface Bot {
  id: string;
  name: string;
  status: string;
}

const StrategyDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [strategy, setStrategy] = useState({
    id: '',
    name: '',
    version: '',
    config: {},
    createdAt: '',
    updatedAt: ''
  });
  
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchStrategyAndBots = async () => {
      try {
        setLoading(true);
        
        // Fetch strategy details
        const strategyResponse = await fetch(`/api/strategies/${id}`);
        if (!strategyResponse.ok) {
          throw new Error('Failed to fetch strategy');
        }
        const strategyData = await strategyResponse.json();
        setStrategy(strategyData);
        
        // Fetch bots using this strategy
        const botsResponse = await fetch(`/api/bots?strategyId=${id}`);
        if (botsResponse.ok) {
          const botsData = await botsResponse.json();
          setBots(botsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStrategyAndBots();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p className="text-gray-500">Loading strategy...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{strategy.name}</h1>
          <p className="text-gray-500">Version: {strategy.version}</p>
        </div>
        <div className="flex space-x-2">
          <Link href={`/dashboard/strategies/${id}/edit`}>
            <a className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Edit Strategy
            </a>
          </Link>
          <Link href="/dashboard/bots/new">
            <a className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
              Create Bot with this Strategy
            </a>
          </Link>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Strategy Configuration</h2>
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-xs max-h-96">
              {JSON.stringify(strategy.config, null, 2)}
            </pre>
          </div>
        </div>
        
        <div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Strategy Details</h2>
            <dl className="divide-y divide-gray-200">
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(strategy.createdAt).toLocaleString()}
                </dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(strategy.updatedAt).toLocaleString()}
                </dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Active Bots</dt>
                <dd className="text-sm text-gray-900">
                  {bots.filter(bot => bot.status === 'active').length}
                </dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Total Bots</dt>
                <dd className="text-sm text-gray-900">{bots.length}</dd>
              </div>
            </dl>
          </div>

          {bots.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6 mt-6">
              <h2 className="text-lg font-medium mb-4">Bots Using This Strategy</h2>
              <ul className="divide-y divide-gray-200">
                {bots.map(bot => (
                  <li key={bot.id} className="py-3">
                    <div className="flex justify-between items-center">
                      <Link href={`/dashboard/bots/${bot.id}`}>
                        <a className="text-blue-600 hover:text-blue-800">{bot.name}</a>
                      </Link>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        bot.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {bot.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StrategyDetailPage;
