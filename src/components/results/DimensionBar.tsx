import type { DimensionScore } from '@/types';

type DimensionBarProps = {
  dimension: DimensionScore;
};

export function DimensionBar({ dimension }: DimensionBarProps) {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-heading font-semibold text-navy">{dimension.label}</h3>
          <p className="mt-1 text-sm leading-6 font-body text-slate">{dimension.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-heading font-bold text-navy">{dimension.score}</p>
          <p className="text-xs font-body font-medium text-slate">of {dimension.maxScore}</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full"
          style={{
            width: `${dimension.percentage}%`,
            backgroundColor: dimension.color,
          }}
        />
      </div>
    </div>
  );
}
