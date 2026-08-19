import Image from "next/image";
import Link from "next/link";
import { AUTHOR_HEADSHOT, pageMetadata } from "@/lib/metadata";
import { jsonLdScript, personAndServiceJsonLd } from "@/lib/jsonLd";

export const metadata = pageMetadata({
  title: "About Muhammed Ajmal | Business Operations & Growth Consultant",
  absoluteTitle: true,
  description: "Muhammed Ajmal is a Dubai-based Business Operations & Growth Consultant helping founder-led UAE SMEs build stronger systems, ownership, visibility, and execution.",
  path: "/about",
});

const credentials = [
  "Google AI Professional Certificate 2026 — Credential: SCSUP9BBKX10",
  "AI for Brainstorming and Planning — Google (2026)",
  "Business Development Foundations — LinkedIn (2024)",
  "Mastering Project Management — LinkedIn (2024)",
  "Basics of Business Consulting — Alison (2024)",
  "Advanced Diploma in Digital Marketing — Digimark Academy (2022)",
];

const principles = [
  ["Simple", "Use operating structures people can understand and apply."],
  ["Practical", "Prioritize changes that fit the reality of the business."],
  ["Sustainable", "Build systems the team can maintain after implementation."],
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(personAndServiceJsonLd()) }} />

      <section className="relative overflow-hidden bg-white px-6 py-16 text-ink md:py-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-3 text-brand-ink">About Muhammed Ajmal</p>
          <h1 className="font-heading text-[length:var(--step-5)] font-extrabold leading-[1.02]">Business Operations &amp; Growth Consultant</h1>
          <p className="mx-auto mt-5 max-w-2xl font-body text-[length:var(--step-0)] leading-relaxed text-muted">Dubai, United Arab Emirates</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-tint px-6 py-16 md:py-24">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-start md:gap-16">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-3 -top-3 h-24 w-24 border-l-2 border-t-2 border-brand" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-tint shadow-3">
              <Image src={AUTHOR_HEADSHOT.src} alt={AUTHOR_HEADSHOT.alt} fill priority sizes="(min-width: 768px) 36vw, 100vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-white/95 p-5">
                <p className="font-heading text-[length:var(--step-0)] font-bold text-ink">Muhammed Ajmal</p>
                <p className="mt-1 font-body text-xs text-brand-ink">Business Operations &amp; Growth Consultant</p>
              </div>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-3 text-accent-ink">Approach</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold leading-tight text-ink">Management knowledge, systems thinking, execution, and applied AI.</h2>
            <div className="mt-6 space-y-5 font-body text-[length:var(--step-0)] leading-relaxed text-muted">
              <p>Muhammed helps founder-led UAE SMEs move important operating responsibility into clear roles, usable systems, and visible management information.</p>
              <p>The work is grounded in business management, systems thinking, and practical execution. Applied AI is used as an enabling capability—where it improves capacity, speed, or visibility—not as a product in itself.</p>
              <p>The focus is to reduce founder dependency by improving decision speed, execution consistency, and operational visibility.</p>
            </div>
            <Link href="/diagnostic" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-6 py-3 font-heading text-[length:var(--step-0)] font-bold text-white transition-colors hover:bg-brand-hover">Start the Business Health Check →</Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3 text-brand-ink">Delivery principle</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold leading-tight text-ink">Simple · Practical · Sustainable</h2>
          </div>
          <div className="mt-10 flex flex-col divide-y divide-line border-t border-line md:flex-row md:divide-y-0 md:divide-x md:border-t-0">
            {principles.map(([title, body], index) => (
              <article key={title} className="stage-reveal flex-1 py-6 md:px-6 md:py-0 first:md:pl-0 last:md:pr-0">
                <span className="font-mono text-xs text-brand-ink">0{index + 1}</span>
                <h3 className="mt-4 text-[length:var(--step-1)] font-heading font-bold text-ink">{title}</h3>
                <p className="mt-3 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-tint px-6 py-16 md:py-24">
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="eyebrow mb-3 text-accent-ink">Professional credentials</p>
          <h2 className="font-heading text-[length:var(--step-3)] font-extrabold text-ink">Current learning and professional development</h2>
          <ul className="mt-8 max-w-2xl divide-y divide-line border-t border-line">
            {credentials.map((credential) => (
              <li key={credential} className="stage-reveal flex items-start gap-3 py-4 font-body text-[length:var(--step-0)] leading-relaxed text-muted">
                <span className="mt-0.5 text-accent-ink" aria-hidden="true">✓</span>{credential}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
