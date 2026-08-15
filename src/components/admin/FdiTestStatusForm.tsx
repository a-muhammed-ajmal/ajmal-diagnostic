'use client';

import { useState } from 'react';

interface FdiTestStatusFormProps {
  readonly sessionId: string;
  readonly isTest: boolean;
}

export function FdiTestStatusForm({ sessionId, isTest }: FdiTestStatusFormProps) {
  const [currentValue, setCurrentValue] = useState(isTest);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWorking(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/fdi/sessions/${sessionId}/test-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTest: !currentValue, reason: reason || undefined }),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok || !payload || typeof payload !== 'object' || !('success' in payload) || payload.success !== true) {
        throw new Error(payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string' ? payload.error : 'Unable to update test status.');
      }
      setCurrentValue((value) => !value);
      setReason('');
      setMessage('Test status updated and recorded in the audit history.');
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to update test status.');
    } finally {
      setWorking(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <p className="font-body text-sm text-navy/70">
        Current classification: <strong>{currentValue ? 'Test' : 'Live'}</strong>
      </p>
      <label className="block">
        <span className="font-heading text-sm font-semibold text-navy">Reason <span className="font-normal text-navy/40">(optional)</span></span>
        <input value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} className="mt-1 w-full min-h-[44px] rounded-lg border border-navy/20 px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-gold" />
      </label>
      <button type="submit" disabled={working} className="min-h-[44px] rounded-lg bg-navy text-ivory px-4 py-2 font-heading text-sm font-bold hover:bg-navy/90 disabled:opacity-50">
        {working ? 'Saving…' : currentValue ? 'Mark as live' : 'Mark as test'}
      </button>
      {message && <p role="status" className="font-body text-xs text-navy/60">{message}</p>}
    </form>
  );
}
