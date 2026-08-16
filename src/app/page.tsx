import Link from "next/link";
import {
  CommercialLadder,
  DependencyIndexPreview,
  FounderTrapDiagram,
} from "@/components/home/SystemVisuals";
import { pageMetadata } from "@/lib/metadata";
import { jsonLdScript, personAndServiceJsonLd } from "@/lib/jsonLd";

export const metadata = pageMetadata({
  title: "Muhammed Ajmal Consulting | Business Operations & Growth Consultant — Dubai, UAE",
  absoluteTitle: true,
  ogTitle: "Build a business that grows beyond the founder | Muhammed Ajmal Consulting",
  description:
    "Business operations and growth consulting for founder-led UAE SMEs. Build systems, ownership, visibility, and consistent execution that reduce founder dependency.",
  path: "/",
});

const GROWTH_FORMULA = ["Vision", "Strategy", "Systems", "People", "Execution", "Accountability"];

const ARCHITECTURE_LAYERS = ["Founder", "Team", "Systems", "Automation", "Data", "Scale"];

const scopeAreas = [
  ["Strategy", "Direction, priorities, positioning, and growth choices."],
  ["Systems", "Processes, SOPs, management rhythm, KPIs, and structure."],
  ["People", "Roles, ownership, decision rights, accountability, and capability."],
  ["Applied AI", "Automation and AI where they improve capacity, speed, or visibility."],
];

