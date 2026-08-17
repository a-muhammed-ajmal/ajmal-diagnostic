import Link from "next/link";

const architecture = ["Founder", "Team", "Systems", "Automation", "Data", "Scale"];

export function FounderSystemVisual() {
  return (
    <div className="reveal relative" role="img" aria-label="Strategic Growth Architecture: founder, team, systems, automation, data, and scale form a connected operating system.">
      <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-gold">Operating architecture</p>
      <div className="mt-5 inline-block">
        <p className="font-heading text-lg font-extrabold text-ivory">Founder</p>
        <p className="mt-1 max-w-xs font-body text-xs leading-relaxed text-ivory/60">Clear direction, not every decision.</p>
        <div className="mt-3 h-px w-16 bg-gold" aria-hidden="true" />
      </div>
      <div className="relative mt-6 space-y-2 before:absolute before:-left-3 before:top-5 before:bottom-5 before:w-px before:bg-teal/50 sm:before:-left-4">
        {architecture.slice(1).map((step, index) => (
          <div key={step} className="group relative flex items-center gap-3 rounded-xl border border-ivory/15 bg-navy/50 px-3 py-2.5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-teal/70">
            <span className="relative z-10 -ml-5 flex h-3 w-3 shrink-0 rounded-full border-2 border-navy bg-teal shadow-lg sm:-ml-6" aria-hidden="true" />
            <span className="font-mono text-xs text-ivory/40">0{index + 2}</span>
            <span className="font-heading text-xs font-bold text-ivory">{step}</span>
            <span className="ml-auto h-1.5 w-7 rounded-full bg-teal/50 transition-[transform,background-color] duration-200 origin-left group-hover:scale-x-150 group-hover:bg-teal" aria-hidden="true" />
          </div>
        ))}
      </div>
      <p className="mt-6 border-t border-ivory/10 pt-4 font-body text-xs leading-relaxed text-ivory/60">Move operational responsibility into visible systems, clear ownership, and useful information.</p>
    </div>
  );
}

const trapSymptoms = [
  { label: "Approval bottlenecks", detail: "Work waits for a founder decision." },
  { label: "Knowledge trapped in people", detail: "Critical know-how is not accessible." },
  { label: "Firefighting", detail: "Urgent issues replace planned work." },
  { label: "Inconsistent execution", detail: "Standards change by person or day." },
];

export function FounderTrapDiagram() {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center" aria-label="Four observable symptoms of the Founder Trap">
      <div className="stage-reveal relative mx-auto flex aspect-square w-full max-w-72 items-center justify-center overflow-hidden rounded-full bg-navy p-6">
        <div className="absolute h-36 w-36 rounded-full border border-crimson/20" aria-hidden="true" />
        <div className="absolute h-24 w-24 rounded-full border border-crimson/35" aria-hidden="true" />
        <div className="relative z-10 rounded-full border border-gold/40 bg-gold px-6 py-5 text-center shadow-lg shadow-gold/10">
          <p className="font-heading text-sm font-extrabold text-navy">Founder</p>
          <p className="mt-1 font-body text-xs text-navy/70">The operating bottleneck</p>
        </div>
      </div>
      <div>
        <p className="font-body text-sm leading-relaxed text-navy/60">The Founder Trap is a pattern of observable dependency—not a judgment on the founder.</p>
        <div className="mt-6 divide-y divide-navy/10 border-t border-navy/10">
          {trapSymptoms.map((symptom, index) => (
            <div key={symptom.label} className="stage-reveal flex items-baseline gap-4 py-4">
              <span className="font-mono text-xs text-crimson">0{index + 1}</span>
              <div>
                <h3 className="text-[length:var(--step-1)] font-heading font-bold text-navy">{symptom.label}</h3>
                <p className="mt-1 font-body text-sm leading-relaxed text-navy/60">{symptom.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const dependencyAreas = [
  { title: "Decision Speed", body: "Whether decisions and work continue when you are unavailable.", value: "01" },
  { title: "Execution Consistency", body: "Whether recurring work reaches a consistent standard without your supervision.", value: "02" },
  { title: "Operational Visibility", body: "Whether you can see what is happening without chasing people for updates.", value: "03" },
];

export function DependencyIndexPreview() {
  return (
    <section id="dependency-index" className="bg-navy px-6 py-16 text-ivory md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="eyebrow mb-3 text-teal">Business Health Check</p>
          <h2 className="font-heading text-[length:var(--step-4)] font-extrabold leading-[1.05]">How much does your business still depend on you?</h2>
          <p className="mt-5 max-w-xl font-body text-base leading-relaxed text-ivory/70">Answer 12 questions and receive your Founder Dependency Index across three observable operating areas.</p>
          <div className="mt-6 rounded-2xl border border-gold/25 bg-gold/10 p-4">
            <p className="font-heading text-sm font-bold text-gold">Important diagnostic boundary</p>
            <p className="mt-1 font-body text-sm leading-relaxed text-ivory/70">This is a focused founder-dependency self-report, not a full financial, tax, legal, or business-performance audit. It shows where dependency appears; a Business Clarity Audit tests why, against operating evidence.</p>
          </div>
          <Link href="/diagnostic" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-gold px-6 py-3 font-heading text-sm font-bold text-navy transition-colors hover:bg-gold-bright">Start the Business Health Check <span aria-hidden="true">&nbsp;→</span></Link>
        </div>
        <div className="flex flex-col divide-y divide-ivory/10 border-t border-ivory/10 md:flex-row md:divide-y-0 md:divide-x md:border-t-0">
          {dependencyAreas.map((area) => (
            <div key={area.title} className="stage-reveal flex-1 py-6 md:px-6 md:py-0 first:md:pl-0 last:md:pr-0">
              <p className="font-mono text-xs text-teal">{area.value}</p>
              <h3 className="mt-3 text-[length:var(--step-1)] font-heading font-bold">{area.title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-ivory/65">{area.body}</p>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-ivory/40">4 questions</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The five commercial stages. Exported so /services can build its Service schema
 *  from the same source the ladder renders, rather than restating the names. */
export const COMMERCIAL_STAGES = [
  { number: "01", title: "Business Health Check", detail: "A free founder self-report that returns your Founder Dependency Index. It shows where dependency appears, not why it exists.", commitment: "No-cost starting point" },
  { number: "02", title: "Business Clarity Audit", detail: "Tests the self-reported picture against operating evidence and identifies the binding constraint.", commitment: "Evidence-led review" },
  { number: "03", title: "Focused Improvement Sprint", detail: "Concentrates effort on one verified priority established through the Audit.", commitment: "Focused intervention" },
  { number: "04", title: "Business System Build", detail: "Installs the broader operating structure: strategy, systems, people, applied AI, and accountability.", commitment: "Structured build" },
  { number: "05", title: "Growth Partner Retainer", detail: "Maintains the operating standard and extends the system as the business grows.", commitment: "Ongoing partnership" },
];

export function CommercialLadder() {
  return (
    <ol className="stage-rail mt-10">
      {COMMERCIAL_STAGES.map((stage) => (
        <li key={stage.number} className="stage-item">
          <span className="stage-marker" aria-hidden="true">{stage.number}</span>
          <article className="stage-card stage-reveal rounded-2xl bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs text-gold-ink">{stage.number}</p>
                <h3 className="mt-1 font-heading text-xl font-bold text-navy">{stage.title}</h3>
                <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-navy/65">{stage.detail}</p>
              </div>
              <span className="w-fit rounded-full border border-teal/25 bg-teal/10 px-3 py-1.5 font-body text-xs font-medium text-teal-ink">{stage.commitment}</span>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
