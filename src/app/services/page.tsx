import Link from "next/link";
import { CommercialLadder, COMMERCIAL_STAGES } from "@/components/home/SystemVisuals";
import { pageMetadata } from "@/lib/metadata";
import { faqJsonLd, jsonLdScript, serviceJsonLd } from "@/lib/jsonLd";

export const metadata = pageMetadata({
  title: "How We Work",
  description: "One evidence-led path for founder-led UAE SMEs: Business Health Check, Business Clarity Audit, Focused Improvement Sprint, Business System Build, and Growth Partner Retainer.",
  path: "/services",
});

const evidenceLadder = [
  ["Self-report", "The Business Health Check captures your view of observable business behavior."],
  ["Evidence", "The Business Clarity Audit examines records, workflows, dashboards, decision samples, SOPs, and rework."],
  ["Root cause", "The Business Clarity Audit identifies the binding constraint that a Focused Improvement Sprint can address."],
];

/**
 * Published answers only. Every one restates an existing approved position — the Anchor
 * Document's positioning boundaries, the target profile, or the FDI result limitation —
 * so nothing here introduces a claim the practice has not already committed to.
 */
const faqs = [
  {
    question: "Can we skip the diagnostic and start with the work?",
    answer: "No. Diagnosis comes before prescription. Without it, an engagement is built on assumption rather than on what the business actually shows.",
  },
  {
    question: "What does the free Business Health Check actually tell me?",
    answer: "It returns your Founder Dependency Index out of 100, a score for each of three operating areas, and findings drawn from your own answers. It is based on founder self-report: it identifies where dependency appears, but it does not prove why it exists, the operational root cause, the single binding constraint, or what intervention will fix it.",
  },
  {
    question: "Is the Business Clarity Audit a financial or tax audit?",
    answer: "No. It is an operating audit. It examines records, workflows, dashboards, decision samples, SOPs, roles, and rework to test the self-reported picture against how the business actually runs. It is not a statutory, financial, tax, or compliance audit.",
  },
  {
    question: "Who is this built for?",
    answer: "Founder-led businesses in the United Arab Emirates, normally AED 1,000,000 to AED 10,000,000 in annual revenue, 5 to 50 employees, operating three years or more, where one founder can approve operating changes without a board.",
  },
  {
    question: "Can you just set up the AI automation?",
    answer: "Only after the process is defined. Applied AI is added once the underlying work is understood, so it improves capacity, speed, or visibility rather than automating a process that is not yet working.",
  },
  {
    question: "Do you cover motivation and mindset?",
    answer: "No. The work is structural: systems, ownership, decision rights, visibility, and consistent execution.",
  },
  {
    question: "Can a single stage be done as a cheaper one-off task?",
    answer: "No. The progression is the product. Each stage exists because the preceding evidence supports it, and removing that sequence removes the reason the work holds.",
  },
  {
    question: "What does an engagement cost?",
    answer: "Scope and fees are agreed only after the Business Clarity Audit establishes what actually needs to change. Quoting a figure before the constraint is understood would price work that has not yet been defined.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(serviceJsonLd(COMMERCIAL_STAGES.map((stage) => ({ name: stage.title, description: stage.detail })))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd(faqs)) }} />

      <section className="relative overflow-hidden bg-white px-6 py-16 text-ink md:py-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-3 text-brand-ink">How we work</p>
          <h1 className="font-heading text-[length:var(--step-5)] font-extrabold leading-[1.02]">A practical path from dependency to a stronger operating system.</h1>
          <p className="mx-auto mt-5 max-w-2xl font-body text-[length:var(--step-0)] leading-relaxed text-muted">The commercial progression is intentional. Each stage clarifies, verifies, or strengthens what comes next.</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-tint px-6 py-16 md:py-24">
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="eyebrow mb-3 text-accent-ink">Why the order matters</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-3)] font-extrabold leading-tight text-ink">Self-report, then evidence, then root cause.</h2>
          </div>
          <div className="flex flex-col divide-y divide-line border-t border-line md:flex-row md:divide-y-0 md:divide-x md:border-t-0">
            {evidenceLadder.map(([title, body], index) => (
              <article key={title} className="stage-reveal flex-1 py-6 md:px-6 md:py-0 first:md:pl-0 last:md:pr-0">
                <span className="font-mono text-xs text-brand-ink">0{index + 1}</span>
                <h3 className="mt-4 text-[length:var(--step-1)] font-heading font-bold text-ink">{title}</h3>
                <p className="mt-3 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{body}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="eyebrow mb-3 text-accent-ink">The engagement journey</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold leading-tight text-ink">Start where the evidence says to start.</h2>
          </div>
          <CommercialLadder />
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="eyebrow mb-3 text-brand-ink">Common questions</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold leading-tight text-ink">Before you start.</h2>
          </div>
          <div className="divide-y divide-line border-t border-line">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-heading text-[length:var(--step-0)] font-bold text-ink marker:content-none">
                  {faq.question}
                  <span className="shrink-0 font-mono text-[length:var(--step-0)] text-brand-ink transition-transform duration-200 group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-4 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-brand-tint px-6 py-16 text-ink md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="heading-reveal font-heading text-[length:var(--step-3)] font-extrabold">Start with the Business Health Check.</h2>
          <p className="mt-4 font-body text-[length:var(--step-0)] leading-relaxed text-muted">It gives an initial, self-reported picture of where founder dependency may appear. A Business Clarity Audit is the evidence-led next step when verification is needed.</p>
          <Link href="/diagnostic" className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-brand px-8 py-4 font-heading text-[length:var(--step-0)] font-bold text-white transition-colors hover:bg-brand-hover">Start the Business Health Check →</Link>
        </div>
      </section>
    </>
  );
}
