import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

interface Strategy {
  id: string;
  name: string;
}

const NewBotPage = () => {
  const router = useRouter();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingStrategies, setFetchingStrategies] = useState(true);
  const [error, setError] = useState('');
  
  const [bot, setBot] = useState({
    name: '',
    strategyId: '',
    config: {
      name: '',
      type: 'tradingBot',
      configuration: {
        trading: {
          strategy: {
            type: 'momentum',
            indicators: [
              {
                name: 'rsi',
                period: 14,
                parameters: {}
              }
            ]
          },
          riskManagement: {
            stopLoss: 5,
            takeProfit: 10,
            maxPositionSize: 5,
            maxDrawdown: 15
          }
        },
        dataFeeds: {
          provider: 'alpaca',
          websocket: {
            enabled: true,
            streams: ['bars', 'trades', 'quotes'],
            rateLimiting: {
              enabled: true,
              maxMessagesPerSecond: 10,
              batchSize: 100,
              throttleInterval: 1000,
              bufferSize: 10000
            }
          }
        }
      }
    }
  });

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        setFetchingStrategies(true);
        const response = await fetch('/api/strategies');
        if (response.ok) {
          const data = await response.json();
          setStrategies(data);
          if (data.length > 0) {
            setBot(prev => ({ ...prev, strategyId: data[0].id }));
          }
        }
      } catch (error) {
        console.error('Error fetching strategies:', error);
        setError('Failed to load strategies');
      } finally {
        setFetchingStrategies(false);
      }
    };

    fetchStrategies();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBot({ ...bot, [name]: value });
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const configObj = JSON.parse(e.target.value);
      setBot({ ...bot, config: configObj });
      setError('');
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bot),
      });

      if (response.ok) {
        router.push('/dashboard/bots');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create bot');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Create New Bot</h1>
        <p className="text-gray-500">Configure a new trading bot using an existing strategy</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}

      {fetchingStrategies ? (
        <p className="text-center py-4">Loading strategies...</p>
      ) : strategies.length === 0 ? (
        <div className="bg-yellow-50 text-yellow-700 p-4 mb-6 rounded">
          <p>You need to create a strategy before you can create a bot.</p>
          <button
            onClick={() => router.push('/dashboard/strategies/new')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Create your first strategy
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Bot Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={bot.name}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="strategyId" className="block text-sm font-medium text-gray-700 mb-1">
                Strategy
              </label>
              <select
                id="strategyId"
                name="strategyId"
                value={bot.strategyId}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                {strategies.map((strategy) => (
                  <option key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="config" className="block text-sm font-medium text-gray-700 mb-1">
              Bot Configuration (JSON)
            </label>
            <textarea
              id="config"
              name="config"
              rows={20}
              value={JSON.stringify(bot.config, null, 2)}
              onChange={handleConfigChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              The configuration must follow the bot-config.json schema.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? 'Creating...' : 'Create Bot'}
            </button>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
};

export default NewBotPage;
