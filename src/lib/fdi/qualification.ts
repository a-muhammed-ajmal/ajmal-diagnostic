/**
 * Commercial qualification (§13).
 *
 * ⚠️  NOT IMPLEMENTED — BLOCKED ON OPEN QUESTIONS B AND B′.
 *
 * The specification requires that a qualification result be stored (§18) and
 * displayed beside the index (§13), but it never defines:
 *
 *   B  — the rule mapping inputs to a result, or the permitted result values.
 *        Only "Outside current target profile" is exemplified.
 *   B′ — which fields the diagnostic collects. Track B states a target profile
 *        (UAE · founder-led · AED 1–10M · 5–50 employees · 3+ years · founder
 *        decision authority · primary sectors) but that is a PROSPECT RESEARCH
 *        profile for outbound, and the spec does not say it is the diagnostic's
 *        qualification input set.
 *
 * Those are the owner's to answer. This module therefore returns an explicit
 * "not evaluated" result rather than a guess, and no caller may substitute a
 * placeholder rule. A wrong qualification rule is worse than an absent one: it
 * would be recorded against real respondents and stamped with a config version
 * implying it was specified.
 *
 * ── WHAT IS ALREADY GUARANTEED, INDEPENDENT OF THOSE ANSWERS ────────────────
 * §13 "Commercial qualification never touches Index scoring." That is enforced
 * structurally, not by convention: `scoreFdi` accepts only a diagnostic version
 * and an answer map, so nothing in this module — now or later — can reach it.
 * Revenue, size, sector, age and qualification status cannot increase, decrease,
 * suppress or reinterpret an FDI.
 */

export interface QualificationOutcome {
  /** Null until the rule is specified. Never inferred, never defaulted. */
  readonly result: string | null;
  /** The qualification config version stamped on the row. Null while unspecified. */
  readonly version: string | null;
  readonly reasons: readonly string[];
}

const NOT_EVALUATED: QualificationOutcome = Object.freeze({
  result: null,
  version: null,
  reasons: Object.freeze([]),
});

/**
 * Returns the "not evaluated" outcome.
 *
 * Deliberately takes no arguments: there is no defined input set (question B′),
 * so accepting one would invent the very thing that is blocked.
 */
export function evaluateQualification(): QualificationOutcome {
  return NOT_EVALUATED;
}
