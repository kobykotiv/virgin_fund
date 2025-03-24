import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Link from 'next/link';

interface Bot {
  id: string;
  name: string;
  status: string;
  strategyId: string;
  createdAt: string;
  updatedAt: string;
  strategy: {
    name: string;
  };
}

const BotsPage = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/bots');
        if (response.ok) {
          const data = await response.json();
          setBots(data);
        }
      } catch (error) {
        console.error('Error fetching bots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

  const handleToggleBotStatus = async (bot: Bot) => {
    try {
      const newStatus = bot.status === 'active' ? 'inactive' : 'active';
      const response = await fetch('/api/bots', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId: bot.id,
          updates: { status: newStatus },
        }),
      });

      if (response.ok) {
        setBots(
          bots.map((b) =>
            b.id === bot.id ? { ...b, status: newStatus } : b
          )
        );
      }
    } catch (error) {
      console.error('Error toggling bot status:', error);
    }
  };

  const handleDeleteBot = async (id: string) => {
    if (confirm('Are you sure you want to delete this bot?')) {
      try {
        const response = await fetch(`/api/bots?botId=${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setBots(bots.filter(bot => bot.id !== id));
        }
      } catch (error) {
        console.error('Error deleting bot:', error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Bots</h1>
        <Link href="/dashboard/bots/new">
          <a className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Create Bot
          </a>
        </Link>
      </div>

      {loading ? (
        <p>Loading bots...</p>
      ) : bots.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">You don't have any bots yet.</p>
          <Link href="/dashboard/bots/new">
            <a className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Create your first bot
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
                  Strategy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {bots.map((bot) => (
                <tr key={bot.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{bot.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{bot.strategy.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bot.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {bot.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(bot.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleToggleBotStatus(bot)}
                      className={`mr-4 ${
                        bot.status === 'active'
                          ? 'text-yellow-600 hover:text-yellow-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {bot.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <Link href={`/dashboard/bots/${bot.id}/edit`}>
                      <a className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</a>
                    </Link>
                    <button
                      onClick={() => handleDeleteBot(bot.id)}
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

export default BotsPage;
