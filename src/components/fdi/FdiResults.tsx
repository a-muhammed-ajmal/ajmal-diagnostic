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
    return <div className="min-h-screen bg-ivory flex items-center justify-center px-5"><section className="max-w-lg text-center bg-white border border-navy/10 rounded-2xl p-8"><h1 className="font-heading font-extrabold text-navy text-2xl">Your result is not available in this browser.</h1><p className="font-body text-navy/60 mt-3">Complete the Business Health Check again to view a new result.</p><Link href="/diagnostic" className="inline-block mt-6 bg-gold text-navy rounded-xl px-5 py-3 min-h-[48px] font-heading font-bold">Start the Business Health Check</Link></section></div>;
  }

  const concentration = report.concentration.labels.join(' and ');
  const alerts = report.alerts.flatMap((tier) => tier.components.map((component) => component.label));
  return (
    <div className="min-h-screen bg-ivory px-4 py-10 relative overflow-hidden"><div className="graph-overlay" /><section className="relative z-10 max-w-4xl mx-auto space-y-5"><header className="bg-navy text-ivory rounded-2xl p-7 md:p-10"><p className="eyebrow text-gold">Founder Dependency Index</p><h1 className="font-heading font-extrabold text-white text-[length:var(--step-5)] mt-3">{report.index.display} <span className="text-ivory/60 text-[length:var(--step-3)]">/ {report.index.scaleMax}</span></h1><p className="font-heading font-bold text-gold text-lg mt-2">{report.index.band.label}</p><p className="font-body text-ivory/70 leading-relaxed mt-5 max-w-2xl">This result describes self-reported operating patterns. It is not a diagnosis of root cause.</p></header>
      <section className="bg-white border border-navy/10 rounded-2xl p-6 md:p-8"><h2 className="font-heading font-extrabold text-navy text-xl">Component scores</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">{report.components.map((component) => <div key={component.key} className="border border-navy/10 rounded-xl p-4"><p className="font-heading text-sm text-navy/60">{component.label}</p><p className="font-heading font-extrabold text-navy text-[length:var(--step-3)] mt-2">{component.display}<span className="text-base text-navy/45"> / 100</span></p></div>)}</div><p className="font-body text-sm text-navy/70 mt-6">Dependency appears most concentrated in <strong>{concentration}</strong>.</p>{alerts.length > 0 && <p className="font-body text-sm text-gold-ink mt-2">Severe component alert: {alerts.join(', ')}.</p>}</section>
      <section className="bg-white border border-navy/10 rounded-2xl p-6 md:p-8"><h2 className="font-heading font-extrabold text-navy text-xl">What the answers indicate</h2><ul className="mt-5 space-y-3">{report.observations.map((finding) => <li key={finding} className="font-body text-navy/80 leading-relaxed pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-gold">{finding}</li>)}</ul></section>
      {/* The next-step href comes from the frozen FDI-1.0 config; only the public label
          is applied here, because that config is hash-locked and must not be edited. */}
      <section className="border border-navy/10 rounded-2xl bg-white p-6 md:p-8"><h2 className="font-heading font-extrabold text-navy text-xl">Next step: Business Clarity Audit</h2><p className="font-body text-navy/70 leading-relaxed mt-3">A Business Clarity Audit tests these self-reported patterns against operating evidence — records, workflows, dashboards, decision samples, and SOPs — and identifies where closer investigation is useful.</p><a href={report.nextStep.href} className="inline-block mt-5 bg-gold text-navy rounded-xl px-5 py-3 min-h-[48px] font-heading font-bold hover:bg-gold-bright">Discuss a Business Clarity Audit →</a><p className="font-body text-xs italic text-navy/50 leading-relaxed mt-6">{report.limitation}</p></section>
    </section></div>
  );
}
