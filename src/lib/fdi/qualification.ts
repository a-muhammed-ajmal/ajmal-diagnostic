/**
 * Consultant-only commercial qualification approved for FDI-1.0 Phase 3.
 *
 * This module is deliberately independent from scoreFdi. Commercial fit never
 * changes, suppresses, or reinterprets the Founder Dependency Index.
 */

export const FDI_QUALIFICATION_CONFIG_VERSION = 'FDI-QF-1.0';

export const FDI_PRIMARY_SECTORS = Object.freeze([
  'real_estate_business_services',
  'trading_distribution',
  'construction_contracting',
] as const);

export type QualificationStatus =
  | 'qualified_primary'
  | 'qualified_secondary'
  | 'outside_target_profile'
  | 'disqualified';

export interface QualificationInput {
  readonly country: 'uae' | 'other';
  readonly founderLed: boolean;
  readonly annualRevenue: 'under_1m' | 'aed_1m_to_10m' | 'over_10m';
  readonly employeeCount: 'under_5' | 'employees_5_to_50' | 'over_50';
  readonly operatingYears: 'under_3' | 'years_3_or_more';
  readonly singleDecisionAuthority: boolean;
  readonly willingToShareOperationalInformation: boolean;
  readonly primarySector: string;
  readonly secondarySector?: string;
  readonly otherSector?: string;
}

export interface QualificationOutcome {
  readonly result: QualificationStatus;
  readonly version: typeof FDI_QUALIFICATION_CONFIG_VERSION;
  readonly reasons: readonly string[];
}

const PRIMARY_SECTOR_SET = new Set<string>(FDI_PRIMARY_SECTORS);

function freezeOutcome(result: QualificationStatus, reasons: readonly string[]): QualificationOutcome {
  return Object.freeze({
    result,
    version: FDI_QUALIFICATION_CONFIG_VERSION,
    reasons: Object.freeze([...reasons]),
  });
}

export function evaluateQualification(input: QualificationInput): QualificationOutcome {
  const disqualifyingReasons: string[] = [];
  if (!input.founderLed) disqualifyingReasons.push('not_founder_led');
  if (!input.singleDecisionAuthority) disqualifyingReasons.push('no_single_decision_authority');
  if (!input.willingToShareOperationalInformation) {
    disqualifyingReasons.push('unwilling_to_share_operational_information');
  }
  if (disqualifyingReasons.length > 0) return freezeOutcome('disqualified', disqualifyingReasons);

  const outsideProfileReasons: string[] = [];
  if (input.country !== 'uae') outsideProfileReasons.push('outside_uae');
  if (input.annualRevenue !== 'aed_1m_to_10m') outsideProfileReasons.push('revenue_outside_target');
  if (input.employeeCount !== 'employees_5_to_50') outsideProfileReasons.push('team_size_outside_target');
  if (input.operatingYears !== 'years_3_or_more') outsideProfileReasons.push('operating_age_outside_target');
  if (outsideProfileReasons.length > 0) return freezeOutcome('outside_target_profile', outsideProfileReasons);

  return PRIMARY_SECTOR_SET.has(input.primarySector)
    ? freezeOutcome('qualified_primary', [])
    : freezeOutcome('qualified_secondary', []);
}
