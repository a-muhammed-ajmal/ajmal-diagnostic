'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/lib/questions';
import { DIMENSION_META } from '@/lib/scoring';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { LeadCaptureForm } from '@/components/lead/LeadCaptureForm';
import { LeadData } from '@/types';

type Stage = 'quiz' | 'lead-capture' | 'submitting';

export default function DiagnosticPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const dimensionLabel = DIMENSION_META[question.dimension].label;
  const selectedAnswer = answers[question.id];

  const handleAnswer = (questionId: number, optionId: string) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);

    // Auto-advance after 400ms
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setStage('lead-capture');
      }
    }, 400);
  };

  const handleLeadSubmit = async (leadData: LeadData) => {
    setIsLoading(true);
    setStage('submitting');
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadData, answers })
      });
      const data = await response.json();
      if (data.success) {
        // Store results in sessionStorage for results page
        sessionStorage.setItem('diagnosticResults', JSON.stringify({
          results: data.results,
          leadData
        }));
        router.push('/results');
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setStage('lead-capture');
    }
  };

  if (stage === 'lead-capture' || stage === 'submitting') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <LeadCaptureForm onSubmit={handleLeadSubmit} isLoading={isLoading} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <ProgressBar current={currentQuestion + 1} total={QUESTIONS.length} />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <QuestionCard
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswer={handleAnswer}
            dimensionLabel={dimensionLabel}
          />
          {selectedAnswer && currentQuestion < QUESTIONS.length - 1 && (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Next Question →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
