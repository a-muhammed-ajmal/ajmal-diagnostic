'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DiagnosticResult, LeadData } from '@/types';
import { DIMENSION_META } from '@/lib/scoring';
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
    <div className="min-h-screen bg-ivory flex items-center justify-center relative overflow-hidden">
      <div className="graph-overlay" />
      <div className="text-center relative z-10">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-navy/60 font-body text-sm">Loading your results...</p>
      </div>
    </div>
  );

  const { results, leadData } = data;
  const primaryMeta = DIMENSION_META[results.primaryConstraint];
  const secondaryMeta = DIMENSION_META[results.secondaryConstraint];
  const firstName = leadData.name.split(' ')[0];
  const calendlyLink = process.env.NEXT_PUBLIC_CALENDLY_LINK || '#';

  const severityBadge: Record<string, string> = {
    Critical: 'bg-crimson/10 text-crimson border-crimson/20',
    Developing: 'bg-warning/10 text-warning-ink border-warning/20',
    Progressing: 'bg-emerald/10 text-emerald border-emerald/20',
  };

  return (
    <div className="min-h-screen bg-ivory py-8 px-4 md:py-12 relative overflow-hidden">
      <div className="graph-overlay" />
      <div className="max-w-3xl mx-auto space-y-5 relative z-10">

        <div className="text-center">
          <p className="text-gold-ink eyebrow mb-2">Strategic Growth Architecture™</p>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-navy mb-2">{firstName}, here is your diagnosis.</h1>
          <p className="text-navy/50 font-body text-sm">Your full report has been emailed to {leadData.email}</p>
        </div>

        <div className="bg-navy rounded-2xl p-6 md:p-8 text-white text-center shadow-xl">
          <p className="text-gold eyebrow mb-4">Business Health Score</p>
          <div className="text-5xl md:text-7xl font-heading font-extrabold mb-2">{results.healthScore}%</div>
          <span className={cn('inline-block px-4 py-1 rounded-full text-sm font-heading font-bold border', severityBadge[results.severityLabel])}>
            {results.severityLabel}
          </span>
          <p className="text-ivory/40 text-xs mt-4 font-body">Critical: 0–39% · Developing: 40–69% · Progressing: 70–100%</p>
        </div>

        <div className="bg-navy rounded-2xl p-6 md:p-8 shadow-lg">
          <p className="text-teal eyebrow mb-2">Primary Growth Constraint</p>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">{results.primaryConstraintLabel}</h2>
          <p className="text-ivory/70 leading-relaxed font-body text-sm">{primaryMeta.constraintExplanation}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 border border-navy/10 shadow-sm">
          <p className="text-navy/40 eyebrow mb-2">Secondary Constraint</p>
          <h3 className="text-lg md:text-xl font-heading font-bold text-navy mb-3">{results.secondaryConstraintLabel}</h3>
          <p className="text-navy/70 font-body text-sm leading-relaxed">{secondaryMeta.secondaryExplanation}</p>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-xl p-5">
          <p className="text-warning-ink italic font-body text-sm leading-relaxed">&ldquo;{primaryMeta.impactStatement}&rdquo;</p>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 border border-navy/10 shadow-sm">
          <h3 className="font-heading font-bold text-navy text-base md:text-lg mb-5">Your Scores Across All 5 Dimensions</h3>
          <div className="space-y-4">
            {results.dimensions.map(dim => (
              <div key={dim.key}>
                <div className="flex justify-between items-center mb-1 gap-2">
                  <span className="font-heading font-semibold text-sm text-navy flex items-center gap-1.5 flex-wrap">
                    {dim.label}
                    {dim.key === results.primaryConstraint && <span className="text-[10px] bg-crimson/10 text-crimson px-2 py-0.5 rounded-full font-bold whitespace-nowrap">PRIMARY</span>}
                    {dim.key === results.secondaryConstraint && <span className="text-[10px] bg-navy/10 text-navy/60 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">SECONDARY</span>}
                  </span>
                  <span className="font-heading font-bold text-sm text-navy/60 flex-shrink-0">{dim.score}/6</span>
                </div>
                <div className="w-full bg-line rounded-full h-3">
                  <div className="h-3 rounded-full transition-[width] duration-1000" style={{ width: `${dim.percentage}%`, backgroundColor: dim.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {results.aiPlan && (
          <>
            <div className="bg-emerald/5 border border-emerald/20 rounded-2xl p-5 md:p-6">
              <p className="text-emerald-ink eyebrow mb-2">AI-Generated Action Plan — 30 Days</p>
              <h3 className="font-heading font-bold text-navy text-base md:text-lg mb-4">Your First 30 Days: Primary Constraint Focus</h3>
              <ul className="space-y-3">
                {results.aiPlan.thirtyDayPriorities.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-navy/80 font-body text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-teal/5 border border-teal/20 rounded-2xl p-5 md:p-6">
              <p className="text-teal-ink eyebrow mb-2">AI-Generated Action Plan — 90 Days</p>
              <h3 className="font-heading font-bold text-navy text-base md:text-lg mb-4">Days 31–90: Building Deeper</h3>
              <ul className="space-y-3">
                {results.aiPlan.ninetyDayDirections.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 text-navy/80 font-body text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-teal text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                    <span className="leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="bg-ivory border border-line rounded-xl p-5">
          <p className="text-navy/70 font-body text-sm leading-relaxed">
            <strong className="text-navy">An important distinction:</strong> This diagnostic identifies your constraint category — not the root cause within it. Understanding exactly why this constraint exists in your specific business is what the paid diagnostic is designed to uncover.
          </p>
        </div>

        <div className="bg-navy rounded-2xl p-6 md:p-8 text-center shadow-xl">
          <h3 className="font-heading font-bold text-white text-lg md:text-xl mb-2">You have named your constraint. Now let us find the root cause.</h3>
          <p className="text-ivory/70 font-body text-sm mb-6 leading-relaxed">Book a free 30-minute consultation to walk through your findings with Muhammed Ajmal personally. This is not a sales call — it is the natural next step.</p>
          <a href={calendlyLink} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-gold text-navy px-8 md:px-10 py-4 rounded-xl font-heading font-bold text-base hover:bg-gold-bright transition-colors shadow-lg min-h-[52px] w-full sm:w-auto text-center">
            Book Your Free 30-Minute Consultation →
          </a>
          <p className="text-ivory/40 font-body text-xs mt-3">With Muhammed Ajmal · Dubai, UAE · Available remotely across the GCC</p>
        </div>

      </div>
    </div>
  );
}
