'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { CURRENT_FDI_QUESTION_SET } from '@/lib/fdi/config';
import type { FounderFdiReport } from '@/lib/fdi/public-report';
import { fdiBusinessDetailsSchema, fdiContactSchema } from '@/lib/fdi-server/validation';
import { cn } from '@/lib/utils';
import type { z } from 'zod';

type Stage = 'intro' | 'questions' | 'contact' | 'submitting';

/** Contact is required; the business details below it never block the result. */
const finalStepSchema = fdiContactSchema.extend(fdiBusinessDetailsSchema.shape).refine(
  (value) => value.sector !== 'other' || Boolean(value.sectorOther),
  { path: ['sectorOther'], message: 'Please describe your sector' },
);
/** Fields hold what a native select can produce ('' when untouched); the resolver hands us the cleaned values. */
type FinalStepFields = z.input<typeof finalStepSchema>;
type FinalStepValues = z.output<typeof finalStepSchema>;

const SECTOR_OPTIONS: readonly (readonly [string, string])[] = [
  ['real_estate_business_services', 'Real Estate & Business Services'],
  ['trading_distribution', 'Trading & Distribution'],
  ['construction_contracting', 'Construction & Contracting'],
  ['professional_services', 'Professional Services'],
  ['retail_ecommerce', 'Retail & E-commerce'],
  ['hospitality_fnb', 'Hospitality & F&B'],
  ['manufacturing', 'Manufacturing'],
  ['other', 'Other'],
];

const REVENUE_OPTIONS: readonly (readonly [string, string])[] = [
  ['under_1m', 'Under AED 1,000,000'],
  ['aed_1m_to_10m', 'AED 1,000,000–10,000,000'],
  ['over_10m', 'Over AED 10,000,000'],
];

const EMPLOYEE_OPTIONS: readonly (readonly [string, string])[] = [
  ['under_5', 'Under 5'],
  ['employees_5_to_50', '5–50'],
  ['over_50', 'Over 50'],
];

const OPERATING_YEAR_OPTIONS: readonly (readonly [string, string])[] = [
  ['under_3', 'Under 3 years'],
  ['years_3_or_more', '3 years or more'],
];

type Session = { readonly id: string; readonly token: string; readonly isTest: boolean };
type ApiResponse = { readonly success: boolean; readonly error?: string };
type StartResponse = ApiResponse & { readonly sessionId?: string; readonly sessionToken?: string; readonly isTest?: boolean };
type SubmitResponse = ApiResponse & { readonly report?: FounderFdiReport };

const componentLabels: Record<string, string> = {
  DS: 'Decision Speed',
  EC: 'Execution Consistency',
  OV: 'Operational Visibility',
};

function completionMsFrom(startedAt: number | null): number | undefined {
  return startedAt === null ? undefined : Math.max(0, Date.now() - startedAt);
}

async function responseJson<T extends ApiResponse>(response: Response): Promise<T> {
  const payload: unknown = await response.json().catch(() => ({ success: false, error: 'Unexpected server response.' }));
  if (!payload || typeof payload !== 'object' || !('success' in payload)) {
    return { success: false, error: 'Unexpected server response.' } as T;
  }
  return payload as T;
}

