import { resolveFdiSessionVersion } from './persistence';

function sessionVersion(diagnosticVersion: string, questionSetVersion: string) {
  return {
    diagnostic_version: diagnosticVersion,
    question_set_version: questionSetVersion,
    scoring_model_version: 'FDI-SM-1.0',
    band_config_version: 'FDI-BC-1.0',
  };
}

describe('persisted FDI version resolution', () => {
  it('keeps FDI-1.0 sessions on their original instrument', () => {
    const resolved = resolveFdiSessionVersion(sessionVersion('FDI-1.0', 'FDI-QS-1.0'));
    expect(resolved.config.diagnosticVersion).toBe('FDI-1.0');
    expect(resolved.questionSet.questionSetVersion).toBe('FDI-QS-1.0');
    expect(resolved.qualificationConfigVersion).toBe('FDI-QF-2.0');
  });

  it('uses FDI-1.1 and its qualification taxonomy for new sessions', () => {
    const resolved = resolveFdiSessionVersion(sessionVersion('FDI-1.1', 'FDI-QS-1.1'));
    expect(resolved.config.diagnosticVersion).toBe('FDI-1.1');
    expect(resolved.questionSet.questionSetVersion).toBe('FDI-QS-1.1');
    expect(resolved.qualificationConfigVersion).toBe('FDI-QF-2.1');
  });

  it('rejects inconsistent version stamps instead of silently using the current version', () => {
    expect(() => resolveFdiSessionVersion(sessionVersion('FDI-1.0', 'FDI-QS-1.1')))
      .toThrow('inconsistent version stamps');
  });
});
