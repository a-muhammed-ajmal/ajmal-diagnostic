/**
 * Report contract and presentation rules (§9, §13, §14, §16).
 */

import { buildReport, renderPresentation } from './report';
import { scoreFdi } from './score';
import { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS } from './config';
import { evaluateQualification, type QualificationInput } from './qualification';
import { deriveObservations } from './observations';
import { answersForRaw } from './test-support';
import type { FdiResult } from './types';

const config = FDI_1_0_CONFIG;
const questionSet = FDI_1_0_QUESTIONS;

function scored(targets: Record<string, number>): FdiResult {
  const outcome = scoreFdi(
    {
      diagnosticVersion: config.diagnosticVersion,
      answers: answersForRaw(config, questionSet, targets),
    },
    config,
    questionSet,
  );
  if (!outcome.ok) throw new Error('unexpected rejection');
  return outcome.result;
}

const QUALIFICATION: QualificationInput = {
  country: 'uae',
  founderLed: true,
  annualRevenue: 'aed_1m_to_10m',
  employeeCount: 'employees_5_to_50',
  operatingYears: 'years_3_or_more',
  singleDecisionAuthority: true,
  willingToShareOperationalInformation: true,
  primarySector: 'real_estate_business_services',
};

const CONTEXT = {
  sessionId: 'session-abc',
  completedAt: '2026-08-14T09:30:00.000Z',
  qualification: evaluateQualification(QUALIFICATION),
  ai: null,
};

describe('presentation (§9)', () => {
  it('renders the canonical string', () => {
    // DS 10, EC 7, OV 7 -> 83.33, 58.33, 58.33 -> 66.67 -> 67
    const result = scored({ DS: 10, EC: 7, OV: 7 });
    const report = buildReport(result, config, CONTEXT);

    expect(report.index.display).toBe(67);
    expect(report.index.presentation).toBe(
      'Founder Dependency Index: 67 / 100 — High Founder Dependency',
    );
  });

  it('never renders the index as a percentage', () => {
    for (let raw = 0; raw <= 12; raw += 1) {
      const report = buildReport(scored({ DS: raw, EC: raw, OV: raw }), config, CONTEXT);
      expect(report.index.presentation).not.toContain('%');
    }
  });

  it('never shows the number without dependency wording beside it', () => {
    for (let raw = 0; raw <= 12; raw += 1) {
      const report = buildReport(scored({ DS: raw, EC: raw, OV: raw }), config, CONTEXT);
      expect(report.index.presentation.toLowerCase()).toContain('dependency');
      expect(report.index.presentation).toContain(String(report.index.display));
    }
  });

  it('exposes scaleMax so consumers render "67 / 100", never "67%"', () => {
    const report = buildReport(scored({ DS: 10, EC: 7, OV: 7 }), config, CONTEXT);
    expect(report.index.scaleMax).toBe(100);
    expect(JSON.stringify(report)).not.toContain('percentage');
  });

  it('is built only from the config template', () => {
    expect(renderPresentation(42, 100, 'Moderate Founder Dependency', config)).toBe(
      'Founder Dependency Index: 42 / 100 — Moderate Founder Dependency',
    );
  });
});

describe('report contract (§14)', () => {
  const report = () => buildReport(scored({ DS: 10, EC: 7, OV: 7 }), config, CONTEXT);

  it('carries the index, band, three components and concentration', () => {
    const r = report();
    expect(r.index.unrounded).toBeCloseTo(66.6667, 4);
    expect(r.index.display).toBe(67);
    expect(r.index.band.label).toBe('High Founder Dependency');
    expect(r.components.map((c) => c.display)).toEqual([83, 58, 58]);
    expect(r.concentration.componentKeys).toEqual(['DS']);
  });

  it('stamps all four versions and the instrument (§18)', () => {
    const r = report();
    expect(r.instrument).toBe('FDI');
    expect(r.versions).toEqual({
      instrument: 'FDI',
      diagnostic: 'FDI-1.0',
      questionSet: 'FDI-QS-1.0',
      scoringModel: 'FDI-SM-1.0',
      bandConfig: 'FDI-BC-1.0',
    });
  });

  it('carries the fixed limitation copy and the audit next step', () => {
    const r = report();
    expect(r.limitation).toContain('founder self-report');
    expect(r.limitation).toContain('does not prove why it exists');
    expect(r.nextStep.label).toBe('Audit');
  });

  it('takes its completion timestamp from the caller, not a clock', () => {
    expect(report().completedAt).toBe(CONTEXT.completedAt);
  });

  it('ships the approved deterministic observations', () => {
    expect(report().observations).toEqual([
      'Important operating decisions slow down when you are unavailable.',
      'Important recurring work still depends materially on knowledge held by individuals rather than usable systems.',
      'You still depend heavily on asking people to understand the current status of the business.',
    ]);
    expect(deriveObservations(scored({ DS: 1, EC: 1, OV: 1 }))).toHaveLength(3);
  });

  it('makes no magnitude claim or guarantee anywhere in its fixed copy', () => {
    const copy = `${config.limitationCopy} ${config.presentationTemplate}`.toLowerCase();
    for (const banned of ['guarantee', 'will increase', 'will reduce', 'proven', 'roi', '%']) {
      expect(copy).not.toContain(banned);
    }
  });
});

describe('qualification is a sibling branch (§13)', () => {
  it('is carried separately without changing the FDI', () => {
    const r = buildReport(scored({ DS: 12, EC: 12, OV: 12 }), config, CONTEXT);
    expect(r.qualification).toEqual({ result: 'qualified_primary', version: 'FDI-QF-1.0' });
    // §13's example: a maximum FDI is reported unchanged alongside qualification.
    expect(r.index.display).toBe(100);
    expect(r.index.band.key).toBe('very_high');
  });
});

describe('AI is additive only (§16)', () => {
  it('reports availability false and a complete body when absent', () => {
    const r = buildReport(scored({ DS: 4, EC: 4, OV: 4 }), config, CONTEXT);
    expect(r.ai).toEqual({ available: false, narrative: null });
    expect(r.index.presentation).toBeTruthy();
    expect(r.components).toHaveLength(3);
  });

  it('attaches narrative without touching any scored value', () => {
    const result = scored({ DS: 4, EC: 4, OV: 4 });
    const without = buildReport(result, config, CONTEXT);
    const with_ = buildReport(result, config, { ...CONTEXT, ai: { briefing: 'x' } });

    expect(with_.index).toEqual(without.index);
    expect(with_.components).toEqual(without.components);
    expect(with_.concentration).toEqual(without.concentration);
    expect(with_.ai.available).toBe(true);
  });
});
