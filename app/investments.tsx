import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';

interface Investment {
  id?: string;
  fund_id?: string;
  user_id?: string;
  amount: number;
  created_at?: string;
}

const InvestmentsPage: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [form, setForm] = useState<Investment>({ amount: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchInvestments = async () => {
    setLoading(true);
    const res = await fetch('/api/investments');
    const data = await res.json();
    setInvestments(data.investments || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    // Frontend validation
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setFormError('Amount is required and must be a positive number.');
      return;
    }
    setLoading(true);
    const method = editingId ? 'PATCH' : 'POST';
    const res = await fetch('/api/investments', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });
    await fetchInvestments();
    setForm({ amount: 0 });
    setEditingId(null);
    setLoading(false);
  };

  const handleEdit = (investment: Investment) => {
    setForm(investment);
    setEditingId(investment.id || null);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await fetch('/api/investments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await fetchInvestments();
    setLoading(false);
  };

  return (
    <AppLayout>
      <Card>
        <h1 className="text-2xl font-bold mb-4">Investments Management</h1>
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="Investment Amount"
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            name="fund_id"
            value={form.fund_id || ''}
            onChange={handleChange}
            placeholder="Fund ID"
            className="border rounded px-3 py-2 w-full"
          />
          <input
            name="user_id"
            value={form.user_id || ''}
            onChange={handleChange}
            placeholder="User ID"
            className="border rounded px-3 py-2 w-full"
          />
          {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>}
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
            {editingId ? 'Update Investment' : 'Create Investment'}
          </button>
          {editingId && (
            <button type="button" className="ml-2 px-4 py-2 rounded bg-muted" onClick={() => { setForm({ amount: 0 }); setEditingId(null); setFormError(null); }}>
              Cancel
            </button>
          )}
        </form>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Fund ID</th>
              <th className="p-2 text-left">User ID</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((investment) => (
              <tr key={investment.id} className="border-t">
                <td className="p-2">{investment.amount}</td>
                <td className="p-2">{investment.fund_id}</td>
                <td className="p-2">{investment.user_id}</td>
                <td className="p-2 flex gap-2">
                  <button className="px-2 py-1 rounded bg-accent" onClick={() => handleEdit(investment)}>Edit</button>
                  <button className="px-2 py-1 rounded bg-red-500 text-white" onClick={() => investment.id && handleDelete(investment.id)}>Delete</button>
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

export default InvestmentsPage;
