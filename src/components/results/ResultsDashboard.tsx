import { ConstraintHighlight } from '@/components/results/ConstraintHighlight';
import { CTASection } from '@/components/results/CTASection';
import { DimensionBar } from '@/components/results/DimensionBar';
import { DIMENSION_META } from '@/lib/scoring';
import type { DiagnosticResult, LeadData } from '@/types';

type ResultsDashboardProps = {
  results: DiagnosticResult;
  leadData?: LeadData;
};

export function ResultsDashboard({ results, leadData }: ResultsDashboardProps) {
  const primaryMeta = DIMENSION_META[results.primaryConstraint];
  const overallPercentage = Math.round((results.totalScore / results.maxPossibleScore) * 100);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Business constraint diagnosis
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-950 md:text-4xl">
                {leadData?.companyName ? `${leadData.companyName} results` : 'Your diagnostic results'}
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
                Your lowest scoring area is the constraint most likely to limit growth until it is addressed.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-right shadow-sm">
              <p className="text-sm font-medium text-slate-500">Overall score</p>
              <p className="mt-1 text-3xl font-bold text-slate-950">
                {results.totalScore}/{results.maxPossibleScore}
              </p>
              <p className="text-sm font-medium text-slate-600">{overallPercentage}% maturity</p>
            </div>
          </div>
        </header>

        <ConstraintHighlight constraintKey={results.primaryConstraint} meta={primaryMeta} />

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-950">Dimension scores</h2>
            <p className="text-sm text-slate-500">Higher scores indicate stronger capability.</p>
          </div>
          <div className="grid gap-4">
            {results.dimensions.map((dimension) => (
              <DimensionBar key={dimension.key} dimension={dimension} />
            ))}
          </div>
        </section>

        <CTASection email={leadData?.email} />
      </div>
    </main>
  );
}
