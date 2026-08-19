import Link from "next/link";
import { CalendlyWidget } from "@/components/contact/CalendlyWidget";
import { ContactForm } from "@/components/contact/ContactForm";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Start with the Business Health Check or contact Muhammed Ajmal Consulting. Built for founder-led UAE SMEs with operating changes to make.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white px-6 py-16 text-ink md:py-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-3 text-brand-ink">Get started</p>
          <h1 className="font-heading text-[length:var(--step-5)] font-extrabold leading-[1.02]">Start with the Business Health Check.</h1>
          <p className="mx-auto mt-5 max-w-2xl font-body text-[length:var(--step-0)] leading-relaxed text-muted">It is the practical first step for founders who want a focused view of where daily operations may still depend on them.</p>
          <Link href="/diagnostic" className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-brand px-8 py-4 font-heading text-[length:var(--step-0)] font-bold text-white transition-colors hover:bg-brand-hover">Start the Business Health Check →</Link>
          <p className="mx-auto mt-5 max-w-2xl font-body text-[length:var(--step-0)] leading-relaxed text-muted">This practice is built for founder-led UAE businesses with AED 1M–10M annual revenue, 5–50 employees, and operating changes the founder can approve.</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-tint px-6 py-12 md:py-16">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 md:gap-12 lg:grid-cols-2">
          <div>
            <h2 className="heading-reveal font-heading text-[length:var(--step-3)] font-bold text-ink">Send an enquiry</h2>
            <p className="mt-2 font-body text-[length:var(--step-0)] leading-relaxed text-muted">For a specific question or a scope you would like to discuss.</p>
            <div className="mt-6"><ContactForm /></div>
          </div>
          <div>
            <h2 className="heading-reveal font-heading text-[length:var(--step-3)] font-bold text-ink">Book a conversation</h2>
            <p className="mt-2 font-body text-[length:var(--step-0)] leading-relaxed text-muted">Come with a specific operating question, or your Founder Dependency Index result if you have completed the Business Health Check.</p>
            <div className="mt-6"><CalendlyWidget /></div>
          </div>
        </div>
      </section>
    </>
  );
}
