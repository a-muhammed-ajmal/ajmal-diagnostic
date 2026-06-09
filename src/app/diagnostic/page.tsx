'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/lib/questions';
import { DIMENSION_META } from '@/lib/scoring';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { LeadCaptureForm } from '@/components/lead/LeadCaptureForm';
import { LeadData } from '@/types';

type Stage = 'quiz' | 'lead-capture' | 'submitting';

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
  const [stage, setStage] = useState<Stage>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = QUESTIONS[currentQuestion];
  const dimensionLabel = DIMENSION_META[question.dimension].label;
  const selectedAnswer = answers[question.id];
  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;

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
        setStage('lead-capture');
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
      setStage('lead-capture');
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

  if (stage === 'lead-capture' || stage === 'submitting') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="graph-overlay" />
        <div className="w-full relative z-10">
          <div className="max-w-md mx-auto mb-4">
            <button
              onClick={handleBackToQuiz}
              className="flex items-center gap-1 text-sm text-navy/50 hover:text-navy transition-colors"
            >
              ← Back to questions
            </button>
          </div>
          <LeadCaptureForm onSubmit={handleLeadSubmit} isLoading={isLoading} />
          {submitError && (
            <p className="mx-auto mt-4 max-w-md text-center text-sm font-medium text-crimson">
              {submitError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="graph-overlay" />
      <div className="w-full max-w-2xl relative z-10">
        <div className="mb-8">
          <ProgressBar current={currentQuestion + 1} total={QUESTIONS.length} />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-8">
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
                className="flex-1 border border-navy/20 text-navy py-3 rounded-xl font-heading font-semibold hover:bg-ivory transition-colors min-h-[48px]"
              >
                ← Back
              </button>
            )}
            {selectedAnswer && (
              <button
                onClick={handleNext}
                className="flex-1 bg-navy text-ivory py-3 rounded-xl font-heading font-bold hover:bg-navy/90 transition-colors min-h-[48px]"
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