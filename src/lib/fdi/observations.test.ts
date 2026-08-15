import { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS } from './config';
import { deriveObservations } from './observations';
import { scoreFdi } from './score';
import { answersForRaw } from './test-support';
import type { FdiResult } from './types';

function scored(targets: Record<string, number>): FdiResult {
  const outcome = scoreFdi(
    {
      diagnosticVersion: FDI_1_0_CONFIG.diagnosticVersion,
      answers: answersForRaw(FDI_1_0_CONFIG, FDI_1_0_QUESTIONS, targets),
    },
    FDI_1_0_CONFIG,
    FDI_1_0_QUESTIONS,
  );
  if (!outcome.ok) throw new Error('unexpected rejection');
  return outcome.result;
}

describe('approved deterministic observations', () => {
  it('shows the top three dependency findings with component coverage when three or more qualify', () => {
    const result = scored({ DS: 12, EC: 12, OV: 8 });

    expect(deriveObservations(result)).toEqual([
      'Important operating decisions slow down when you are unavailable.',
      'Important recurring work still depends materially on knowledge held by individuals rather than usable systems.',
      'You still depend heavily on asking people to understand the current status of the business.',
    ]);
  });

  it('shows exactly two dependency findings when exactly two questions qualify', () => {
    const result = scored({ DS: 5, EC: 0, OV: 0 });

    expect(deriveObservations(result)).toEqual([
      'Important operating decisions slow down when you are unavailable.',
      'Meaningful operating authority is still concentrated with you.',
    ]);
  });

  it('pairs one dependency finding with the strongest positive finding from another component', () => {
    const result = scored({ DS: 2, EC: 0, OV: 0 });

    expect(deriveObservations(result)).toEqual([
      'Important operating decisions slow down when you are unavailable.',
      'Critical recurring work is largely supported by documented, usable processes.',
    ]);
  });

  it('shows one strongest positive finding per component when no answer indicates dependency', () => {
    const result = scored({ DS: 0, EC: 0, OV: 0 });

    expect(deriveObservations(result)).toEqual([
      'Most operating decisions can continue when you are unavailable.',
      'Critical recurring work is largely supported by documented, usable processes.',
      'Important operating status is generally visible without repeatedly asking individuals for updates.',
    ]);
  });
});
