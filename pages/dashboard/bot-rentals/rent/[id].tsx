import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import Link from 'next/link';

interface Bot {
  id: string;
  name: string;
  type: string;
  rentalPrice: number;
  user: {
    id: string;
    name: string;
  }
}

const RentBotPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rentalForm, setRentalForm] = useState({
    startTime: '',
    endTime: '',
    settings: {}
  });
  const [totalCost, setTotalCost] = useState(0);

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
        
        // Set default rental period (e.g., 1 day from now)
        const startTime = new Date();
        const endTime = new Date(startTime);
        endTime.setDate(endTime.getDate() + 1);
        
        setRentalForm({
          startTime: startTime.toISOString().substring(0, 16),
          endTime: endTime.toISOString().substring(0, 16),
          settings: {}
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBot();
  }, [id]);

  useEffect(() => {
    if (bot && rentalForm.startTime && rentalForm.endTime) {
      const start = new Date(rentalForm.startTime);
      const end = new Date(rentalForm.endTime);
      
      // Calculate rental duration in hours
      const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      // Calculate total cost
      setTotalCost(durationHours * bot.rentalPrice);
    }
  }, [bot, rentalForm.startTime, rentalForm.endTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRentalForm({
      ...rentalForm,
      [name]: value
    });
  };

  const handleRentBot = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bot) return;
    
    try {
      const response = await fetch('/api/bot-rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId: bot.id,
          startTime: rentalForm.startTime,
          endTime: rentalForm.endTime,
          settings: rentalForm.settings
        }),
      });

      if (response.ok) {
        router.push('/dashboard/bot-rentals');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to rent bot');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p className="text-gray-500">Loading bot details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!bot) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p className="text-red-500">Bot not found</p>
          <Link href="/dashboard/bot-rentals">
            <a className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Back to Bot Rentals
            </a>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Rent Bot: {bot.name}</h1>
        <p className="text-gray-500">Provider: {bot.user.name}</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Rental Details</h2>
            <form onSubmit={handleRentBot}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    id="startTime"
                    name="startTime"
                    value={rentalForm.startTime}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    id="endTime"
                    name="endTime"
                    value={rentalForm.endTime}
                    onChange={handleInputChange}
                    min={rentalForm.startTime}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Cost Breakdown</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-medium">${bot.rentalPrice.toFixed(2)}/hour</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Estimated Duration:</span>
                    <span className="font-medium">
                      {rentalForm.startTime && rentalForm.endTime ? 
                        `${((new Date(rentalForm.endTime).getTime() - new Date(rentalForm.startTime).getTime()) / (1000 * 60 * 60)).toFixed(1)} hours` 
                        : '-'}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-800 font-medium">Total Cost:</span>
                      <span className="text-gray-800 font-bold">${totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Link href="/dashboard/bot-rentals">
                  <a className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                    Cancel
                  </a>
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                  Rent Bot
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Bot Details</h2>
            <dl className="divide-y divide-gray-200">
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="text-sm text-gray-900">{bot.type}</dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Rental Price</dt>
                <dd className="text-sm text-gray-900">${bot.rentalPrice.toFixed(2)}/hour</dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Provider</dt>
                <dd className="text-sm text-gray-900">{bot.user.name}</dd>
              </div>
            </dl>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-lg font-medium mb-4">Important Information</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex">
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                You can cancel before the start time at no cost
              </li>
              <li className="flex">
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                You'll only be charged for the time the bot is active
              </li>
              <li className="flex">
                <svg className="h-5 w-5 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Trading with bots involves risk - use at your own discretion
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RentBotPage;