const qualification = [
  "Founder-led",
  "United Arab Emirates",
  "AED 1M–10M annual revenue",
  "5–50 employees",
  "3+ years operating",
  "Growth still depends heavily on the founder",
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(personAndServiceJsonLd()) }} />

      <section className="relative flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden bg-navy px-6 py-10 text-ivory sm:py-12">
        <div className="graph-overlay-dark" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div>
            <span className="reveal mb-4 block font-heading text-xs font-bold uppercase tracking-widest text-gold md:text-sm">
              Business Operations &amp; Growth Consultant · Dubai, UAE
            </span>
            <h1 className="reveal font-heading text-[length:var(--step-5)] font-extrabold leading-[0.98]">
              Build a business that <span className="orange-gradient-text">grows beyond the founder.</span>
            </h1>
            <p className="reveal mt-6 max-w-xl font-body text-base leading-relaxed text-ivory/80 md:text-lg">
              Muhammed Ajmal Consulting helps founder-led UAE SMEs build successful, scalable businesses by reducing founder dependency through better systems, clearer ownership, useful visibility, and consistent execution.
            </p>
            <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/diagnostic" className="inline-flex min-h-11 items-center justify-center rounded-md bg-violet px-5 py-3 font-heading text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-deep">
                Start assessment <span aria-hidden="true">&nbsp;→</span>
              </Link>
              <Link href="/services" className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-ivory/35 px-7 py-4 font-heading text-base font-bold text-ivory transition-colors hover:border-gold hover:text-gold">
                See How It Works
              </Link>
            </div>
            <p className="reveal mt-4 font-body text-sm text-ivory/50">Free. Private. A focused founder-dependency self-report.</p>
          </div>
          <aside className="rounded-lg border border-dark-border bg-dark-raised p-5" aria-label="Assessment scope">
            <p className="font-heading text-sm font-semibold text-white">Assessment scope</p>
            <p className="mt-2 text-sm leading-5 text-slate">A focused self-report that helps identify where founder dependency appears in day-to-day operations.</p>
            <dl className="mt-5 divide-y divide-dark-border border-y border-dark-border">
              {[["Decision speed", "Can work move without founder approval?"], ["Execution consistency", "Do recurring standards hold across the team?"], ["Operational visibility", "Can you see what is happening without chasing updates?"]].map(([term, detail]) => (
                <div key={term} className="grid gap-1 py-3 sm:grid-cols-[0.8fr_1.2fr] sm:gap-4">
                  <dt className="text-sm font-semibold text-white">{term}</dt>
                  <dd className="text-sm leading-5 text-slate">{detail}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="bg-gold px-6 py-5" aria-label="Growth Formula">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 font-heading text-xs font-bold text-navy md:text-sm">
          {GROWTH_FORMULA.map((step, index) => (
            <span key={step} className="flex items-center gap-3">
              <span>{step}</span>
              {index < GROWTH_FORMULA.length - 1 && <span className="text-navy/45" aria-hidden="true">→</span>}
            </span>
          ))}
        </div>
      </section>

      <section id="founder-trap" className="relative overflow-hidden bg-ivory px-6 py-16 md:py-24">
        <div className="graph-overlay" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
            <p className="eyebrow mb-3 text-crimson">The Founder Trap</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold leading-tight text-navy">When growth still depends on one person.</h2>
            <p className="mt-4 font-body text-base leading-relaxed text-navy/65">The pattern is visible in how decisions move, where knowledge sits, how the team responds to change, and whether work is done consistently.</p>
          </div>
          <FounderTrapDiagram />
        </div>
      </section>

      <DependencyIndexPreview />

      <section id="how-it-works" className="relative overflow-hidden bg-white px-6 py-16 md:py-24">
        <div className="graph-overlay" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3 text-gold-ink">How we work</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold leading-tight text-navy">One commercial journey. Each stage leads to the next.</h2>
            <p className="mt-4 font-body text-base leading-relaxed text-navy/65">The right next step depends on what evidence shows—not on choosing from a menu of disconnected services.</p>
          </div>
          <CommercialLadder />
          <div className="mt-10 text-center"><Link href="/services" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-navy px-7 py-3 font-heading text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-ivory">See the full journey <span aria-hidden="true">&nbsp;→</span></Link></div>
        </div>
      </section>

      <section className="bg-ivory px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3 text-teal-ink">Operating scope</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold leading-tight text-navy">The areas of work that make an operating system work.</h2>
            <p className="mt-4 font-body text-base leading-relaxed text-navy/65">These are areas of work, not another framework.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {scopeAreas.map(([title, body], index) => (
              <article key={title} className="card-interactive relative overflow-hidden rounded-2xl border border-navy/10 bg-white p-6 shadow-sm hover:border-teal/50">
                <span className="font-mono text-xs text-teal-ink">0{index + 1}</span>
                <div className="mt-5 h-px w-full bg-teal/25" aria-hidden="true" />
                <h3 className="mt-5 font-heading text-xl font-bold text-navy">{title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-navy/60">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-6 py-16 md:py-24">
        <div className="graph-overlay" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3 text-gold-ink">Strategic Growth Architecture</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold leading-tight text-navy">A system that shifts responsibility out of the founder&apos;s head.</h2>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-6">
            {ARCHITECTURE_LAYERS.map((layer, index) => (
              <div key={layer} className="card-interactive group relative rounded-2xl border border-navy/10 bg-ivory p-5 hover:border-gold">
                <span className="font-mono text-xs text-gold-ink">0{index + 1}</span>
                <p className="mt-7 font-heading text-base font-bold text-navy">{layer}</p>
                {index < ARCHITECTURE_LAYERS.length - 1 && <span className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-white text-gold-ink md:flex" aria-hidden="true">→</span>}
              </div>
            ))}
          </div>
          <p className="mx-auto mt-7 max-w-2xl text-center font-body text-sm leading-relaxed text-navy/60">The architecture is progressive: each layer gives the next one a stronger foundation.</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ivory px-6 py-16 md:py-24">
        <div className="graph-overlay" />
        <div className="relative z-10 mx-auto max-w-6xl rounded-3xl border border-navy/10 bg-white p-7 shadow-sm md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow mb-3 text-teal-ink">Built for</p>
              <h2 className="heading-reveal font-heading text-[length:var(--step-3)] font-extrabold leading-tight text-navy">Founder-led UAE SMEs ready to make operating changes.</h2>
              <p className="mt-4 font-body text-sm leading-relaxed text-navy/65">Primary sectors include real estate and business services, trading and distribution, and construction and contracting.</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {qualification.map((item) => <li key={item} className="flex items-start gap-3 rounded-xl border border-navy/10 bg-ivory px-4 py-3 font-body text-sm text-navy/80"><span className="mt-0.5 text-teal-ink" aria-hidden="true">✓</span>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden bg-navy px-6 py-10 text-ivory sm:py-12">
        <div className="graph-overlay-dark" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-3 text-gold">Start with clarity</p>
          <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold leading-tight">Find out where your business still depends on you.</h2>
          <p className="mx-auto mt-5 max-w-xl font-body text-base leading-relaxed text-ivory/70">Start with a free Business Health Check and receive your Founder Dependency Index across decision speed, execution consistency, and operational visibility.</p>
          <Link href="/diagnostic" className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gold px-9 py-4 font-heading text-base font-bold text-navy shadow-lg transition-colors hover:bg-gold-bright">Start assessment <span aria-hidden="true">&nbsp;→</span></Link>
        </div>
      </section>
    </>
  );
}
