/**
 * Test-only helpers. Not imported by any application module.
 *
 * The point of these helpers is that no test ever hardcodes an option id or a
 * derived instrument constant. Tests state the RAW component score they want and
 * the helper resolves it against the question set, so the suite keeps passing if
 * option ids change and keeps failing if the scoring maths changes.
 */

import type { FdiConfig, FdiQuestionSet } from './types';

/** Splits a target raw total across a component's items, greedily filling each to max. */
function distribute(total: number, items: number, maxPerItem: number, minPerItem: number): number[] {
  if (total < items * minPerItem || total > items * maxPerItem) {
    throw new Error(`Raw total ${total} is not reachable with ${items} items`);
  }
  const out: number[] = [];
  let remaining = total;
  for (let i = 0; i < items; i += 1) {
    const itemsLeftAfterThis = items - i - 1;
    const take = Math.min(maxPerItem, remaining - itemsLeftAfterThis * minPerItem);
    out.push(take);
    remaining -= take;
  }
  return out;
}

/**
 * Builds an answer map hitting an exact RAW score per component.
 *
 * @param targets raw component totals, e.g. { DS: 12, EC: 0, OV: 0 }
 */
export function answersForRaw(
  config: FdiConfig,
  questionSet: FdiQuestionSet,
  targets: Readonly<Record<string, number>>,
): Record<string, string> {
  const answers: Record<string, string> = {};

  for (const component of config.components) {
    const target = targets[component.key];
    if (typeof target !== 'number') {
      throw new Error(`No raw target supplied for component ${component.key}`);
    }
    const questions = questionSet.questions.filter((q) => q.componentKey === component.key);
    const perItem = distribute(
      target,
      questions.length,
      config.itemScoreMax,
      config.itemScoreMin,
    );

    questions.forEach((question, index) => {
      const wanted = perItem[index];
      const option = question.options.find((candidate) => candidate.score === wanted);
      if (!option) {
        throw new Error(`Question ${question.id} has no option scoring ${wanted}`);
      }
      answers[question.id] = option.id;
    });
  }

  return answers;
}

/** Builds an answer map where every item is answered with the same score. */
export function answersAllScoring(
  config: FdiConfig,
  questionSet: FdiQuestionSet,
  score: number,
): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const question of questionSet.questions) {
    const option = question.options.find((candidate) => candidate.score === score);
    if (!option) {
      throw new Error(`Question ${question.id} has no option scoring ${score}`);
    }
    answers[question.id] = option.id;
  }
  return answers;
}

/** The raw component total that produces an exact normalised component value. */
export function rawForComponentValue(config: FdiConfig, value: number): number {
  const rawMax = config.itemsPerComponent * config.itemScoreMax;
  const raw = (value / config.componentScale) * rawMax;
  if (!Number.isInteger(raw)) {
    throw new Error(`Component value ${value} is not exactly reachable`);
  }
  return raw;
}

/** Rebuilds an object with its keys in reverse insertion order. */
export function withReversedKeyOrder<T>(input: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const key of Object.keys(input).reverse()) {
    out[key] = input[key];
  }
  return out;
}
