import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!email || !email.includes('@')) {
      setStatus('Please enter a valid email address.');
      return;
    }

    try {
      const { error, data } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        setStatus(`Registration failed: ${error.message}`);
        console.error('Supabase registration error:', error);
        return;
      }
      setStatus('Magic link sent! Check your email to complete registration.');
      console.log('Supabase registration response:', data);
    } catch (err) {
      setStatus('Unexpected error during registration.');
      console.error('Unexpected registration error:', err);
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-4">
      <label className="block mb-2 font-semibold">Email</label>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-4"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Register
      </button>
      {status && <div className="mt-4 text-sm">{status}</div>}
    </form>
  );
}