import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';

interface Transaction {
  id?: string;
  investment_id?: string;
  type: string;
  amount: number;
  created_at?: string;
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState<Transaction>({ type: '', amount: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    const res = await fetch('/api/transactions');
    const data = await res.json();
    setTransactions(data.transactions || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? 'PATCH' : 'POST';
    const res = await fetch('/api/transactions', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });
    await fetchTransactions();
    setForm({ type: '', amount: 0 });
    setEditingId(null);
    setLoading(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setForm(transaction);
    setEditingId(transaction.id || null);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await fetch('/api/transactions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await fetchTransactions();
    setLoading(false);
  };

  return (
    <AppLayout>
      <Card>
        <h1 className="text-2xl font-bold mb-4">Transactions Management</h1>
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="Transaction Type"
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            name="investment_id"
            value={form.investment_id || ''}
            onChange={handleChange}
            placeholder="Investment ID"
            className="border rounded px-3 py-2 w-full"
          />
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
            {editingId ? 'Update Transaction' : 'Create Transaction'}
          </button>
          {editingId && (
            <button type="button" className="ml-2 px-4 py-2 rounded bg-muted" onClick={() => { setForm({ type: '', amount: 0 }); setEditingId(null); }}>
              Cancel
            </button>
          )}
        </form>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Investment ID</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t">
                <td className="p-2">{transaction.type}</td>
                <td className="p-2">{transaction.amount}</td>
                <td className="p-2">{transaction.investment_id}</td>
                <td className="p-2 flex gap-2">
                  <button className="px-2 py-1 rounded bg-accent" onClick={() => handleEdit(transaction)}>Edit</button>
                  <button className="px-2 py-1 rounded bg-red-500 text-white" onClick={() => transaction.id && handleDelete(transaction.id)}>Delete</button>
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

export default TransactionsPage;
