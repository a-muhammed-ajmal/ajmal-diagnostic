'use client';
import { useId, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Rendered in two places with different ground colours: the /insights section (light)
 * and the site footer (dark). The supporting text and success card have to invert, so
 * tone is a prop rather than hardcoded navy.
 *
 * The field id comes from useId() because both instances can appear on the same page —
 * a fixed id would duplicate and leave each <label htmlFor> pointing at the wrong input.
 */
export function NewsletterForm({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const fieldId = useId();
  const isDark = tone === 'dark';

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
    <div className={cn('rounded-xl border p-6 text-center', isDark ? 'border-emerald/30 bg-emerald/10' : 'border-emerald/30 bg-emerald/10')}>
      <p className={cn('mb-1 font-heading text-lg font-bold', isDark ? 'text-emerald' : 'text-emerald-ink')}>✔ You are subscribed.</p>
      <p className={cn('font-body text-sm', isDark ? 'text-ivory/60' : 'text-navy/60')}>You will hear from us when there is something worth sending.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <label htmlFor={fieldId} className="sr-only">Email address</label>
      <input
        id={fieldId}
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="your@email.com"
        className="min-w-0 flex-1 rounded-lg border border-navy/20 bg-white px-4 py-3 text-base text-navy focus:outline-none focus:ring-2 focus:ring-gold"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="min-h-[48px] whitespace-nowrap rounded-lg bg-gold px-6 py-3 font-heading font-bold text-navy transition-colors hover:bg-gold-bright disabled:opacity-50"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe →'}
      </button>
      {status === 'error' && <p role="alert" className={cn('mt-1 w-full text-xs', isDark ? 'text-gold' : 'text-crimson')}>Something went wrong. Try again.</p>}
      <p className={cn('w-full font-body text-xs sm:basis-full', isDark ? 'text-ivory/45' : 'text-navy/50')}>
        By subscribing you agree to our{' '}
        <a href="/privacy" className={cn('underline transition-colors', isDark ? 'text-gold hover:text-gold-bright' : 'text-gold-ink hover:text-gold')}>Privacy Policy</a>.
      </p>
    </form>
  );
}
