/**
 * "What the answers indicate" (§14).
 *
 * ⚠️  NOT IMPLEMENTED — BLOCKED ON OPEN QUESTION A.
 *
 * §14 requires "two or three behavioral observations from deterministic response
 * rules" and gives an illustrative example:
 *
 *   "important decisions frequently wait for founder involvement; routine
 *    operating authority remains concentrated with the founder; execution is
 *    less dependent than decision-making"
 *
 * but it defines no rules. Missing: the trigger conditions, the sentence emitted
 * for each, and how two versus three are chosen when more conditions qualify.
 *
 * No rule format is invented here either. Designing a speculative rule DSL would
 * lock in a shape before the owner has specified the rules it must express, and
 * the spec is explicit that these observations are DETERMINISTIC — §16 forbids AI
 * from inferring them.
 *
 * Until question A is answered, every report ships `observations: []`. The rest
 * of the free diagnostic output (§14) — index, band, three components,
 * concentration, alerts, limitation, next step — is complete without it.
 */

import type { FdiResult } from './types';

/**
 * Returns the deterministic observations for a scored result.
 *
 * Always empty in FDI-1.0. The parameter is accepted so that call sites and the
 * report contract are already correct when the rules land.
 */
export function deriveObservations(result: FdiResult): readonly string[] {
  void result;
  return Object.freeze([]);
}
