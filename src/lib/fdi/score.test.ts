/**
 * FDI-1.0 scoring engine — §19 required automated tests.
 *
 * Tests 1–16 and 20 live here. Tests 17–19 (band boundaries) are in bands.test.ts
 * because, as established during design, the values 24, 49 and 74 are NOT
 * reachable from any valid twelve-answer set: every composite is 25·s/9 for an
 * integer s in 0..36. They are therefore direct unit tests of `bandFor`, with
 * end-to-end companions at s = 9, 18 and 27 which land on 25, 50 and 75 exactly.
 *
 * No test hardcodes an option id or a derived instrument constant. Where the
 * SPECIFICATION fixes an expected outcome (FDI 0, 100, 33) that literal is the
 * assertion target, which is the point of the test.
 */

import { scoreFdi } from './score';
import { bandFor } from './bands';
import { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS, resolveVersion } from './config';
import { httpStatusForRejection } from './rejection';
import { buildReport } from './report';
import { evaluateQualification, type QualificationInput } from './qualification';
import {
  answersAllScoring,
  answersForRaw,
  rawForComponentValue,
  withReversedKeyOrder,
} from './test-support';
import type { FdiAnswers, FdiResult } from './types';

const config = FDI_1_0_CONFIG;
const questionSet = FDI_1_0_QUESTIONS;
const VERSION = config.diagnosticVersion;
const RAW_MAX = config.itemsPerComponent * config.itemScoreMax;
const QUALIFIED_PRIMARY: QualificationInput = {
  annualRevenue: 'aed_1m_to_10m',
  employeeCount: 'employees_5_to_50',
  operatingYears: 'years_3_or_more',
  sector: 'real_estate_business_services',
};

function score(answers: FdiAnswers, version: string = VERSION) {
  return scoreFdi({ diagnosticVersion: version, answers }, config, questionSet);
}

function scoreOk(answers: FdiAnswers): FdiResult {
  const outcome = score(answers);
  if (!outcome.ok) {
    throw new Error(`Expected a score, got rejection ${outcome.reason.code}`);
  }
  return outcome.result;
}

