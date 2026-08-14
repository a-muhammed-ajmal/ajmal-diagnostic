import Link from "next/link";
import { CommercialLadder } from "@/components/home/SystemVisuals";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "How We Work",
  description: "A structured consulting journey for founder-led UAE SMEs: Free Diagnostic, Audit, Sprint, Operating System Build, and Growth Partner Retainer.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy px-6 py-16 text-ivory md:py-20">
        <div className="graph-overlay-dark" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-3 text-gold">How we work</p>
          <h1 className="font-heading text-[length:var(--step-5)] font-extrabold leading-[1.02]">A practical path from dependency to a stronger operating system.</h1>
          <p className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-ivory/70 md:text-lg">The commercial progression is intentional. Each stage clarifies, verifies, or strengthens what comes next.</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ivory px-6 py-16 md:py-24">
        <div className="graph-overlay" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Self-report", "The Free Diagnostic captures the founder's view of observable business behavior."],
              ["Evidence", "The Audit checks records, workflows, dashboards, decision samples, SOPs, and rework."],
              ["Root cause", "The Audit identifies the binding constraint that a focused Sprint can address."],
            ].map(([title, body], index) => (
              <article key={title} className="relative rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
                <span className="font-mono text-xs text-gold-ink">0{index + 1}</span>
                <h2 className="mt-5 font-heading text-xl font-bold text-navy">{title}</h2>
                <p className="mt-3 font-body text-sm leading-relaxed text-navy/65">{body}</p>
                {index < 2 && <span className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-ivory text-gold-ink md:flex" aria-hidden="true">→</span>}
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="eyebrow mb-3 text-teal-ink">The engagement journey</p>
            <h2 className="font-heading text-[length:var(--step-4)] font-extrabold leading-tight text-navy">Start where the evidence says to start.</h2>
          </div>
          <CommercialLadder />
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy px-6 py-16 text-ivory md:py-20">
        <div className="graph-overlay-dark" />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-[length:var(--step-3)] font-extrabold">Start with the Free Diagnostic.</h2>
          <p className="mt-4 font-body text-base leading-relaxed text-ivory/70">It provides an initial, self-reported picture of where founder dependency may appear. An Audit is the evidence-led next step when verification is needed.</p>
          <Link href="/diagnostic" className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gold px-8 py-4 font-heading text-base font-bold text-navy transition-colors hover:bg-gold-bright">Take the Free Diagnostic →</Link>
        </div>
      </section>
    </>
  );
}
