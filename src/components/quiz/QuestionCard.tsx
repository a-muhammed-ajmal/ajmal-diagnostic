'use client';
import { Question } from '@/types';
import { OptionButton } from './OptionButton';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | undefined;
  onAnswer: (questionId: number, optionId: string) => void;
  dimensionLabel: string;
}

export function QuestionCard({
  question,
  selectedAnswer,
  onAnswer,
  dimensionLabel,
}: QuestionCardProps) {
  return (
    <div className="w-full animate-fade-in">
      <div className="mb-2">
        <span className="text-xs font-heading font-semibold tracking-widest text-brand-ink uppercase">
          {dimensionLabel}
        </span>
      </div>

      <h2 className="text-[length:var(--step-2)] font-heading font-semibold text-ink mb-6 leading-relaxed">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map(option => (
          <OptionButton
            key={option.id}
            optionId={option.id}
            text={option.text}
            selected={selectedAnswer === option.id}
            onSelect={id => onAnswer(question.id, id)}
          />
        ))}
      </div>
    </div>
  );
}
