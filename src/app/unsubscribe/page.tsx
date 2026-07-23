import type { Metadata } from 'next';
import Link from 'next/link';

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
    <section className="min-h-[60vh] bg-ivory flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="graph-overlay" />
      <div className="max-w-md w-full text-center relative z-10 bg-white border border-navy/10 rounded-2xl shadow-sm p-8">
        <h1 className="font-heading font-extrabold text-2xl text-navy mb-3">{message.heading}</h1>
        <p className="font-body text-navy/70 text-sm leading-relaxed mb-6">{message.body}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-navy text-ivory font-heading font-bold py-3 px-6 rounded-xl text-sm hover:bg-navy/90 transition-colors min-h-[44px]"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-navy/20 text-navy font-heading font-bold py-3 px-6 rounded-xl text-sm hover:bg-ivory transition-colors min-h-[44px]"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
