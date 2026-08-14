/**
 * Config-defect guards.
 *
 * These paths are unreachable through user input: they fire only when the CONFIG
 * itself is malformed. They exist so that a bad config fails loudly at the first
 * scored session instead of silently producing wrong numbers that then get
 * stamped with a version key implying they were computed correctly.
 *
 * They throw rather than returning a §12 rejection, because a deployment defect
 * must not be reported to a respondent as a bad request. That distinction is
 * what these tests pin.
 */

import { scoreFdi } from './score';
import { bandFor } from './bands';
import { httpStatusForRejection } from './rejection';
import { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS } from './config';
import { answersAllScoring, answersForRaw } from './test-support';
import type { FdiConfig } from './types';

const config = FDI_1_0_CONFIG;
const questionSet = FDI_1_0_QUESTIONS;
const validAnswers = answersAllScoring(config, questionSet, 1);

function score(cfg: FdiConfig, qs = questionSet) {
  return scoreFdi({ diagnosticVersion: cfg.diagnosticVersion, answers: validAnswers }, cfg, qs);
}

describe('a mismatched question set is a deployment defect, not a rejection', () => {
  it('throws rather than scoring against the wrong question set', () => {
    const wrongQuestionSet = { ...questionSet, questionSetVersion: 'FDI-QS-9.9' };
    expect(() => score(config, wrongQuestionSet)).toThrow(/config expects question set/);
  });

  it('does not report the defect as a bad request', () => {
    const wrongQuestionSet = { ...questionSet, questionSetVersion: 'FDI-QS-9.9' };
    // A §12 rejection would return { ok: false }; this must throw instead.
    expect(() => score(config, wrongQuestionSet)).toThrow(Error);
  });
});

describe('a component whose item count contradicts the config', () => {
  it('throws rather than normalising against the wrong denominator', () => {
    // Config claims 5 items per component; the question set supplies 4. Scoring
    // anyway would divide by the wrong rawMax and silently deflate every score.
    const broken = { ...config, itemsPerComponent: 5 };
    expect(() => score(broken)).toThrow(/has 4 items, config declares 5/);
  });
});

describe('malformed component weights', () => {
  it('throws when a component has no declared weight', () => {
    const broken = { ...config, weights: { DS: 1, EC: 1 } };
    expect(() => score(broken)).toThrow(/no finite weight declared for component OV/);
  });

  it('throws when a weight is not finite', () => {
    const broken = { ...config, weights: { DS: 1, EC: 1, OV: Number.NaN } };
    expect(() => score(broken)).toThrow(/no finite weight declared for component OV/);
  });

  it('throws when the weights sum to zero rather than dividing by zero', () => {
    const broken = { ...config, weights: { DS: 0, EC: 0, OV: 0 } };
    expect(() => score(broken)).toThrow(/must sum to a positive number/);
  });
});

describe('a band set that does not cover the scale', () => {
  it('throws rather than mislabelling a score', () => {
    // Lowest band starts at 25, so 10 falls into no band at all.
    const broken = { ...config, bands: config.bands.slice(1) };
    expect(() => bandFor(10, broken)).toThrow(/no band covers 10/);
  });

  it('still resolves values the truncated band set does cover', () => {
    const broken = { ...config, bands: config.bands.slice(1) };
    expect(bandFor(60, broken).key).toBe('high');
  });
});

describe('an absent diagnostic version', () => {
  it('is rejected and reported as null rather than as the string "undefined"', () => {
    const outcome = scoreFdi(
      { diagnosticVersion: undefined as unknown as string, answers: validAnswers },
      config,
      questionSet,
    );
    expect(outcome.ok).toBe(false);
    if (outcome.ok) throw new Error('unreachable');
    expect(outcome.reason).toEqual({ code: 'VERSION_MISMATCH', submitted: null });
  });
});

describe('the boundary-input switches are honoured (owner-pinned answer G)', () => {
  const displayCfg = { ...config, bandInput: 'display' as const, alertInput: 'display' as const };

  it('FDI-1.0 is pinned to the unrounded reading', () => {
    expect(config.bandInput).toBe('unrounded');
    expect(config.alertInput).toBe('unrounded');
  });

  it('the display reading is implemented, so a future version can flip it', () => {
    const outcome = score(displayCfg);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) throw new Error('unreachable');
    expect(outcome.result.band.key).toBeTruthy();
    for (const component of outcome.result.components) {
      expect(typeof component.alert).toBe('boolean');
    }
  });

  /**
   * The two readings are currently equivalent, which is why answer G was
   * recorded as non-blocking. This test proves it rather than asserting it:
   * component values are raw·25/3 and composites are s·25/9, and neither family
   * lands in [edge − 0.5, edge) for any band edge or for the alert threshold.
   *
   * It is deliberately exhaustive over all 13³ = 2197 reachable answer profiles.
   * If a future version changes the item count, range or weights so that the
   * readings diverge, this fails and forces the decision to be revisited.
   */
  it('agrees with the unrounded reading for every reachable profile in FDI-1.0', () => {
    const rawMax = config.itemsPerComponent * config.itemScoreMax;
    let compared = 0;

    for (let ds = 0; ds <= rawMax; ds += 1) {
      for (let ec = 0; ec <= rawMax; ec += 1) {
        for (let ov = 0; ov <= rawMax; ov += 1) {
          const answers = answersForRaw(config, questionSet, { DS: ds, EC: ec, OV: ov });
          const input = { diagnosticVersion: config.diagnosticVersion, answers };

          const unroundedOutcome = scoreFdi(input, config, questionSet);
          const displayOutcome = scoreFdi(input, displayCfg, questionSet);
          if (!unroundedOutcome.ok || !displayOutcome.ok) throw new Error('unreachable');

          expect(displayOutcome.result.band.key).toBe(unroundedOutcome.result.band.key);
          expect(displayOutcome.result.components.map((c) => c.alert)).toEqual(
            unroundedOutcome.result.components.map((c) => c.alert),
          );
          compared += 1;
        }
      }
    }

    expect(compared).toBe((rawMax + 1) ** 3);
  });
});

describe('rejection status mapping', () => {
  it('maps every known code to 400', () => {
    for (const code of [
      'VERSION_MISMATCH',
      'UNKNOWN_QUESTION_ID',
      'INVALID_OPTION',
      'INCOMPLETE',
    ] as const) {
      expect(httpStatusForRejection(code)).toBe(400);
    }
  });

  it('throws on an unrecognised code rather than defaulting to 500', () => {
    // @ts-expect-error deliberately invalid rejection code
    expect(() => httpStatusForRejection('SOMETHING_ELSE')).toThrow(RangeError);
  });
});
