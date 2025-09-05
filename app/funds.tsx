import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';

interface Fund {
  id?: string;
  name: string;
  description?: string;
  created_at?: string;
}

const FundsPage: React.FC = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [form, setForm] = useState<Fund>({ name: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchFunds = async () => {
    setLoading(true);
    const res = await fetch('/api/funds');
    const data = await res.json();
    setFunds(data.funds || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    // Frontend validation
    if (!form.name || form.name.trim().length < 3) {
      setFormError('Fund name is required and must be at least 3 characters.');
      return;
    }
    setLoading(true);
    const method = editingId ? 'PATCH' : 'POST';
    const res = await fetch('/api/funds', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });
    await fetchFunds();
    setForm({ name: '' });
    setEditingId(null);
    setLoading(false);
  };

  const handleEdit = (fund: Fund) => {
    setForm(fund);
    setEditingId(fund.id || null);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await fetch('/api/funds', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await fetchFunds();
    setLoading(false);
  };

  return (
    <AppLayout>
      <Card>
        <h1 className="text-2xl font-bold mb-4">Funds Management</h1>
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Fund Name"
            className="border rounded px-3 py-2 w-full"
            required
          />
          <textarea
            name="description"
            value={form.description || ''}
            onChange={handleChange}
            placeholder="Description"
            className="border rounded px-3 py-2 w-full"
          />
          {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>}
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
            {editingId ? 'Update Fund' : 'Create Fund'}
          </button>
          {editingId && (
            <button type="button" className="ml-2 px-4 py-2 rounded bg-muted" onClick={() => { setForm({ name: '' }); setEditingId(null); setFormError(null); }}>
              Cancel
            </button>
          )}
        </form>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund) => (
              <tr key={fund.id} className="border-t">
                <td className="p-2">{fund.name}</td>
                <td className="p-2">{fund.description}</td>
                <td className="p-2 flex gap-2">
                  <button className="px-2 py-1 rounded bg-accent" onClick={() => handleEdit(fund)}>Edit</button>
                  <button className="px-2 py-1 rounded bg-red-500 text-white" onClick={() => fund.id && handleDelete(fund.id)}>Delete</button>
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

export default FundsPage;
