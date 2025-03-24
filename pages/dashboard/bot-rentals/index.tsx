import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Link from 'next/link';

interface BotRental {
  id: string;
  botId: string;
  startTime: string;
  endTime: string;
  status: string;
  totalCost: number;
  createdAt: string;
  bot: {
    id: string;
    name: string;
    user: {
      id: string;
      name: string;
    }
  }
}

interface AvailableBot {
  id: string;
  name: string;
  type: string;
  rentalPrice: number;
  status: string;
  user: {
    id: string;
    name: string;
  }
}

const BotRentalsPage = () => {
  const [activeTab, setActiveTab] = useState('rented');
  const [rentals, setRentals] = useState<BotRental[]>([]);
  const [availableBots, setAvailableBots] = useState<AvailableBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bot-rentals?view=${activeTab === 'rented' ? 'renter' : 'provider'}`);
        if (response.ok) {
          const data = await response.json();
          setRentals(data);
        }
      } catch (error) {
        console.error('Error fetching rentals:', error);
        setError('Failed to load rentals');
      } finally {
        setLoading(false);
      }
    };

    const fetchAvailableBots = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/bots/available');
        if (response.ok) {
          const data = await response.json();
          setAvailableBots(data);
        }
      } catch (error) {
        console.error('Error fetching available bots:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'marketplace') {
      fetchAvailableBots();
    } else {
      fetchRentals();
    }
  }, [activeTab]);

  const handleCancelRental = async (rentalId: string) => {
    if (confirm('Are you sure you want to cancel this rental?')) {
      try {
        const response = await fetch(`/api/bot-rentals/${rentalId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'CANCELLED'
          }),
        });
        
        if (response.ok) {
          setRentals(rentals.map(rental => 
            rental.id === rentalId 
              ? { ...rental, status: 'CANCELLED' } 
              : rental
          ));
        }
      } catch (error) {
        console.error('Error cancelling rental:', error);
        setError('Failed to cancel rental');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Bot Rentals</h1>
          {activeTab === 'marketplace' && (
            <Link href="/dashboard/bot-rentals/marketplace">
              <a className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Browse All Bots
              </a>
            </Link>
          )}
        </div>
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('rented')}
              className={`${
                activeTab === 'rented'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Bots I've Rented
            </button>
            <button
              onClick={() => setActiveTab('providing')}
              className={`${
                activeTab === 'providing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Bots I've Provided
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`${
                activeTab === 'marketplace'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Marketplace
            </button>
          </nav>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}

      {activeTab !== 'marketplace' ? (
        <>
          {loading ? (
            <p className="text-center py-4">Loading rentals...</p>
          ) : rentals.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">
                {activeTab === 'rented' 
                  ? "You haven't rented any bots yet." 
                  : "You haven't provided any bots for rent."}
              </p>
              {activeTab === 'rented' ? (
                <Link href="/dashboard/bot-rentals/marketplace">
                  <a className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                    Browse available bots
                  </a>
                </Link>
              ) : (
                <Link href="/dashboard/bots">
                  <a className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                    Make your bots available for rent
                  </a>
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bot Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeTab === 'rented' ? 'Provider' : 'Rented By'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rentals.map((rental) => (
                    <tr key={rental.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{rental.bot.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{rental.bot.user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(rental.startTime).toLocaleDateString()} - {new Date(rental.endTime).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          rental.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : rental.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : rental.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {rental.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">${rental.totalCost.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {rental.status === 'PENDING' || rental.status === 'ACTIVE' ? (
                          <button 
                            onClick={() => handleCancelRental(rental.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-gray-400">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-center py-4 col-span-3">Loading available bots...</p>
          ) : availableBots.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center col-span-3">
              <p className="text-gray-500">No bots are currently available for rent.</p>
            </div>
          ) : (
            availableBots.map((bot) => (
              <div key={bot.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{bot.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">By {bot.user.name}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-semibold rounded-full">
                      {bot.type}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900">${bot.rentalPrice.toFixed(2)}/hr</p>
                  </div>
                  <div className="mt-6">
                    <Link href={`/dashboard/bot-rentals/rent/${bot.id}`}>
                      <a className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Rent Now
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default BotRentalsPage;