function component(result: FdiResult, key: string) {
  const found = result.components.find((c) => c.key === key);
  if (!found) throw new Error(`No component ${key}`);
  return found;
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 1 — All answers = 0 → FDI 0
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 1 — all answers at the minimum', () => {
  it('produces FDI 0 and the lowest band', () => {
    const result = scoreOk(answersAllScoring(config, questionSet, config.itemScoreMin));

    expect(result.fdi.unrounded).toBe(0);
    expect(result.fdi.display).toBe(0);
    expect(result.band.key).toBe(config.bands[0].key);
    for (const c of result.components) {
      expect(c.raw).toBe(0);
      expect(c.unrounded).toBe(0);
      expect(c.display).toBe(0);
      expect(c.alert).toBe(false);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 2 — All answers = 3 → FDI 100
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 2 — all answers at the maximum', () => {
  it('produces FDI 100 and the highest band', () => {
    const result = scoreOk(answersAllScoring(config, questionSet, config.itemScoreMax));

    expect(result.fdi.unrounded).toBe(config.componentScale);
    expect(result.fdi.display).toBe(100);
    expect(result.band.key).toBe(config.bands[config.bands.length - 1].key);
    for (const c of result.components) {
      expect(c.raw).toBe(RAW_MAX);
      expect(c.unrounded).toBe(config.componentScale);
      expect(c.alert).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 3 — All answers = 1 → FDI 33
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 3 — all answers at score 1', () => {
  it('displays 33 while storing the unrounded value', () => {
    const result = scoreOk(answersAllScoring(config, questionSet, 1));

    expect(result.fdi.display).toBe(33);
    // The stored composite must NOT be the rounded one (§7).
    expect(result.fdi.unrounded).toBeCloseTo(33.3333, 4);
    expect(result.fdi.unrounded).not.toBe(result.fdi.display);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 4 — DS 100, EC 0, OV 0 → FDI 33 plus DS alert
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 4 — concentrated dependency in one component', () => {
  const result = () => scoreOk(answersForRaw(config, questionSet, { DS: RAW_MAX, EC: 0, OV: 0 }));

  it('averages to 33', () => {
    expect(result().fdi.display).toBe(33);
    expect(component(result(), 'DS').display).toBe(100);
    expect(component(result(), 'EC').display).toBe(0);
    expect(component(result(), 'OV').display).toBe(0);
  });

  it('raises exactly one alert, on Decision Speed', () => {
    const alerts = result().alerts;
    expect(alerts).toHaveLength(1);
    expect(alerts[0].components.map((c) => c.key)).toEqual(['DS']);
    expect(alerts[0].display).toBe(100);
  });

  it('RETAINS the original composite and does NOT change the band (§10)', () => {
    const r = result();
    // The band must be whatever 33.33 maps to, exactly as if no alert existed.
    expect(r.band.key).toBe(bandFor(r.fdi.unrounded, config).key);
    expect(r.band.key).toBe('moderate');
    expect(r.fdi.unrounded).toBeCloseTo(33.3333, 4);
  });

  it('names Decision Speed as the dependency concentration', () => {
    expect(result().concentration.componentKeys).toEqual(['DS']);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests 5 & 6 — component alert threshold
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 5 — component exactly at the alert threshold', () => {
  it('triggers the alert', () => {
    const raw = rawForComponentValue(config, config.componentAlertThreshold);
    const result = scoreOk(answersForRaw(config, questionSet, { DS: raw, EC: 0, OV: 0 }));
    const ds = component(result, 'DS');

    expect(ds.unrounded).toBe(config.componentAlertThreshold);
    expect(ds.alert).toBe(true);
    expect(result.alerts).toHaveLength(1);
  });
});

describe('Test 6 — component below the alert threshold', () => {
  it('does not trigger the alert', () => {
    const raw = rawForComponentValue(config, config.componentAlertThreshold) - 1;
    const result = scoreOk(answersForRaw(config, questionSet, { DS: raw, EC: 0, OV: 0 }));
    const ds = component(result, 'DS');

    expect(ds.unrounded).toBeLessThan(config.componentAlertThreshold);
    expect(ds.alert).toBe(false);
    expect(result.alerts).toHaveLength(0);
  });

  it('is a >= comparison, not >', () => {
    // The next raw step below the threshold is the highest non-alerting value.
    const atThreshold = rawForComponentValue(config, config.componentAlertThreshold);
    const below = scoreOk(answersForRaw(config, questionSet, { DS: atThreshold - 1, EC: 0, OV: 0 }));
    const at = scoreOk(answersForRaw(config, questionSet, { DS: atThreshold, EC: 0, OV: 0 }));
    expect(component(below, 'DS').alert).toBe(false);
    expect(component(at, 'DS').alert).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests 7 & 8 — dependency concentration ties (§11)
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 7 — two components tied at the highest value', () => {
  const answers = answersForRaw(config, questionSet, { DS: RAW_MAX, EC: 2, OV: RAW_MAX });

  it('displays both, with no tie-break to a single winner', () => {
    const { concentration } = scoreOk(answers);
    expect(concentration.componentKeys).toHaveLength(2);
    expect(new Set(concentration.componentKeys)).toEqual(new Set(['DS', 'OV']));
    expect(new Set(concentration.labels)).toEqual(
      new Set(['Decision Speed', 'Operational Visibility']),
    );
  });

  it('is invariant to the order the answers arrived in', () => {
    // Proves no source-order or array-position tie-break (§11).
    expect(scoreOk(withReversedKeyOrder(answers))).toEqual(scoreOk(answers));
  });

  it('groups the tied components together in one alert tier (answer L)', () => {
    const { alerts } = scoreOk(answers);
    expect(alerts).toHaveLength(1);
    expect(new Set(alerts[0].components.map((c) => c.key))).toEqual(new Set(['DS', 'OV']));
  });
});

describe('Test 8 — all three components equal', () => {
  it('produces a three-way concentration', () => {
    const { concentration } = scoreOk(answersAllScoring(config, questionSet, 2));
    expect(concentration.componentKeys).toHaveLength(3);
    expect(new Set(concentration.componentKeys)).toEqual(new Set(['DS', 'EC', 'OV']));
  });
});

describe('alert tiers order by score descending (answer L)', () => {
  it('puts the higher component first and keeps ties together', () => {
    const threshold = rawForComponentValue(config, config.componentAlertThreshold);
    const { alerts } = scoreOk(
      answersForRaw(config, questionSet, { DS: threshold, EC: RAW_MAX, OV: RAW_MAX }),
    );
    expect(alerts).toHaveLength(2);
    expect(new Set(alerts[0].components.map((c) => c.key))).toEqual(new Set(['EC', 'OV']));
    expect(alerts[1].components.map((c) => c.key)).toEqual(['DS']);
    expect(alerts[0].raw).toBeGreaterThan(alerts[1].raw);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 9 — one answer missing → no FDI (§12)
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 9 — an unanswered question', () => {
  it('yields no FDI at all', () => {
    const answers = { ...answersAllScoring(config, questionSet, 2) };
    const dropped = questionSet.questions[5].id;
    delete answers[dropped];

    const outcome = score(answers);
    expect(outcome.ok).toBe(false);
    if (outcome.ok) throw new Error('unreachable');
    expect(outcome.reason.code).toBe('INCOMPLETE');
    expect(outcome.reason).toEqual({ code: 'INCOMPLETE', missingQuestionIds: [dropped] });
    // Missing does not equal zero dependency: no partial composite may leak out.
    expect(outcome).not.toHaveProperty('result');
  });

  it('rejects an entirely empty answer set rather than scoring it as zero', () => {
    const outcome = score({});
    expect(outcome.ok).toBe(false);
    if (outcome.ok) throw new Error('unreachable');
    expect(outcome.reason.code).toBe('INCOMPLETE');
    expect((outcome.reason as { missingQuestionIds: readonly string[] }).missingQuestionIds).toHaveLength(
      questionSet.questions.length,
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 10 — unknown question ID → reject
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 10 — unknown question id', () => {
  it('is rejected', () => {
    const answers = { ...answersAllScoring(config, questionSet, 1), NOT_A_QUESTION: 'DS1-A' };
    const outcome = score(answers);

    expect(outcome.ok).toBe(false);
    if (outcome.ok) throw new Error('unreachable');
    expect(outcome.reason).toEqual({
      code: 'UNKNOWN_QUESTION_ID',
      questionIds: ['NOT_A_QUESTION'],
    });
  });

  it('maps to HTTP 400, never 500', () => {
    expect(httpStatusForRejection('UNKNOWN_QUESTION_ID')).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 11 — invalid answer → reject
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 11 — invalid option', () => {
  const target = questionSet.questions[0];

  it.each([
    ['an unknown option id', 'NOT_AN_OPTION'],
    ['an empty string', ''],
  ])('rejects %s', (_label, optionId) => {
    const answers = { ...answersAllScoring(config, questionSet, 1), [target.id]: optionId };
    const outcome = score(answers);

    expect(outcome.ok).toBe(false);
    if (outcome.ok) throw new Error('unreachable');
    expect(outcome.reason).toEqual({ code: 'INVALID_OPTION', questionIds: [target.id] });
  });

  it("rejects an option id that is valid for a DIFFERENT question", () => {
    const other = questionSet.questions[1];
    const answers = {
      ...answersAllScoring(config, questionSet, 1),
      [target.id]: other.options[0].id,
    };
    const outcome = score(answers);

    expect(outcome.ok).toBe(false);
    if (outcome.ok) throw new Error('unreachable');
    expect(outcome.reason).toEqual({ code: 'INVALID_OPTION', questionIds: [target.id] });
  });

  it('maps to HTTP 400', () => {
    expect(httpStatusForRejection('INVALID_OPTION')).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 12 — version mismatch → reject
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 12 — diagnostic version mismatch', () => {
  const answers = answersAllScoring(config, questionSet, 1);

  it.each(['FDI-1.1', 'FDI-0.9', 'FDI', ''])('rejects %p', (submitted) => {
    const outcome = score(answers, submitted);
    expect(outcome.ok).toBe(false);
    if (outcome.ok) throw new Error('unreachable');
    expect(outcome.reason).toEqual({ code: 'VERSION_MISMATCH', submitted });
  });

  it('never falls back to the current version for an unknown one', () => {
    expect(resolveVersion('FDI-1.2')).toBeUndefined();
    expect(resolveVersion('FDI-1.1')).toBeDefined();
    expect(resolveVersion('FDI-1.0')).toBeDefined();
  });

  it('resolves FDI-1.0 to the frozen config and its question set (§18)', () => {
    const resolved = resolveVersion('FDI-1.0');
    expect(resolved?.config).toBe(FDI_1_0_CONFIG);
    expect(resolved?.questionSet).toBe(FDI_1_0_QUESTIONS);
  });

  it('maps to HTTP 400', () => {
    expect(httpStatusForRejection('VERSION_MISMATCH')).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 13 — commercially unqualified → FDI unchanged (§13)
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 13 — commercial qualification', () => {
  const answers = answersForRaw(config, questionSet, { DS: 10, EC: 7, OV: 7 });

  it('cannot be supplied to the scoring engine at all', () => {
    // The engine's signature has no qualification channel. This is the structural
    // guarantee behind §13; `next build` type-checks it.
    // @ts-expect-error qualification data must not be accepted by scoreFdi
    scoreFdi({ diagnosticVersion: VERSION, answers, qualification: 'outside' }, config, questionSet);
  });

  it('leaves every scored value identical regardless of qualification result', () => {
    const result = scoreOk(answers);
    const context = { sessionId: 's', completedAt: '2026-08-14T00:00:00.000Z', ai: null };

    const unqualified = buildReport(result, config, {
      ...context,
      qualification: evaluateQualification({ ...QUALIFIED_PRIMARY, annualRevenue: 'over_10m' }),
    });
    const qualified = buildReport(result, config, {
      ...context,
      qualification: evaluateQualification(QUALIFIED_PRIMARY),
    });

    expect(unqualified.index).toEqual(qualified.index);
    expect(unqualified.components).toEqual(qualified.components);
    expect(unqualified.alerts).toEqual(qualified.alerts);
    expect(unqualified.concentration).toEqual(qualified.concentration);
    // Only the qualification branch differs.
    expect(unqualified.qualification).not.toEqual(qualified.qualification);
  });

  it('uses the approved deterministic qualification rule', () => {
    expect(evaluateQualification(QUALIFIED_PRIMARY)).toMatchObject({
      result: 'qualified_primary',
      version: 'FDI-QF-2.0',
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 14 — AI unavailable → core report still delivered (§16)
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 14 — AI unavailable', () => {
  it('still delivers the complete core report', () => {
    const result = scoreOk(answersForRaw(config, questionSet, { DS: 10, EC: 7, OV: 7 }));
    const report = buildReport(result, config, {
      sessionId: 'session-1',
      completedAt: '2026-08-14T00:00:00.000Z',
      qualification: evaluateQualification(QUALIFIED_PRIMARY),
      ai: null,
    });

    expect(report.ai).toEqual({ available: false, narrative: null });

    // Everything §14 requires is present without AI.
    expect(report.index.display).toBe(result.fdi.display);
    expect(report.index.band.label).toBeTruthy();
    expect(report.index.presentation).toContain('Founder Dependency Index');
    expect(report.components).toHaveLength(config.components.length);
    expect(report.concentration.componentKeys.length).toBeGreaterThan(0);
    expect(report.limitation).toBe(config.limitationCopy);
    expect(report.nextStep).toEqual(config.nextStep);
    expect(report.versions.diagnostic).toBe(VERSION);
  });

  it('scores identically whether or not AI output is attached', () => {
    const result = scoreOk(answersForRaw(config, questionSet, { DS: 10, EC: 7, OV: 7 }));
    const base = {
      sessionId: 's',
      completedAt: '2026-08-14T00:00:00.000Z',
      qualification: evaluateQualification(QUALIFIED_PRIMARY),
    };
    const without = buildReport(result, config, { ...base, ai: null });
    const with_ = buildReport(result, config, { ...base, ai: { summary: 'drafted prose' } });

    expect(without.index).toEqual(with_.index);
    expect(without.components).toEqual(with_.components);
    expect(with_.ai.available).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 15 — same raw input, same version → identical output
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 15 — determinism', () => {
  const answers = answersForRaw(config, questionSet, { DS: 9, EC: 4, OV: 11 });

  it('produces byte-identical output across repeated runs', () => {
    const first = JSON.stringify(scoreOk(answers));
    for (let i = 0; i < 100; i += 1) {
      expect(JSON.stringify(scoreOk(answers))).toBe(first);
    }
  });

  it('does not mutate its input', () => {
    const frozen = Object.freeze({ ...answers });
    const snapshot = JSON.stringify(frozen);
    scoreOk(frozen);
    expect(JSON.stringify(frozen)).toBe(snapshot);
  });

  it('is insensitive to answer key order', () => {
    expect(scoreOk(withReversedKeyOrder(answers))).toEqual(scoreOk(answers));
  });

  it('has no clock and no randomness in its output', () => {
    const a = scoreOk(answers);
    const b = scoreOk(answers);
    expect(a).toEqual(b);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 16 — legacy health score is never converted into an FDI
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 16 — legacy records', () => {
  it('produces no legacy field anywhere in a scored result', () => {
    const result = scoreOk(answersAllScoring(config, questionSet, 2));
    const serialised = JSON.stringify(result);

    for (const legacyField of [
      'healthScore',
      'health_score',
      'severityLabel',
      'severity_label',
      'primaryConstraint',
      'primary_constraint',
      'secondaryConstraint',
      'totalScore',
      'maxPossibleScore',
    ]) {
      expect(serialised).not.toContain(legacyField);
    }
  });

  it('exposes no conversion entry point', async () => {
    const engine = await import('./score');
    const names = Object.keys(engine).join(' ').toLowerCase();
    expect(names).not.toContain('health');
    expect(names).not.toContain('legacy');
    expect(names).not.toContain('convert');
    expect(names).not.toContain('migrate');
  });

  // The structural half of this test — that src/lib/fdi never imports the legacy
  // scorer — is enforced in purity.test.ts.
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 20 — decimal component values are rounded for display only
// ─────────────────────────────────────────────────────────────────────────────
describe('Test 20 — decimal component values', () => {
  it('stores the unrounded component and rounds only for display', () => {
    const result = scoreOk(answersForRaw(config, questionSet, { DS: 5, EC: 5, OV: 5 }));
    const ds = component(result, 'DS');

    expect(ds.raw).toBe(5);
    expect(ds.unrounded).toBeCloseTo(41.6667, 4);
    expect(Number.isInteger(ds.unrounded)).toBe(false);
    expect(Number.isInteger(ds.display)).toBe(true);
    expect(ds.display).toBe(42);
    expect(ds.unrounded).not.toBe(ds.display);
  });

  it('rounds every reachable component value half-up without altering the stored value', () => {
    for (let raw = 0; raw <= RAW_MAX; raw += 1) {
      const result = scoreOk(answersForRaw(config, questionSet, { DS: raw, EC: 0, OV: 0 }));
      const ds = component(result, 'DS');
      // Single correctly-rounded division, matching the engine. Computing this
      // as (raw / rawMax) * scale would be a DIFFERENT double for raw = 1, 5, 7
      // and 11 — less accurate than the true value.
      const exact = (raw * config.componentScale) / RAW_MAX;
      expect(ds.unrounded).toBe(exact);
      expect(ds.display).toBe(Math.round(exact));
    }
  });

  it('normalises components to the nearest representable value, not an accumulated one', () => {
    // raw 1 of 12 on a 0–100 scale is 25/3. The correctly-rounded double is
    // 8.333333333333334; the two-step form gives 8.333333333333332.
    const result = scoreOk(answersForRaw(config, questionSet, { DS: 1, EC: 0, OV: 0 }));
    expect(component(result, 'DS').unrounded).toBe(8.333333333333334);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Supporting guarantees
// ─────────────────────────────────────────────────────────────────────────────
describe('composite arithmetic (§7)', () => {
  it('averages the UNROUNDED components, not the displayed ones', () => {
    // DS raw 5 -> 41.6667, display 42. Averaging displays would give 42 exactly;
    // the spec requires the composite be computed from unrounded values.
    const result = scoreOk(answersForRaw(config, questionSet, { DS: 5, EC: 5, OV: 5 }));
    expect(result.fdi.unrounded).toBeCloseTo(41.6667, 4);
    expect(result.fdi.unrounded).not.toBe(42);
    expect(result.fdi.display).toBe(42);
  });

  it('uses the weight sum as the divisor, matching (DS+EC+OV)/3 at equal weights', () => {
    const weightSum = Object.values(config.weights).reduce((a, b) => a + b, 0);
    expect(weightSum).toBe(config.components.length);

    const result = scoreOk(answersForRaw(config, questionSet, { DS: 12, EC: 6, OV: 3 }));
    const manual =
      (component(result, 'DS').unrounded +
        component(result, 'EC').unrounded +
        component(result, 'OV').unrounded) /
      3;
    expect(result.fdi.unrounded).toBeCloseTo(manual, 10);
  });

  /**
   * REGRESSION — floating-point accumulation across components.
   *
   * Averaging three separately-normalised component values accumulates rounding
   * error, and binary64 cannot represent 100/12. For 25 of the 2197 reachable
   * answer profiles that path yields 24.999999999999996 where the exact
   * composite is 25 — which, under the pinned `bandInput: 'unrounded'`, bands
   * the respondent Low instead of Moderate.
   *
   * The composite must therefore depend only on the TOTAL raw dependency, never
   * on how that total is distributed across the three components.
   */
  it('lands exactly on a band edge regardless of how the raw total is distributed', () => {
    const rawMax = RAW_MAX;
    const edgeTotal = 9; // 9/36 of the scale = exactly 25

    const distributions = [
      { DS: 3, EC: 3, OV: 3 },
      { DS: 1, EC: 4, OV: 4 },
      { DS: 0, EC: 1, OV: 8 },
      { DS: 2, EC: 3, OV: 4 },
      { DS: 9, EC: 0, OV: 0 },
    ];

    for (const targets of distributions) {
      expect(targets.DS + targets.EC + targets.OV).toBe(edgeTotal);
      const result = scoreOk(answersForRaw(config, questionSet, targets));
      expect(result.fdi.unrounded).toBe(25);
      expect(result.band.key).toBe('moderate');
    }

    // The composite is a pure function of the raw total, for every total.
    for (let total = 0; total <= rawMax * 3; total += 1) {
      const seen = new Set<number>();
      for (let ds = 0; ds <= Math.min(rawMax, total); ds += 1) {
        for (let ec = 0; ec <= Math.min(rawMax, total - ds); ec += 1) {
          const ov = total - ds - ec;
          if (ov > rawMax) continue;
          seen.add(scoreOk(answersForRaw(config, questionSet, { DS: ds, EC: ec, OV: ov })).fdi.unrounded);
        }
      }
      expect(seen.size).toBe(1);
    }
  });

  it('stores all six §7 artefacts', () => {
    const result = scoreOk(answersForRaw(config, questionSet, { DS: 7, EC: 3, OV: 10 }));
    expect(result.answers).toHaveLength(questionSet.questions.length); // raw answers
    for (const c of result.components) {
      expect(typeof c.raw).toBe('number'); // raw component scores
      expect(typeof c.unrounded).toBe('number'); // unrounded normalised
      expect(typeof c.display).toBe('number'); // displayed components
    }
    expect(typeof result.fdi.unrounded).toBe('number'); // unrounded composite
    expect(typeof result.fdi.display).toBe('number'); // displayed FDI
  });
});

describe('rejection precedence', () => {
  it('reports an unknown question id ahead of incompleteness', () => {
    const answers = { NOT_A_QUESTION: 'x' };
    const outcome = score(answers);
    if (outcome.ok) throw new Error('unreachable');
    expect(outcome.reason.code).toBe('UNKNOWN_QUESTION_ID');
  });

  it('reports a version mismatch ahead of every other defect', () => {
    const outcome = score({ NOT_A_QUESTION: 'x' }, 'FDI-9.9');
    if (outcome.ok) throw new Error('unreachable');
    expect(outcome.reason.code).toBe('VERSION_MISMATCH');
  });
});

describe('scored answers are stored for every item (§7, §15)', () => {
  it('records question, component, chosen option and its score', () => {
    const result = scoreOk(answersAllScoring(config, questionSet, 2));
    expect(result.answers).toHaveLength(12);
    for (const answer of result.answers) {
      expect(answer.score).toBe(2);
      expect(answer.optionId).toBeTruthy();
      expect(['DS', 'EC', 'OV']).toContain(answer.componentKey);
    }
  });

  it('emits answers in question-set order regardless of submission order', () => {
    const answers = answersAllScoring(config, questionSet, 1);
    const forward = scoreOk(answers).answers.map((a) => a.questionId);
    const reversed = scoreOk(withReversedKeyOrder(answers)).answers.map((a) => a.questionId);
    expect(forward).toEqual(questionSet.questions.map((q) => q.id));
    expect(reversed).toEqual(forward);
  });
});

describe('configuration selectors', () => {
  it('records a null submitted version when the runtime input omits it', () => {
    const outcome = scoreFdi(
      {
        diagnosticVersion: undefined as unknown as string,
        answers: answersAllScoring(config, questionSet, 1),
      },
      config,
      questionSet,
    );
    expect(outcome).toEqual({
      ok: false,
      reason: { code: 'VERSION_MISMATCH', submitted: null },
    });
  });

  it('can evaluate component alerts from displayed values when configured', () => {
    const configured = { ...config, alertInput: 'display' as const };
    const outcome = scoreFdi(
      { diagnosticVersion: VERSION, answers: answersForRaw(configured, questionSet, { DS: 9, EC: 0, OV: 0 }) },
      configured,
      questionSet,
    );
    if (!outcome.ok) throw new Error('Expected a score');
    expect(component(outcome.result, 'DS').alert).toBe(true);
  });

  it('can select the band from the displayed FDI when configured', () => {
    const configured = { ...config, bandInput: 'display' as const };
    const outcome = scoreFdi(
      { diagnosticVersion: VERSION, answers: answersForRaw(configured, questionSet, { DS: 5, EC: 5, OV: 5 }) },
      configured,
      questionSet,
    );
    if (!outcome.ok) throw new Error('Expected a score');
    expect(outcome.result.band.key).toBe(bandFor(outcome.result.fdi.display, configured).key);
  });
});
