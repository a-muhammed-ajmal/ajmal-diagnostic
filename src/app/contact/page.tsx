import { ArrowRight } from "lucide-react";
import { CalendlyWidget } from "@/components/contact/CalendlyWidget";
import { ContactForm } from "@/components/contact/ContactForm";
import { Button } from "@/components/ui/Button";
import { CTABand } from "@/components/ui/CTABand";
import { Surface } from "@/components/ui/Surface";
import { WHATSAPP_AUDIT_LINK } from "@/lib/env";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Start with the Business Health Check or contact Muhammed Ajmal Consulting. Built for founder-led UAE SMEs with operating changes to make.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get started"
        title="Start with the Business Health Check."
        lead="It is the practical first step for founders who want a focused view of where daily operations may still depend on them."
        actions={
          <Button href="/diagnostic">
            Start the Business Health Check
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
        note="Built for founder-led UAE businesses with AED 1M–10M annual revenue, 5–50 employees, and operating changes the founder can approve."
      />

      {/* 7/5 split rather than two equal halves: the enquiry form is the primary
          path and the booking widget supports it. */}
      <Section tone="tint" width="wide" orbs>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold text-ink">Send an enquiry</h2>
            <p className="mt-2 font-body text-[length:var(--step-0)] leading-relaxed text-muted">
              For a specific question or a scope you would like to discuss.
            </p>
            <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-1">
              <ContactForm />
            </div>
          </div>
          <div className="lg:col-span-5">
            <h2 className="heading-reveal font-heading text-[length:var(--step-4)] font-extrabold text-ink">Book a conversation</h2>
            <p className="mt-2 font-body text-[length:var(--step-0)] leading-relaxed text-muted">
              Come with a specific operating question, or your Founder Dependency Index result if you have completed the Business Health Check.
            </p>
            <div className="mt-6">
              <CalendlyWidget />
            </div>

            {/*
              What to bring, not what to expect back. A response-time
              commitment is not stated in any governing document, so none is
              invented here.
            */}
            <Surface className="mt-6" tone="muted">
              <p className="eyebrow mb-3">What to send</p>
              <ul className="space-y-2 font-body text-[length:var(--step-0)] leading-relaxed text-ink">
                <li>The operating problem as you see it today.</li>
                <li>What you have already tried.</li>
                <li>Your Founder Dependency Index result, if you have one.</li>
              </ul>
            </Surface>

            {WHATSAPP_AUDIT_LINK && (
              <div className="mt-4">
                <Button href={WHATSAPP_AUDIT_LINK} external variant="quiet" fullWidth>
                  Message on WhatsApp
                </Button>
              </div>
            )}
          </div>
        </div>
      </Section>

      <CTABand
        eyebrow="A lighter first step"
        title="Not ready to talk? Start with the check."
        body="The Business Health Check is free and private, and returns your Founder Dependency Index in 12 questions."
        actions={
          <Button href="/diagnostic" variant="accent">
            Start the Business Health Check
            {/* WEB §5 fixes the label including the arrow. The icon is decorative,
                so the glyph is restated here for the accessible name only. */}
            <span className="sr-only"> →</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />
    </>
  );
}
