/**
 * §19 tests 17, 18 and 19 — band boundaries.
 *
 * WHY THESE ARE DIRECT UNIT TESTS (owner-confirmed, answer J):
 *
 * Every reachable composite is 25·s/9 for an integer s in 0..36, because each
 * component is raw·25/3 with raw in 0..12 and the composite is their mean. The
 * reachable set is {0, 2.78, 5.56, … 25, … 50, … 75, … 100}. The values 24, 49
 * and 74 appear in it neither unrounded NOR displayed — no valid twelve-answer
 * set can produce them. The lower edge of each boundary pair is therefore only
 * testable against `bandFor` directly.
 *
 * The upper edge of each pair IS exactly reachable, so each boundary also carries
 * an end-to-end companion at s = 9, 18 and 27.
 *
 * Owner-pinned answer G: bands read the UNROUNDED composite.
 * Owner-pinned answer I: half-open lower bounds, total over the interval.
 */

import { bandFor } from './bands';
import { scoreFdi } from './score';
import { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS } from './config';
import { answersForRaw } from './test-support';
import type { FdiResult } from './types';

const config = FDI_1_0_CONFIG;
const questionSet = FDI_1_0_QUESTIONS;
const RAW_MAX = config.itemsPerComponent * config.itemScoreMax;

/** Scores an answer set whose three raw component totals sum to `s`. */
function scoreForRawSum(s: number): FdiResult {
  const per = [0, 0, 0];
  let remaining = s;
  for (let i = 0; i < 3; i += 1) {
    per[i] = Math.min(RAW_MAX, remaining);
    remaining -= per[i];
  }
  const outcome = scoreFdi(
    {
      diagnosticVersion: config.diagnosticVersion,
      answers: answersForRaw(config, questionSet, { DS: per[0], EC: per[1], OV: per[2] }),
    },
    config,
    questionSet,
  );
  if (!outcome.ok) throw new Error(`unexpected rejection ${outcome.reason.code}`);
  return outcome.result;
}

describe('Test 17 — band boundary 24 / 25', () => {
  it('labels 24 as the low band and 25 as the moderate band', () => {
    expect(bandFor(24, config).key).toBe('low');
    expect(bandFor(24, config).label).toBe('Low Founder Dependency');
    expect(bandFor(25, config).key).toBe('moderate');
    expect(bandFor(25, config).label).toBe('Moderate Founder Dependency');
  });

  it('places values immediately below the edge in the lower band', () => {
    expect(bandFor(24.999999, config).key).toBe('low');
  });

  it('end-to-end: the reachable composite of exactly 25 lands in moderate', () => {
    const result = scoreForRawSum(9);
    expect(result.fdi.unrounded).toBe(25);
    expect(result.band.key).toBe('moderate');
  });
});

describe('Test 18 — band boundary 49 / 50', () => {
  it('labels 49 as moderate and 50 as high', () => {
    expect(bandFor(49, config).key).toBe('moderate');
    expect(bandFor(50, config).key).toBe('high');
    expect(bandFor(50, config).label).toBe('High Founder Dependency');
  });

  it('places values immediately below the edge in the lower band', () => {
    expect(bandFor(49.999999, config).key).toBe('moderate');
  });

  it('end-to-end: the reachable composite of exactly 50 lands in high', () => {
    const result = scoreForRawSum(18);
    expect(result.fdi.unrounded).toBe(50);
    expect(result.band.key).toBe('high');
  });
});

describe('Test 19 — band boundary 74 / 75', () => {
  it('labels 74 as high and 75 as very high', () => {
    expect(bandFor(74, config).key).toBe('high');
    expect(bandFor(75, config).key).toBe('very_high');
    expect(bandFor(75, config).label).toBe('Very High Founder Dependency');
  });

  it('places values immediately below the edge in the lower band', () => {
    expect(bandFor(74.999999, config).key).toBe('high');
  });

  it('end-to-end: the reachable composite of exactly 75 lands in very high', () => {
    const result = scoreForRawSum(27);
    expect(result.fdi.unrounded).toBe(75);
    expect(result.band.key).toBe('very_high');
  });

  it('the composite of exactly 75 also alerts on all three components', () => {
    // s = 27 distributed as 12/12/3 by the helper, so this is NOT a three-way
    // alert; build the even split explicitly to cross-check §9 against §10.
    const outcome = scoreFdi(
      {
        diagnosticVersion: config.diagnosticVersion,
        answers: answersForRaw(config, questionSet, { DS: 9, EC: 9, OV: 9 }),
      },
      config,
      questionSet,
    );
    if (!outcome.ok) throw new Error('unexpected rejection');
    expect(outcome.result.fdi.unrounded).toBe(75);
    expect(outcome.result.band.key).toBe('very_high');
    expect(outcome.result.alerts).toHaveLength(1);
    expect(outcome.result.alerts[0].components).toHaveLength(3);
  });
});

describe('band lookup is total over the continuous interval (answer I)', () => {
  it('assigns exactly one band to every value in [0, scale]', () => {
    for (let v = 0; v <= config.componentScale; v += 0.01) {
      const value = Math.round(v * 100) / 100;
      const band = bandFor(value, config);
      expect(band).toBeDefined();

      const matching = config.bands.filter((candidate) => value >= candidate.minInclusive);
      // Half-open lower bounds: the winner is the greatest qualifying bound.
      expect(band.minInclusive).toBe(Math.max(...matching.map((m) => m.minInclusive)));
    }
  });

  it('covers the exact edges and the scale endpoints', () => {
    expect(bandFor(0, config).key).toBe('low');
    expect(bandFor(config.componentScale, config).key).toBe('very_high');
    for (const band of config.bands) {
      expect(bandFor(band.minInclusive, config).key).toBe(band.key);
    }
  });

  it('rejects values outside the index scale rather than guessing a band', () => {
    expect(() => bandFor(-0.1, config)).toThrow(RangeError);
    expect(() => bandFor(config.componentScale + 0.1, config)).toThrow(RangeError);
    expect(() => bandFor(Number.NaN, config)).toThrow(RangeError);
  });
});

describe('band metadata (§9)', () => {
  it('keeps the numeric key separate from the display label so bands can recalibrate', () => {
    for (const band of config.bands) {
      expect(band.key).toBeTruthy();
      expect(band.label).toBeTruthy();
      expect(band.key).not.toBe(band.label);
    }
  });

  it('never uses a band name that reads as praise', () => {
    const praise = ['excellent', 'good', 'great', 'healthy', 'strong', 'best', 'optimal', 'pass'];
    for (const band of config.bands) {
      const label = band.label.toLowerCase();
      for (const word of praise) {
        expect(label).not.toContain(word);
      }
    }
  });

  it('names every band in terms of founder dependency', () => {
    for (const band of config.bands) {
      expect(band.label.toLowerCase()).toContain('dependency');
    }
  });
});
