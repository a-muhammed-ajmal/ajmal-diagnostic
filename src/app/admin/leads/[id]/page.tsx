import { requireAdminAuth } from '@/lib/adminAuth';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Lead } from '@/types';
import { DIMENSION_META } from '@/lib/scoring';
import type { DimensionKey } from '@/types';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function toTitleCase(snake: string) {
  return snake.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const DIMENSION_KEYS: DimensionKey[] = [
  'strategic_clarity',
  'financial_visibility',
  'operations',
  'people_leadership',
  'sales_growth',
];

export default async function LeadBriefingPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminAuth();
  const { id } = await params;

  const { data: lead, error } = await supabase
    .from('diagnostic_leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !lead) notFound();

  const typedLead = lead as Lead;

  const dimensionScores = DIMENSION_KEYS.map(key => {
    const scoreKey = `score_${key}` as keyof Lead;
    const score = typedLead[scoreKey] as number | null;
    return {
      key,
      label: DIMENSION_META[key].label,
      score: score ?? 0,
      isPrimary: typedLead.primary_constraint === key,
      isSecondary: typedLead.secondary_constraint === key,
    };
  }).sort((a, b) => a.score - b.score);

  let thirtyDay: string[] = [];
  let ninetyDay: string[] = [];
  let discussionQuestions: string[] = [];

  if (typedLead.ai_30day_plan) {
    try { thirtyDay = JSON.parse(typedLead.ai_30day_plan); } catch { thirtyDay = [typedLead.ai_30day_plan]; }
  }
  if (typedLead.ai_90day_plan) {
    try { ninetyDay = JSON.parse(typedLead.ai_90day_plan); } catch { ninetyDay = [typedLead.ai_90day_plan]; }
  }
  if (typedLead.ai_discussion_questions) {
    try { discussionQuestions = JSON.parse(typedLead.ai_discussion_questions); } catch { discussionQuestions = [typedLead.ai_discussion_questions]; }
  }

  const severityColors: Record<string, string> = {
    Critical: 'bg-crimson/10 text-crimson border-crimson/20',
    Developing: 'bg-amber-100 text-amber-700 border-amber-200',
    Progressing: 'bg-emerald/10 text-emerald border-emerald/20',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-navy text-ivory px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/leads" className="text-xs text-ivory/50 hover:text-gold transition-colors">← All Leads</Link>
          <div className="font-heading font-bold text-sm">M<span className="text-gold">A</span> · Pre-Call Briefing</div>
        </div>
        <a href="/api/admin/logout" className="text-xs text-ivory/50 hover:text-gold transition-colors">Sign Out</a>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-navy/10 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="font-heading font-extrabold text-navy text-2xl">{typedLead.name}</h1>
              <div className="font-body text-navy/60 text-sm mt-1">{typedLead.company_name}</div>
              <div className="flex flex-wrap gap-2 mt-3">
                <a href={`mailto:${typedLead.email}`} className="font-body text-xs text-gold hover:underline">{typedLead.email}</a>
                {typedLead.phone && <span className="font-body text-xs text-navy/50">{typedLead.phone}</span>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-heading font-extrabold text-navy text-4xl">{typedLead.health_score ?? '—'}%</div>
              <div className="font-body text-navy/50 text-xs mb-1">Business Health Score</div>
              {typedLead.severity_label && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${severityColors[typedLead.severity_label] || ''}`}>
                  {typedLead.severity_label}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-navy/10">
            <div>
              <div className="text-[10px] font-heading uppercase tracking-wider text-navy/40 mb-1">Industry</div>
              <div className="font-body text-sm text-navy">{typedLead.industry || '—'}</div>
            </div>
            <div>
              <div className="text-[10px] font-heading uppercase tracking-wider text-navy/40 mb-1">Team Size</div>
              <div className="font-body text-sm text-navy">{typedLead.team_size || '—'}</div>
            </div>
            <div>
              <div className="text-[10px] font-heading uppercase tracking-wider text-navy/40 mb-1">Revenue</div>
              <div className="font-body text-sm text-navy">{typedLead.revenue_range}</div>
            </div>
            <div>
              <div className="text-[10px] font-heading uppercase tracking-wider text-navy/40 mb-1">Submitted</div>
              <div className="font-body text-sm text-navy">{new Date(typedLead.created_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>
        </div>

        {/* Dimension Scores */}
        <div className="bg-white rounded-xl shadow-sm border border-navy/10 p-6">
          <h2 className="font-heading font-bold text-navy text-lg mb-4">Dimension Scores</h2>
          <div className="space-y-3">
            {dimensionScores.map(d => (
              <div key={d.key}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm text-navy">{d.label}</span>
                    {d.isPrimary && <span className="text-[10px] font-bold bg-crimson/10 text-crimson px-2 py-0.5 rounded-full">PRIMARY</span>}
                    {d.isSecondary && <span className="text-[10px] font-bold bg-gold/10 text-gold px-2 py-0.5 rounded-full">SECONDARY</span>}
                  </div>
                  <span className="font-heading font-bold text-navy text-sm">{d.score}/6</span>
                </div>
                <div className="h-2 bg-navy/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(d.score / 6) * 100}%`,
                      backgroundColor: d.isPrimary ? '#C41E3A' : d.isSecondary ? '#C9A84C' : '#1B2B4B',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-navy/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-heading uppercase tracking-wider text-navy/40 mb-1">Primary Constraint</div>
              <div className="font-body text-sm text-navy font-semibold">
                {typedLead.primary_constraint ? toTitleCase(typedLead.primary_constraint) : '—'}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-heading uppercase tracking-wider text-navy/40 mb-1">Secondary Constraint</div>
              <div className="font-body text-sm text-navy">
                {typedLead.secondary_constraint ? toTitleCase(typedLead.secondary_constraint) : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* AI Action Plan */}
        {(thirtyDay.length > 0 || ninetyDay.length > 0) && (
          <div className="bg-white rounded-xl shadow-sm border border-navy/10 p-6">
            <h2 className="font-heading font-bold text-navy text-lg mb-4">AI-Generated Action Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {thirtyDay.length > 0 && (
                <div>
                  <h3 className="font-heading font-semibold text-navy text-sm uppercase tracking-wider mb-3">30-Day Priorities</h3>
                  <ol className="space-y-2">
                    {thirtyDay.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-crimson/10 text-crimson text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                        <span className="font-body text-sm text-navy/80">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {ninetyDay.length > 0 && (
                <div>
                  <h3 className="font-heading font-semibold text-navy text-sm uppercase tracking-wider mb-3">90-Day Directions</h3>
                  <ol className="space-y-2">
                    {ninetyDay.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-navy/10 text-navy text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                        <span className="font-body text-sm text-navy/80">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Discussion Questions */}
        {discussionQuestions.length > 0 && (
          <div className="bg-navy rounded-xl p-6">
            <h2 className="font-heading font-bold text-ivory text-lg mb-4">Discovery Questions for the Call</h2>
            <ol className="space-y-3">
              {discussionQuestions.map((q, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                  <span className="font-body text-ivory/80 text-sm">{q}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Status Flags */}
        <div className="bg-white rounded-xl shadow-sm border border-navy/10 p-6">
          <h2 className="font-heading font-bold text-navy text-lg mb-4">Lead Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Email Sent', value: typedLead.email_sent },
              { label: 'AI Plan Generated', value: typedLead.ai_plan_generated },
              { label: 'Call Booked', value: typedLead.booked_call },
              { label: 'Contacted', value: typedLead.contacted },
            ].map(flag => (
              <div key={flag.label} className="text-center">
                <div className={`text-2xl font-bold mb-1 ${flag.value ? 'text-emerald' : 'text-navy/20'}`}>
                  {flag.value ? '✔' : '○'}
                </div>
                <div className="font-heading text-xs text-navy/50 uppercase tracking-wider">{flag.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
