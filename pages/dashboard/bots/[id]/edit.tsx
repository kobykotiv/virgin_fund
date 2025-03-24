import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';

interface Strategy {
  id: string;
  name: string;
}

const EditBotPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [bot, setBot] = useState({
    id: '',
    name: '',
    strategyId: '',
    status: '',
    config: {}
  });

  const [loading, setLoading] = useState(true);
  const [fetchingStrategies, setFetchingStrategies] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        setFetchingStrategies(true);
        const response = await fetch('/api/strategies');
        if (response.ok) {
          const data = await response.json();
          setStrategies(data);
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
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/bots/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: bot.name,
          strategyId: bot.strategyId,
          status: bot.status,
          config: bot.config
        }),
      });

      if (response.ok) {
        router.push('/dashboard/bots');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update bot');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || fetchingStrategies) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p className="text-gray-500">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Bot</h1>
        <p className="text-gray-500">Modify your trading bot configuration</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={bot.status}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="error">Error</option>
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
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default EditBotPage;
