/**
 * Founder Dependency Index — shared types.
 *
 * SPEC: FDI-1.0. Every measurement constant (item count, item range, scale,
 * weights, alert threshold, band edges) lives in FdiConfig, never in code.
 *
 * This module is type-only plus pure data shapes. It must never import a
 * database client, an AI client, an email client, or anything from `next/*`.
 */

/** One measured component, e.g. Decision Speed. */
export interface ComponentDef {
  readonly key: string;
  readonly label: string;
}

/**
 * One interpretation band (§9).
 *
 * Bands are stored as HALF-OPEN LOWER BOUNDS: a value belongs to the band with
 * the greatest `minInclusive` that is <= the value. With bands declared at
 * 0/25/50/75 this tiles [0, 100] as [0,25) [25,50) [50,75) [75,100] with no gap
 * and no overlap, so the band function is total over the continuous interval.
 *
 * `displayRange` ("0–24") is presentation text only and is NEVER used to decide
 * membership. `key` is stored separately from `label` in the database so bands
 * can be relabelled later without destroying history (§9).
 */
export interface BandDef {
  readonly key: string;
  readonly label: string;
  readonly minInclusive: number;
  readonly displayRange: string;
}

/**
 * Whether a threshold comparison reads the unrounded or the display value.
 *
 * Pinned for FDI-1.0: both band assignment and the component alert read the
 * UNROUNDED value (§7 "Compute using unrounded component values. Round only for
 * display."). Kept configurable because a future version that changes item
 * count, item range or weights would make the two readings diverge.
 */
export type BoundaryInput = 'unrounded' | 'display';

/** Display rounding rule. Pinned half-up for FDI-1.0. */
export type RoundingRule = 'half-up';

export interface FdiConfig {
  readonly instrument: 'FDI';

  /** §18 — the four version keys stamped on every session. */
  readonly diagnosticVersion: string;
  readonly questionSetVersion: string;
  readonly scoringModelVersion: string;
  readonly bandConfigVersion: string;

  /** §2 — the components. Their count IS the "3"; it is never written literally. */
  readonly components: readonly ComponentDef[];

  /** §3 — instrument structure. rawMax is derived: itemsPerComponent * itemScoreMax. */
  readonly itemsPerComponent: number;
  readonly itemScoreMin: number;
  readonly itemScoreMax: number;

  /** §7 — normalisation target. The "100". */
  readonly componentScale: number;

  /** §8 — equal weighting for v1: DS 1, EC 1, OV 1. The composite divisor is their sum. */
  readonly weights: Readonly<Record<string, number>>;

  /** §10 — severe component alert. The "75". */
  readonly componentAlertThreshold: number;

  /** §9 — ordered ascending by minInclusive. */
  readonly bands: readonly BandDef[];

  readonly bandInput: BoundaryInput;
  readonly alertInput: BoundaryInput;
  readonly rounding: RoundingRule;

  /**
   * §9 — canonical presentation. Placeholders: {display} {scaleMax} {bandLabel}.
   * Built in exactly one place so the index can never be rendered without its
   * dependency wording beside it, and never as a percentage.
   */
  readonly presentationTemplate: string;

  /** §14 — fixed limitation copy shown with every report. */
  readonly limitationCopy: string;

  /** §14 — "Next step: Audit". */
  readonly nextStep: { readonly label: string; readonly href: string };
}

/** One response option. `score` is carried on the option, never derived from position. */
export interface QuestionOption {
  readonly id: string;
  readonly score: number;
  readonly text: string;
}

export interface Question {
  readonly id: string;
  readonly componentKey: string;
  readonly text: string;
  /** Ordered low -> high dependency (§17). Never randomised. */
  readonly options: readonly QuestionOption[];
  /** §4 — what the paid Audit uses to verify this item, where the spec states one. */
  readonly auditNote?: string;
}

export interface FdiQuestionSet {
  readonly questionSetVersion: string;
  readonly questions: readonly Question[];
}

/** questionId -> optionId. A map, so duplicate ids are structurally impossible (§12). */
export type FdiAnswers = Readonly<Record<string, string>>;

