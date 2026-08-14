/**
 * Golden fixture — §18 reproducibility, mechanised.
 *
 * "A historic response may be recalculated USING THAT SAME VERSION'S
 * configuration to confirm reproducibility. Never silently recalculate FDI-1.0
 * under later rules."
 *
 * The fixture holds committed inputs and their exact scored outputs under
 * FDI-1.0. Any change to the engine, the config, the question set, the rounding
 * rule or the band edges that alters a stored score fails here — including
 * changes that leave the config digest intact because they live in code rather
 * than in configuration.
 *
 * This runs on every CI run, so it is a continuous reproducibility check rather
 * than a one-off migration validation.
 */

import golden from './__fixtures__/fdi-1.0-golden.json';
import { scoreFdi } from './score';
import { resolveVersion } from './config';
import { answersForRaw } from './test-support';

describe('FDI-1.0 golden fixture (§18)', () => {
  const resolved = resolveVersion(golden.diagnosticVersion);

  it('resolves the version the fixture was generated under', () => {
    expect(resolved).toBeDefined();
    expect(golden.diagnosticVersion).toBe('FDI-1.0');
    expect(golden.cases.length).toBeGreaterThanOrEqual(10);
  });

  it.each(golden.cases.map((c) => [c.label, c] as const))(
    'reproduces %s exactly',
    (_label, testCase) => {
      if (!resolved) throw new Error('version not resolvable');
      const outcome = scoreFdi(
        {
          diagnosticVersion: golden.diagnosticVersion,
          answers: answersForRaw(resolved.config, resolved.questionSet, testCase.targets),
        },
        resolved.config,
        resolved.questionSet,
      );

      expect(outcome.ok).toBe(true);
      if (!outcome.ok) throw new Error('unreachable');
      expect(outcome.result).toEqual(testCase.result);
    },
  );

  it('reproduces every case byte-for-byte when re-serialised', () => {
    if (!resolved) throw new Error('version not resolvable');
    for (const testCase of golden.cases) {
      const outcome = scoreFdi(
        {
          diagnosticVersion: golden.diagnosticVersion,
          answers: answersForRaw(resolved.config, resolved.questionSet, testCase.targets),
        },
        resolved.config,
        resolved.questionSet,
      );
      if (!outcome.ok) throw new Error('unreachable');
      expect(JSON.stringify(outcome.result)).toBe(JSON.stringify(testCase.result));
    }
  });
});
