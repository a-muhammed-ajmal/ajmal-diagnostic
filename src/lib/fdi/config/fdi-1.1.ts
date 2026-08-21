/**
 * FDI-1.1 configuration.
 *
 * This version adopts the approved Business Health Check wording. FDI-1.0 is
 * immutable and remains available through the version registry for historic
 * sessions. The scoring model and band configuration are intentionally reused.
 */

import type { FdiConfig } from '../types';

export const FDI_1_1_CONFIG: FdiConfig = Object.freeze({
  instrument: 'FDI',
  diagnosticVersion: 'FDI-1.1',
  questionSetVersion: 'FDI-QS-1.1',
  scoringModelVersion: 'FDI-SM-1.0',
  bandConfigVersion: 'FDI-BC-1.0',

  components: Object.freeze([
    Object.freeze({ key: 'DS', label: 'Decision Speed' }),
    Object.freeze({ key: 'EC', label: 'Execution Consistency' }),
    Object.freeze({ key: 'OV', label: 'Operational Visibility' }),
  ]),

  itemsPerComponent: 4,
  itemScoreMin: 0,
  itemScoreMax: 3,
  componentScale: 100,
  weights: Object.freeze({ DS: 1, EC: 1, OV: 1 }),
  componentAlertThreshold: 75,

  bands: Object.freeze([
    Object.freeze({ key: 'low', label: 'Low Founder Dependency', minInclusive: 0, displayRange: '0–24' }),
    Object.freeze({ key: 'moderate', label: 'Moderate Founder Dependency', minInclusive: 25, displayRange: '25–49' }),
    Object.freeze({ key: 'high', label: 'High Founder Dependency', minInclusive: 50, displayRange: '50–74' }),
    Object.freeze({ key: 'very_high', label: 'Very High Founder Dependency', minInclusive: 75, displayRange: '75–100' }),
  ]),

  bandInput: 'unrounded',
  alertInput: 'unrounded',
  rounding: 'half-up',
  presentationTemplate: 'Founder Dependency Index: {display} / {scaleMax} — {bandLabel}',
  limitationCopy:
    'This result is based on founder self-report. It identifies where dependency appears. ' +
    'It does not prove why it exists, the operational root cause, the single binding ' +
    'constraint, or what intervention will fix it.',
  nextStep: Object.freeze({ label: 'Audit', href: '/contact' }),
} satisfies FdiConfig);