export type ScoreRejectionCode =
  | 'VERSION_MISMATCH'
  | 'UNKNOWN_QUESTION_ID'
  | 'INVALID_OPTION'
  | 'INCOMPLETE';

export type ScoreRejection =
  | { readonly code: 'VERSION_MISMATCH'; readonly submitted: string | null }
  | { readonly code: 'UNKNOWN_QUESTION_ID'; readonly questionIds: readonly string[] }
  | { readonly code: 'INVALID_OPTION'; readonly questionIds: readonly string[] }
  | { readonly code: 'INCOMPLETE'; readonly missingQuestionIds: readonly string[] };

export interface ScoredAnswer {
  readonly questionId: string;
  readonly componentKey: string;
  readonly optionId: string;
  readonly score: number;
}

export interface ComponentResult {
  readonly key: string;
  readonly label: string;
  /** §7 raw component: sum of its items, 0..rawMax. */
  readonly raw: number;
  readonly rawMax: number;
  /** §7 normalised, UNROUNDED. Stored. */
  readonly unrounded: number;
  /** §7 normalised, rounded for display only. */
  readonly display: number;
  /** §10 — at or above componentAlertThreshold. */
  readonly alert: boolean;
}

/**
 * §10 — alerted components grouped into tiers, ordered by score DESCENDING.
 *
 * Components that tie sit together inside one tier with no further ordering,
 * the same treatment §11 requires for concentration. Array order WITHIN a tier
 * is config declaration order: it is a deterministic serialisation order for a
 * group displayed together, never a ranking or a tie-break.
 */
export interface AlertTier {
  readonly raw: number;
  readonly unrounded: number;
  readonly display: number;
  readonly components: readonly { readonly key: string; readonly label: string }[];
}

/**
 * §11 — the highest component(s). If two or three tie at the highest value, ALL
 * are present. No source-order, array-position or alphabetical tie-break is used
 * to pick a single winner.
 */
export interface Concentration {
  readonly componentKeys: readonly string[];
  readonly labels: readonly string[];
  readonly raw: number;
  readonly unrounded: number;
  readonly display: number;
}

export interface FdiVersions {
  readonly instrument: 'FDI';
  readonly diagnostic: string;
  readonly questionSet: string;
  readonly scoringModel: string;
  readonly bandConfig: string;
}

export interface FdiResult {
  readonly versions: FdiVersions;
  /** §7 — raw answers are stored. */
  readonly answers: readonly ScoredAnswer[];
  readonly components: readonly ComponentResult[];
  /** §7 — unrounded composite and displayed FDI. */
  readonly fdi: { readonly unrounded: number; readonly display: number };
  readonly band: { readonly key: string; readonly label: string; readonly displayRange: string };
  readonly alerts: readonly AlertTier[];
  readonly concentration: Concentration;
}

export type ScoreOutcome =
  | { readonly ok: true; readonly result: FdiResult }
  | { readonly ok: false; readonly reason: ScoreRejection };

/** §16 — AI output is additive and may be absent. It never participates in scoring. */
export interface AiNarrative {
  readonly [key: string]: unknown;
}

export interface FdiReport {
  readonly instrument: 'FDI';
  readonly sessionId: string;
  /** ISO timestamp, stamped by the caller. The engine has no clock. */
  readonly completedAt: string;
  readonly versions: FdiVersions;

  readonly index: {
    readonly unrounded: number;
    readonly display: number;
    readonly scaleMax: number;
    readonly band: { readonly key: string; readonly label: string; readonly displayRange: string };
    /** §9 canonical string. Never a percentage. */
    readonly presentation: string;
  };

  readonly components: readonly ComponentResult[];
  readonly alerts: readonly AlertTier[];
  readonly concentration: Concentration;

  /** §14 — deterministic observations. Empty in FDI-1.0: rules undefined (open question A). */
  readonly observations: readonly string[];
  readonly limitation: string;
  readonly nextStep: { readonly label: string; readonly href: string };

  /** §13 — display-only sibling branch. Structurally cannot influence `index`. */
  readonly qualification: { readonly result: string | null; readonly version: string | null };

  /** §16 — absent AI must never block delivery of everything above. */
  readonly ai: { readonly available: boolean; readonly narrative: AiNarrative | null };
}
