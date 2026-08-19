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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas-light px-4">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="orb orb-electric absolute -right-32 -top-40 h-96 w-96" />
        <div className="orb orb-amber absolute -bottom-40 -left-32 h-80 w-80" />
      </div>
      <div className="glass-panel relative z-10 w-full max-w-sm rounded-2xl p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand shadow-1">
            <span className="font-heading text-[length:var(--step-1)] font-extrabold leading-none tracking-tighter text-white">
              M<span className="text-accent">A</span>
            </span>
          </div>
          <h1 className="font-heading font-bold text-ink text-[length:var(--step-0)] uppercase tracking-widest">Admin Access</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-[length:var(--step-0)] font-heading font-semibold text-ink mb-1">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-line rounded-lg px-4 py-3 text-ink text-[length:var(--step-0)] focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Enter admin password"
              required
            />
          </div>
          {error && <p role="alert" className="text-danger text-[length:var(--step-0)]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white font-heading font-bold py-3 rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50 min-h-[48px]"
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
