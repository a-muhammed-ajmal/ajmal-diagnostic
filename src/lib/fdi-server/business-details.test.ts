import { businessDetailColumns, businessDetailsFromColumns, mergeBusinessDetails, type BusinessDetailRow } from './business-details';

const emptyRow: BusinessDetailRow = {
  q_revenue_range: null,
  q_team_size: null,
  q_operating_years: null,
  q_industry: null,
  q_other_sector: null,
};

describe('FDI business details', () => {
  it('maps each provided detail to its session column', () => {
    expect(businessDetailColumns({
      annualRevenue: 'aed_1m_to_10m',
      employeeCount: 'employees_5_to_50',
      operatingYears: 'years_3_or_more',
      sector: 'trading_distribution',
      sectorOther: undefined,
    })).toEqual({
      q_revenue_range: 'aed_1m_to_10m',
      q_team_size: 'employees_5_to_50',
      q_operating_years: 'years_3_or_more',
      q_industry: 'trading_distribution',
    });
  });

  it('writes no column for a detail the founder skipped', () => {
    expect(businessDetailColumns({})).toEqual({});
    expect(businessDetailColumns(undefined)).toEqual({});
    expect(businessDetailColumns({ employeeCount: 'under_5' })).toEqual({ q_team_size: 'under_5' });
  });

  it('keeps a typed sector only alongside the other option', () => {
    expect(businessDetailColumns({ sector: 'other', sectorOther: 'Marine services' }))
      .toEqual({ q_industry: 'other', q_other_sector: 'Marine services' });
    expect(businessDetailColumns({ sector: 'healthcare', sectorOther: 'Marine services' }))
      .toEqual({ q_industry: 'healthcare', q_other_sector: null });
    expect(businessDetailColumns({ sector: 'other', sectorOther: '' }))
      .toEqual({ q_industry: 'other', q_other_sector: null });
  });

  // The FDI-QF-1.0 flow threw when a pre-quiz answer was missing, which would now
  // deny a founder their completed result. Reading back must never throw.
  it('reads a partly filled row back without throwing', () => {
    expect(businessDetailsFromColumns(emptyRow)).toEqual({
      annualRevenue: undefined,
      employeeCount: undefined,
      operatingYears: undefined,
      sector: undefined,
      sectorOther: undefined,
    });
    expect(businessDetailsFromColumns({ ...emptyRow, q_team_size: 'over_50' }))
      .toMatchObject({ employeeCount: 'over_50', annualRevenue: undefined });
  });

  it('discards a column value outside its option list', () => {
    expect(businessDetailsFromColumns({
      ...emptyRow,
      q_revenue_range: 'legacy_band',
      q_industry: 'no_longer_offered',
      q_operating_years: '',
    })).toMatchObject({ annualRevenue: undefined, sector: undefined, operatingYears: undefined });
  });

  it('lets a submitted detail win without wiping one already stored', () => {
    const stored = businessDetailsFromColumns({ ...emptyRow, q_team_size: 'under_5', q_industry: 'healthcare' });
    expect(mergeBusinessDetails(stored, { employeeCount: 'employees_5_to_50' })).toEqual({
      annualRevenue: undefined,
      employeeCount: 'employees_5_to_50',
      operatingYears: undefined,
      sector: 'healthcare',
      sectorOther: undefined,
    });
    expect(mergeBusinessDetails(stored, undefined)).toMatchObject({ employeeCount: 'under_5', sector: 'healthcare' });
  });
});
