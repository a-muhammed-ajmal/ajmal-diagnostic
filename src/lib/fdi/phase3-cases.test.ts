import { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS } from './config';
import { evaluateQualification } from './qualification';
import { scoreFdi } from './score';
import { answersForRaw } from './test-support';

function score(raw: Record<string, number>) {
  return scoreFdi({
    diagnosticVersion: FDI_1_0_CONFIG.diagnosticVersion,
    answers: answersForRaw(FDI_1_0_CONFIG, FDI_1_0_QUESTIONS, raw),
  }, FDI_1_0_CONFIG, FDI_1_0_QUESTIONS);
}

const qualifyingProfile = {
  country: 'uae' as const,
  founderLed: true,
  annualRevenue: 'aed_1m_to_10m' as const,
  employeeCount: 'employees_5_to_50' as const,
  operatingYears: 'years_3_or_more' as const,
  singleDecisionAuthority: true,
  willingToShareOperationalInformation: true,
  primarySector: 'real_estate_business_services',
};

describe('Phase 3 QA outcome examples', () => {
  it('low: all components at zero reports Low Founder Dependency', () => {
    const outcome = score({ DS: 0, EC: 0, OV: 0 });
    expect(outcome).toMatchObject({ ok: true, result: { fdi: { display: 0 }, band: { key: 'low' } } });
  });

  it('moderate: a 25 boundary score lands in Moderate Founder Dependency', () => {
    const outcome = score({ DS: 3, EC: 3, OV: 3 });
    expect(outcome).toMatchObject({ ok: true, result: { fdi: { unrounded: 25, display: 25 }, band: { key: 'moderate' } } });
  });

  it('high: evenly distributed raw seven scores High Founder Dependency', () => {
    const outcome = score({ DS: 7, EC: 7, OV: 7 });
    expect(outcome).toMatchObject({ ok: true, result: { fdi: { display: 58 }, band: { key: 'high' } } });
  });

  it('severe component: Decision Speed alert is shown without inflating the composite', () => {
    const outcome = score({ DS: 9, EC: 4, OV: 4 });
    if (!outcome.ok) throw new Error('unexpected rejection');
    expect(outcome.result.fdi.display).toBe(47);
    expect(outcome.result.alerts).toEqual(expect.arrayContaining([
      expect.objectContaining({ components: [expect.objectContaining({ key: 'DS' })] }),
    ]));
  });

  it('unqualified: commercial disqualification leaves a valid FDI untouched', () => {
    const outcome = score({ DS: 6, EC: 6, OV: 6 });
    expect(outcome).toMatchObject({ ok: true, result: { fdi: { display: 50 }, band: { key: 'high' } } });
    expect(evaluateQualification({ ...qualifyingProfile, founderLed: false })).toMatchObject({ result: 'disqualified' });
  });

  it('incomplete: eleven answers produce no FDI result', () => {
    const all = answersForRaw(FDI_1_0_CONFIG, FDI_1_0_QUESTIONS, { DS: 6, EC: 6, OV: 6 });
    const missingOne = Object.fromEntries(Object.entries(all).slice(0, -1));
    const outcome = scoreFdi({ diagnosticVersion: FDI_1_0_CONFIG.diagnosticVersion, answers: missingOne }, FDI_1_0_CONFIG, FDI_1_0_QUESTIONS);
    expect(outcome).toEqual({ ok: false, reason: { code: 'INCOMPLETE', missingQuestionIds: ['OV4'] } });
  });
});
