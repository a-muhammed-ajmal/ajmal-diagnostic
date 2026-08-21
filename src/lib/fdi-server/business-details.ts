/**
 * Column mapping for the four OPTIONAL business details collected on the final
 * screen, kept free of Supabase so it can be tested directly.
 *
 * Nothing here throws. A blank or unrecognised column simply reads back as
 * "not answered": an unanswered optional field must never prevent a founder
 * from receiving a completed result (the FDI-QF-1.0 flow required all eight
 * pre-quiz answers and failed completion without them).
 */

import type { QualificationInput } from '@/lib/fdi/qualification';
import { ALL_FDI_SECTOR_VALUES, type FdiBusinessDetails } from './validation';

/** Column set written for these details. Legacy QF-1.0 columns are never written again. */
export type BusinessDetailColumns = {
  q_revenue_range?: string | null;
  q_team_size?: string | null;
  q_operating_years?: string | null;
  q_industry?: string | null;
  q_other_sector?: string | null;
};

export type BusinessDetailRow = {
  readonly q_revenue_range: string | null;
  readonly q_team_size: string | null;
  readonly q_operating_years: string | null;
  readonly q_industry: string | null;
  readonly q_other_sector: string | null;
};

const REVENUE_VALUES = ['under_1m', 'aed_1m_to_10m', 'over_10m'] as const;
const TEAM_SIZE_VALUES = ['under_5', 'employees_5_to_50', 'over_50'] as const;
const OPERATING_YEAR_VALUES = ['under_3', 'years_3_or_more'] as const;

function member<const T extends readonly string[]>(values: T, value: string | null): T[number] | undefined {
  return value !== null && (values as readonly string[]).includes(value) ? (value as T[number]) : undefined;
}

export function businessDetailColumns(details: Partial<FdiBusinessDetails> | undefined): BusinessDetailColumns {
  if (!details) return {};
  const columns: BusinessDetailColumns = {};
  if (details.annualRevenue !== undefined) columns.q_revenue_range = details.annualRevenue;
  if (details.employeeCount !== undefined) columns.q_team_size = details.employeeCount;
  if (details.operatingYears !== undefined) columns.q_operating_years = details.operatingYears;
  if (details.sector !== undefined) columns.q_industry = details.sector;
  // A typed sector is meaningful only alongside the 'other' option.
  if (details.sectorOther !== undefined) {
    columns.q_other_sector = details.sector === 'other' ? details.sectorOther || null : null;
  }
  return columns;
}

export function businessDetailsFromColumns(row: BusinessDetailRow): QualificationInput {
  return {
    annualRevenue: member(REVENUE_VALUES, row.q_revenue_range),
    employeeCount: member(TEAM_SIZE_VALUES, row.q_team_size),
    operatingYears: member(OPERATING_YEAR_VALUES, row.q_operating_years),
    sector: member(ALL_FDI_SECTOR_VALUES, row.q_industry),
    sectorOther: row.q_other_sector ?? undefined,
  };
}

/** Submitted details win over anything already stored, and a stored answer is never wiped by an omission. */
export function mergeBusinessDetails(
  stored: QualificationInput,
  submitted: Partial<FdiBusinessDetails> | undefined,
): FdiBusinessDetails {
  const merged: FdiBusinessDetails = {
    annualRevenue: submitted?.annualRevenue ?? stored.annualRevenue,
    employeeCount: submitted?.employeeCount ?? stored.employeeCount,
    operatingYears: submitted?.operatingYears ?? stored.operatingYears,
    sector: member(ALL_FDI_SECTOR_VALUES, submitted?.sector ?? stored.sector ?? null),
    sectorOther: submitted?.sectorOther ?? stored.sectorOther,
  };
  return merged;
}
