'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { FounderFdiReport } from '@/lib/fdi/public-report';

export function FdiResults() {
  const [report, setReport] = useState<FounderFdiReport | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = sessionStorage.getItem('fdiFounderReport');
        if (stored) setReport(JSON.parse(stored) as FounderFdiReport);
      } catch {
        setReport(null);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!report) {
    return <div className="min-h-screen bg-brand-tint flex items-center justify-center px-5"><section className="max-w-lg text-center bg-white border border-line rounded-2xl p-8"><h1 className="font-heading font-extrabold text-ink text-[length:var(--step-3)]">Your result is not available in this browser.</h1><p className="font-body text-muted mt-3">Complete the Business Health Check again to view a new result.</p><Link href="/diagnostic" className="inline-block mt-6 bg-brand text-white rounded-xl px-5 py-3 min-h-[48px] font-heading font-bold">Start the Business Health Check</Link></section></div>;
  }

  const concentration = report.concentration.labels.join(' and ');
  const alerts = report.alerts.flatMap((tier) => tier.components.map((component) => component.label));
  return (
    <div className="min-h-screen bg-brand-tint px-4 py-10 relative overflow-hidden"><section className="relative z-10 max-w-4xl mx-auto space-y-5"><header className="bg-white text-ink border border-line shadow-2 rounded-2xl p-7 md:p-10"><p className="eyebrow text-brand-ink">Founder Dependency Index</p><h1 className="font-heading font-extrabold text-ink text-[length:var(--step-5)] mt-3">{report.index.display} <span className="text-muted text-[length:var(--step-3)]">/ {report.index.scaleMax}</span></h1><p className="font-heading font-bold text-brand-ink text-[length:var(--step-0)] mt-2">{report.index.band.label}</p><p className="font-body text-muted leading-relaxed mt-5 max-w-2xl">This result describes self-reported operating patterns. It is not a diagnosis of root cause.</p></header>
      <section className="bg-white border border-line rounded-2xl p-6 md:p-8"><h2 className="font-heading font-extrabold text-ink text-[length:var(--step-2)]">Component scores</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">{report.components.map((component) => <div key={component.key} className="border border-line rounded-xl p-4"><p className="font-heading text-[length:var(--step-0)] text-muted">{component.label}</p><p className="font-heading font-extrabold text-ink text-[length:var(--step-3)] mt-2">{component.display}<span className="text-[length:var(--step-0)] text-muted"> / 100</span></p></div>)}</div><p className="font-body text-[length:var(--step-0)] text-muted mt-6">Dependency appears most concentrated in <strong>{concentration}</strong>.</p>{alerts.length > 0 && <p className="font-body text-[length:var(--step-0)] text-brand-ink mt-2">Severe component alert: {alerts.join(', ')}.</p>}</section>
      <section className="bg-white border border-line rounded-2xl p-6 md:p-8"><h2 className="font-heading font-extrabold text-ink text-[length:var(--step-2)]">What the answers indicate</h2><ul className="mt-5 space-y-3">{report.observations.map((finding) => <li key={finding} className="font-body text-ink leading-relaxed pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-brand">{finding}</li>)}</ul></section>
      {/* The next-step href comes from the frozen FDI-1.0 config; only the public label
          is applied here, because that config is hash-locked and must not be edited. */}
      <section className="border border-line rounded-2xl bg-white p-6 md:p-8"><h2 className="font-heading font-extrabold text-ink text-[length:var(--step-2)]">Next step: Business Clarity Audit</h2><p className="font-body text-muted leading-relaxed mt-3">A Business Clarity Audit tests these self-reported patterns against operating evidence — records, workflows, dashboards, decision samples, and SOPs — and identifies where closer investigation is useful.</p><a href={report.nextStep.href} className="inline-block mt-5 bg-brand text-white rounded-xl px-5 py-3 min-h-[48px] font-heading font-bold hover:bg-brand-hover">Discuss a Business Clarity Audit →</a><p className="font-body text-xs italic text-muted leading-relaxed mt-6">{report.limitation}</p></section>
    </section></div>
  );
}
