/**
 * FDI scoring engine (§7).
 *
 *   Raw Component  = Q1 + Q2 + Q3 + Q4                    (0 .. rawMax)
 *   Component Score = (Raw / rawMax) * componentScale      (0 .. 100)
 *   FDI             = Σ(wᵢ · Cᵢ) / Σwᵢ                     (0 .. 100)
 *
 * At FDI-1.0's equal weights the composite is exactly (DS + EC + OV) / 3, but the
 * divisor is the weight sum, so §8's "implement as configuration, never scattered
 * constants" holds and a future reweighting needs no change here.
 *
 * ── HARD CONSTRAINTS ON THIS MODULE ──────────────────────────────────────────
 * PURE. No database calls. No AI. No network. No clock, no randomness, no
 * mutation of its inputs, no side effects of any kind. `completedAt` is stamped
 * by the caller. Enforced by purity.test.ts, which fails if this module's import
 * graph ever reaches a client library or `next/*`.
 *
 * §16 AI MAY NOT: calculate the FDI, alter a score, infer an unanswered question,
 * change a weight, change qualification, determine the binding constraint,
 * declare a root cause. Nothing in this file consults AI, and nothing may.
 *
 * §13 QUALIFICATION IS SEPARATE. This function's signature cannot accept
 * qualification data, so revenue, size, sector, age or qualification status
 * cannot increase, decrease, suppress or reinterpret an FDI even by accident.
 *
 * §12 MISSING DOES NOT EQUAL ZERO DEPENDENCY. An incomplete answer set yields no
 * FDI at all, never a composite computed over the answered subset.
 */

import { bandFor } from './bands';
import { rounderFor } from './rounding';
import type {
  AlertTier,
  ComponentResult,
  Concentration,
  FdiAnswers,
  FdiConfig,
  FdiQuestionSet,
  Question,
  ScoreOutcome,
  ScoredAnswer,
} from './types';

export interface ScoreInput {
  /**
   * §12/§18 — the version the answers were collected under. Owner-pinned
   * (answer K): this is the ONLY version key the client submits. The other three
   * are derived from the resolved config and stamped server-side.
   */
  readonly diagnosticVersion: string;
  /** questionId -> optionId. Duplicates are impossible in a map (§12). */
  readonly answers: FdiAnswers;
}

/**
 * Scores a complete answer set, or explains why it cannot.
 *
 * Returns a discriminated outcome rather than throwing: §12's four reject
 * conditions are expected inputs, not exceptional ones, and the transport layer
 * maps them to HTTP 400. A thrown error from this function means a malformed
 * CONFIG, which is a deployment defect and must not be reported as a bad request.
 *
 * Rejection precedence is deliberate and fixed: version, then unknown question
 * ids, then invalid options, then incompleteness. Malformed input is reported
 * before a merely partial answer set, so the most specific defect surfaces.
 */
