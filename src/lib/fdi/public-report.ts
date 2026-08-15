import type { FdiReport } from './types';

/** The deterministic founder payload intentionally omits consultant-only qualification and AI. */
export type FounderFdiReport = Omit<FdiReport, 'qualification' | 'ai'>;

export function toFounderFdiReport(report: FdiReport): FounderFdiReport {
  return {
    instrument: report.instrument,
    sessionId: report.sessionId,
    completedAt: report.completedAt,
    versions: report.versions,
    index: report.index,
    components: report.components,
    alerts: report.alerts,
    concentration: report.concentration,
    observations: report.observations,
    limitation: report.limitation,
    nextStep: report.nextStep,
  };
}
