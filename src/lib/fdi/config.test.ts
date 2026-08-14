/**
 * Configuration and question-set integrity, plus the §18 version lock.
 *
 * The lock is the mechanical enforcement of "Never silently recalculate FDI-1.0
 * under later rules": editing the shipped config or question set changes the
 * digest and fails CI, forcing a new version file instead.
 */

import { createHash } from 'node:crypto';

import { FDI_1_0_CONFIG, FDI_1_0_QUESTIONS, resolveVersion, knownDiagnosticVersions, CURRENT_DIAGNOSTIC_VERSION } from './config';
import { validateVersion } from './integrity';

const config = FDI_1_0_CONFIG;
const questionSet = FDI_1_0_QUESTIONS;

/** Key-sorted JSON so the digest depends on content, not on declaration order. */
function canonicalise(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalise);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((key) => [key, canonicalise((value as Record<string, unknown>)[key])]),
    );
  }
  return value;
}

function digest(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(canonicalise(value))).digest('hex');
}

// ─────────────────────────────────────────────────────────────────────────────
// §18 VERSION LOCK
// ─────────────────────────────────────────────────────────────────────────────
describe('FDI-1.0 version lock (§18)', () => {
  // Regenerate ONLY when introducing a genuinely new version file.
  // Changing these to make a failing test pass re-scores history.
  const CONFIG_DIGEST = 'f7680370f864e220b7d276c99650666b15a790ea1d27b418a86b8e9fd401dcb0';
  const QUESTIONS_DIGEST = 'f77b5192803e72f2c1f2547bce01562772a3ab09f577f7c7fac4792d9a275660';

  it('config is unchanged since it shipped', () => {
    expect(digest(config)).toBe(CONFIG_DIGEST);
  });

  it('question set is unchanged since it shipped', () => {
    expect(digest(questionSet)).toBe(QUESTIONS_DIGEST);
  });

  it('is deeply frozen so it cannot be mutated at runtime', () => {
    expect(Object.isFrozen(config)).toBe(true);
    expect(Object.isFrozen(config.bands)).toBe(true);
    expect(Object.isFrozen(config.components)).toBe(true);
    expect(Object.isFrozen(config.weights)).toBe(true);
    expect(Object.isFrozen(questionSet)).toBe(true);
    expect(Object.isFrozen(questionSet.questions)).toBe(true);
    for (const question of questionSet.questions) {
      expect(Object.isFrozen(question)).toBe(true);
      expect(Object.isFrozen(question.options)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────
describe('FDI-1.0 integrity', () => {
  it('passes every structural check', () => {
    expect(validateVersion(config, questionSet)).toEqual([]);
  });

  it('declares the instrument the spec fixes (§1)', () => {
    expect(config.instrument).toBe('FDI');
    expect(config.diagnosticVersion).toBe('FDI-1.0');
    expect(config.components).toHaveLength(3);
    expect(config.itemsPerComponent).toBe(4);
    expect(config.itemScoreMin).toBe(0);
    expect(config.itemScoreMax).toBe(3);
    expect(config.componentScale).toBe(100);
    expect(questionSet.questions).toHaveLength(12);
  });

  it('measures the three components §2 fixes, and nothing else', () => {
    expect(config.components.map((c) => c.key)).toEqual(['DS', 'EC', 'OV']);
    expect(config.components.map((c) => c.label)).toEqual([
      'Decision Speed',
      'Execution Consistency',
      'Operational Visibility',
    ]);
  });

  it('excludes every out-of-scope dimension (§1)', () => {
    const labels = config.components.map((c) => c.label.toLowerCase()).join(' ');
    for (const outOfScope of [
      'financial',
      'strategy',
      'strategic',
      'revenue',
      'sales',
      'marketing',
      'health',
      'people',
      'ai maturity',
    ]) {
      expect(labels).not.toContain(outOfScope);
    }
  });

  it('weights all three components equally (§8)', () => {
    expect(config.weights).toEqual({ DS: 1, EC: 1, OV: 1 });
  });

  it('sets the component alert threshold from config, not code (§10)', () => {
    expect(config.componentAlertThreshold).toBe(75);
  });

  it('declares the four bands §9 fixes', () => {
    expect(config.bands.map((b) => b.minInclusive)).toEqual([0, 25, 50, 75]);
    expect(config.bands.map((b) => b.displayRange)).toEqual([
      '0–24',
      '25–49',
      '50–74',
      '75–100',
    ]);
  });

  it('pins the owner-decided boundary and rounding rules', () => {
    expect(config.bandInput).toBe('unrounded'); // answer G
    expect(config.alertInput).toBe('unrounded'); // answer G
    expect(config.rounding).toBe('half-up'); // answer H
  });

  it('never renders the index as a percentage (§9)', () => {
    expect(config.presentationTemplate).not.toContain('%');
    expect(config.presentationTemplate).toContain('Founder Dependency Index');
  });

  it('carries all four version keys for §18 stamping', () => {
    expect(config.diagnosticVersion).toBeTruthy();
    expect(config.questionSetVersion).toBeTruthy();
    expect(config.scoringModelVersion).toBeTruthy();
    expect(config.bandConfigVersion).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION SET
// ─────────────────────────────────────────────────────────────────────────────
describe('FDI-1.0 question set', () => {
  it('has four items per component (§1)', () => {
    for (const component of config.components) {
      const own = questionSet.questions.filter((q) => q.componentKey === component.key);
      expect(own).toHaveLength(config.itemsPerComponent);
    }
  });

  it('gives every item exactly one option per score 0–3, in ascending order (§3, §17)', () => {
    for (const question of questionSet.questions) {
      expect(question.options.map((o) => o.score)).toEqual([0, 1, 2, 3]);
    }
  });

  it('never reverse-codes an item in v1 (§3)', () => {
    // Ascending presentation order IS ascending dependency for every item.
    for (const question of questionSet.questions) {
      const scores = question.options.map((o) => o.score);
      expect([...scores].sort((a, b) => a - b)).toEqual(scores);
    }
  });

  it('uses globally unique, stable option ids that do not encode the score', () => {
    const ids = questionSet.questions.flatMap((q) => q.options.map((o) => o.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const question of questionSet.questions) {
      for (const option of question.options) {
        expect(option.id.startsWith(`${question.id}-`)).toBe(true);
        // The suffix must not encode the score, so a later version could
        // reorder or reverse-code items without invalidating stored ids.
        const suffix = option.id.slice(question.id.length + 1);
        expect(suffix).not.toContain(String(option.score));
        expect(suffix).toMatch(/^[A-Z]$/);
      }
    }
  });

  it('avoids agree/disagree and yes/no scales (§3)', () => {
    // Every item must offer four distinct behavioural states, not a rating scale.
    for (const question of questionSet.questions) {
      const texts = question.options.map((o) => o.text.toLowerCase().trim());
      expect(new Set(texts).size).toBe(texts.length);
      for (const banned of ['strongly agree', 'strongly disagree', 'somewhat agree']) {
        expect(texts.join(' ')).not.toContain(banned);
      }
    }
  });

  it('records the audit note the spec attaches to DS3 (§4)', () => {
    const ds3 = questionSet.questions.find((q) => q.id === 'DS3');
    expect(ds3?.auditNote).toBe('Audit verifies with actual cycle-time samples.');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────────────────────
describe('version registry (§18)', () => {
  it('serves FDI-1.0 as the current version', () => {
    expect(CURRENT_DIAGNOSTIC_VERSION).toBe('FDI-1.0');
    expect(knownDiagnosticVersions()).toEqual(['FDI-1.0']);
  });

  it('resolves a historic version to its own config, not the latest', () => {
    const resolved = resolveVersion('FDI-1.0');
    expect(resolved?.config.diagnosticVersion).toBe('FDI-1.0');
    expect(resolved?.questionSet.questionSetVersion).toBe(config.questionSetVersion);
  });

  it('returns undefined for an unknown version', () => {
    expect(resolveVersion('FDI-2.0')).toBeUndefined();
    expect(resolveVersion('')).toBeUndefined();
    expect(resolveVersion('constructor')).toBeUndefined();
    expect(resolveVersion('__proto__')).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRITY VALIDATOR
// ─────────────────────────────────────────────────────────────────────────────
describe('validateVersion catches malformed configs', () => {
  it('flags a band set that does not start at zero', () => {
    const broken = { ...config, bands: config.bands.slice(1) };
    expect(validateVersion(broken, questionSet).join(' ')).toContain('must start at 0');
  });

  it('flags weights that do not match the components', () => {
    const broken = { ...config, weights: { DS: 1, EC: 1 } };
    expect(validateVersion(broken, questionSet).join(' ')).toContain('do not correspond 1:1');
  });

  it('flags an item count that contradicts the config', () => {
    const broken = { ...config, itemsPerComponent: 5 };
    const problems = validateVersion(broken, questionSet).join(' ');
    expect(problems).toContain('config implies');
  });

  it('flags a presentation template containing a percent sign', () => {
    const broken = { ...config, presentationTemplate: '{display}% — {bandLabel} {scaleMax}' };
    expect(validateVersion(broken, questionSet).join(' ')).toContain('never be rendered as a percentage');
  });

  it('flags a question set version that does not match the config', () => {
    const broken = { ...questionSet, questionSetVersion: 'FDI-QS-9.9' };
    expect(validateVersion(config, broken).join(' ')).toContain('does not match config');
  });
});
