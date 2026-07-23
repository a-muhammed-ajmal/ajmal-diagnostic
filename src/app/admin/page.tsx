'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) router.push('/admin/leads');
      else setError('Incorrect password. Try again.');
    } catch { setError('Something went wrong.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-heading font-extrabold text-navy text-2xl mb-1">
            M<span className="text-gold-ink">A</span>
          </div>
          <p className="font-heading font-bold text-navy text-sm uppercase tracking-widest">Admin Access</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-heading font-semibold text-navy mb-1">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-navy/20 rounded-lg px-4 py-3 text-navy text-base focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Enter admin password"
              required
            />
          </div>
          {error && <p role="alert" className="text-crimson text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-ivory font-heading font-bold py-3 rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50 min-h-[48px]"
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
