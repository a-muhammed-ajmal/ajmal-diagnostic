import {
  fdiBusinessDetailsSchema,
  fdiContactSchema,
  fdiSubmitSchema,
  parseFdiBusinessDetailsForVersion,
} from './validation';

const contact = {
  name: 'Ajmal Test',
  email: 'ajmalconsults@gmail.com',
  companyName: 'Test Co',
  phone: '+971 50 123 4567',
};

const submission = {
  sessionId: '11111111-1111-4111-8111-111111111111',
  sessionToken: 'x'.repeat(20),
  contact,
};

describe('FDI server validation', () => {
  it('requires name, company, email and mobile number at final submission', () => {
    expect(fdiContactSchema.safeParse(contact).success).toBe(true);
    expect(fdiContactSchema.safeParse({ ...contact, phone: undefined }).success).toBe(false);
    expect(fdiContactSchema.safeParse({ ...contact, phone: '123' }).success).toBe(false);
    expect(fdiContactSchema.safeParse({ ...contact, phone: 'call me' }).success).toBe(false);
    expect(fdiContactSchema.safeParse({ ...contact, phone: '0501234567' }).success).toBe(true);
  });

  // The four business details are optional: a skipped field must never fail the request.
  it('accepts absent, partial and untouched business details', () => {
    expect(fdiBusinessDetailsSchema.safeParse({}).success).toBe(true);
    expect(fdiBusinessDetailsSchema.safeParse({ employeeCount: 'employees_5_to_50' }).success).toBe(true);

    const untouched = fdiBusinessDetailsSchema.safeParse({
      annualRevenue: '', employeeCount: '', operatingYears: '', sector: '', sectorOther: '',
    });
    expect(untouched.success).toBe(true);
    expect(untouched.data).toEqual({
      annualRevenue: undefined, employeeCount: undefined, operatingYears: undefined, sector: undefined, sectorOther: undefined,
    });
  });

  it('still rejects a business detail outside its option list', () => {
    expect(fdiBusinessDetailsSchema.safeParse({ annualRevenue: 'over_9000' }).success).toBe(false);
    expect(fdiBusinessDetailsSchema.safeParse({ sector: 'space_tourism' }).success).toBe(false);
    expect(fdiBusinessDetailsSchema.safeParse({ sectorOther: 'x'.repeat(101) }).success).toBe(false);
    expect(fdiBusinessDetailsSchema.safeParse({ country: 'uae' }).success).toBe(false);
  });

  it('uses the FDI-1.1 sector list and requires free text for Other', () => {
    for (const sector of ['healthcare', 'technology', 'education']) {
      expect(fdiBusinessDetailsSchema.safeParse({ sector }).success).toBe(false);
    }
    expect(fdiBusinessDetailsSchema.safeParse({ sector: 'other' }).success).toBe(false);
    expect(fdiBusinessDetailsSchema.safeParse({ sector: 'other', sectorOther: 'Marine services' }).success).toBe(true);
  });

  it('keeps the historic sector taxonomy valid only for FDI-1.0 sessions', () => {
    expect(parseFdiBusinessDetailsForVersion({ sector: 'healthcare' }, 'FDI-1.0')).toMatchObject({ sector: 'healthcare' });
    expect(() => parseFdiBusinessDetailsForVersion({ sector: 'healthcare' }, 'FDI-1.1')).toThrow();
  });

  it('requires a session capability and complete contact details at final submission', () => {
    expect(fdiSubmitSchema.safeParse(submission).success).toBe(true);
    expect(fdiSubmitSchema.safeParse({ ...submission, businessDetails: { sector: 'other', sectorOther: 'Marine services' } }).success).toBe(true);
    expect(fdiSubmitSchema.safeParse({
      sessionId: 'not-a-uuid', sessionToken: 'short', contact: { name: 'A', email: 'invalid', companyName: 'B', phone: '1' },
    }).success).toBe(false);
  });
});
