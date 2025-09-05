// ...existing code...

import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';

interface Bot {
  id?: string;
  name: string;
  type: string;
  status: string;
  performance?: number;
  config?: Record<string, any>;
}

const BotsPage: React.FC = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [form, setForm] = useState<Bot>({ name: '', type: '', status: 'active' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchBots = async () => {
    setLoading(true);
    const res = await fetch('/api/bots');
    const data = await res.json();
    setBots(data.bots || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    // Frontend validation
    if (!form.name || form.name.trim().length < 3) {
      setFormError('Bot name is required and must be at least 3 characters.');
      return;
    }
    if (!form.type || form.type.trim().length < 3) {
      setFormError('Bot type is required and must be at least 3 characters.');
      return;
    }
    setLoading(true);
    const method = editingId ? 'PATCH' : 'POST';
    const res = await fetch('/api/bots', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });
    await fetchBots();
    setForm({ name: '', type: '', status: 'active' });
    setEditingId(null);
    setLoading(false);
  };

  const handleEdit = (bot: Bot) => {
    setForm(bot);
    setEditingId(bot.id || null);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await fetch('/api/bots', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await fetchBots();
    setLoading(false);
  };

  return (
    <AppLayout>
      <Card>
        <h1 className="text-2xl font-bold mb-4">Bot Management</h1>
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Bot Name"
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="Type (e.g., algorithmic)"
            className="border rounded px-3 py-2 w-full"
            required
          />
          <select name="status" value={form.status} onChange={handleChange} className="border rounded px-3 py-2 w-full">
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="stopped">Stopped</option>
            <option value="error">Error</option>
          </select>
          {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>}
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
            {editingId ? 'Update Bot' : 'Create Bot'}
          </button>
          {editingId && (
            <button type="button" className="ml-2 px-4 py-2 rounded bg-muted" onClick={() => { setForm({ name: '', type: '', status: 'active' }); setEditingId(null); setFormError(null); }}>
              Cancel
            </button>
          )}
        </form>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Performance</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((bot) => (
              <tr key={bot.id} className="border-t">
                <td className="p-2">{bot.name}</td>
                <td className="p-2">{bot.type}</td>
                <td className="p-2">{bot.status}</td>
                <td className="p-2">{bot.performance ?? '-'}</td>
                <td className="p-2 flex gap-2">
                  <button className="px-2 py-1 rounded bg-accent" onClick={() => handleEdit(bot)}>Edit</button>
                  <button className="px-2 py-1 rounded bg-red-500 text-white" onClick={() => bot.id && handleDelete(bot.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="mt-4 text-muted">Loading...</div>}
      </Card>
    </AppLayout>
  );
};

export default BotsPage;
