/**
 * Version registry.
 *
 * §18: a historic response may be recalculated USING THAT SAME VERSION'S
 * configuration to confirm reproducibility. That is what this registry exists
 * for: `resolveConfig(row.diagnostic_version)` returns the exact config the
 * session was scored under, however many versions have shipped since.
 *
 * Adding a version means adding a file and an entry here. It never means editing
 * an existing entry.
 */

import type { FdiConfig, FdiQuestionSet } from '../types';
import { FDI_1_0_CONFIG } from './fdi-1.0';
import { FDI_1_1_CONFIG } from './fdi-1.1';
import { FDI_1_0_QUESTIONS } from '../questions/fdi-questions-1.0';
import { FDI_1_1_QUESTIONS } from '../questions/fdi-questions-1.1';
import type { QualificationConfigVersion } from '../qualification';

export interface ResolvedVersion {
  readonly config: FdiConfig;
  readonly questionSet: FdiQuestionSet;
  /** Qualification is separate from scoring, but it is versioned with the session. */
  readonly qualificationConfigVersion: QualificationConfigVersion;
}

const REGISTRY: Readonly<Record<string, ResolvedVersion>> = Object.freeze({
  [FDI_1_0_CONFIG.diagnosticVersion]: Object.freeze({
    config: FDI_1_0_CONFIG,
    questionSet: FDI_1_0_QUESTIONS,
    qualificationConfigVersion: 'FDI-QF-2.0',
  }),
  [FDI_1_1_CONFIG.diagnosticVersion]: Object.freeze({
    config: FDI_1_1_CONFIG,
    questionSet: FDI_1_1_QUESTIONS,
    qualificationConfigVersion: 'FDI-QF-2.1',
  }),
});

/** The version served to new respondents. */
export const CURRENT_DIAGNOSTIC_VERSION = FDI_1_1_CONFIG.diagnosticVersion;

/**
 * Returns the config + question set for a version key, or undefined if unknown.
 * An unknown version is a §12 rejection ("Diagnostic-version mismatch | Reject"),
 * never a fallback to the current version.
 */
export function resolveVersion(diagnosticVersion: string): ResolvedVersion | undefined {
  return Object.prototype.hasOwnProperty.call(REGISTRY, diagnosticVersion)
    ? REGISTRY[diagnosticVersion]
    : undefined;
}

export function knownDiagnosticVersions(): readonly string[] {
  return Object.freeze(Object.keys(REGISTRY));
}

export const CURRENT_FDI_VERSION = REGISTRY[CURRENT_DIAGNOSTIC_VERSION];
export const CURRENT_FDI_QUESTION_SET = CURRENT_FDI_VERSION.questionSet;

export { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS, FDI_1_1_CONFIG, FDI_1_1_QUESTIONS };
