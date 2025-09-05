import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';

interface Portfolio {
  id?: string;
  name: string;
  risk_profile: string;
  created_at?: string;
}

const PortfolioManagementPage: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [form, setForm] = useState<Portfolio>({ name: '', risk_profile: 'moderate' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPortfolios = async () => {
    setLoading(true);
    const res = await fetch('/api/portfolios');
    const data = await res.json();
    setPortfolios(data.portfolios || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? 'PATCH' : 'POST';
    const res = await fetch('/api/portfolios', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });
    await fetchPortfolios();
    setForm({ name: '', risk_profile: 'moderate' });
    setEditingId(null);
    setLoading(false);
  };

  const handleEdit = (portfolio: Portfolio) => {
    setForm(portfolio);
    setEditingId(portfolio.id || null);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await fetch('/api/portfolios', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await fetchPortfolios();
    setLoading(false);
  };

  return (
    <AppLayout>
      <Card>
        <h1 className="text-2xl font-bold mb-4">Portfolio Management</h1>
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Portfolio Name"
            className="border rounded px-3 py-2 w-full"
            required
          />
          <select name="risk_profile" value={form.risk_profile} onChange={handleChange} className="border rounded px-3 py-2 w-full">
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
            {editingId ? 'Update Portfolio' : 'Create Portfolio'}
          </button>
          {editingId && (
            <button type="button" className="ml-2 px-4 py-2 rounded bg-muted" onClick={() => { setForm({ name: '', risk_profile: 'moderate' }); setEditingId(null); }}>
              Cancel
            </button>
          )}
        </form>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Risk Profile</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolios.map((portfolio) => (
              <tr key={portfolio.id} className="border-t">
                <td className="p-2">{portfolio.name}</td>
                <td className="p-2">{portfolio.risk_profile}</td>
                <td className="p-2 flex gap-2">
                  <button className="px-2 py-1 rounded bg-accent" onClick={() => handleEdit(portfolio)}>Edit</button>
                  <button className="px-2 py-1 rounded bg-red-500 text-white" onClick={() => portfolio.id && handleDelete(portfolio.id)}>Delete</button>
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

export default PortfolioManagementPage;
