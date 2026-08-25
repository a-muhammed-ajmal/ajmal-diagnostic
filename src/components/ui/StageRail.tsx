import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The commercial-journey rail.
 *
 * All of the layout lives in `globals.css` as `.stage-rail` / `.stage-item` /
 * `.stage-card` / `.stage-marker`: a left accent border on mobile, a 64px
 * indented rail with a connector and scroll-filling markers from 768px. This
 * component only supplies the markup those rules expect — it re-authors none
 * of them.
 */
export type Stage = {
  /** The marker glyph. A number in the sequence, normally. */
  marker: ReactNode;
  title: string;
  body: ReactNode;
};

export function StageRail({
  stages,
  className,
  snap = false,
}: {
  stages: Stage[];
  className?: string;
  /** Horizontal scroll-snap presentation over the same data. Home only. */
  snap?: boolean;
}) {
  return (
    <ol className={cn("stage-rail", snap && "stage-rail-snap", className)}>
      {stages.map((stage, index) => (
        <li key={index} className="stage-item">
          <span className="stage-marker font-mono" aria-hidden="true">
            {stage.marker}
          </span>
          <div className="stage-card rounded-2xl bg-white p-6 shadow-1">
            <h3 className="font-heading text-[length:var(--step-1)] font-bold text-ink">{stage.title}</h3>
            <div className="mt-3 font-body text-[length:var(--step-0)] leading-relaxed text-muted">
              {stage.body}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
