import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    strategies: 0,
    bots: 0,
    activeBots: 0,
    portfolioValue: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Strategies</h3>
          <p className="text-3xl font-bold">{stats.strategies}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Bots</h3>
          <p className="text-3xl font-bold">{stats.bots}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Active Bots</h3>
          <p className="text-3xl font-bold">{stats.activeBots}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Portfolio Value</h3>
          <p className="text-3xl font-bold">${stats.portfolioValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Recent Bot Activity</h3>
          <p className="text-gray-500">No recent activity</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Performance Overview</h3>
          <p className="text-gray-500">No performance data available</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
