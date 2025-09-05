import React from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';

const Settings = () => (
  <AppLayout>
    <Card>
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <div className="text-muted">Profile, API keys, billing, team members.</div>
    </Card>
  </AppLayout>
);

export default Settings;
