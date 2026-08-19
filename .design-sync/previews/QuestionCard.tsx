import { QuestionCard } from "ajmal-diagnostic";
import { QUESTIONS } from "@/lib/questions";

// Imports the repo's real question bank rather than inventing copy, so the card
// stays true if the questions change. QUESTIONS[0] is the opening
// strategic-clarity question; QUESTIONS[2] opens financial visibility.
const noop = () => {};

/** The unanswered state — how every question first appears in the flow. */
export function Unanswered() {
  return (
    <QuestionCard
      question={QUESTIONS[0]}
      selectedAnswer={undefined}
      onAnswer={noop}
      dimensionLabel="Strategic Clarity"
    />
  );
}

/** An answered question. The filled dot, not colour alone, signals selection. */
export function Answered() {
  return (
    <QuestionCard
      question={QUESTIONS[0]}
      selectedAnswer="b"
      onAnswer={noop}
      dimensionLabel="Strategic Clarity"
    />
  );
}

/** A second dimension, to show the label changing with the question set. */
export function FinancialVisibility() {
  return (
    <QuestionCard
      question={QUESTIONS[2]}
      selectedAnswer="a"
      onAnswer={noop}
      dimensionLabel="Financial Visibility"
    />
  );
}
