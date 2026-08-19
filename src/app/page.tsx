import Link from "next/link";
import { ArrowRight, CircleCheck, Compass, Cpu, Settings2, Users } from "lucide-react";
import {
  CommercialLadder,
  DependencyIndexPreview,
  FounderSystemVisual,
  FounderTrapDiagram,
} from "@/components/home/SystemVisuals";
import { ArchitectureLadder, GrowthFormulaRail, IndexBandMeter } from "@/components/home/Graphics";
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

const scopeAreas = [
  { title: "Strategy", body: "Direction, priorities, positioning, and growth choices.", Icon: Compass },
  { title: "Systems", body: "Processes, SOPs, management rhythm, KPIs, and structure.", Icon: Settings2 },
  { title: "People", body: "Roles, ownership, decision rights, accountability, and capability.", Icon: Users },
  { title: "Applied AI", body: "Automation and AI where they improve capacity, speed, or visibility.", Icon: Cpu },
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

      <section className="bg-white px-6 py-16 text-ink md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div>
            <span className="reveal eyebrow mb-4 block text-brand-ink">
              Business Operations &amp; Growth Consultant · Dubai, UAE
            </span>
            <h1 className="reveal font-heading text-[length:var(--step-5)] font-extrabold">
              Build a business that <span className="brand-gradient-text">grows beyond the founder.</span>
            </h1>
            <p className="reveal mt-6 max-w-xl font-body text-[length:var(--step-0)] leading-relaxed text-muted">
              Muhammed Ajmal Consulting helps founder-led UAE SMEs build successful, scalable businesses by reducing founder dependency through better systems, clearer ownership, useful visibility, and consistent execution.
            </p>
            <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/diagnostic"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3 font-heading text-[length:var(--step-0)] font-bold text-white shadow-1 transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:bg-brand-hover hover:shadow-2"
              >
                Start the Business Health Check
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line-strong px-7 py-3 font-heading text-[length:var(--step-0)] font-bold text-ink transition-[border-color,color,transform] duration-200 ease-out hover:-translate-y-px hover:border-brand hover:text-brand-ink"
              >
                See How It Works
              </Link>
            </div>
            <p className="reveal mt-4 font-body text-xs text-muted">Free. Private. A focused founder-dependency self-report.</p>
          </div>
          <FounderSystemVisual />
        </div>
      </section>

      <section className="border-y border-line bg-brand-tint px-6 py-10" aria-label="Growth Formula">
        <GrowthFormulaRail />
      </section>

      <section id="founder-trap" className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
            <p className="eyebrow mb-3 text-danger">The Founder Trap</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold text-ink">When growth still depends on one person.</h2>
            <p className="mt-4 font-body text-[length:var(--step-0)] leading-relaxed text-muted">The pattern is visible in how decisions move, where knowledge sits, how the team responds to change, and whether work is done consistently.</p>
          </div>
          <FounderTrapDiagram />
        </div>
      </section>

      <DependencyIndexPreview />

      <section id="how-it-works" className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3 text-brand-ink">How we work</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold text-ink">One commercial journey. Each stage leads to the next.</h2>
            <p className="mt-4 font-body text-[length:var(--step-0)] leading-relaxed text-muted">The right next step depends on what evidence shows—not on choosing from a menu of disconnected services.</p>
          </div>
          <CommercialLadder />
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line-strong px-7 py-3 font-heading text-[length:var(--step-0)] font-bold text-ink transition-[border-color,background-color,color,transform] duration-200 ease-out hover:-translate-y-px hover:border-brand hover:bg-brand hover:text-white"
            >
              See the full journey
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-brand-tint px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3 text-accent-ink">Operating scope</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold text-ink">The areas of work that make an operating system work.</h2>
            <p className="mt-4 font-body text-[length:var(--step-0)] leading-relaxed text-muted">These are areas of work, not another framework.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {scopeAreas.map(({ title, body, Icon }, index) => (
              <article key={title} className="stage-reveal card-interactive rounded-2xl border border-line bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft" aria-hidden="true">
                    <Icon className="h-5 w-5 text-brand-ink" strokeWidth={2.25} />
                  </span>
                  <span className="font-mono text-xs text-accent-ink">0{index + 1}</span>
                </div>
                <h3 className="mt-4 text-[length:var(--step-1)] font-heading font-bold text-ink">{title}</h3>
                <p className="mt-2 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3 text-brand-ink">Strategic Growth Architecture</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold text-ink">A system that shifts responsibility out of the founder&apos;s head.</h2>
          </div>
          <div className="mt-12">
            <ArchitectureLadder />
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center font-body text-[length:var(--step-0)] leading-relaxed text-muted">The architecture is progressive: each layer gives the next one a stronger foundation.</p>
        </div>
      </section>

      <section className="border-y border-line bg-brand-tint px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow mb-3 text-accent-ink">Built for</p>
              <h2 className="heading-reveal font-heading text-[length:var(--step-3)] font-extrabold text-ink">Founder-led UAE SMEs ready to make operating changes.</h2>
              <p className="mt-4 font-body text-[length:var(--step-0)] leading-relaxed text-muted">Primary sectors include real estate and business services, trading and distribution, and construction and contracting.</p>
            </div>
            <ul className="grid gap-3 rounded-2xl border border-line bg-white p-5 sm:grid-cols-2">
              {qualification.map((item) => (
                <li key={item} className="stage-reveal flex items-start gap-2.5 font-body text-[length:var(--step-0)] text-ink">
                  <CircleCheck className="mt-px h-4 w-4 shrink-0 text-brand" strokeWidth={2.25} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <p className="eyebrow mb-3 text-brand-ink">Start with clarity</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold text-ink">Find out where your business still depends on you.</h2>
            <p className="mx-auto mt-5 max-w-xl font-body text-[length:var(--step-0)] leading-relaxed text-muted lg:mx-0">Start with a free Business Health Check and receive your Founder Dependency Index across decision speed, execution consistency, and operational visibility.</p>
            <Link
              href="/diagnostic"
              className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3 font-heading text-[length:var(--step-0)] font-bold text-white shadow-1 transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:bg-brand-hover hover:shadow-2"
            >
              Start the Business Health Check
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <IndexBandMeter />
        </div>
      </section>
    </>
  );
}
