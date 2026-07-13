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
    <section className="rounded-lg border border-navy/10 bg-navy/5 p-6">
      <p className="text-sm font-heading font-semibold uppercase tracking-wide text-navy/70">
        Primary growth constraint
      </p>
      <h1 className="mt-2 text-3xl font-heading font-bold text-navy">{meta.label}</h1>
      <p className="mt-4 text-base leading-7 font-body text-charcoal/80">{meta.constraintExplanation}</p>
      <div className="mt-5 rounded-lg bg-white p-4 shadow-sm">
        <p className="text-sm font-heading font-semibold text-navy">Business impact</p>
        <p className="mt-2 text-sm leading-6 font-body text-slate">{meta.impactStatement}</p>
      </div>
      <div className="mt-5">
        <p className="text-sm font-heading font-semibold text-navy">Recommended next moves</p>
        <ul className="mt-3 space-y-3">
          {meta.actionDirections.map((action) => (
            <li key={`${constraintKey}-${action}`} className="flex gap-3 text-sm leading-6 font-body text-charcoal/80">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
