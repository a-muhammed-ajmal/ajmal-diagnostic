/**
 * Interpretation bands (§9).
 *
 * Owner-pinned (answer I): bands are HALF-OPEN LOWER BOUNDS and the function is
 * total over the continuous interval [0, componentScale] — every real value in
 * that interval maps to exactly one band, with no gap between 24 and 25.
 *
 * Owner-pinned (answer G): the caller passes the UNROUNDED composite.
 *
 * §9: the numeric score is stored independently from the label so bands can
 * recalibrate later without destroying history. That is why this returns the
 * whole BandDef (key + label + displayRange) and the persistence layer stores
 * `band_key` and `band_label` in separate columns.
 *
 * These are provisional v1 operating bands. They are NOT industry benchmarks,
 * population percentiles, validated cutoffs, or claims about business performance.
 */

import type { BandDef, FdiConfig } from './types';

/**
 * Returns the band a value falls into.
 *
 * Scans descending and returns the first band whose `minInclusive` is <= value,
 * which is exactly half-open lower-bound semantics.
 *
 * @throws RangeError if the value is outside [0, componentScale]. Band
 * membership is only defined on the index's own scale; a value outside it is a
 * programming error, not a band.
 */
export function bandFor(value: number, config: FdiConfig): BandDef {
  if (!Number.isFinite(value)) {
    throw new RangeError(`bandFor: expected a finite number, received ${value}`);
  }
  if (value < 0 || value > config.componentScale) {
    throw new RangeError(
      `bandFor: ${value} is outside the index scale [0, ${config.componentScale}]`,
    );
  }

  for (let i = config.bands.length - 1; i >= 0; i -= 1) {
    const band = config.bands[i];
    if (value >= band.minInclusive) {
      return band;
    }
  }

  // Unreachable when the config passes its integrity test, which requires the
  // lowest band to start at 0. Kept explicit rather than returning a default,
  // so a malformed config fails loudly instead of silently mislabelling a score.
  throw new RangeError(
    `bandFor: no band covers ${value}; the lowest band starts above the scale minimum`,
  );
}
