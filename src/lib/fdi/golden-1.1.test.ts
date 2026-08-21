import golden from './__fixtures__/fdi-1.1-golden.json';
import { resolveVersion } from './config';
import { scoreFdi } from './score';
import { answersForRaw } from './test-support';

describe('FDI-1.1 golden fixture', () => {
  const resolved = resolveVersion(golden.diagnosticVersion);

  it('resolves the exact version captured by the fixture', () => {
    expect(resolved?.config.diagnosticVersion).toBe('FDI-1.1');
    expect(resolved?.questionSet.questionSetVersion).toBe('FDI-QS-1.1');
  });

  it.each(golden.cases)('reproduces $label exactly', (testCase) => {
    if (!resolved) throw new Error('FDI-1.1 is not registered');
    const outcome = scoreFdi({
      diagnosticVersion: golden.diagnosticVersion,
      answers: answersForRaw(resolved.config, resolved.questionSet, testCase.targets),
    }, resolved.config, resolved.questionSet);
    if (!outcome.ok) throw new Error(`Expected FDI-1.1 score, got ${outcome.reason.code}`);

    expect({
      fdi: outcome.result.fdi,
      bandKey: outcome.result.band.key,
      componentRaws: outcome.result.components.map((component) => component.raw),
      alertKeys: outcome.result.alerts.flatMap((tier) => tier.components.map((component) => component.key)),
      concentrationKeys: outcome.result.concentration.componentKeys,
    }).toEqual(testCase.expected);
  });
});
