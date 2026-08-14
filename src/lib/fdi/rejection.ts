/**
 * Transport mapping for §12 reject conditions.
 *
 * Every reject condition is a BAD REQUEST, not a server fault. This matters:
 * the legacy /api/submit route calls `schema.parse()` inside one catch-all and
 * returns 500 for a malformed body, so a validation failure is indistinguishable
 * from an outage in logs and shows the user "Something went wrong. Please try
 * again." for an input they could fix. The FDI route must not repeat that.
 *
 * Kept as a pure table so the contract is testable without a route handler.
 */

import type { ScoreRejectionCode } from './types';

export const REJECTION_STATUS: Readonly<Record<ScoreRejectionCode, 400>> = Object.freeze({
  VERSION_MISMATCH: 400,
  UNKNOWN_QUESTION_ID: 400,
  INVALID_OPTION: 400,
  INCOMPLETE: 400,
});

export function httpStatusForRejection(code: ScoreRejectionCode): 400 {
  const status = REJECTION_STATUS[code];
  if (!status) {
    throw new RangeError(`Unknown rejection code: ${code}`);
  }
  return status;
}
