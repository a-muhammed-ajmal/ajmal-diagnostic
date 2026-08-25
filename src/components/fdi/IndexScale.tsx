import { FDI_1_1_CONFIG } from "@/lib/fdi/config";
import { bandFor } from "@/lib/fdi/bands";
import { cn } from "@/lib/utils";

/**
 * The Founder Dependency Index readout.
 *
 * Four rules bind this component, all from PRODUCT §A6 and DESIGN §7:
 *
 * 1. A high index is the ADVERSE result. Nothing here may read as praise.
 * 2. It is a value out of 100, never a percentage. No `%` anywhere.
 * 3. Never a bare "Low"/"Moderate"/"High" — always the full band label.
 * 4. It renders EMPTY on every surface except a completed result. A filled
 *    meter on a marketing page would be an invented metric.
 *
 * Band labels and ranges are read from the active config rather than restated,
 * so a recalibration cannot leave this component showing retired wording.
 */
const { componentScale, bands } = FDI_1_1_CONFIG;

type IndexScaleProps = {
  /**
   * The unrounded composite from a completed check. Omit it — the normal case —
   * and the scale renders empty with its caption.
   */
  value?: number;
  /** The rounded, display-ready figure. Required alongside `value`. */
  display?: number;
  className?: string;
};

export function IndexScale({ value, display, className }: IndexScaleProps) {
  const hasReading = typeof value === "number" && typeof display === "number";
  const band = hasReading ? bandFor(value, FDI_1_1_CONFIG) : null;

  return (
    <div className={cn("w-full", className)}>
      {hasReading && band ? (
        <p className="font-heading text-[length:var(--step-3)] font-extrabold text-ink">
          <span className="font-mono">{display}</span>
          <span className="text-muted"> / {componentScale}</span>
          <span className="mt-1 block font-body text-[length:var(--step-0)] font-medium text-brand-ink">
            {band.label}
          </span>
        </p>
      ) : null}

      <div
        className={cn("relative h-[10px] w-full overflow-hidden rounded-full bg-canvas-light", hasReading && "mt-4")}
        role={hasReading ? "img" : undefined}
        aria-label={
          hasReading && band
            ? `Founder Dependency Index ${display} out of ${componentScale} — ${band.label}`
            : undefined
        }
        aria-hidden={hasReading ? undefined : true}
      >
        {/* Quartile ticks. Decorative — the labels below carry the same information. */}
        {bands.slice(1).map((tickBand) => (
          <span
            key={tickBand.key}
            className="absolute top-0 h-full w-px bg-line-strong"
            style={{ left: `${(tickBand.minInclusive / componentScale) * 100}%` }}
          />
        ))}
        {hasReading && display !== undefined ? (
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-brand"
            style={{ width: `${(display / componentScale) * 100}%` }}
          />
        ) : null}
      </div>

      <div className="mt-2 flex justify-between font-body text-[length:var(--step--1)] text-muted">
        <span>0</span>
        <span>{componentScale / 2}</span>
        <span>{componentScale}</span>
      </div>

      {hasReading ? null : (
        <p className="mt-3 font-body text-[length:var(--step--1)] text-muted">
          empty scale — awaiting your answers
        </p>
      )}
    </div>
  );
}

/** The four bands, for pages that explain the scale without showing a reading. */
export function IndexBandList({ className }: { className?: string }) {
  return (
    <ul className={cn("space-y-2", className)}>
      {bands.map((band) => (
        <li
          key={band.key}
          className="flex items-baseline justify-between gap-4 font-body text-[length:var(--step-0)]"
        >
          <span className="text-ink">{band.label}</span>
          <span className="font-mono shrink-0 text-muted">{band.displayRange}</span>
        </li>
      ))}
    </ul>
  );
}
