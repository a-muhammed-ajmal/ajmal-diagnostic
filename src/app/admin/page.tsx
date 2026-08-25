'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Field';

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
      <div className="glass-panel relative z-10 w-full max-w-sm rounded-2xl p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand shadow-1">
            <span className="font-heading text-[length:var(--step-1)] font-extrabold leading-none tracking-tighter text-white">
              M<span className="text-accent">A</span>
            </span>
          </div>
          <h1 className="font-heading text-[length:var(--step-1)] font-bold uppercase text-ink">Admin Access</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              invalid={Boolean(error)}
              placeholder="Enter admin password"
              required
            />
          </div>
          {error && <p role="alert" className="text-danger text-[length:var(--step-0)]">{error}</p>}
          <Button type="submit" disabled={loading} fullWidth className="min-h-[48px]">
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </Button>
        </form>
      </div>
    </div>
  );
}