export function FdiDiagnosticFlow() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('intro');
  const [session, setSession] = useState<Session | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const question = CURRENT_FDI_QUESTION_SET.questions[currentQuestion];

  const finalForm = useForm<FinalStepFields, unknown, FinalStepValues>({
    resolver: zodResolver(finalStepSchema),
    mode: 'onTouched',
  });
  /** Only the 'other' sector needs a free-text box. useWatch keeps this compiler-safe. */
  const sector = useWatch({ control: finalForm.control, name: 'sector' });

  const saveProgress = async (payload: Record<string, unknown>) => {
    if (!session) throw new Error('The diagnostic session is missing. Start again to continue.');
    const response = await fetch(`/api/fdi/sessions/${session.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionToken: session.token, completionMs: completionMsFrom(startedAt), ...payload }),
    });
    const data = await responseJson<ApiResponse>(response);
    if (!response.ok || !data.success) throw new Error(data.error ?? 'Unable to save progress.');
  };

  const start = async () => {
    setIsWorking(true);
    setError(null);
    try {
      const response = await fetch('/api/fdi/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testMode: new URLSearchParams(window.location.search).get('testMode') === 'true' }),
      });
      const data = await responseJson<StartResponse>(response);
      if (!response.ok || !data.success || !data.sessionId || !data.sessionToken) {
        throw new Error(data.error ?? 'Unable to start the diagnostic.');
      }
      setSession({ id: data.sessionId, token: data.sessionToken, isTest: Boolean(data.isTest) });
      setStartedAt(Date.now());
      setStage('questions');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start the diagnostic.');
    } finally {
      setIsWorking(false);
    }
  };

  const handleAnswer = async (questionId: string, optionId: string) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
    setError(null);
    try {
      await saveProgress({ answers: { [questionId]: optionId } });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save that answer. Please try again.');
    }
  };

  const submit = finalForm.handleSubmit(async (values) => {
    if (!session) return;
    const { name, email, companyName, phone, ...businessDetails } = values;
    setStage('submitting');
    setIsWorking(true);
    setError(null);
    try {
      const response = await fetch('/api/fdi/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          sessionToken: session.token,
          contact: { name, email, companyName, phone },
          businessDetails,
          completionMs: completionMsFrom(startedAt),
        }),
      });
      const data = await responseJson<SubmitResponse>(response);
      if (!response.ok || !data.success || !data.report) {
        throw new Error(data.error ?? 'Unable to complete the diagnostic.');
      }
      sessionStorage.setItem('fdiFounderReport', JSON.stringify(data.report));
      router.push('/results');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to complete the diagnostic.');
      setStage('contact');
    } finally {
      setIsWorking(false);
    }
  });

  if (stage === 'intro') {
    return (
      <div className="relative flex min-h-svh items-center overflow-hidden bg-white px-5 py-8 text-ink sm:py-12">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="orb orb-electric absolute -right-32 -top-40 h-[28rem] w-[28rem]" />
          <div className="orb orb-amber absolute -bottom-40 -left-32 h-96 w-96" />
        </div>
        <section className="relative z-10 mx-auto w-full max-w-3xl text-center">
          <p className="eyebrow text-brand-ink mb-3">Business Health Check</p>
          <h1 className="font-heading font-extrabold text-[length:var(--step-4)] leading-tight text-ink">
            How much does your business still depend on you?
          </h1>
          <p className="font-body text-[length:var(--step-0)] text-muted max-w-2xl mx-auto mt-3 leading-relaxed">
            A free check of how much day-to-day operations still rely on you.
          </p>
          <p className="font-body text-[length:var(--step-0)] text-muted max-w-2xl mx-auto mt-2 leading-relaxed">
            Answer 12 questions about decision-making, execution, and operational visibility. You will receive your Founder Dependency Index and a clear next step.
          </p>
          {/* One bordered list on a phone, three cards from sm up — keeps this section inside a single mobile view. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-2 max-w-2xl mx-auto mt-4 text-left rounded-xl border border-brand/30 sm:border-0 divide-y divide-line sm:divide-y-0 overflow-hidden">
            {[
              ['12 questions', 'Four questions across each operating component'],
              ['Progress saved', 'You can leave before completion; an unfinished attempt receives no score or email'],
              ['Self-report only', 'The result identifies reported patterns. It does not diagnose root causes'],
            ].map(([title, body]) => (
              <div key={title} className="bg-white/5 px-3 py-2 sm:rounded-xl sm:border sm:border-brand/30">
                <p className="font-heading font-bold text-brand-ink text-xs">{title}</p>
                <p className="font-body text-muted text-xs leading-snug sm:mt-1">{body}</p>
              </div>
            ))}
          </div>
          {error && <p role="alert" className="mt-4 text-[length:var(--step-0)] text-danger">{error}</p>}
          <button onClick={start} disabled={isWorking} className="mt-5 min-h-12 rounded-xl bg-brand px-8 py-3 font-body text-[length:var(--step-0)] font-semibold text-white shadow-1 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-glow-electric disabled:pointer-events-none disabled:opacity-50">
            {isWorking ? 'Starting…' : 'Start the Business Health Check →'}
          </button>
          <p className="font-body text-xs text-muted mt-3 max-w-xl mx-auto leading-snug">
            This is a focused founder-dependency self-report, not a full financial, tax, legal, or business-performance audit.
          </p>
          <p className="font-body text-xs text-muted mt-2">
            <a href="/privacy" className="underline text-brand-ink hover:text-brand">Privacy Policy</a>
          </p>
        </section>
      </div>
    );
  }

  if (stage === 'contact' || stage === 'submitting') {
    const fieldClass = 'w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-brand min-h-11';
    const labelClass = 'block font-heading font-semibold text-[length:var(--step-0)] text-ink mb-1';
    const errors = finalForm.formState.errors;
    const fieldError = (message?: string) => message ? <p role="alert" className="font-body text-xs text-danger mt-1">{message}</p> : null;
    return (
      <div className="relative min-h-svh overflow-hidden bg-canvas-light px-4 py-5 sm:py-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="orb orb-electric absolute -right-32 -top-40 h-96 w-96" />
          <div className="orb orb-amber absolute -bottom-40 -left-32 h-80 w-80" />
        </div>
        <form onSubmit={submit} className="glass-panel relative z-10 mx-auto max-w-xl space-y-3 rounded-2xl p-4 sm:p-6">
          <div>
            <p className="eyebrow text-brand-ink">Your result is ready</p>
            <h1 className="mt-1 font-heading text-[length:var(--step-2)] font-extrabold text-ink">Where should we send it?</h1>
            <p className="font-body text-xs text-muted mt-1 leading-snug">Your result also appears on the next page. We use these details only to send your report and to follow up if you ask us to.</p>
          </div>
          {/* Name and company pair up even on a phone so all four required fields stay in one view. */}
          <div className="grid grid-cols-2 gap-2.5">
            <div><label className={labelClass} htmlFor="fdi-name">Your name</label><input id="fdi-name" className={fieldClass} autoComplete="name" {...finalForm.register('name')} />{fieldError(errors.name?.message)}</div>
            <div><label className={labelClass} htmlFor="fdi-company">Company name</label><input id="fdi-company" className={fieldClass} autoComplete="organization" {...finalForm.register('companyName')} />{fieldError(errors.companyName?.message)}</div>
            <div className="col-span-2 sm:col-span-1"><label className={labelClass} htmlFor="fdi-email">Email address</label><input id="fdi-email" type="email" inputMode="email" className={fieldClass} autoComplete="email" {...finalForm.register('email')} />{fieldError(errors.email?.message)}</div>
            <div className="col-span-2 sm:col-span-1"><label className={labelClass} htmlFor="fdi-phone">Mobile number</label><input id="fdi-phone" type="tel" inputMode="tel" className={fieldClass} autoComplete="tel" {...finalForm.register('phone')} />{fieldError(errors.phone?.message)}</div>
          </div>

          <div className="border-t border-line pt-3">
            <button type="button" onClick={() => setDetailsOpen((open) => !open)} aria-expanded={detailsOpen} aria-controls="fdi-business-details" className="flex w-full items-center justify-between gap-3 min-h-11 text-left font-heading text-[length:var(--step-0)] font-semibold text-ink hover:text-brand-ink transition-colors">
              <span>Add business details <span className="font-normal text-muted">— optional</span></span>
              <span aria-hidden="true" className="font-body text-[length:var(--step-0)] text-brand-ink leading-none">{detailsOpen ? '−' : '+'}</span>
            </button>
            <div id="fdi-business-details" hidden={!detailsOpen}>
              <p className="font-body text-xs text-muted leading-snug">Skip these if you prefer. They help us tailor any follow-up and never change your result.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div><label className={labelClass} htmlFor="fdi-sector">Sector</label><select id="fdi-sector" className={fieldClass} {...finalForm.register('sector', { setValueAs: (value) => value === '' ? undefined : value })}><option value="">Select…</option>{SECTOR_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                <div><label className={labelClass} htmlFor="fdi-employees">Number of employees</label><select id="fdi-employees" className={fieldClass} {...finalForm.register('employeeCount', { setValueAs: (value) => value === '' ? undefined : value })}><option value="">Select…</option>{EMPLOYEE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                <div><label className={labelClass} htmlFor="fdi-revenue">Annual revenue</label><select id="fdi-revenue" className={fieldClass} {...finalForm.register('annualRevenue', { setValueAs: (value) => value === '' ? undefined : value })}><option value="">Select…</option>{REVENUE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                <div><label className={labelClass} htmlFor="fdi-years">Years operating</label><select id="fdi-years" className={fieldClass} {...finalForm.register('operatingYears', { setValueAs: (value) => value === '' ? undefined : value })}><option value="">Select…</option>{OPERATING_YEAR_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                {sector === 'other' && <div className="sm:col-span-2"><label className={labelClass} htmlFor="fdi-sector-other">Type your sector</label><input id="fdi-sector-other" className={fieldClass} {...finalForm.register('sectorOther')} />{fieldError(errors.sectorOther?.message)}</div>}
              </div>
            </div>
          </div>

          {error && <p role="alert" className="font-body text-[length:var(--step-0)] text-danger">{error}</p>}
          <button type="submit" disabled={isWorking} className="min-h-12 w-full rounded-xl bg-brand py-3 font-body text-[length:var(--step-0)] font-semibold text-white shadow-1 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-glow-electric disabled:pointer-events-none disabled:opacity-50">{stage === 'submitting' ? 'Preparing your result…' : 'View my Founder Dependency Index →'}</button>
          <p className="font-body text-xs text-muted text-center leading-snug">By continuing, you agree to our <a href="/privacy" className="underline text-brand-ink">Privacy Policy</a>.{session?.isTest && <span className="text-brand-ink"> Marked as a test record.</span>}</p>
        </form>
      </div>
    );
  }

  const isLast = currentQuestion === CURRENT_FDI_QUESTION_SET.questions.length - 1;
  const selected = answers[question.id];
  const progress = Math.round(((currentQuestion + 1) / CURRENT_FDI_QUESTION_SET.questions.length) * 100);
  return (
    <div className="relative flex min-h-svh items-center overflow-hidden bg-canvas-light px-4 py-5 sm:py-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="orb orb-electric absolute -right-32 -top-40 h-96 w-96" />
          <div className="orb orb-amber absolute -bottom-40 -left-32 h-80 w-80" />
        </div>
      <section className="relative z-10 mx-auto w-full max-w-2xl">
        <div className="mb-3"><div className="flex justify-between font-body text-xs text-muted mb-1.5"><span>{componentLabels[question.componentKey]}</span><span>Question {currentQuestion + 1} of 12</span></div><div className="h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-gradient-to-r from-electric-700 to-electric-500 transition-[width] duration-300" style={{ width: `${progress}%` }} /></div></div>
        <div className="glass-panel rounded-2xl p-4 sm:p-6">
          <p className="eyebrow text-brand-ink">{componentLabels[question.componentKey]}</p>
          <h1 className="mt-1.5 font-heading text-[length:var(--step-1)] font-extrabold leading-snug text-ink">{question.text}</h1>
          <div className="space-y-2 mt-4">
            {question.options.map((option) => (
              <button key={option.id} type="button" aria-pressed={selected === option.id} onClick={() => void handleAnswer(question.id, option.id)} className={cn('w-full min-h-11 rounded-xl border-2 text-left px-4 py-2.5 font-body text-[length:var(--step-0)] leading-snug transition-all duration-200 ease-out', selected === option.id ? 'border-brand bg-brand-soft text-ink font-semibold shadow-1' : 'border-line bg-white text-ink hover:-translate-y-0.5 hover:border-brand hover:bg-brand-tint hover:shadow-1')}>
                {option.text}
              </button>
            ))}
          </div>
          {error && <p role="alert" className="text-[length:var(--step-0)] text-danger mt-3">{error}</p>}
          <div className="flex gap-3 mt-4">
            {currentQuestion > 0 && <button type="button" onClick={() => setCurrentQuestion((value) => value - 1)} className="min-h-11 flex-1 rounded-xl border border-line bg-white font-body text-[length:var(--step-0)] font-semibold text-ink transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand hover:text-brand-ink">← Back</button>}
            <button type="button" disabled={!selected} onClick={() => isLast ? setStage('contact') : setCurrentQuestion((value) => value + 1)} className="min-h-11 flex-1 rounded-xl bg-brand font-body text-[length:var(--step-0)] font-semibold text-white shadow-1 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-glow-electric disabled:pointer-events-none disabled:opacity-40">{isLast ? 'Continue →' : 'Next →'}</button>
          </div>
        </div>
      </section>
    </div>
  );
}