export function scoreFdi(
  input: ScoreInput,
  config: FdiConfig,
  questionSet: FdiQuestionSet,
): ScoreOutcome {
  // ── Config sanity. These are deployment defects, never user input. ─────────
  if (questionSet.questionSetVersion !== config.questionSetVersion) {
    throw new Error(
      `Config mismatch: config expects question set ${config.questionSetVersion}, ` +
        `received ${questionSet.questionSetVersion}`,
    );
  }

  // ── §12 Diagnostic-version mismatch → Reject ──────────────────────────────
  if (input.diagnosticVersion !== config.diagnosticVersion) {
    return {
      ok: false,
      reason: { code: 'VERSION_MISMATCH', submitted: input.diagnosticVersion ?? null },
    };
  }

  const byId = new Map<string, Question>();
  for (const question of questionSet.questions) {
    byId.set(question.id, question);
  }

  const submittedIds = Object.keys(input.answers);

  // ── §12 Unknown question ID → Reject ──────────────────────────────────────
  const unknown = submittedIds.filter((id) => !byId.has(id));
  if (unknown.length > 0) {
    return { ok: false, reason: { code: 'UNKNOWN_QUESTION_ID', questionIds: unknown } };
  }

  // ── §12 Invalid option → Reject ───────────────────────────────────────────
  // An option is valid only within its OWN question: an id belonging to a
  // different item is rejected, not silently resolved.
  //
  // Every submitted id resolves here: the unknown-id check above returned for
  // any that did not, so the lookup is total over `submittedIds`.
  const invalid = submittedIds.filter((id) => {
    const question = byId.get(id) as Question;
    const optionId = input.answers[id];
    return !question.options.some((option) => option.id === optionId);
  });
  if (invalid.length > 0) {
    return { ok: false, reason: { code: 'INVALID_OPTION', questionIds: invalid } };
  }

  // ── §12 Any scored question unanswered → No FDI ───────────────────────────
  const missing = questionSet.questions
    .filter((question) => !Object.prototype.hasOwnProperty.call(input.answers, question.id))
    .map((question) => question.id);
  if (missing.length > 0) {
    return { ok: false, reason: { code: 'INCOMPLETE', missingQuestionIds: missing } };
  }

  // ── Scoring ───────────────────────────────────────────────────────────────
  const round = rounderFor(config.rounding);
  const rawMax = config.itemsPerComponent * config.itemScoreMax;

  // Answers are emitted in question-set order, not submission order, so the
  // stored record is byte-identical for the same responses however they arrived.
  const answers: ScoredAnswer[] = questionSet.questions.map((question) => {
    const optionId = input.answers[question.id];
    const option = question.options.find((candidate) => candidate.id === optionId);
    /* istanbul ignore next -- unreachable: invalid options rejected above */
    if (!option) {
      throw new Error(`Unresolvable option ${optionId} for question ${question.id}`);
    }
    return {
      questionId: question.id,
      componentKey: question.componentKey,
      optionId: option.id,
      score: option.score,
    };
  });

  const components: ComponentResult[] = config.components.map((component) => {
    const own = answers.filter((answer) => answer.componentKey === component.key);
    if (own.length !== config.itemsPerComponent) {
      throw new Error(
        `Config mismatch: component ${component.key} has ${own.length} items, ` +
          `config declares ${config.itemsPerComponent}`,
      );
    }
    const raw = own.reduce((total, answer) => total + answer.score, 0);
    // Single division over an integer numerator: (raw * scale) / rawMax rather
    // than (raw / rawMax) * scale. One correctly-rounded division instead of
    // two, so exactly-representable results such as 25, 50 and 75 land exactly.
    const unrounded = (raw * config.componentScale) / rawMax;
    const display = round(unrounded);
    // §10 — provisional, configurable threshold. Not a validated risk threshold.
    const alertBasis = config.alertInput === 'unrounded' ? unrounded : display;
    return {
      key: component.key,
      label: component.label,
      raw,
      rawMax,
      unrounded,
      display,
      alert: alertBasis >= config.componentAlertThreshold,
    };
  });

  // §8 — weighted mean over the UNROUNDED component values (§7).
  //
  // Accumulated in RAW units, with the normalisation deferred to a single final
  // division. Averaging the already-normalised component values instead would
  // accumulate three rounding errors before the mean, and binary64 cannot
  // represent 100/12: for 25 of the 2197 reachable answer profiles that path
  // yields 24.999999999999996 where the exact composite is 25, which under
  // `bandInput: 'unrounded'` bands the respondent Low instead of Moderate. Two
  // founders with the same total dependency would then land in different bands
  // depending only on which components carried it.
  //
  // Every component shares one rawMax (config declares a single
  // itemsPerComponent), so factoring it out is algebraically identical to
  // §7's Σ(wᵢ·Cᵢ)/Σwᵢ while staying exact for integer weights.
  let weightedRaw = 0;
  let weightSum = 0;
  for (const component of components) {
    const weight = config.weights[component.key];
    if (typeof weight !== 'number' || !Number.isFinite(weight)) {
      throw new Error(`Config mismatch: no finite weight declared for component ${component.key}`);
    }
    weightedRaw += weight * component.raw;
    weightSum += weight;
  }
  if (weightSum <= 0) {
    throw new Error('Config mismatch: component weights must sum to a positive number');
  }

  const fdiUnrounded = (weightedRaw * config.componentScale) / (weightSum * rawMax);
  const fdiDisplay = round(fdiUnrounded);

  // §9 — owner-pinned (answer G): band from the unrounded composite.
  const band = bandFor(config.bandInput === 'unrounded' ? fdiUnrounded : fdiDisplay, config);

  return {
    ok: true,
    result: {
      versions: {
        instrument: config.instrument,
        diagnostic: config.diagnosticVersion,
        questionSet: config.questionSetVersion,
        scoringModel: config.scoringModelVersion,
        bandConfig: config.bandConfigVersion,
      },
      answers,
      components,
      fdi: { unrounded: fdiUnrounded, display: fdiDisplay },
      band: { key: band.key, label: band.label, displayRange: band.displayRange },
      alerts: buildAlertTiers(components),
      concentration: buildConcentration(components),
    },
  };
}

/**
 * §10 — every component at or above the threshold, grouped into tiers ordered by
 * score DESCENDING (owner-pinned answer L).
 *
 * Tied components share one tier and are displayed together with no further
 * ordering, the same treatment §11 requires for concentration. Order within a
 * tier is config declaration order: a deterministic serialisation order for a
 * group shown together, never a ranking and never a tie-break.
 *
 * Grouping compares RAW sums rather than normalised floats. Raw → normalised is
 * strictly monotone and every component shares the same rawMax (asserted by the
 * config integrity test), so raw comparison is mathematically identical to
 * comparing component scores while being exact rather than float-sensitive.
 */
function buildAlertTiers(components: readonly ComponentResult[]): AlertTier[] {
  const alerted = components.filter((component) => component.alert);
  const distinctRaw = [...new Set(alerted.map((component) => component.raw))].sort((a, b) => b - a);

  return distinctRaw.map((raw) => {
    const tier = alerted.filter((component) => component.raw === raw);
    return {
      raw,
      unrounded: tier[0].unrounded,
      display: tier[0].display,
      components: tier.map((component) => ({ key: component.key, label: component.label })),
    };
  });
}

/**
 * §11 — the highest component is the dependency concentration.
 *
 * If two or three components tie at the highest value, ALL of them are returned.
 * There is no source-order, array-position or alphabetical tie-break: the caller
 * receives the full set and must display all of it.
 *
 * This is never the binding constraint, the root cause, or the primary business
 * constraint. Those require the Audit (§11).
 */
function buildConcentration(components: readonly ComponentResult[]): Concentration {
  const highestRaw = components.reduce(
    (highest, component) => (component.raw > highest ? component.raw : highest),
    Number.NEGATIVE_INFINITY,
  );
  const tied = components.filter((component) => component.raw === highestRaw);

  return {
    componentKeys: tied.map((component) => component.key),
    labels: tied.map((component) => component.label),
    raw: highestRaw,
    unrounded: tied[0].unrounded,
    display: tied[0].display,
  };
}
