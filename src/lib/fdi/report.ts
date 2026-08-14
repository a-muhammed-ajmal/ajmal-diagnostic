/**
 * Report assembly — the single shape returned to the results page, the email,
 * and the persistence layer (§14).
 *
 * Building it in one place is what makes two presentation rules structural
 * rather than aspirational:
 *
 *   §9  "The number never appears without 'dependency' beside it."
 *       `index.presentation` is the only sanctioned rendering of the score and
 *       it is built from the config template, which carries the band label.
 *
 *   §9  "Never as '67% dependent.' That misrepresents an index score as an
 *       empirical percentage."
 *       There is no percentage field anywhere in FdiReport. Consumers receive
 *       `display` and `scaleMax` and must render "67 / 100". A test asserts the
 *       rendered presentation contains no '%'.
 *
 * §16 "AI failure cannot prevent delivery of the core result." AI enters only
 * through the optional `ai` argument. Passing null produces a complete,
 * deliverable report: the index, band, components, alerts, concentration,
 * limitation and next step are all present without it.
 */

import { deriveObservations } from './observations';
import type { AiNarrative, FdiConfig, FdiReport, FdiResult } from './types';
import type { QualificationOutcome } from './qualification';

export interface ReportContext {
  readonly sessionId: string;
  /** ISO timestamp. Stamped by the caller — the engine and this module have no clock. */
  readonly completedAt: string;
  /** §13 — display only. Structurally cannot have influenced `result`. */
  readonly qualification: QualificationOutcome;
  /** §16 — null whenever AI is unavailable or failed. */
  readonly ai: AiNarrative | null;
}

/**
 * Renders §9's canonical presentation string from the config template.
 *
 * Exported so the presentation rule can be tested directly, and so no consumer
 * has an excuse to concatenate its own version of this string.
 */
export function renderPresentation(
  display: number,
  scaleMax: number,
  bandLabel: string,
  config: FdiConfig,
): string {
  return config.presentationTemplate
    .replace('{display}', String(display))
    .replace('{scaleMax}', String(scaleMax))
    .replace('{bandLabel}', bandLabel);
}

export function buildReport(
  result: FdiResult,
  config: FdiConfig,
  context: ReportContext,
): FdiReport {
  return {
    instrument: config.instrument,
    sessionId: context.sessionId,
    completedAt: context.completedAt,
    versions: result.versions,

    index: {
      unrounded: result.fdi.unrounded,
      display: result.fdi.display,
      scaleMax: config.componentScale,
      band: result.band,
      presentation: renderPresentation(
        result.fdi.display,
        config.componentScale,
        result.band.label,
        config,
      ),
    },

    components: result.components,
    alerts: result.alerts,
    concentration: result.concentration,

    // §14 — empty in FDI-1.0; rules undefined (open question A).
    observations: deriveObservations(result),
    limitation: config.limitationCopy,
    nextStep: config.nextStep,

    // §13 — a sibling branch. `result` was computed without ever seeing this.
    qualification: {
      result: context.qualification.result,
      version: context.qualification.version,
    },

    // §16 — additive only.
    ai: { available: context.ai !== null, narrative: context.ai },
  };
}
