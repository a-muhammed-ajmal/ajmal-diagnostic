/**
 * Config + question-set integrity checks.
 *
 * These guard the assumptions the engine relies on. Several are load-bearing:
 *
 *  · Bands must start at 0 and ascend, or `bandFor` is not total over [0, scale]
 *    and a real score could fall into no band (owner-pinned answer I).
 *  · Every component must have the SAME item count, because `buildAlertTiers`
 *    and `buildConcentration` compare raw sums instead of normalised floats.
 *    Equal rawMax makes that exactly equivalent to comparing component scores
 *    while staying float-exact. Unequal item counts would silently break it.
 *  · Every item must carry exactly one option per score in [min, max], or the
 *    instrument cannot express its full range (§3).
 *  · Options must ascend by score, because §17 fixes them as an ordered
 *    low-to-high dependency scale that must stay logically sequenced.
 *
 * Returns a list of problems rather than throwing, so a test can report all of
 * them at once instead of one per run.
 */

import type { FdiConfig, FdiQuestionSet } from './types';

export function validateVersion(config: FdiConfig, questionSet: FdiQuestionSet): string[] {
  const problems: string[] = [];

  if (questionSet.questionSetVersion !== config.questionSetVersion) {
    problems.push(
      `question set version ${questionSet.questionSetVersion} does not match config ${config.questionSetVersion}`,
    );
  }

  // ── Components and weights ────────────────────────────────────────────────
  const componentKeys = config.components.map((component) => component.key);
  if (new Set(componentKeys).size !== componentKeys.length) {
    problems.push('component keys are not unique');
  }
  const weightKeys = Object.keys(config.weights);
  if (new Set(weightKeys).size !== componentKeys.length ||
      !componentKeys.every((key) => weightKeys.includes(key))) {
    problems.push(
      `weights [${weightKeys.join(', ')}] do not correspond 1:1 to components [${componentKeys.join(', ')}]`,
    );
  }
  const weightSum = componentKeys.reduce((total, key) => total + (config.weights[key] ?? 0), 0);
  if (!(weightSum > 0)) {
    problems.push('component weights must sum to a positive number');
  }

  // ── Instrument structure ──────────────────────────────────────────────────
  if (config.itemScoreMax <= config.itemScoreMin) {
    problems.push('itemScoreMax must exceed itemScoreMin');
  }
  if (config.itemsPerComponent <= 0) {
    problems.push('itemsPerComponent must be positive');
  }
  if (config.componentScale <= 0) {
    problems.push('componentScale must be positive');
  }

  // ── Questions ─────────────────────────────────────────────────────────────
  const ids = questionSet.questions.map((question) => question.id);
  if (new Set(ids).size !== ids.length) {
    problems.push('question ids are not unique');
  }

  const expectedTotal = config.components.length * config.itemsPerComponent;
  if (questionSet.questions.length !== expectedTotal) {
    problems.push(
      `question set has ${questionSet.questions.length} items, config implies ${expectedTotal}`,
    );
  }

  const expectedScores = Array.from(
    { length: config.itemScoreMax - config.itemScoreMin + 1 },
    (_, index) => config.itemScoreMin + index,
  );

  for (const component of config.components) {
    const own = questionSet.questions.filter((question) => question.componentKey === component.key);
    if (own.length !== config.itemsPerComponent) {
      problems.push(
        `component ${component.key} has ${own.length} items, config declares ${config.itemsPerComponent}`,
      );
    }
  }

  const knownComponents = new Set(componentKeys);
  const optionIds = new Set<string>();
  for (const question of questionSet.questions) {
    if (!knownComponents.has(question.componentKey)) {
      problems.push(`question ${question.id} references unknown component ${question.componentKey}`);
    }
    if (question.text.trim().length === 0) {
      problems.push(`question ${question.id} has empty text`);
    }

    const scores = question.options.map((option) => option.score);

    if (question.options.length !== expectedScores.length) {
      problems.push(
        `question ${question.id} has ${question.options.length} options, expected ${expectedScores.length}`,
      );
    }
    // Exactly one option per score in the range (§3).
    for (const expected of expectedScores) {
      if (scores.filter((score) => score === expected).length !== 1) {
        problems.push(`question ${question.id} does not have exactly one option scoring ${expected}`);
      }
    }
    // §17 — ordered low -> high dependency; never randomised.
    for (let i = 1; i < scores.length; i += 1) {
      if (scores[i] <= scores[i - 1]) {
        problems.push(`question ${question.id} options are not in ascending dependency order`);
        break;
      }
    }
    for (const option of question.options) {
      if (option.text.trim().length === 0) {
        problems.push(`question ${question.id} option ${option.id} has empty text`);
      }
      if (optionIds.has(option.id)) {
        problems.push(`option id ${option.id} is not globally unique`);
      }
      optionIds.add(option.id);
    }
  }

  // ── Bands (§9, owner-pinned answer I) ─────────────────────────────────────
  if (config.bands.length === 0) {
    problems.push('no bands configured');
  } else {
    if (config.bands[0].minInclusive !== 0) {
      problems.push(
        `lowest band starts at ${config.bands[0].minInclusive}, must start at 0 for band lookup to be total`,
      );
    }
    for (let i = 1; i < config.bands.length; i += 1) {
      if (config.bands[i].minInclusive <= config.bands[i - 1].minInclusive) {
        problems.push('bands are not ordered strictly ascending by minInclusive');
        break;
      }
    }
    for (const band of config.bands) {
      if (band.minInclusive > config.componentScale) {
        problems.push(`band ${band.key} starts above the scale maximum`);
      }
    }
    const bandKeys = config.bands.map((band) => band.key);
    if (new Set(bandKeys).size !== bandKeys.length) {
      problems.push('band keys are not unique');
    }
  }

  // ── Alert threshold (§10) ─────────────────────────────────────────────────
  if (config.componentAlertThreshold < 0 || config.componentAlertThreshold > config.componentScale) {
    problems.push('componentAlertThreshold is outside [0, componentScale]');
  }

  // ── Presentation (§9) ─────────────────────────────────────────────────────
  if (config.presentationTemplate.includes('%')) {
    problems.push(
      "presentationTemplate contains '%'; an index score must never be rendered as a percentage",
    );
  }
  for (const placeholder of ['{display}', '{scaleMax}', '{bandLabel}']) {
    if (!config.presentationTemplate.includes(placeholder)) {
      problems.push(`presentationTemplate is missing ${placeholder}`);
    }
  }

  return problems;
}
