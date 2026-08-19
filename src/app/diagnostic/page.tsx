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

type Stage = 'intro' | 'quiz' | 'lead-capture' | 'submitting';

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
        <section className="min-h-[100svh] flex flex-col items-center justify-center px-5 py-16 md:px-8 md:py-24 text-center relative overflow-hidden">
          <div className="relative z-10 w-full">
            <span className="inline-block bg-brand-soft border border-brand/30 text-brand-ink text-xs font-heading font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              Free · 4 Minutes · 10 Questions
            </span>
            <h1 className="font-heading font-extrabold text-[length:var(--step-3)] text-ink leading-tight mb-5 max-w-3xl mx-auto">
              Does your business run on you —<br />
              or do you run your business?
            </h1>
            <p className="font-body text-muted text-[length:var(--step-0)] leading-relaxed mb-8 max-w-md mx-auto">
              Answer 10 questions for a self-reported view of how your business runs today.
              You will receive a diagnostic score and an AI-assisted reflection plan by email.
            </p>
            <div className="w-full max-w-xs mx-auto mb-8 text-left space-y-3">
              {[
                'Your diagnostic score',
                'Five operating dimensions compared',
                'AI-assisted 30-day and 90-day reflection plan',
                'Full report delivered to your inbox',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-success-soft text-success text-xs font-bold flex items-center justify-center mt-0.5">✔</span>
                  <span className="font-body text-[length:var(--step-0)] text-muted leading-snug">{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={startQuiz}
              className="w-full max-w-xs mx-auto block bg-brand text-white font-heading font-bold py-4 px-8 rounded-xl text-[length:var(--step-0)] min-h-[56px] hover:bg-brand-hover active:scale-95 transition-[background-color,transform] duration-200 shadow-1"
            >
              Start the Free Diagnostic →
            </button>
            <p className="font-body text-xs text-muted mt-3">
              No account needed · No spam · Takes 4 minutes
            </p>
          </div>
        </section>

        {/* ── STATS BAR ───────────────────────────────────────────── */}
        <section className="bg-brand-tint py-8 px-5 border-b border-line relative overflow-hidden">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 relative z-10">
            {[
              { n: '10', l: 'Questions' },
              { n: '5', l: 'Operating Dimensions' },
              { n: '4 min', l: 'To Your Results' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-heading font-bold text-[length:var(--step-3)] text-ink">{s.n}</div>
                <div className="font-body text-xs text-muted uppercase tracking-widest mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────── */}
        <section className="bg-brand-tint py-14 px-5 relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10">
            <p className="text-center text-brand-ink eyebrow mb-3">How It Works</p>
            <h2 className="text-center font-heading font-extrabold text-ink text-[length:var(--step-3)] mb-10">
              Three steps. Four minutes.
            </h2>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-0 md:gap-4">
              {[
                { n: '01', title: 'Answer 10 Questions', body: 'Each question takes 30 seconds. No trick questions — just honest answers about how your business runs today.' },
                { n: '02', title: 'See Your Result', body: 'Compare your answers across five operating dimensions and identify the areas worth examining further.' },
                { n: '03', title: 'Receive Your AI-Assisted Reflection Plan', body: 'Receive practical starting points generated from your scores. The diagnostic does not establish root cause.' },
              ].map((step, i) => (
                <div key={step.n} className="flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center max-w-xs w-full mb-8 md:mb-0 md:flex-1">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand text-white font-heading font-bold flex items-center justify-center text-[length:var(--step-0)] md:mb-4">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-ink text-[length:var(--step-0)] mb-1">{step.title}</h3>
                    <p className="font-body text-[length:var(--step-0)] text-muted leading-relaxed">{step.body}</p>
                  </div>
                  {i < 2 && <span className="hidden md:block text-brand/30 text-[length:var(--step-3)] mx-2 self-center">→</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ──────────────────────────────────────────── */}
        <section className="bg-white py-16 px-5 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-heading font-extrabold text-ink text-[length:var(--step-3)] mb-3">
              Ready to examine how your business runs?
            </h2>
            <p className="font-body text-[length:var(--step-0)] text-muted mb-8 max-w-sm mx-auto leading-relaxed">
              It is free, takes four minutes, and gives you a practical view of your current self-reported operating patterns.
            </p>
            <button
              onClick={startQuiz}
              className="w-full max-w-xs mx-auto block bg-brand text-white font-heading font-bold py-4 px-8 rounded-xl text-[length:var(--step-0)] min-h-[56px] hover:bg-brand-hover active:scale-95 transition-[background-color,transform] duration-200 shadow-1"
            >
              Start the Free Diagnostic →
            </button>
            <p className="font-body text-xs text-muted mt-3">
              No account needed · No spam · Takes 4 minutes
            </p>
          </div>
        </section>

      </div>
    );
  }

  if (stage === 'lead-capture' || stage === 'submitting') {
    return (
      <div className="min-h-screen bg-brand-tint flex items-center justify-center p-4 relative overflow-hidden">
        <div className="w-full relative z-10">
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
    <div className="min-h-screen bg-brand-tint flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-2xl relative z-10">
        <h1 className="sr-only">Business diagnostic — question {currentQuestion + 1} of {QUESTIONS.length}</h1>
        <div className="mb-8">
          <ProgressBar current={currentQuestion + 1} total={QUESTIONS.length} />
        </div>
        <div className="bg-white rounded-2xl shadow-1 border border-line p-8">
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
                className="flex-1 border border-line text-ink py-3 rounded-xl font-heading font-semibold hover:bg-brand-tint transition-colors min-h-[48px]"
              >
                ← Back
              </button>
            )}
            {selectedAnswer && (
              <button
                onClick={handleNext}
                className="flex-1 bg-brand text-white py-3 rounded-xl font-heading font-bold hover:bg-brand-hover transition-colors min-h-[48px]"
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
