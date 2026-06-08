'use client';
import { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setStatus('success'); setEmail(''); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  if (status === 'success') return (
    <div className="bg-emerald/10 border border-emerald/30 rounded-xl p-6 text-center">
      <p className="text-emerald font-heading font-bold text-lg mb-1">✔ You are subscribed.</p>
      <p className="text-navy/60 font-body text-sm">You will hear from us when there is something worth sending.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="your@email.com"
        className="flex-1 border border-navy/20 rounded-lg px-4 py-3 text-navy text-base focus:outline-none focus:ring-2 focus:ring-gold bg-white"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-gold text-navy font-heading font-bold px-6 py-3 rounded-lg hover:bg-gold-bright transition-colors min-h-[48px] whitespace-nowrap disabled:opacity-50"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe →'}
      </button>
      {status === 'error' && <p className="text-crimson text-xs mt-1 w-full">Something went wrong. Try again.</p>}
    </form>
  );
}
