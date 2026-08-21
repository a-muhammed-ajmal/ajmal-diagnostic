/*
 * ⚠️ DRAFT FOR AJMAL'S REVIEW — NOT LEGAL ADVICE.
 *
 * This privacy policy is aligned to the UAE Personal Data Protection Law
 * (Federal Decree-Law No. 45 of 2021) and its Executive Regulation
 * (Cabinet Decision No. 33 of 2024) to the best of a non-lawyer's ability.
 * It MUST be reviewed by a UAE-qualified lawyer before you rely on it.
 *
 * Before publishing, confirm each of these is true and current:
 *   - The privacy contact mailbox below (privacy@muhammedajmal.com) actually exists
 *     and is monitored — or change it to one that is.
 *   - The list of third-party processors matches what the site actually uses.
 *   - The retention periods reflect how long you genuinely keep each record.
 *   - The "Last updated" date is refreshed whenever the policy changes.
 */
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How Muhammed Ajmal Consulting collects, uses, and protects your personal data, aligned to the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021).',
  path: '/privacy',
});

const LAST_UPDATED = '21 August 2026';
const PRIVACY_EMAIL = 'privacy@muhammedajmal.com';

const dataCollected: { item: string; detail: string }[] = [
  { item: 'Name', detail: 'To address you and personalise your diagnostic report.' },
  { item: 'Email address', detail: 'To send your report, respond to enquiries, and — if you opt in — send newsletters.' },
  { item: 'Mobile number', detail: 'To follow up on your enquiry or diagnostic result.' },
  { item: 'Company name', detail: 'To contextualise your diagnostic and any conversation that follows.' },
  { item: 'Business details', detail: 'Optional. Sector, number of employees, revenue band (a range, not an exact figure), and how long the business has operated. Skipping them does not affect your result.' },
  { item: 'Business Health Check answers', detail: 'Your responses to the 12 self-report questions, used only to calculate your Founder Dependency Index and deterministic findings.' },
];

const processors: { name: string; role: string; location: string }[] = [
  { name: 'Supabase', role: 'Database hosting — stores your submissions.', location: 'Servers outside the UAE' },
  { name: 'Resend', role: 'Email delivery — sends your report and our replies.', location: 'Servers outside the UAE' },
  { name: 'Vercel', role: 'Website hosting and infrastructure.', location: 'Servers outside the UAE' },
  { name: 'Calendly', role: 'Consultation scheduling, if you choose to book a call.', location: 'Servers outside the UAE' },
];

const rights: string[] = [
  'Be informed about how your personal data is processed.',
  'Access the personal data we hold about you.',
  'Request correction of inaccurate or incomplete data.',
  'Request erasure of your data.',
  'Restrict or stop the processing of your data.',
  'Request your data in a structured, portable format.',
  'Withdraw consent at any time, without affecting processing already carried out.',
];

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading font-extrabold text-[length:var(--step-2)] text-ink pt-2">{heading}</h2>
      {children}
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        lead={`Last updated: ${LAST_UPDATED}`}
      />

      <section className="relative overflow-hidden border-y border-line bg-canvas-light px-6 py-12 md:py-16">
        <div className="max-w-3xl mx-auto relative z-10 space-y-8 font-body text-ink leading-relaxed">

          <div className="bg-white border-l-4 border-brand rounded-r-lg p-5 shadow-1">
            <p className="text-[length:var(--step-0)] text-muted">
              This policy explains how Muhammed Ajmal Consulting (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles your
              personal data. It is aligned to the UAE Personal Data Protection Law — Federal Decree-Law
              No. 45 of 2021 — and its Executive Regulation, Cabinet Decision No. 33 of 2024.
            </p>
          </div>

          <Section heading="What data we collect">
            <p>When you use the diagnostic, contact form, or newsletter, we may collect:</p>
            <ul className="space-y-2">
              {dataCollected.map((d) => (
                <li key={d.item} className="flex gap-3">
                  <span className="text-brand-ink font-bold mt-0.5 flex-shrink-0">•</span>
                  <span><strong className="text-ink">{d.item}.</strong> {d.detail}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section heading="Why we collect it">
            <p>
              We use your data to generate and send your diagnostic report, to respond to enquiries you
              send us, and — only if you opt in — to send occasional insights by email. We do not sell
              your data, and we do not share it for advertising.
            </p>
          </Section>

          <Section heading="Our lawful basis">
            <p>
              For the diagnostic and the newsletter, our basis is your <strong className="text-ink">consent</strong>,
              given when you submit your details. For contact enquiries, we process your data to take the
              steps you have asked us to take — namely, to respond to you. You can withdraw consent at
              any time using the contact details below.
            </p>
          </Section>

          <Section heading="Third parties who process your data">
            <p>We rely on a small number of trusted service providers to run this service:</p>
            <div className="space-y-2">
              {processors.map((p) => (
                <div key={p.name} className="bg-white border border-line rounded-lg p-4">
                  <p className="font-heading font-bold text-ink text-[length:var(--step-0)]">{p.name}</p>
                  <p className="text-[length:var(--step-0)] text-muted">{p.role}</p>
                  <p className="text-xs text-muted mt-1">{p.location}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section heading="Cross-border transfer">
            <p>
              The service providers above host data on servers outside the UAE, including in the United
              States and Europe. This means your personal data is transferred internationally. We only use
              providers that offer contractual and technical protections for the data they handle on our
              behalf, consistent with the cross-border transfer provisions of the PDPL.
            </p>
          </Section>

          <Section heading="How long we keep it">
            <p>
              We keep diagnostic and enquiry records for as long as there is a genuine prospect of working
              together, and for up to 24 months after our last contact, after which they are deleted or
              anonymised. Newsletter subscriptions are kept until you unsubscribe. You can ask us to delete
              your data sooner at any time.
            </p>
          </Section>

          <Section heading="Your rights under the PDPL">
            <p>Under the UAE Personal Data Protection Law, you have the right to:</p>
            <ul className="space-y-2">
              {rights.map((r) => (
                <li key={r} className="flex gap-3">
                  <span className="text-brand-ink font-bold mt-0.5 flex-shrink-0">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section heading="How to exercise your rights">
            <p>
              To exercise any of these rights — including access, correction, or deletion — email us at{' '}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="text-brand-ink underline hover:text-brand-ink transition-colors">
                {PRIVACY_EMAIL}
              </a>{' '}
              or use the{' '}
              <Link href="/contact" className="text-brand-ink underline hover:text-brand-ink transition-colors">
                contact form
              </Link>
              . If you subscribed to the newsletter, every email also contains a one-click unsubscribe link.
              We will respond within a reasonable time and in line with the PDPL.
            </p>
          </Section>

          <Section heading="Changes to this policy">
            <p>
              We may update this policy from time to time. When we do, we will revise the &ldquo;Last
              updated&rdquo; date at the top of this page.
            </p>
          </Section>

        </div>
      </section>
    </>
  );
}
