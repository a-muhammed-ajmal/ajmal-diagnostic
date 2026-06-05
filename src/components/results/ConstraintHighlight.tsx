import type { DimensionKey } from '@/types';

type ConstraintMeta = {
  label: string;
  constraintExplanation: string;
  impactStatement: string;
  actionDirections: string[];
};

type ConstraintHighlightProps = {
  constraintKey: DimensionKey;
  meta: ConstraintMeta;
};

export function ConstraintHighlight({ constraintKey, meta }: ConstraintHighlightProps) {
  return (
    <section className="rounded-lg border border-blue-100 bg-blue-50 p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
        Primary growth constraint
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">{meta.label}</h1>
      <p className="mt-4 text-base leading-7 text-slate-700">{meta.constraintExplanation}</p>
      <div className="mt-5 rounded-lg bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-950">Business impact</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{meta.impactStatement}</p>
      </div>
      <div className="mt-5">
        <p className="text-sm font-semibold text-slate-950">Recommended next moves</p>
        <ul className="mt-3 space-y-3">
          {meta.actionDirections.map((action) => (
            <li key={`${constraintKey}-${action}`} className="flex gap-3 text-sm leading-6 text-slate-700">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
