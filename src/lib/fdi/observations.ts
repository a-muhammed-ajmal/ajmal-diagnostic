/**
 * Deterministic founder-facing findings approved for the FDI-1.1 Business Health Check.
 *
 * Every scored question contributes one candidate. These findings describe only
 * reported behaviour. They never determine a root cause, binding constraint,
 * intervention, qualification result, or FDI score.
 */

import type { FdiResult } from './types';

interface ObservationRule {
  readonly questionId: string;
  readonly high: string;
  readonly low: string;
}

interface Candidate {
  readonly questionId: string;
  readonly componentKey: string;
  readonly questionScore: number;
  readonly componentScore: number;
  readonly finding: string;
}

const RULES: readonly ObservationRule[] = Object.freeze([
  Object.freeze({ questionId: 'DS1', high: 'Important operating decisions slow down when you are unavailable.', low: 'Most operating decisions can continue when you are unavailable.' }),
  Object.freeze({ questionId: 'DS2', high: 'Meaningful operating authority is still concentrated with you.', low: 'Your team has meaningful authority to handle recurring operating decisions.' }),
  Object.freeze({ questionId: 'DS3', high: 'Work regularly waits for decisions that depend on you.', low: 'Founder-related decision waiting time appears relatively limited.' }),
  Object.freeze({ questionId: 'DS4', high: 'You are frequently pulled into decisions that could reasonably sit elsewhere in the business.', low: 'Unnecessary escalation to you appears relatively limited.' }),
  Object.freeze({ questionId: 'EC1', high: 'Important recurring work still depends materially on knowledge held by individuals rather than usable systems.', low: 'Critical recurring work is largely supported by documented, usable processes.' }),
  Object.freeze({ questionId: 'EC2', high: 'Delivery quality varies materially depending on who performs the work or whether you are involved.', low: 'Different capable team members generally produce a consistent standard of work.' }),
  Object.freeze({ questionId: 'EC3', high: 'Rework, correction, or re-explanation is a recurring part of execution.', low: 'Rework caused by inconsistent execution appears relatively limited.' }),
  Object.freeze({ questionId: 'EC4', high: 'Day-to-day delivery is likely to weaken when your direct supervision is removed.', low: 'Day-to-day execution appears reasonably able to maintain its standard without your direct supervision.' }),
  Object.freeze({ questionId: 'OV1', high: 'You still depend heavily on asking people to understand the current status of the business.', low: 'Important operating status is generally visible without repeatedly asking individuals for updates.' }),
  Object.freeze({ questionId: 'OV2', high: 'The information available to you is often too delayed or unreliable for clear operational visibility.', low: 'Important operating information is generally current enough to support management decisions.' }),
  Object.freeze({ questionId: 'OV3', high: 'Important problems are often becoming visible only after they have already affected operations.', low: 'Important operating problems are generally surfaced through the business before they become urgent.' }),
  Object.freeze({ questionId: 'OV4', high: 'Chasing people for updates is still a recurring part of your management workload.', low: 'You spend relatively little time chasing people for routine operating information.' }),
]);

function dependencyOrder(left: Candidate, right: Candidate): number {
  return right.questionScore - left.questionScore || right.componentScore - left.componentScore || left.questionId.localeCompare(right.questionId);
}

function positiveOrder(left: Candidate, right: Candidate): number {
  return left.questionScore - right.questionScore || left.questionId.localeCompare(right.questionId);
}

function preferComponentCoverage(candidates: readonly Candidate[], count: number): Candidate[] {
  const selected: Candidate[] = [];
  const usedComponents = new Set<string>();

  for (const candidate of candidates) {
    if (selected.length === count) break;
    if (!usedComponents.has(candidate.componentKey)) {
      selected.push(candidate);
      usedComponents.add(candidate.componentKey);
    }
  }
  for (const candidate of candidates) {
    if (selected.length === count) break;
    if (!selected.some((item) => item.questionId === candidate.questionId)) selected.push(candidate);
  }
  return selected;
}

/** Selects the approved two or three findings from a complete scored result. */
export function deriveObservations(result: FdiResult): readonly string[] {
  const componentScores = new Map(result.components.map((component) => [component.key, component.display]));
  const answers = new Map(result.answers.map((answer) => [answer.questionId, answer]));
  const candidates = RULES.map((rule) => {
    const answer = answers.get(rule.questionId);
    if (!answer) throw new Error(`Missing scored answer for approved observation rule ${rule.questionId}`);
    const componentScore = componentScores.get(answer.componentKey);
    if (componentScore === undefined) throw new Error(`Missing component score for approved observation rule ${rule.questionId}`);
    return {
      questionId: rule.questionId,
      componentKey: answer.componentKey,
      questionScore: answer.score,
      componentScore,
      finding: answer.score >= 2 ? rule.high : rule.low,
    } satisfies Candidate;
  });
  const dependency = candidates.filter((candidate) => candidate.questionScore >= 2).sort(dependencyOrder);

  if (dependency.length >= 3) return Object.freeze(preferComponentCoverage(dependency, 3).map((candidate) => candidate.finding));
  if (dependency.length === 2) return Object.freeze(dependency.map((candidate) => candidate.finding));
  if (dependency.length === 1) {
    const high = dependency[0];
    const strongestPositive = candidates.filter((candidate) => candidate.questionScore <= 1 && candidate.componentKey !== high.componentKey).sort(positiveOrder)[0];
    return Object.freeze(strongestPositive ? [high.finding, strongestPositive.finding] : [high.finding]);
  }
  return Object.freeze(
    [...new Set(candidates.map((candidate) => candidate.componentKey))]
      .map((componentKey) => candidates.filter((candidate) => candidate.componentKey === componentKey).sort(positiveOrder)[0])
      .map((candidate) => candidate.finding),
  );
}
