import { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS } from './config';
import { evaluateQualification, type QualificationInput } from './qualification';
import { scoreFdi } from './score';
import { answersForRaw } from './test-support';

const qualifyingInput: QualificationInput = {
  country: 'uae',
  founderLed: true,
  annualRevenue: 'aed_1m_to_10m',
  employeeCount: 'employees_5_to_50',
  operatingYears: 'years_3_or_more',
  singleDecisionAuthority: true,
  willingToShareOperationalInformation: true,
  primarySector: 'real_estate_business_services',
};

describe('FDI qualification', () => {
  it('classifies a target-profile business in a primary sector', () => {
    expect(evaluateQualification(qualifyingInput)).toMatchObject({
      result: 'qualified_primary',
      version: 'FDI-QF-1.0',
      reasons: [],
    });
  });

  it('classifies an otherwise-qualified non-primary sector as secondary', () => {
    expect(evaluateQualification({ ...qualifyingInput, primarySector: 'professional_services' }))
      .toMatchObject({ result: 'qualified_secondary', reasons: [] });
  });

  it('classifies a basic-target miss as outside target profile', () => {
    expect(evaluateQualification({ ...qualifyingInput, country: 'other', annualRevenue: 'under_1m' }))
      .toMatchObject({ result: 'outside_target_profile', reasons: ['outside_uae', 'revenue_outside_target'] });
  });

  it('gives disqualification precedence over an outside-profile answer', () => {
    expect(evaluateQualification({ ...qualifyingInput, country: 'other', founderLed: false }))
      .toMatchObject({ result: 'disqualified', reasons: ['not_founder_led'] });
  });

  it('cannot influence the score because scoring accepts no qualification input', () => {
    const answers = answersForRaw(FDI_1_0_CONFIG, FDI_1_0_QUESTIONS, { DS: 6, EC: 6, OV: 6 });
    const first = scoreFdi({ diagnosticVersion: FDI_1_0_CONFIG.diagnosticVersion, answers }, FDI_1_0_CONFIG, FDI_1_0_QUESTIONS);
    evaluateQualification({ ...qualifyingInput, founderLed: false });
    const second = scoreFdi({ diagnosticVersion: FDI_1_0_CONFIG.diagnosticVersion, answers }, FDI_1_0_CONFIG, FDI_1_0_QUESTIONS);

    expect(first).toEqual(second);
  });
});
