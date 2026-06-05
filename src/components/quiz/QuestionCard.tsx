'use client';
import { Question } from '@/types';
import { OptionButton } from './OptionButton';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | undefined;
  onAnswer: (questionId: number, optionId: string) => void;
  dimensionLabel: string;
}

export function QuestionCard({ question, selectedAnswer, onAnswer, dimensionLabel }: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="mb-2">
        <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
          {dimensionLabel}
        </span>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
        {question.text}
      </h2>
      <div className="space-y-3">
        {question.options.map(option => (
          <OptionButton
            key={option.id}
            optionId={option.id}
            text={option.text}
            selected={selectedAnswer === option.id}
            onSelect={(id) => onAnswer(question.id, id)}
          />
        ))}
      </div>
    </motion.div>
  );
}
