import { ArrowRight } from "lucide-react";
import { CommercialLadder, COMMERCIAL_STAGES } from "@/components/home/SystemVisuals";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/Surface";
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

      <PageHero
        eyebrow="How we work"
        title="A practical path from dependency to a stronger operating system."
        lead="The commercial progression is intentional. Each stage clarifies, verifies, or strengthens what comes next."
        actions={
          <Button href="/diagnostic">
            Start the Business Health Check
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      <Section tone="tint" width="wide" orbs>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-3">Why the order matters</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold leading-tight text-ink">
              Self-report, then evidence, then root cause.
            </h2>
          </div>
          <ol className="lg:col-span-7">
            {evidenceLadder.map(([title, body], index) => (
              <li
                key={title}
                className="stage-reveal card-interactive mb-3 rounded-2xl border border-line bg-white p-5 last:mb-0"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-heading text-[length:var(--step-1)] font-bold text-ink">{title}</h3>
                  <span className="font-mono text-xs text-accent-ink">0{index + 1}</span>
                </div>
                <p className="mt-2 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section width="narrow" tone="light">
        <SectionHeader
          eyebrow="The engagement journey"
          accent="amber"
          title="Start where the evidence says to start."
        />
        <CommercialLadder />
      </Section>

      <Section width="prose">
        <SectionHeader eyebrow="Common questions" title="Before you start." />
        <div className="mt-10 grid gap-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-line bg-white px-5 shadow-1 transition-all duration-200 open:shadow-2 hover:border-brand"
            >
              <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 py-4 font-heading text-[length:var(--step-0)] font-bold text-ink marker:content-none">
                {faq.question}
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft font-mono text-[length:var(--step-0)] text-brand-ink transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section tone="dark" width="wide" orbs>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">Start here</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold text-white">
              Start with the Business Health Check.
            </h2>
            <p className="mt-4 max-w-xl font-body text-[length:var(--step-0)] leading-relaxed text-muted-invert">
              It gives an initial, self-reported picture of where founder dependency may appear. A Business Clarity Audit is the evidence-led next step when verification is needed.
            </p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <Button href="/diagnostic" variant="accent">
              Start the Business Health Check
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Section>

    </>
  );
}
