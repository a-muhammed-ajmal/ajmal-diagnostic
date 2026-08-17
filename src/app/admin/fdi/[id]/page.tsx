import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FdiTestStatusForm } from '@/components/admin/FdiTestStatusForm';
import { requireAdminAuth } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase/server';

type FdiSessionDetail = {
  readonly id: string;
  readonly created_at: string;
  readonly completed_at: string | null;
  readonly status: string;
  readonly is_test: boolean;
  readonly name: string | null;
  readonly email: string | null;
  readonly phone: string | null;
  readonly company_name: string | null;
  readonly fdi_display: number | null;
  readonly band_label: string | null;
  readonly display_ds: number | null;
  readonly display_ec: number | null;
  readonly display_ov: number | null;
  readonly concentration: { labels?: string[] } | null;
  readonly component_alerts: { components?: { label: string }[] }[] | null;
  readonly observations: string[] | null;
  readonly qualification_result: string | null;
  readonly qualification_reasons: string[] | null;
  readonly q_industry: string | null;
  readonly q_other_sector: string | null;
  readonly q_revenue_range: string | null;
  readonly q_team_size: string | null;
  readonly q_operating_years: string | null;
  readonly email_sent: boolean;
  readonly completion_ms: number | null;
  readonly answer_change_count: number | null;
};

type FdiAnswer = { readonly question_id: string; readonly component_key: string; readonly option_id: string; readonly score: number; readonly change_count: number; readonly answered_at: string };
type TestHistory = { readonly previous_is_test: boolean; readonly new_is_test: boolean; readonly changed_at: string; readonly admin_identifier: string | null; readonly reason: string | null };

function displayValue(value: string | number | boolean | null): string {
  if (value === null) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value).replace(/_/g, ' ');
}

