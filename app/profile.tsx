import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';

interface UserProfile {
  id?: string;
  email: string;
  name?: string;
  gemini_api_key?: string;
  openai_api_key?: string;
  preferences?: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({ email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    const res = await fetch('/api/users');
    const data = await res.json();
    if (data.user) setProfile(data.user);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    setMessage(data.error ? data.error : 'Profile updated successfully');
    setLoading(false);
  };

  return (
    <AppLayout>
      <Card>
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded px-3 py-2 w-full"
            required
            disabled
          />
          <input
            name="name"
            value={profile.name || ''}
            onChange={handleChange}
            placeholder="Name"
            className="border rounded px-3 py-2 w-full"
          />
          <textarea
            name="preferences"
            value={profile.preferences || ''}
            onChange={handleChange}
            placeholder="Preferences"
            className="border rounded px-3 py-2 w-full"
          />
          <input
            name="gemini_api_key"
            value={profile.gemini_api_key || ''}
            onChange={handleChange}
            placeholder="Gemini API Key"
            className="border rounded px-3 py-2 w-full"
          />
          <input
            name="openai_api_key"
            value={profile.openai_api_key || ''}
            onChange={handleChange}
            placeholder="OpenAI API Key"
            className="border rounded px-3 py-2 w-full"
          />
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
            Update Profile
          </button>
        </form>
        {message && <div className="mb-4 text-muted">{message}</div>}
        {loading && <div className="mt-4 text-muted">Loading...</div>}
      </Card>
    </AppLayout>
  );
};

export default ProfilePage;
