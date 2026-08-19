'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { DiagnosticResult, LeadData } from '@/types';
import { track } from '@vercel/analytics';
import { DIMENSION_META } from '@/lib/scoring';
import { CALENDLY_LINK } from '@/lib/env';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
  const router = useRouter();
  const [data] = useState<{ results: DiagnosticResult; leadData: LeadData } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = sessionStorage.getItem('diagnosticResults');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!data) router.push('/');
  }, [data, router]);

  if (!data) return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas-light">
      <div className="relative z-10 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="font-body text-[length:var(--step-0)] text-muted">Loading your results...</p>
      </div>
    </div>
  );

  const { results, leadData } = data;
  const primaryMeta = DIMENSION_META[results.primaryConstraint];
  const secondaryMeta = DIMENSION_META[results.secondaryConstraint];
  const firstName = leadData.name.split(' ')[0];

  const severityBadge: Record<string, string> = {
    Critical: 'bg-danger-soft text-danger border-danger/30',
    Developing: 'bg-warning-soft text-warning border-warning/30',
    Progressing: 'bg-success-soft text-success border-success/30',
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas-light px-4 py-10 md:py-14">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="orb orb-electric absolute -right-32 -top-40 h-[28rem] w-[28rem]" />
        <div className="orb orb-amber absolute -bottom-40 -left-32 h-96 w-96" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl space-y-5">

        <header>
          <p className="eyebrow mb-2 text-brand-ink">Business Diagnostic</p>
          <h1 className="mb-2 font-heading text-[length:var(--step-4)] font-extrabold text-ink">
            {firstName}, here is your diagnostic result.
          </h1>
          <p className="font-body text-[length:var(--step-0)] text-muted">
            Your full report has been emailed to {leadData.email}
          </p>
        </header>

        {/* Score. The one glass panel on the page, so the headline number reads as
            the focal point rather than as one more white card in the stack. */}
        <section className="glass-panel rounded-2xl p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow mb-3 text-brand-ink">Diagnostic Score</p>
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-[length:var(--step-5)] font-extrabold text-brand">{results.healthScore}%</span>
                <span className={cn('inline-block rounded-full border px-4 py-1 font-heading text-[length:var(--step-0)] font-bold', severityBadge[results.severityLabel])}>
                  {results.severityLabel}
                </span>
              </div>
            </div>
            <p className="font-body text-xs leading-relaxed text-muted sm:max-w-[12rem] sm:text-right">
              Critical: 0–39%<br />Developing: 40–69%<br />Progressing: 70–100%
            </p>
          </div>
        </section>

        {/* Primary constraint leads with an amber rule — the page's one accent moment. */}
        <section className="rounded-2xl border border-line border-l-4 border-l-accent bg-white p-6 shadow-1 md:p-8">
          <p className="eyebrow mb-2 text-accent-ink">Lowest-Scoring Area</p>
          <h2 className="mb-4 font-heading text-[length:var(--step-3)] font-bold text-ink">{results.primaryConstraintLabel}</h2>
          <p className="font-body text-[length:var(--step-0)] leading-relaxed text-muted">{primaryMeta.description}</p>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 shadow-1 md:p-6">
          <p className="eyebrow mb-2 text-muted">Next Lowest-Scoring Area</p>
          <h3 className="mb-3 font-heading text-[length:var(--step-1)] font-bold text-ink">{results.secondaryConstraintLabel}</h3>
          <p className="font-body text-[length:var(--step-0)] leading-relaxed text-muted">{secondaryMeta.description}</p>
        </section>

        <aside className="rounded-2xl border border-warning/30 bg-warning-soft p-5">
          <p className="font-body text-[length:var(--step-0)] leading-relaxed text-warning">
            <strong>What this result means:</strong> it compares your self-reported answers across five operating areas. It does not establish root cause or prove which change will have the greatest effect.
          </p>
        </aside>

        <section className="rounded-2xl border border-line bg-white p-5 shadow-1 md:p-6">
          <h3 className="mb-5 font-heading text-[length:var(--step-1)] font-bold text-ink">Your Scores Across All 5 Dimensions</h3>
          <div className="space-y-4">
            {results.dimensions.map(dim => (
              <div key={dim.key}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="flex flex-wrap items-center gap-1.5 font-heading text-[length:var(--step-0)] font-semibold text-ink">
                    {dim.label}
                    {dim.key === results.primaryConstraint && <span className="whitespace-nowrap rounded-full bg-danger-soft px-2 py-0.5 text-xs font-bold text-danger">LOWEST SCORE</span>}
                    {dim.key === results.secondaryConstraint && <span className="whitespace-nowrap rounded-full bg-brand-soft px-2 py-0.5 text-xs font-bold text-brand-ink">NEXT SCORE</span>}
                  </span>
                  <span className="flex-shrink-0 font-heading text-[length:var(--step-0)] font-bold text-muted">{dim.score}/6</span>
                </div>
                <div className="h-3 w-full rounded-full bg-line">
                  <div className="h-3 rounded-full transition-[width] duration-1000" style={{ width: `${dim.percentage}%`, backgroundColor: dim.color }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {results.aiPlan && (
          <>
            <section className="rounded-2xl border border-success/30 bg-success-soft p-5 md:p-6">
              <p className="eyebrow mb-2 text-success">AI-Assisted Reflection Plan — 30 Days</p>
              <h3 className="mb-4 font-heading text-[length:var(--step-1)] font-bold text-ink">Your First 30 Days: A Practical Starting Point</h3>
              <ul className="space-y-3">
                {results.aiPlan.thirtyDayPriorities.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-[length:var(--step-0)] text-ink">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-success text-xs font-bold text-white">{i + 1}</span>
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-accent/40 bg-accent-soft p-5 md:p-6">
              <p className="eyebrow mb-2 text-accent-ink">AI-Assisted Reflection Plan — 90 Days</p>
              <h3 className="mb-4 font-heading text-[length:var(--step-1)] font-bold text-ink">Days 31–90: Building Deeper</h3>
              <ul className="space-y-3">
                {results.aiPlan.ninetyDayDirections.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-[length:var(--step-0)] text-ink">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-canvas-dark">{i + 1}</span>
                    <span className="leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        <aside className="rounded-2xl border border-line bg-brand-tint p-5">
          <p className="font-body text-[length:var(--step-0)] leading-relaxed text-muted">
            <strong className="text-ink">An important distinction:</strong> This diagnostic reflects self-reported answers. It can show patterns worth examining, but an Audit is the evidence-led next step when you need to verify why a pattern exists and identify the binding constraint.
          </p>
        </aside>

        {/* Closing CTA on the dark band — the amber button's one home on this page. */}
        <section className="relative overflow-hidden rounded-2xl bg-canvas-dark p-6 md:p-8">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="orb orb-amber absolute -right-16 -top-24 h-64 w-64 opacity-25" />
          </div>
          <div className="relative z-10">
            <h3 className="mb-2 font-heading text-[length:var(--step-3)] font-bold text-white">Need to verify the picture with evidence?</h3>
            <p className="mb-6 max-w-xl font-body text-[length:var(--step-0)] leading-relaxed text-muted-invert">
              An Audit reviews operating evidence to verify why dependency appears and identify the binding constraint to address.
            </p>
            <Button
              href={CALENDLY_LINK}
              external
              variant="accent"
              onClick={() => track('calendly_click', { from: 'results' })}
            >
              Discuss an Audit
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <p className="mt-3 font-body text-xs text-muted-invert">With Muhammed Ajmal · Dubai, United Arab Emirates</p>
          </div>
        </section>

      </div>
    </div>
  );
}
