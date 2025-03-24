import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

const NewStrategyPage = () => {
  const router = useRouter();
  const [strategy, setStrategy] = useState({
    name: '',
    version: '1.0.0',
    config: {
      strategyName: '',
      version: '1.0.0',
      indicators: {
        rsi: {
          period: 14,
          overbought: 70,
          oversold: 30
        },
        macd: {
          fastPeriod: 12,
          slowPeriod: 26,
          signalPeriod: 9
        },
        movingAverages: [
          {
            type: 'SMA',
            period: 20
          }
        ]
      },
      entryRules: [
        {
          indicator: 'rsi',
          condition: 'lessThan',
          value: 30,
          action: 'buy'
        }
      ],
      exitRules: [
        {
          type: 'stopLoss',
          value: 5
        },
        {
          type: 'takeProfit',
          value: 10
        }
      ],
      positionSizing: {
        type: 'percentageEquity',
        size: 5,
        maxPositionSize: 20
      },
      riskManagement: {
        maxDrawdown: 15,
        dailyLossLimit: 500,
        positionRiskPercent: 1
      }
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStrategy({ ...strategy, [name]: value });
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const configObj = JSON.parse(e.target.value);
      setStrategy({ ...strategy, config: configObj });
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
      const response = await fetch('/api/strategies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(strategy),
      });

      if (response.ok) {
        router.push('/dashboard/strategies');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create strategy');
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
        <h1 className="text-2xl font-semibold">Create New Strategy</h1>
        <p className="text-gray-500">Define your trading strategy configuration</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Strategy Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={strategy.name}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
              Version
            </label>
            <input
              type="text"
              id="version"
              name="version"
              value={strategy.version}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="config" className="block text-sm font-medium text-gray-700 mb-1">
            Strategy Configuration (JSON)
          </label>
          <textarea
            id="config"
            name="config"
            rows={20}
            value={JSON.stringify(strategy.config, null, 2)}
            onChange={handleConfigChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            The configuration must follow the strategy-config.json schema.
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
            {loading ? 'Creating...' : 'Create Strategy'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default NewStrategyPage;
