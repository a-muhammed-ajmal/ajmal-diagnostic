import { fdiQualificationSchema, fdiSubmitSchema } from './validation';

const qualification = {
  country: 'uae',
  founderLed: true,
  annualRevenue: 'aed_1m_to_10m',
  employeeCount: 'employees_5_to_50',
  operatingYears: 'years_3_or_more',
  singleDecisionAuthority: true,
  willingToShareOperationalInformation: true,
  primarySector: 'real_estate_business_services',
};

describe('FDI server validation', () => {
  it('requires every explicit qualification response before completion', () => {
    expect(fdiQualificationSchema.safeParse(qualification).success).toBe(true);
    expect(fdiQualificationSchema.safeParse({ ...qualification, founderLed: undefined }).success).toBe(false);
  });

  it('requires a session capability and complete contact details at final submission', () => {
    expect(fdiSubmitSchema.safeParse({
      sessionId: '11111111-1111-4111-8111-111111111111',
      sessionToken: 'x'.repeat(20),
      contact: { name: 'Ajmal Test', email: 'ajmalconsults@gmail.com', companyName: 'Test Co' },
    }).success).toBe(true);
    expect(fdiSubmitSchema.safeParse({
      sessionId: 'not-a-uuid', sessionToken: 'short', contact: { name: 'A', email: 'invalid', companyName: 'B' },
    }).success).toBe(false);
  });
});
