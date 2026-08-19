/**
 * Section graphics for the home page.
 *
 * All three are CSS/flex compositions rather than SVG on purpose: every one of
 * them carries real labels, and text inside a scaled <svg> shrinks below the
 * legible floor on a 375px screen. Bars and rails scale; the type does not.
 */

const GROWTH_FORMULA = ["Vision", "Strategy", "Systems", "People", "Execution", "Accountability"];

export function GrowthFormulaRail() {
  return (
    <ol className="relative mx-auto flex max-w-5xl flex-wrap justify-center gap-x-4 gap-y-7 sm:flex-nowrap">
      {/* The rail the markers sit on. Hidden until the row stops wrapping. */}
      <span className="absolute left-6 right-6 top-5 hidden h-px bg-line sm:block" aria-hidden="true" />
      {GROWTH_FORMULA.map((step, index) => (
        <li
          key={step}
          className="stage-reveal relative z-10 flex basis-1/3 flex-col items-center gap-2 sm:basis-0 sm:flex-1"
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white font-mono text-xs font-bold text-brand-ink shadow-1"
            aria-hidden="true"
          >
            0{index + 1}
          </span>
          <span className="text-center font-heading text-xs font-bold text-ink">{step}</span>
        </li>
      ))}
    </ol>
  );
}

const ARCHITECTURE_LAYERS = ["Founder", "Team", "Systems", "Automation", "Data", "Scale"];

/* Mobile reads as growing horizontal bars; from `sm` it stands up into an
   ascending column chart. One markup tree, so screen readers hear it once. */
const LAYER_BAR = [
  "w-1/4 bg-brand/30 sm:h-12",
  "w-2/5 bg-brand/45 sm:h-16",
  "w-1/2 bg-brand/60 sm:h-20",
  "w-3/5 bg-brand/75 sm:h-24",
  "w-4/5 bg-brand sm:h-28",
  "w-full bg-accent sm:h-32",
];

export function ArchitectureLadder() {
  return (
    <ol className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-end sm:gap-3">
      {ARCHITECTURE_LAYERS.map((layer, index) => (
        <li
          key={layer}
          className="stage-reveal flex items-center gap-3 sm:flex-1 sm:flex-col-reverse sm:items-stretch sm:gap-2"
        >
          <span className="flex w-28 shrink-0 items-baseline gap-2 sm:w-auto sm:justify-center">
            <span className="font-mono text-xs text-muted">0{index + 1}</span>
            <span className="font-heading text-xs font-bold text-ink">{layer}</span>
          </span>
          <span
            className={`h-2.5 rounded-full sm:w-full sm:rounded-b-none sm:rounded-t-lg ${LAYER_BAR[index]}`}
            aria-hidden="true"
          />
        </li>
      ))}
    </ol>
  );
}

/* The three severity bands are the product's own defined ranges — the same
   ones the emailed report prints. Nothing here is an invented figure. */
const INDEX_BANDS = [
  { label: "Critical", range: "0–39", bar: "bg-danger", tint: "bg-danger-soft", text: "text-danger" },
  { label: "Developing", range: "40–69", bar: "bg-accent", tint: "bg-accent-soft", text: "text-accent-ink" },
  { label: "Progressing", range: "70–100", bar: "bg-success", tint: "bg-success-soft", text: "text-success" },
];

export function IndexBandMeter() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-line bg-white p-5 text-left shadow-1">
      <p className="font-heading text-xs font-bold uppercase tracking-[0.15em] text-brand-ink">
        Founder Dependency Index
      </p>
      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {INDEX_BANDS.map((band) => (
          <span key={band.label} className={`h-2 flex-1 rounded-full ${band.bar}`} />
        ))}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2">
        {INDEX_BANDS.map((band) => (
          <div key={band.label} className={`rounded-lg px-2 py-2 text-center ${band.tint}`}>
            <dt className={`font-heading text-xs font-bold ${band.text}`}>{band.label}</dt>
            <dd className="mt-0.5 font-mono text-xs text-muted">{band.range}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 font-body text-xs leading-relaxed text-muted">
        Your result lands in one of three bands across decision speed, execution consistency, and operational visibility.
      </p>
    </div>
  );
}
