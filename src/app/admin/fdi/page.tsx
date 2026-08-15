import Link from 'next/link';
import { requireAdminAuth } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase/server';

type FdiSessionListRow = {
  readonly id: string;
  readonly created_at: string;
  readonly status: 'in_progress' | 'completed';
  readonly is_test: boolean;
  readonly name: string | null;
  readonly email: string | null;
  readonly company_name: string | null;
  readonly fdi_display: number | null;
  readonly band_label: string | null;
  readonly qualification_result: string | null;
  readonly email_sent: boolean;
};

export default async function AdminFdiPage() {
  await requireAdminAuth();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('fdi_sessions')
    .select('id,created_at,status,is_test,name,email,company_name,fdi_display,band_label,qualification_result,email_sent')
    .order('created_at', { ascending: false });
  const sessions = (data ?? []) as FdiSessionListRow[];
  const liveCompleted = sessions.filter((session) => !session.is_test && session.status === 'completed');
  const liveInProgress = sessions.filter((session) => !session.is_test && session.status === 'in_progress');
  const testSessions = sessions.filter((session) => session.is_test);

  return (
    <main className="min-h-screen bg-ivory">
      <nav className="bg-navy text-ivory px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4"><Link href="/admin/leads" className="text-xs text-ivory/50 hover:text-gold">← Legacy leads</Link><span className="font-heading font-bold text-sm">M<span className="text-gold">A</span> · FDI Consultant Workspace</span></div>
        <div className="flex items-center gap-4"><Link href="/diagnostic/fdi?testMode=true" className="text-xs text-gold hover:text-gold-bright">Start Test Mode</Link><a href="/api/admin/logout" className="text-xs text-ivory/50 hover:text-gold">Sign Out</a></div>
      </nav>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"><div><p className="eyebrow text-gold-ink">Founder Dependency Index</p><h1 className="font-heading font-extrabold text-navy text-2xl mt-2">FDI sessions</h1><p className="font-body text-sm text-navy/60 mt-2">Live and test records are separated. Qualification is consultant-only.</p></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6"><div className="bg-white border border-navy/10 rounded-xl p-5"><p className="font-heading text-xs uppercase tracking-wider text-navy/50">Live completed</p><p className="font-heading font-extrabold text-navy text-3xl mt-2">{liveCompleted.length}</p></div><div className="bg-white border border-navy/10 rounded-xl p-5"><p className="font-heading text-xs uppercase tracking-wider text-navy/50">Live in progress</p><p className="font-heading font-extrabold text-navy text-3xl mt-2">{liveInProgress.length}</p></div><div className="bg-white border border-navy/10 rounded-xl p-5"><p className="font-heading text-xs uppercase tracking-wider text-navy/50">Explicit test records</p><p className="font-heading font-extrabold text-navy text-3xl mt-2">{testSessions.length}</p></div></div>
        <div className="bg-white border border-navy/10 rounded-xl shadow-sm overflow-hidden mt-6"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-navy text-ivory"><tr>{['Date', 'Respondent', 'Company', 'Status', 'FDI', 'Qualification', 'Email', 'Record'].map((label) => <th key={label} className="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider whitespace-nowrap">{label}</th>)}</tr></thead><tbody className="divide-y divide-navy/5">{sessions.map((session) => <tr key={session.id} className="hover:bg-ivory/60"><td className="px-4 py-3 font-body text-xs text-navy/60 whitespace-nowrap">{new Date(session.created_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}</td><td className="px-4 py-3"><p className="font-heading font-semibold text-navy">{session.name ?? '—'}</p><p className="font-body text-xs text-navy/45">{session.email ?? 'No contact yet'}</p></td><td className="px-4 py-3 font-body text-xs text-navy/70">{session.company_name ?? '—'}</td><td className="px-4 py-3"><span className={session.status === 'completed' ? 'text-xs font-bold text-emerald-ink' : 'text-xs font-bold text-warning-ink'}>{session.status === 'completed' ? 'Completed' : 'In progress'}</span></td><td className="px-4 py-3 font-heading font-bold text-navy">{session.fdi_display === null ? '—' : `${session.fdi_display} / 100`}<p className="font-body text-xs font-normal text-navy/45">{session.band_label ?? ''}</p></td><td className="px-4 py-3 font-body text-xs text-navy/70">{session.qualification_result ?? 'Pending'}</td><td className="px-4 py-3 font-body text-xs">{session.status === 'completed' ? (session.email_sent ? <span className="text-emerald-ink">Sent</span> : <span className="text-crimson">Pending</span>) : '—'}</td><td className="px-4 py-3"><Link href={`/admin/fdi/${session.id}`} className="font-heading text-xs font-bold text-gold-ink hover:underline">{session.is_test ? 'Test record →' : 'View →'}</Link></td></tr>)}</tbody></table></div>{sessions.length === 0 && <p className="font-body text-sm text-navy/55 p-8 text-center">No FDI sessions yet.</p>}</div>
      </section>
    </main>
  );
}
