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
import { FDI_1_0_QUESTIONS } from '../questions/fdi-questions-1.0';

export interface ResolvedVersion {
  readonly config: FdiConfig;
  readonly questionSet: FdiQuestionSet;
}

const REGISTRY: Readonly<Record<string, ResolvedVersion>> = Object.freeze({
  [FDI_1_0_CONFIG.diagnosticVersion]: Object.freeze({
    config: FDI_1_0_CONFIG,
    questionSet: FDI_1_0_QUESTIONS,
  }),
});

/** The version served to new respondents. */
export const CURRENT_DIAGNOSTIC_VERSION = FDI_1_0_CONFIG.diagnosticVersion;

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

export { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS };
