import { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS } from './config';
import { evaluateQualification, type QualificationInput } from './qualification';
import { scoreFdi } from './score';
import { answersForRaw } from './test-support';

const qualifyingInput: QualificationInput = {
  annualRevenue: 'aed_1m_to_10m',
  employeeCount: 'employees_5_to_50',
  operatingYears: 'years_3_or_more',
  sector: 'real_estate_business_services',
};

describe('FDI qualification', () => {
  it('classifies a target-profile business in a primary sector', () => {
    expect(evaluateQualification(qualifyingInput)).toMatchObject({
      result: 'qualified_primary',
      version: 'FDI-QF-2.0',
      reasons: [],
    });
  });

  it('stamps the active FDI-1.1 taxonomy with FDI-QF-2.1', () => {
    expect(evaluateQualification(qualifyingInput, 'FDI-QF-2.1')).toMatchObject({
      result: 'qualified_primary',
      version: 'FDI-QF-2.1',
      reasons: [],
    });
  });

  it('classifies an otherwise-qualified non-primary sector as secondary', () => {
    expect(evaluateQualification({ ...qualifyingInput, sector: 'professional_services' }))
      .toMatchObject({ result: 'qualified_secondary', reasons: [] });
  });

  it('classifies a basic-target miss as outside target profile', () => {
    expect(evaluateQualification({ ...qualifyingInput, annualRevenue: 'under_1m', employeeCount: 'over_50' }))
      .toMatchObject({ result: 'outside_target_profile', reasons: ['revenue_outside_target', 'team_size_outside_target'] });
  });

  // Every business detail is optional, so absent answers must never break completion.
  it('records no assessment when the founder shares no business details', () => {
    expect(evaluateQualification({})).toMatchObject({
      result: 'not_assessed',
      version: 'FDI-QF-2.0',
      reasons: ['business_details_not_provided'],
    });
    expect(evaluateQualification({ sectorOther: '' })).toMatchObject({ result: 'not_assessed' });
  });

  it('classifies on what was shared and names what was not', () => {
    expect(evaluateQualification({ sector: 'trading_distribution' })).toMatchObject({
      result: 'qualified_primary',
      reasons: ['revenue_not_provided', 'team_size_not_provided', 'operating_age_not_provided'],
    });
    expect(evaluateQualification({ annualRevenue: 'over_10m' })).toMatchObject({
      result: 'outside_target_profile',
      reasons: ['revenue_outside_target', 'team_size_not_provided', 'operating_age_not_provided', 'sector_not_provided'],
    });
  });

  it('treats an unshared sector as secondary rather than inventing a primary match', () => {
    expect(evaluateQualification({ ...qualifyingInput, sector: undefined })).toMatchObject({
      result: 'qualified_secondary',
      reasons: ['sector_not_provided'],
    });
  });

  it('cannot influence the score because scoring accepts no qualification input', () => {
    const answers = answersForRaw(FDI_1_0_CONFIG, FDI_1_0_QUESTIONS, { DS: 6, EC: 6, OV: 6 });
    const first = scoreFdi({ diagnosticVersion: FDI_1_0_CONFIG.diagnosticVersion, answers }, FDI_1_0_CONFIG, FDI_1_0_QUESTIONS);
    evaluateQualification({ ...qualifyingInput, annualRevenue: 'under_1m' });
    evaluateQualification({});
    const second = scoreFdi({ diagnosticVersion: FDI_1_0_CONFIG.diagnosticVersion, answers }, FDI_1_0_CONFIG, FDI_1_0_QUESTIONS);

    expect(first).toEqual(second);
  });
});
