import Link from 'next/link';

type CTASectionProps = {
  email?: string;
};

export function CTASection({ email }: CTASectionProps) {
  return (
    <section className="rounded-lg bg-slate-950 p-6 text-white">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Your detailed report is on its way</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            {email
              ? `A copy has been sent to ${email}.`
              : 'A copy has been sent to the email address you provided.'}
            {' '}Use these priorities to decide where leadership attention should go first.
          </p>
        </div>
        <Link
          href="/diagnostic"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200"
        >
          Retake diagnostic
        </Link>
      </div>
    </section>
  );
}
