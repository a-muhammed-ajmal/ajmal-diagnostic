import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: 'Manage your newsletter subscription for Muhammed Ajmal Consulting.',
  robots: { index: false },
};

const messages: Record<string, { heading: string; body: string }> = {
  success: {
    heading: 'You are unsubscribed.',
    body: 'You will no longer receive newsletter emails from us. If this was a mistake, you can subscribe again any time from the Insights page.',
  },
  invalid: {
    heading: 'This link is not valid.',
    body: 'The unsubscribe link may have expired or already been used. If you are still receiving emails you did not ask for, contact us and we will remove you.',
  },
  error: {
    heading: 'Something went wrong.',
    body: 'We could not process the request just now. Please try the link again shortly, or contact us and we will unsubscribe you manually.',
  },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const message = messages[status ?? ''] ?? messages.invalid;

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-canvas-light px-6 py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="orb orb-electric absolute -right-32 -top-40 h-[28rem] w-[28rem]" />
        <div className="orb orb-amber absolute -bottom-40 -left-32 h-96 w-96" />
      </div>
      <div className="glass-panel relative z-10 w-full max-w-md rounded-2xl p-8">
        <h1 className="mb-3 font-heading text-[length:var(--step-4)] font-extrabold text-ink">{message.heading}</h1>
        <p className="mb-7 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{message.body}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/">Back to home</Button>
          <Button href="/contact" variant="quiet">Contact us</Button>
        </div>
      </div>
    </section>
  );
}
