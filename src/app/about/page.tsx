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

      <section className="relative overflow-hidden bg-navy px-6 py-16 text-ivory md:py-20">
        <div className="graph-overlay-dark" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-3 text-gold">About Muhammed Ajmal</p>
          <h1 className="font-heading text-[length:var(--step-5)] font-extrabold leading-[1.02]">Business Operations &amp; Growth Consultant</h1>
          <p className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-ivory/70 md:text-lg">Dubai, United Arab Emirates</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ivory px-6 py-16 md:py-24">
        <div className="graph-overlay" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-start md:gap-16">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-3 -top-3 h-24 w-24 border-l-2 border-t-2 border-gold" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-navy shadow-2xl">
              <Image src={AUTHOR_HEADSHOT.src} alt={AUTHOR_HEADSHOT.alt} fill priority sizes="(min-width: 768px) 36vw, 100vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-navy/85 p-5">
                <p className="font-heading text-lg font-bold text-ivory">Muhammed Ajmal</p>
                <p className="mt-1 font-body text-xs text-gold">Business Operations &amp; Growth Consultant</p>
              </div>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-3 text-teal-ink">Approach</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold leading-tight text-navy">Management knowledge, systems thinking, execution, and applied AI.</h2>
            <div className="mt-6 space-y-5 font-body text-base leading-relaxed text-navy/70">
              <p>Muhammed helps founder-led UAE SMEs move important operating responsibility into clear roles, usable systems, and visible management information.</p>
              <p>The work is grounded in business management, systems thinking, and practical execution. Applied AI is used as an enabling capability—where it improves capacity, speed, or visibility—not as a product in itself.</p>
              <p>The focus is to reduce founder dependency by improving decision speed, execution consistency, and operational visibility.</p>
            </div>
            <Link href="/diagnostic" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-gold px-6 py-3 font-heading text-sm font-bold text-navy transition-colors hover:bg-gold-bright">Start the Business Health Check →</Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3 text-gold-ink">Delivery principle</p>
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold leading-tight text-navy">Simple · Practical · Sustainable</h2>
          </div>
          <div className="mt-10 flex flex-col divide-y divide-navy/10 border-t border-navy/10 md:flex-row md:divide-y-0 md:divide-x md:border-t-0">
            {principles.map(([title, body], index) => (
              <article key={title} className="stage-reveal flex-1 py-6 md:px-6 md:py-0 first:md:pl-0 last:md:pr-0">
                <span className="font-mono text-xs text-gold-ink">0{index + 1}</span>
                <h3 className="mt-4 text-[length:var(--step-1)] font-heading font-bold text-navy">{title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-navy/65">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ivory px-6 py-16 md:py-24">
        <div className="graph-overlay" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="eyebrow mb-3 text-teal-ink">Professional credentials</p>
          <h2 className="font-heading text-[length:var(--step-3)] font-extrabold text-navy">Current learning and professional development</h2>
          <ul className="mt-8 max-w-2xl divide-y divide-navy/10 border-t border-navy/10">
            {credentials.map((credential) => (
              <li key={credential} className="stage-reveal flex items-start gap-3 py-4 font-body text-sm leading-relaxed text-navy/70">
                <span className="mt-0.5 text-teal-ink" aria-hidden="true">✓</span>{credential}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
