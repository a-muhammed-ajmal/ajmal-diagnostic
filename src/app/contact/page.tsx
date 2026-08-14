import Link from "next/link";
import { CalendlyWidget } from "@/components/contact/CalendlyWidget";
import { ContactForm } from "@/components/contact/ContactForm";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Start with the Free Diagnostic or contact Muhammed Ajmal Consulting. Built for founder-led UAE SMEs with operating changes to make.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy px-6 py-16 text-ivory md:py-20">
        <div className="graph-overlay-dark" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-3 text-gold">Get started</p>
          <h1 className="font-heading text-[length:var(--step-5)] font-extrabold leading-[1.02]">Start with the Free Diagnostic.</h1>
          <p className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-ivory/70 md:text-lg">It is the practical first step for founders who want a clearer view of where the business still depends on them.</p>
          <Link href="/diagnostic" className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gold px-8 py-4 font-heading text-base font-bold text-navy transition-colors hover:bg-gold-bright">Take the Free Diagnostic →</Link>
          <p className="mx-auto mt-5 max-w-2xl font-body text-sm leading-relaxed text-ivory/50">This practice is built for founder-led UAE businesses with AED 1M–10M annual revenue, 5–50 employees, and operating changes the founder can approve.</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ivory px-6 py-12 md:py-16">
        <div className="graph-overlay" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 md:gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold text-navy">Send an enquiry</h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-navy/60">For a specific question or a scope you would like to discuss.</p>
            <div className="mt-6"><ContactForm /></div>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-navy">Book a conversation</h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-navy/60">If you have completed the diagnostic or need to discuss an operating challenge, choose a suitable time.</p>
            <div className="mt-6"><CalendlyWidget /></div>
          </div>
        </div>
      </section>
    </>
  );
}
