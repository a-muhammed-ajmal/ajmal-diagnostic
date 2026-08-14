/**
 * Display rounding (§7 "Round only for display").
 *
 * Owner-pinned (answer H): half-up.
 *
 * Note on reachability: under FDI-1.0's structure no reachable value ever lands
 * exactly on .5 — component values are raw·25/3 and composite values are
 * sum·25/9, and neither family produces a half. The rule is pinned anyway so
 * that reproducibility does not depend on an accident of the current item count.
 */

import type { RoundingRule } from './types';

/**
 * Half-up rounding for non-negative values.
 *
 * Implemented as floor + fractional comparison rather than `Math.floor(x + 0.5)`
 * because adding 0.5 can carry a value such as 0.49999999999999994 across the
 * boundary through floating-point rounding alone.
 */
export function roundHalfUp(value: number): number {
  if (!Number.isFinite(value)) {
    throw new RangeError(`roundHalfUp: expected a finite number, received ${value}`);
  }
  const floor = Math.floor(value);
  return value - floor >= 0.5 ? floor + 1 : floor;
}

const ROUNDERS: Readonly<Record<RoundingRule, (value: number) => number>> = Object.freeze({
  'half-up': roundHalfUp,
});

/** Selects the rounding function named by a config's `rounding` field. */
export function rounderFor(rule: RoundingRule): (value: number) => number {
  const rounder = ROUNDERS[rule];
  if (!rounder) {
    throw new RangeError(`Unknown rounding rule: ${rule}`);
  }
  return rounder;
}
