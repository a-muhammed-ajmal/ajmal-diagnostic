'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { track } from '@vercel/analytics';
import { QUESTIONS } from '@/lib/questions';
import { DIMENSION_META } from '@/lib/scoring';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { LeadCaptureForm } from '@/components/lead/LeadCaptureForm';
import { FdiDiagnosticFlow } from '@/components/fdi/FdiDiagnosticFlow';
import { isFdiEnabled } from '@/lib/featureFlags';
import { LeadData } from '@/types';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

type Stage = 'intro' | 'quiz' | 'lead-capture' | 'submitting';

/** What the emailed report actually contains. Shown in the hero panel. */
const DELIVERABLES = [
  'Your diagnostic score',
  'Five operating dimensions compared',
  'AI-assisted 30-day and 90-day reflection plan',
  'Full report delivered to your inbox',
];

type SubmitResponse = {
  success: boolean;
  error?: string;
  results?: unknown;
};

function isSubmitResponse(value: unknown): value is SubmitResponse {
  return !!value && typeof value === 'object' && 'success' in value;
}

export default function DiagnosticPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (isFdiEnabled()) return <FdiDiagnosticFlow />;

  const question = QUESTIONS[currentQuestion];
  const dimensionLabel = DIMENSION_META[question.dimension].label;
  const selectedAnswer = answers[question.id];
  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;

  // Funnel: diagnostic start → complete → email captured → Calendly click.
  const startQuiz = () => {
    track('diagnostic_start');
    window.scrollTo(0, 0);
    setStage('quiz');
  };

  const goToLeadCapture = () => {
    track('diagnostic_complete');
    setStage('lead-capture');
  };

  const handleAnswer = (questionId: number, optionId: string) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);

    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
    }

    autoAdvanceRef.current = setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        goToLeadCapture();
      }
    }, 400);
  };

  const handleNext = () => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
    }
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      goToLeadCapture();
    }
  };

  const handleBack = () => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
    }
    setCurrentQuestion(prev => prev - 1);
  };

  const handleBackToQuiz = () => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
    }
    setCurrentQuestion(QUESTIONS.length - 1);
    setStage('quiz');
  };

  const handleLeadSubmit = async (leadData: LeadData) => {
    setIsLoading(true);
    setSubmitError(null);
    setStage('submitting');
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadData, answers }),
      });

      const payload: unknown = await response.json().catch(() => null);
      const data = isSubmitResponse(payload) ? payload : null;

      if (!response.ok) {
        throw new Error(data?.error ?? 'Unable to submit your diagnostic right now.');
      }

      if (data?.success) {
        track('email_captured');
        sessionStorage.setItem(
          'diagnosticResults',
          JSON.stringify({ results: data.results, leadData })
        );
        router.push('/results');
        return;
      }

      throw new Error(data?.error ?? 'Unable to submit your diagnostic right now.');
    } catch (error) {
      console.error(error);
      setSubmitError(
        error instanceof Error ? error.message : 'Unable to submit your diagnostic right now.'
      );
      setIsLoading(false);
      setStage('lead-capture');
    }
  };

  if (stage === 'intro') {
    return (
      <div className="bg-white">

        {/* ── HERO ────────────────────────────────────────────────── */}
        <Section width="wide" orbs className="py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <span className="mb-6 inline-block rounded-full bg-brand-soft px-4 py-2 font-heading text-xs font-bold uppercase tracking-widest text-brand-ink">
                Free · 4 Minutes · 10 Questions
              </span>
              <h1 className="mb-5 font-heading text-[length:var(--step-5)] font-extrabold leading-tight text-ink">
                Does your business run on you — or do you run your business?
              </h1>
              <p className="mb-8 max-w-xl font-body text-[length:var(--step-0)] leading-relaxed text-muted">
                Answer 10 questions for a self-reported view of how your business runs today.
                You will receive a diagnostic score and an AI-assisted reflection plan by email.
              </p>
              <Button onClick={startQuiz}>
                Start the Free Diagnostic
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <p className="mt-3 font-body text-xs text-muted">
                No account needed · No spam · Takes 4 minutes
              </p>
            </div>

            {/* What arrives in the inbox, as the hero's glass panel. */}
            <div className="lg:col-span-5">
              <div className="glass-panel rounded-2xl p-6 md:p-7">
                <p className="eyebrow mb-4 text-accent-ink">What you receive</p>
                <ul className="space-y-3.5">
                  {DELIVERABLES.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-success-soft" aria-hidden="true">
                        <Check className="h-3 w-3 text-success" strokeWidth={3} />
                      </span>
                      <span className="font-body text-[length:var(--step-0)] leading-snug text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* ── STATS BAR ───────────────────────────────────────────── */}
        <Section tone="tint" width="narrow" compact>
          <dl className="flex flex-wrap justify-center gap-10 md:gap-20">
            {[
              { n: '10', l: 'Questions' },
              { n: '5', l: 'Operating Dimensions' },
              { n: '4 min', l: 'To Your Results' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <dt className="font-heading text-[length:var(--step-4)] font-extrabold text-brand">{s.n}</dt>
                <dd className="mt-1 font-body text-xs uppercase tracking-widest text-muted">{s.l}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* ── HOW IT WORKS ────────────────────────────────────────── */}
        <Section width="narrow">
          <p className="eyebrow mb-3 text-brand-ink">How It Works</p>
          <h2 className="mb-10 font-heading text-[length:var(--step-4)] font-extrabold text-ink">
            Three steps. Four minutes.
          </h2>
          <ol className="stage-rail">
            {[
              { n: '01', title: 'Answer 10 Questions', body: 'Each question takes 30 seconds. No trick questions — just honest answers about how your business runs today.' },
              { n: '02', title: 'See Your Result', body: 'Compare your answers across five operating dimensions and identify the areas worth examining further.' },
              { n: '03', title: 'Receive Your AI-Assisted Reflection Plan', body: 'Receive practical starting points generated from your scores. The diagnostic does not establish root cause.' },
            ].map((step) => (
              <li key={step.n} className="stage-item">
                <span className="stage-marker" aria-hidden="true">{step.n}</span>
                <div className="stage-card stage-reveal card-interactive rounded-2xl border border-line bg-white p-5 shadow-1 md:p-6">
                  <p className="font-mono text-xs text-brand-ink md:hidden">{step.n}</p>
                  <h3 className="mt-1 font-heading text-[length:var(--step-1)] font-bold text-ink md:mt-0">{step.title}</h3>
                  <p className="mt-2 font-body text-[length:var(--step-0)] leading-relaxed text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* ── BOTTOM CTA ──────────────────────────────────────────── */}
        <Section tone="dark" width="wide" orbs>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="mb-3 font-heading text-[length:var(--step-4)] font-extrabold text-white">
                Ready to examine how your business runs?
              </h2>
              <p className="max-w-xl font-body text-[length:var(--step-0)] leading-relaxed text-muted-invert">
                It is free, takes four minutes, and gives you a practical view of your current self-reported operating patterns.
              </p>
            </div>
            <div className="lg:col-span-5 lg:justify-self-end">
              <Button onClick={startQuiz} variant="accent">
                Start the Free Diagnostic
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <p className="mt-3 font-body text-xs text-muted-invert">
                No account needed · No spam · Takes 4 minutes
              </p>
            </div>
          </div>
        </Section>

      </div>
    );
  }

  if (stage === 'lead-capture' || stage === 'submitting') {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas-light p-4">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="orb orb-electric absolute -right-32 -top-40 h-96 w-96" />
          <div className="orb orb-amber absolute -bottom-40 -left-32 h-80 w-80" />
        </div>
        <div className="relative z-10 w-full">
          <h1 className="sr-only">Business diagnostic — your results are ready</h1>
          <div className="max-w-md mx-auto mb-4">
            <button
              onClick={handleBackToQuiz}
              className="tap-target flex items-center gap-1 text-[length:var(--step-0)] text-muted hover:text-ink transition-colors"
            >
              ← Back to questions
            </button>
          </div>
          <LeadCaptureForm onSubmit={handleLeadSubmit} isLoading={isLoading} />
          {submitError && (
            <p role="alert" className="mx-auto mt-4 max-w-md text-center text-[length:var(--step-0)] font-medium text-danger">
              {submitError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas-light p-4">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="orb orb-electric absolute -right-32 -top-40 h-96 w-96" />
        <div className="orb orb-amber absolute -bottom-40 -left-32 h-80 w-80" />
      </div>
      <div className="relative z-10 w-full max-w-2xl">
        <h1 className="sr-only">Business diagnostic — question {currentQuestion + 1} of {QUESTIONS.length}</h1>
        <div className="mb-8">
          <ProgressBar current={currentQuestion + 1} total={QUESTIONS.length} />
        </div>
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <QuestionCard
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswer={handleAnswer}
            dimensionLabel={dimensionLabel}
          />
          <div className="mt-6 flex gap-3">
            {currentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="min-h-[48px] flex-1 rounded-xl border border-line bg-white py-3 font-body text-[length:var(--step-0)] font-semibold text-ink transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand hover:text-brand-ink"
              >
                ← Back
              </button>
            )}
            {selectedAnswer && (
              <button
                onClick={handleNext}
                className="min-h-[48px] flex-1 rounded-xl bg-brand py-3 font-body text-[length:var(--step-0)] font-semibold text-white shadow-1 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-glow-electric"
              >
                {isLastQuestion ? 'See My Results →' : 'Next →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