export default async function AdminFdiDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminAuth();
  const { id } = await params;
  const supabase = createAdminClient();
  const [{ data: row, error }, { data: answers }, { data: history }] = await Promise.all([
    supabase.from('fdi_sessions').select('*').eq('id', id).single(),
    supabase.from('fdi_answers').select('question_id,component_key,option_id,score,change_count,answered_at').eq('session_id', id).order('question_id'),
    supabase.from('fdi_test_status_history').select('previous_is_test,new_is_test,changed_at,admin_identifier,reason').eq('session_id', id).order('changed_at', { ascending: false }),
  ]);
  if (error || !row) notFound();
  const session = row as FdiSessionDetail;
  const alerts = (session.component_alerts ?? []).flatMap((tier) => tier.components?.map((component) => component.label) ?? []);
  // Self-reported and optional: a dash means the founder skipped it, which never blocks a result.
  const qualification = [
    ['Sector', session.q_industry], ['Other sector', session.q_other_sector], ['Employees', session.q_team_size], ['Revenue', session.q_revenue_range], ['Operating age', session.q_operating_years],
  ] as const;

  return (
    <div className="min-h-screen bg-ivory"><nav className="bg-navy text-ivory px-6 py-4 flex items-center justify-between"><div className="flex items-center gap-4"><Link href="/admin/fdi" className="text-xs text-ivory/50 hover:text-gold">← FDI sessions</Link><span className="font-heading font-bold text-sm">M<span className="text-gold">A</span> · FDI record</span></div><a href="/api/admin/logout" className="text-xs text-ivory/50 hover:text-gold">Sign Out</a></nav><section className="max-w-5xl mx-auto px-4 py-8 space-y-5"><header className="bg-white border border-navy/10 rounded-2xl p-6"><div className="flex flex-col md:flex-row md:justify-between gap-4"><div><p className="eyebrow text-gold-ink">{session.is_test ? 'Explicit test record' : 'Live FDI record'}</p><h1 className="font-heading font-extrabold text-navy text-2xl mt-2">{session.name ?? 'Incomplete session'}</h1><p className="font-body text-navy/60 mt-1">{session.company_name ?? 'No company captured'} · {session.email ?? 'No email captured'}</p></div><div className="md:text-right"><p className="font-heading font-extrabold text-navy text-4xl">{session.fdi_display === null ? '—' : `${session.fdi_display} / 100`}</p><p className="font-body text-sm text-navy/60">{session.band_label ?? session.status}</p></div></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-navy/10 pt-5 mt-5"><div><p className="eyebrow text-navy/40">Decision Speed</p><p className="font-heading font-bold text-navy text-lg mt-1">{session.display_ds ?? '—'}</p></div><div><p className="eyebrow text-navy/40">Execution</p><p className="font-heading font-bold text-navy text-lg mt-1">{session.display_ec ?? '—'}</p></div><div><p className="eyebrow text-navy/40">Visibility</p><p className="font-heading font-bold text-navy text-lg mt-1">{session.display_ov ?? '—'}</p></div><div><p className="eyebrow text-navy/40">Email</p><p className="font-heading font-bold text-navy text-lg mt-1">{session.status === 'completed' ? (session.email_sent ? 'Sent' : 'Pending') : '—'}</p></div></div></header>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5"><div className="bg-white border border-navy/10 rounded-2xl p-6"><h2 className="font-heading font-extrabold text-navy text-lg">Consultant qualification</h2><p className="font-body text-sm text-navy/60 mt-2">Outcome: <strong>{session.qualification_result ?? 'Pending'}</strong></p><p className="font-body text-xs text-navy/45 mt-1">Business details are optional on the final screen. Not assessed means none were shared.</p>{session.qualification_reasons && session.qualification_reasons.length > 0 && <p className="font-body text-xs text-navy/50 mt-2">Reasons: {session.qualification_reasons.map(displayValue).join(', ')}</p>}<dl className="grid grid-cols-2 gap-x-4 gap-y-3 mt-5">{qualification.map(([label, value]) => <div key={label}><dt className="font-heading text-xs text-navy/45">{label}</dt><dd className="font-body text-sm text-navy mt-1">{displayValue(value)}</dd></div>)}</dl></div><div className="bg-white border border-navy/10 rounded-2xl p-6"><h2 className="font-heading font-extrabold text-navy text-lg">Test classification</h2><div className="mt-4"><FdiTestStatusForm sessionId={session.id} isTest={session.is_test} /></div><div className="border-t border-navy/10 mt-5 pt-5"><p className="eyebrow text-navy/45">Override history</p><ul className="mt-3 space-y-3">{((history ?? []) as TestHistory[]).map((entry) => <li key={`${entry.changed_at}-${entry.admin_identifier}`} className="font-body text-xs text-navy/65"><strong>{entry.previous_is_test ? 'Test' : 'Live'} → {entry.new_is_test ? 'Test' : 'Live'}</strong> · {new Date(entry.changed_at).toLocaleString('en-AE')}{entry.reason ? ` · ${entry.reason}` : ''}</li>)}{(history ?? []).length === 0 && <li className="font-body text-xs text-navy/45">No manual override recorded.</li>}</ul></div></div></section>
      <section className="bg-white border border-navy/10 rounded-2xl p-6"><h2 className="font-heading font-extrabold text-navy text-lg">Deterministic findings</h2><p className="font-body text-sm text-navy/60 mt-2">Concentration: {session.concentration?.labels?.join(' and ') ?? 'Pending'}{alerts.length > 0 ? ` · Severe component alert: ${alerts.join(', ')}` : ''}</p><ul className="mt-4 space-y-2">{(session.observations ?? []).map((finding) => <li key={finding} className="font-body text-sm text-navy/80">• {finding}</li>)}{(session.observations ?? []).length === 0 && <li className="font-body text-sm text-navy/45">No result until the session is completed.</li>}</ul></section>
      <section className="bg-white border border-navy/10 rounded-2xl p-6"><h2 className="font-heading font-extrabold text-navy text-lg">Saved FDI answers</h2><div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="border-b border-navy/10"><th className="text-left py-2 font-heading text-xs text-navy/50">Question</th><th className="text-left py-2 font-heading text-xs text-navy/50">Component</th><th className="text-left py-2 font-heading text-xs text-navy/50">Score</th><th className="text-left py-2 font-heading text-xs text-navy/50">Changes</th></tr></thead><tbody>{((answers ?? []) as FdiAnswer[]).map((answer) => <tr key={answer.question_id} className="border-b border-navy/5"><td className="py-2 font-body text-navy">{answer.question_id}</td><td className="py-2 font-body text-navy/65">{answer.component_key}</td><td className="py-2 font-heading font-bold text-navy">{answer.score}</td><td className="py-2 font-body text-navy/65">{answer.change_count}</td></tr>)}</tbody></table></div></section>
    </section></div>
  );
}
