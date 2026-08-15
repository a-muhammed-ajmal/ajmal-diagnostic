'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FDI_1_0_QUESTIONS } from '@/lib/fdi/config';
import type { FounderFdiReport } from '@/lib/fdi/public-report';
import { fdiContactSchema, fdiQualificationSchema, type FdiContact, type FdiQualificationValues } from '@/lib/fdi-server/validation';
import { cn } from '@/lib/utils';

type Stage = 'intro' | 'qualification' | 'questions' | 'contact' | 'submitting';

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
  const searchParams = useSearchParams();
  const [stage, setStage] = useState<Stage>('intro');
  const [session, setSession] = useState<Session | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const question = FDI_1_0_QUESTIONS.questions[currentQuestion];

  const qualificationForm = useForm<FdiQualificationValues>({
    resolver: zodResolver(fdiQualificationSchema),
    mode: 'onTouched',
  });
  const contactForm = useForm<FdiContact>({
    resolver: zodResolver(fdiContactSchema),
    mode: 'onTouched',
  });

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
        body: JSON.stringify({ testMode: searchParams.get('testMode') === 'true' }),
      });
      const data = await responseJson<StartResponse>(response);
      if (!response.ok || !data.success || !data.sessionId || !data.sessionToken) {
        throw new Error(data.error ?? 'Unable to start the diagnostic.');
      }
      setSession({ id: data.sessionId, token: data.sessionToken, isTest: Boolean(data.isTest) });
      setStartedAt(Date.now());
      setStage('qualification');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start the diagnostic.');
    } finally {
      setIsWorking(false);
    }
  };

  const proceedFromQualification = qualificationForm.handleSubmit(async (values) => {
    setIsWorking(true);
    setError(null);
    try {
      await saveProgress({ qualification: values });
      setStage('questions');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save qualification details.');
    } finally {
      setIsWorking(false);
    }
  });

  const handleAnswer = async (questionId: string, optionId: string) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
    setError(null);
    try {
      await saveProgress({ answers: { [questionId]: optionId } });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save that answer. Please try again.');
    }
  };

  const submit = contactForm.handleSubmit(async (contact) => {
    if (!session) return;
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
          contact,
          completionMs: completionMsFrom(startedAt),
        }),
      });
      const data = await responseJson<SubmitResponse>(response);
      if (!response.ok || !data.success || !data.report) {
        throw new Error(data.error ?? 'Unable to complete the diagnostic.');
      }
      sessionStorage.setItem('fdiFounderReport', JSON.stringify(data.report));
      router.push('/results/fdi');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to complete the diagnostic.');
      setStage('contact');
    } finally {
      setIsWorking(false);
    }
  });

  if (stage === 'intro') {
    return (
      <main className="min-h-screen bg-navy text-ivory flex items-center px-5 py-16 relative overflow-hidden">
        <div className="graph-overlay-dark" />
        <section className="relative z-10 w-full max-w-3xl mx-auto text-center">
          <p className="eyebrow text-gold mb-4">Private diagnostic preview</p>
          <h1 className="font-heading font-extrabold text-[length:var(--step-3)] leading-tight text-white">
            How dependent is your business on you?
          </h1>
          <p className="font-body text-ivory/75 max-w-2xl mx-auto mt-5 leading-relaxed">
            Answer 12 questions about decision-making, execution, and operational visibility. You will receive a deterministic Founder Dependency Index and a clear Audit next step.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mt-8 text-left">
            {[
              ['12 questions', 'Four questions across each operating component.'],
              ['Progress saved', 'You can leave before completion; an unfinished attempt receives no score or email.'],
              ['Self-report only', 'The result identifies reported patterns. It does not diagnose root causes.'],
            ].map(([title, body]) => (
              <div key={title} className="border border-gold/25 bg-white/5 rounded-xl p-4">
                <p className="font-heading font-bold text-gold text-sm">{title}</p>
                <p className="font-body text-ivory/70 text-xs leading-relaxed mt-2">{body}</p>
              </div>
            ))}
          </div>
          {error && <p role="alert" className="mt-5 text-sm text-gold">{error}</p>}
          <button onClick={start} disabled={isWorking} className="mt-8 bg-gold text-navy font-heading font-bold rounded-xl px-8 py-4 min-h-[52px] hover:bg-gold-bright disabled:opacity-50 transition-colors">
            {isWorking ? 'Starting…' : 'Start Diagnostic →'}
          </button>
        </section>
      </main>
    );
  }

  if (stage === 'qualification') {
    const fieldClass = 'w-full rounded-lg border border-navy/20 bg-white px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold min-h-[48px]';
    const labelClass = 'block font-heading text-sm font-semibold text-navy mb-1';
    const saveOnBlur = () => {
      const values = qualificationForm.getValues();
      void saveProgress({ qualification: Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined && value !== '')) }).catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to save progress.'));
    };
    return (
      <main className="min-h-screen bg-ivory px-4 py-10 relative overflow-hidden">
        <div className="graph-overlay" />
        <form onSubmit={proceedFromQualification} className="relative z-10 max-w-2xl mx-auto bg-white border border-navy/10 shadow-sm rounded-2xl p-6 md:p-8 space-y-5">
          <div>
            <p className="eyebrow text-gold-ink">Before the questions</p>
            <h1 className="font-heading font-extrabold text-navy text-2xl mt-2">A few details about the business</h1>
            <p className="font-body text-sm text-navy/60 mt-2">These details are used for consultant-only commercial qualification. They never change your FDI result.</p>
            {session?.isTest && <p className="font-body text-xs text-gold-ink mt-3">This session is explicitly marked as a test record.</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelClass} htmlFor="fdi-country">Is the business based in the UAE?</label><select id="fdi-country" className={fieldClass} {...qualificationForm.register('country', { onBlur: saveOnBlur })}><option value="">Select…</option><option value="uae">Yes</option><option value="other">No</option></select></div>
            <div><label className={labelClass} htmlFor="fdi-founder-led">Is the business founder-led?</label><select id="fdi-founder-led" className={fieldClass} {...qualificationForm.register('founderLed', { setValueAs: (value) => value === '' ? undefined : value === 'yes', onBlur: saveOnBlur })}><option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option></select></div>
            <div><label className={labelClass} htmlFor="fdi-revenue">Annual revenue</label><select id="fdi-revenue" className={fieldClass} {...qualificationForm.register('annualRevenue', { onBlur: saveOnBlur })}><option value="">Select…</option><option value="under_1m">Under AED 1,000,000</option><option value="aed_1m_to_10m">AED 1,000,000–10,000,000</option><option value="over_10m">Over AED 10,000,000</option></select></div>
            <div><label className={labelClass} htmlFor="fdi-employees">Number of employees</label><select id="fdi-employees" className={fieldClass} {...qualificationForm.register('employeeCount', { onBlur: saveOnBlur })}><option value="">Select…</option><option value="under_5">Under 5</option><option value="employees_5_to_50">5–50</option><option value="over_50">Over 50</option></select></div>
            <div><label className={labelClass} htmlFor="fdi-years">How long has the business operated?</label><select id="fdi-years" className={fieldClass} {...qualificationForm.register('operatingYears', { onBlur: saveOnBlur })}><option value="">Select…</option><option value="under_3">Under 3 years</option><option value="years_3_or_more">3 years or more</option></select></div>
            <div><label className={labelClass} htmlFor="fdi-authority">Can you personally approve operating changes?</label><select id="fdi-authority" className={fieldClass} {...qualificationForm.register('singleDecisionAuthority', { setValueAs: (value) => value === '' ? undefined : value === 'yes', onBlur: saveOnBlur })}><option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option></select></div>
            <div className="sm:col-span-2"><label className={labelClass} htmlFor="fdi-audit-info">Would you share relevant operational information for an Audit if appropriate?</label><select id="fdi-audit-info" className={fieldClass} {...qualificationForm.register('willingToShareOperationalInformation', { setValueAs: (value) => value === '' ? undefined : value === 'yes', onBlur: saveOnBlur })}><option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option></select></div>
            <div><label className={labelClass} htmlFor="fdi-primary-sector">Primary sector</label><select id="fdi-primary-sector" className={fieldClass} {...qualificationForm.register('primarySector', { onBlur: saveOnBlur })}><option value="">Select…</option><option value="real_estate_business_services">Real Estate and Business Services</option><option value="trading_distribution">Trading and Distribution</option><option value="construction_contracting">Construction and Contracting</option><option value="professional_services">Professional Services</option><option value="other">Other</option></select></div>
            <div><label className={labelClass} htmlFor="fdi-secondary-sector">Secondary sector <span className="font-normal text-navy/40">(optional)</span></label><input id="fdi-secondary-sector" className={fieldClass} {...qualificationForm.register('secondarySector', { onBlur: saveOnBlur })} /></div>
            <div className="sm:col-span-2"><label className={labelClass} htmlFor="fdi-other-sector">Other sector <span className="font-normal text-navy/40">(optional)</span></label><input id="fdi-other-sector" className={fieldClass} {...qualificationForm.register('otherSector', { onBlur: saveOnBlur })} /></div>
          </div>
          {error && <p role="alert" className="text-sm text-crimson">{error}</p>}
          <button type="submit" disabled={isWorking} className="w-full bg-navy text-ivory rounded-xl min-h-[52px] py-3 font-heading font-bold hover:bg-navy/90 disabled:opacity-50 transition-colors">Continue to the 12 questions →</button>
        </form>
      </main>
    );
  }

  if (stage === 'contact' || stage === 'submitting') {
    const inputClass = 'w-full rounded-lg border border-navy/20 bg-white px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold min-h-[48px]';
    return (
      <main className="min-h-screen bg-ivory px-4 py-10 relative overflow-hidden">
        <div className="graph-overlay" />
        <form onSubmit={submit} className="relative z-10 max-w-xl mx-auto bg-white border border-navy/10 shadow-sm rounded-2xl p-6 md:p-8 space-y-5">
          <div><p className="eyebrow text-gold-ink">Your result is ready</p><h1 className="font-heading font-extrabold text-navy text-2xl mt-2">Where should we send it?</h1><p className="font-body text-sm text-navy/60 mt-2">Your result is also shown on the next page. We use these details only to deliver your report and follow up on an Audit if you ask us to.</p></div>
          <div><label className="block font-heading font-semibold text-sm text-navy mb-1" htmlFor="fdi-name">Name</label><input id="fdi-name" className={inputClass} autoComplete="name" {...contactForm.register('name')} /></div>
          <div><label className="block font-heading font-semibold text-sm text-navy mb-1" htmlFor="fdi-email">Work email</label><input id="fdi-email" type="email" className={inputClass} autoComplete="email" {...contactForm.register('email')} /></div>
          <div><label className="block font-heading font-semibold text-sm text-navy mb-1" htmlFor="fdi-company">Company</label><input id="fdi-company" className={inputClass} autoComplete="organization" {...contactForm.register('companyName')} /></div>
          <div><label className="block font-heading font-semibold text-sm text-navy mb-1" htmlFor="fdi-phone">Phone <span className="font-normal text-navy/40">(optional)</span></label><input id="fdi-phone" type="tel" className={inputClass} autoComplete="tel" {...contactForm.register('phone')} /></div>
          {error && <p role="alert" className="text-sm text-crimson">{error}</p>}
          <button type="submit" disabled={isWorking} className="w-full bg-gold text-navy rounded-xl min-h-[52px] py-3 font-heading font-bold hover:bg-gold-bright disabled:opacity-50 transition-colors">{stage === 'submitting' ? 'Preparing your result…' : 'View my FDI result →'}</button>
          <p className="font-body text-xs text-navy/45 text-center">By continuing you agree to our <a href="/privacy" className="underline text-gold-ink">Privacy Policy</a>.</p>
        </form>
      </main>
    );
  }

  const isLast = currentQuestion === FDI_1_0_QUESTIONS.questions.length - 1;
  const selected = answers[question.id];
  const progress = Math.round(((currentQuestion + 1) / FDI_1_0_QUESTIONS.questions.length) * 100);
  return (
    <main className="min-h-screen bg-ivory px-4 py-10 flex items-center relative overflow-hidden">
      <div className="graph-overlay" />
      <section className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="mb-6"><div className="flex justify-between font-body text-sm text-navy/60 mb-2"><span>{componentLabels[question.componentKey]}</span><span>Question {currentQuestion + 1} of 12</span></div><div className="h-2 rounded-full bg-line overflow-hidden"><div className="h-full rounded-full bg-gold transition-[width] duration-300" style={{ width: `${progress}%` }} /></div></div>
        <div className="bg-white border border-navy/10 shadow-sm rounded-2xl p-6 md:p-8">
          <p className="eyebrow text-gold-ink">{componentLabels[question.componentKey]}</p>
          <h1 className="font-heading font-extrabold text-navy text-xl md:text-2xl leading-relaxed mt-3">{question.text}</h1>
          <div className="space-y-3 mt-7">
            {question.options.map((option) => (
              <button key={option.id} type="button" onClick={() => void handleAnswer(question.id, option.id)} className={cn('w-full min-h-[56px] rounded-xl border-2 text-left px-5 py-4 font-body transition-colors', selected === option.id ? 'border-navy bg-navy/5 text-navy font-medium' : 'border-line bg-white text-navy/80 hover:border-gold hover:bg-ivory')}>
                {option.text}
              </button>
            ))}
          </div>
          {error && <p role="alert" className="text-sm text-crimson mt-4">{error}</p>}
          <div className="flex gap-3 mt-7">
            {currentQuestion > 0 && <button type="button" onClick={() => setCurrentQuestion((value) => value - 1)} className="flex-1 min-h-[48px] rounded-xl border border-navy/20 text-navy font-heading font-semibold hover:bg-ivory">← Back</button>}
            <button type="button" disabled={!selected} onClick={() => isLast ? setStage('contact') : setCurrentQuestion((value) => value + 1)} className="flex-1 min-h-[48px] rounded-xl bg-navy text-ivory font-heading font-bold hover:bg-navy/90 disabled:opacity-40">{isLast ? 'Continue →' : 'Next →'}</button>
          </div>
        </div>
      </section>
    </main>
  );
}
