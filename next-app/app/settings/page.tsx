'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsClient } from '@/lib/api/apiClients';
import { queryKeys } from '@/components/ReactQueryProvider';
import { ProfileUpdate } from '@/lib/schemas/schemas';
import { Settings, User, Bell, Shield, Link, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * Settings Page - User Profile & System Configuration
 */

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const queryClient = useQueryClient();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account preferences and trading configuration
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'preferences', label: 'Preferences', icon: Settings },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'integrations', label: 'Integrations', icon: Link },
              { id: 'security', label: 'Security', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'preferences' && <PreferencesTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'integrations' && <IntegrationsTab />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
}

/**
 * Profile Tab
 */
function ProfileTab() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferences: {
      currency: 'USD',
      timezone: 'UTC',
      notifications: true,
    },
  });

  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: queryKeys.settings.profile(),
    queryFn: settingsClient.getProfile,
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        preferences: profile.preferences,
      });
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updates: ProfileUpdate) => settingsClient.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.profile() });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="trading-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="trading-card p-6">
      <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Currency</label>
            <select
              value={formData.preferences.currency}
              onChange={(e) => setFormData({
                ...formData,
                preferences: { ...formData.preferences, currency: e.target.value }
              })}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Timezone</label>
            <select
              value={formData.preferences.timezone}
              onChange={(e) => setFormData({
                ...formData,
                preferences: { ...formData.preferences, timezone: e.target.value }
              })}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {updateProfileMutation.isSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Profile updated successfully
              </span>
            </div>
          </div>
        )}

        {updateProfileMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                Failed to update profile
              </span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

/**
 * Integrations Tab
 */
function IntegrationsTab() {
  const queryClient = useQueryClient();

  // Fetch integrations
  const { data: integrations, isLoading } = useQuery({
    queryKey: queryKeys.settings.integrations(),
    queryFn: settingsClient.getIntegrations,
  });

  // Disconnect integration mutation
  const disconnectMutation = useMutation({
    mutationFn: (id: string) => settingsClient.disconnectIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.integrations() });
    },
  });

  if (isLoading) {
    return (
      <div className="trading-card p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="trading-card p-6">
      <h2 className="text-xl font-semibold mb-6">Connected Services</h2>
      
      {integrations && integrations.length > 0 ? (
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  integration.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {integration.type} • {integration.status}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => disconnectMutation.mutate(integration.id)}
                disabled={disconnectMutation.isPending}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Link className="h-12 w-12 mx-auto mb-4" />
          <p>No integrations connected</p>
        </div>
      )}
    </div>
  );
}

/**
 * Simple Tab Placeholders
 */
function PreferencesTab() {
  return (
    <div className="trading-card p-6">
      <h2 className="text-xl font-semibold mb-6">Trading Preferences</h2>
      <p className="text-muted-foreground">Trading preferences configuration coming soon...</p>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="trading-card p-6">
      <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
      <p className="text-muted-foreground">Notification settings coming soon...</p>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="trading-card p-6">
      <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
      <p className="text-muted-foreground">Security settings coming soon...</p>
    </div>
  );
}