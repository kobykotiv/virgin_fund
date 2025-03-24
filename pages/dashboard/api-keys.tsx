import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  key: string;
  createdAt: string;
}

const ApiKeysPage = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyForm, setNewKeyForm] = useState({
    name: '',
    provider: 'alpaca',
    key: '',
    secret: '',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/api-keys');
        if (response.ok) {
          const data = await response.json();
          setApiKeys(data);
        }
      } catch (error) {
        console.error('Error fetching API keys:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewKeyForm({ ...newKeyForm, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newKeyForm),
      });

      if (response.ok) {
        const newKey = await response.json();
        setApiKeys([...apiKeys, newKey]);
        setNewKeyForm({
          name: '',
          provider: 'alpaca',
          key: '',
          secret: '',
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      try {
        const response = await fetch(`/api/api-keys?apiKeyId=${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setApiKeys(apiKeys.filter(key => key.id !== id));
        }
      } catch (error) {
        console.error('Error deleting API key:', error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">API Keys</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {showForm ? 'Cancel' : 'Add API Key'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Add New API Key</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newKeyForm.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Provider</label>
                <select
                  name="provider"
                  value={newKeyForm.provider}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="alpaca">Alpaca</option>
                  <option value="polygon">Polygon</option>
                  <option value="finnhub">Finnhub</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">API Key</label>
                <input
                  type="text"
                  name="key"
                  value={newKeyForm.key}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">API Secret</label>
                <input
                  type="password"
                  name="secret"
                  value={newKeyForm.secret}
                  onChange={handleInputChange}
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
                Save API Key
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading API keys...</p>
      ) : apiKeys.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">You don't have any API keys yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:text-blue-800 mt-2"
          >
            Add your first API key
          </button>
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
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  API Key
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
              {apiKeys.map((apiKey) => (
                <tr key={apiKey.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{apiKey.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{apiKey.provider}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {apiKey.key.substring(0, 5)}...{apiKey.key.substring(apiKey.key.length - 5)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(apiKey.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteKey(apiKey.id)}
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

export default ApiKeysPage;
