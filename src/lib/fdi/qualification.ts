/**
 * Consultant-only commercial qualification.
 *
 * This module is deliberately independent from scoreFdi. Commercial fit never
 * changes, suppresses, or reinterprets the Founder Dependency Index.
 *
 * FDI-QF-2.0 works from the four OPTIONAL business details collected on the
 * final screen. Every input may be absent: a founder who answers none of them
 * still receives a complete result, and the outcome is then 'not_assessed'
 * rather than an invented classification. Missing answers are recorded as
 * explicit `*_not_provided` reasons so a thin classification is never mistaken
 * for a confirmed one.
 */

/** Preserved for FDI-1.0 sessions. */
export const FDI_QUALIFICATION_CONFIG_VERSION = 'FDI-QF-2.0';
/** Business Health Check FDI-1.1 taxonomy. */
export const FDI_QUALIFICATION_CONFIG_VERSION_2_1 = 'FDI-QF-2.1';

export type QualificationConfigVersion =
  | typeof FDI_QUALIFICATION_CONFIG_VERSION
  | typeof FDI_QUALIFICATION_CONFIG_VERSION_2_1;

export const FDI_PRIMARY_SECTORS = Object.freeze([
  'real_estate_business_services',
  'trading_distribution',
  'construction_contracting',
] as const);

export type QualificationStatus =
  | 'qualified_primary'
  | 'qualified_secondary'
  | 'outside_target_profile'
  | 'not_assessed'
  /** Historic FDI-QF-1.0 rows only. QF-2.0 no longer asks the questions that produced it. */
  | 'disqualified';

export interface QualificationInput {
  readonly annualRevenue?: 'under_1m' | 'aed_1m_to_10m' | 'over_10m';
  readonly employeeCount?: 'under_5' | 'employees_5_to_50' | 'over_50';
  readonly operatingYears?: 'under_3' | 'years_3_or_more';
  readonly sector?: string;
  readonly sectorOther?: string;
}

export interface QualificationOutcome {
  readonly result: QualificationStatus;
  readonly version: QualificationConfigVersion;
  readonly reasons: readonly string[];
}

const PRIMARY_SECTOR_SET = new Set<string>(FDI_PRIMARY_SECTORS);

function freezeOutcome(
  version: QualificationConfigVersion,
  result: QualificationStatus,
  reasons: readonly string[],
): QualificationOutcome {
  return Object.freeze({
    result,
    version,
    reasons: Object.freeze([...reasons]),
  });
}

/**
 * Qualification is deliberately separate from scoring. Callers pass the
 * session's registry-resolved version so a historic FDI-1.0 record keeps its
 * original FDI-QF-2.0 stamp while FDI-1.1 receives FDI-QF-2.1.
 */
export function evaluateQualification(
  input: QualificationInput,
  version: QualificationConfigVersion = FDI_QUALIFICATION_CONFIG_VERSION,
): QualificationOutcome {
  const outsideProfileReasons: string[] = [];
  const missingReasons: string[] = [];

  if (input.annualRevenue === undefined) missingReasons.push('revenue_not_provided');
  else if (input.annualRevenue !== 'aed_1m_to_10m') outsideProfileReasons.push('revenue_outside_target');

  if (input.employeeCount === undefined) missingReasons.push('team_size_not_provided');
  else if (input.employeeCount !== 'employees_5_to_50') outsideProfileReasons.push('team_size_outside_target');

  if (input.operatingYears === undefined) missingReasons.push('operating_age_not_provided');
  else if (input.operatingYears !== 'years_3_or_more') outsideProfileReasons.push('operating_age_outside_target');

  if (input.sector === undefined) missingReasons.push('sector_not_provided');

  // Nothing was shared, so there is nothing to classify against. This is a
  // normal outcome, not a failure: the founder still receives the full result.
  if (missingReasons.length === 4) return freezeOutcome(version, 'not_assessed', missingReasons);

  if (outsideProfileReasons.length > 0) {
    return freezeOutcome(version, 'outside_target_profile', [...outsideProfileReasons, ...missingReasons]);
  }

  return input.sector !== undefined && PRIMARY_SECTOR_SET.has(input.sector)
    ? freezeOutcome(version, 'qualified_primary', missingReasons)
    : freezeOutcome(version, 'qualified_secondary', missingReasons);
}
