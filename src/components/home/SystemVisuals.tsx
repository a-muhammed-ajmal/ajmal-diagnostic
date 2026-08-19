import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Eye,
  GitBranch,
  Repeat,
  ShieldAlert,
  Users,
} from "lucide-react";

const architecture = ["Founder", "Team", "Systems", "Automation", "Data", "Scale"];

export function FounderSystemVisual() {
  return (
    <div
      className="reveal relative rounded-2xl border border-line bg-white p-6 shadow-2"
      role="img"
      aria-label="Strategic Growth Architecture: founder, team, systems, automation, data, and scale form a connected operating system."
    >
      <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-brand-ink">Operating architecture</p>
      <div className="mt-5 inline-block">
        <span className="block font-heading text-[length:var(--step-1)] font-extrabold text-ink">Founder</span>
        <p className="mt-1 max-w-xs font-body text-xs leading-relaxed text-muted">Clear direction, not every decision.</p>
        <div className="mt-3 h-1 w-16 rounded-full bg-brand" aria-hidden="true" />
      </div>
      <div className="relative mt-6 space-y-2 before:absolute before:-left-3 before:top-5 before:bottom-5 before:w-px before:bg-line sm:before:-left-4">
        {architecture.slice(1).map((step, index) => (
          <div
            key={step}
            className="group relative flex items-center gap-3 rounded-xl border border-line bg-brand-tint px-3 py-2.5 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-brand"
          >
            <span
              className="relative z-10 -ml-5 flex h-3 w-3 shrink-0 rounded-full border-2 border-white bg-brand shadow-1 sm:-ml-6"
              aria-hidden="true"
            />
            <span className="font-mono text-xs text-muted">0{index + 2}</span>
            <span className="font-heading text-xs font-bold text-ink">{step}</span>
            <span
              className="ml-auto h-1.5 w-7 origin-left rounded-full bg-brand-soft transition-[transform,background-color] duration-200 ease-out group-hover:scale-x-150 group-hover:bg-brand"
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
      <p className="mt-6 border-t border-line pt-4 font-body text-xs leading-relaxed text-muted">
        Move operational responsibility into visible systems, clear ownership, and useful information.
      </p>
    </div>
  );
}

const trapSymptoms = [
  { label: "Approval bottlenecks", detail: "Work waits for a founder decision.", Icon: Clock },
  { label: "Knowledge trapped in people", detail: "Critical know-how is not accessible.", Icon: GitBranch },
  { label: "Firefighting", detail: "Urgent issues replace planned work.", Icon: ShieldAlert },
  { label: "Inconsistent execution", detail: "Standards change by person or day.", Icon: Repeat },
];

export function FounderTrapDiagram() {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center" aria-label="Four observable symptoms of the Founder Trap">
      <div className="stage-reveal relative mx-auto flex aspect-square w-full max-w-72 items-center justify-center rounded-full border border-line bg-white p-6">
        <div className="absolute h-52 w-52 rounded-full border border-dashed border-danger/30" aria-hidden="true" />
        <div className="absolute h-36 w-36 rounded-full border border-dashed border-danger/30" aria-hidden="true" />
        <div className="relative z-10 rounded-full bg-brand px-6 py-5 text-center shadow-2">
          <span className="block font-heading text-[length:var(--step-1)] font-extrabold text-white">Founder</span>
          <p className="mt-1 font-body text-xs text-white/80">The operating bottleneck</p>
        </div>
      </div>
      <div>
        <p className="font-body text-[length:var(--step-0)] leading-relaxed text-muted">
          The Founder Trap is a pattern of observable dependency—not a judgment on the founder.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {trapSymptoms.map(({ label, detail, Icon }, index) => (
            <div key={label} className="stage-reveal card-interactive rounded-xl border border-line bg-white p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger-soft" aria-hidden="true">
                  <Icon className="h-4 w-4 text-danger" strokeWidth={2.25} />
                </span>
                <span className="font-mono text-xs text-danger">0{index + 1}</span>
              </div>
              <h3 className="mt-3 text-[length:var(--step-1)] font-heading font-bold text-ink">{label}</h3>
              <p className="mt-1 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const dependencyAreas = [
  { title: "Decision Speed", body: "Whether decisions and work continue when you are unavailable.", value: "01", Icon: Clock },
  { title: "Execution Consistency", body: "Whether recurring work reaches a consistent standard without your supervision.", value: "02", Icon: Users },
  { title: "Operational Visibility", body: "Whether you can see what is happening without chasing people for updates.", value: "03", Icon: Eye },
];

export function DependencyIndexPreview() {
  return (
    <section id="dependency-index" className="border-y border-line bg-brand-tint px-6 py-16 text-ink md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="eyebrow mb-3 text-accent-ink">Business Health Check</p>
          <h2 className="font-heading text-[length:var(--step-4)] font-extrabold">How much does your business still depend on you?</h2>
          <p className="mt-5 max-w-xl font-body text-[length:var(--step-0)] leading-relaxed text-muted">
            Answer 12 questions and receive your Founder Dependency Index across three observable operating areas.
          </p>
          <div className="mt-6 rounded-2xl border border-brand/30 bg-brand-soft p-4">
            <h3 className="font-heading text-[length:var(--step-1)] font-bold text-brand-ink">Important diagnostic boundary</h3>
            <p className="mt-1 font-body text-[length:var(--step-0)] leading-relaxed text-ink">
              This is a focused founder-dependency self-report, not a full financial, tax, legal, or business-performance audit. It shows where dependency appears; a Business Clarity Audit tests why, against operating evidence.
            </p>
          </div>
          <Link
            href="/diagnostic"
            className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-heading text-sm font-bold text-white shadow-1 transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:bg-brand-hover hover:shadow-2"
          >
            Start the Business Health Check
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {dependencyAreas.map(({ title, body, value, Icon }) => (
            <div key={title} className="stage-reveal card-interactive rounded-2xl border border-line bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft" aria-hidden="true">
                <Icon className="h-5 w-5 text-brand-ink" strokeWidth={2.25} />
              </span>
              <p className="mt-4 font-mono text-xs text-accent-ink">{value}</p>
              <h3 className="mt-1 text-[length:var(--step-1)] font-heading font-bold">{title}</h3>
              <p className="mt-2 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{body}</p>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">4 questions</p>
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
          <article className="stage-card stage-reveal card-interactive rounded-2xl border border-line bg-white p-5 shadow-1 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs text-brand-ink">{stage.number}</p>
                <h3 className="mt-1 font-heading text-[length:var(--step-2)] font-bold text-ink">{stage.title}</h3>
                <p className="mt-2 max-w-2xl font-body text-[length:var(--step-0)] leading-relaxed text-muted">{stage.detail}</p>
              </div>
              <span className="w-fit rounded-full border border-accent/30 bg-accent-soft px-3 py-1.5 font-body text-xs font-medium text-accent-ink">{stage.commitment}</span>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
