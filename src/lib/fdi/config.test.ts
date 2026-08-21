/**
 * Configuration and question-set integrity, plus the §18 version lock.
 *
 * The lock is the mechanical enforcement of "Never silently recalculate FDI-1.0
 * under later rules": editing the shipped config or question set changes the
 * digest and fails CI, forcing a new version file instead.
 */

import { createHash } from 'node:crypto';

import {
  FDI_1_0_CONFIG,
  FDI_1_0_QUESTIONS,
  FDI_1_1_CONFIG,
  FDI_1_1_QUESTIONS,
  resolveVersion,
  knownDiagnosticVersions,
  CURRENT_DIAGNOSTIC_VERSION,
} from './config';
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

describe('FDI-1.1 approved Business Health Check wording', () => {
  // FDI-1.1 is the active instrument. Its approved wording must be just as
  // immutable as FDI-1.0; any future change requires a newly registered version.
  const CONFIG_DIGEST = '4438c56db3a1d1049f4617131703d6a18050daf61ac1206488eb4343a810d577';
  const QUESTIONS_DIGEST = '1e8a7a56697a0e02a0a7eab807da73bdcf4934cc4edf7ea107f24473bca474af';
  const expectedCopy = {
    DS1: ['When an important decision needs to be made, and you are not available, what usually happens?', 'The responsible person makes the decision', 'Most decisions continue, but some wait for me', 'Many important decisions wait until I am available', 'Important decisions usually stop until I decide'],
    DS2: ['How much can your team decide without asking for your approval?', 'The team handles regular decisions without me', 'Most regular decisions are handled without me', 'The team handles smaller decisions, but many still need my approval', 'I approve most important decisions'],
    DS3: ['If work needs your decision, how long does it usually wait?', 'It usually does not wait because someone else can decide', 'A few hours', 'Until later that day or the next working day', 'More than one working day or until I am available'],
    DS4: ['How often does your team ask you to make decisions they could make themselves?', 'Rarely', 'Sometimes', 'Often', 'Almost every day'],
    EC1: ['For important work that happens regularly, how well is the process written down for the team?', 'Important processes are written down, easy to find, and used', 'Most important processes are written down, with some gaps', "Some are written down, but much still depends on people's knowledge", 'Most important work depends on what a few key people or I know'],
    EC2: ['When different team members do the same work, how similar are the results?', 'The results consistently meet the same standard', 'Results are usually consistent, with some differences', 'Quality changes noticeably depending on who does the work', 'Good results depend heavily on certain people or my involvement'],
    EC3: ['How often does completed work need to be corrected or done again?', 'Rarely', 'Sometimes', 'Often', 'Rework and correction are a normal part of our work'],
    EC4: ['When you are not personally supervising the work, what usually happens?', 'Quality and speed stay about the same', 'Some issues appear, but work generally continues normally', 'Quality or speed becomes noticeably worse', 'Serious delays or quality problems occur'],
    OV1: ['Can you see what is happening in the business without asking your team for updates?', 'Yes — the information I need is already available', 'Mostly — I sometimes need to ask', 'Only partly — I regularly need to ask for updates', 'No — asking people is the main way I know what is happening'],
    OV2: ['How up to date is the information you use to manage the business?', 'It is up to date when I need it', 'It is usually up to date, with some delays', 'It is often out of date', 'I regularly do not have reliable, current information'],
    OV3: ['How do you usually find out about an important problem in the business?', 'Our reports or systems show the problem early', 'The team reports it through the normal process', 'Someone tells me after it has already affected the work', 'I find out myself, from a customer, or when it becomes urgent'],
    OV4: ['How often do you have to chase your team for updates, numbers, or explanations?', 'Rarely — the information is usually available', 'Sometimes', 'Often', 'Chasing updates is a regular part of my day'],
  } as const;

  it('is a frozen, structurally valid new instrument', () => {
    expect(FDI_1_1_CONFIG.diagnosticVersion).toBe('FDI-1.1');
    expect(FDI_1_1_CONFIG.questionSetVersion).toBe('FDI-QS-1.1');
    expect(FDI_1_1_CONFIG.scoringModelVersion).toBe('FDI-SM-1.0');
    expect(FDI_1_1_CONFIG.bandConfigVersion).toBe('FDI-BC-1.0');
    expect(validateVersion(FDI_1_1_CONFIG, FDI_1_1_QUESTIONS)).toEqual([]);
    expect(Object.isFrozen(FDI_1_1_CONFIG)).toBe(true);
    expect(Object.isFrozen(FDI_1_1_QUESTIONS.questions)).toBe(true);
  });

  it('cannot be changed without registering a new version', () => {
    expect(digest(FDI_1_1_CONFIG)).toBe(CONFIG_DIGEST);
    expect(digest(FDI_1_1_QUESTIONS)).toBe(QUESTIONS_DIGEST);
  });

  it('contains the PDF-approved wording and ordered response scale exactly', () => {
    for (const question of FDI_1_1_QUESTIONS.questions) {
      const expected = expectedCopy[question.id as keyof typeof expectedCopy];
      expect(expected).toBeDefined();
      expect([question.text, ...question.options.map((option) => option.text)]).toEqual(expected);
      expect(question.options.map((option) => option.score)).toEqual([0, 1, 2, 3]);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────────────────────
describe('version registry (§18)', () => {
  it('serves FDI-1.1 while retaining FDI-1.0', () => {
    expect(CURRENT_DIAGNOSTIC_VERSION).toBe('FDI-1.1');
    expect(knownDiagnosticVersions()).toEqual(['FDI-1.0', 'FDI-1.1']);
  });

  it('resolves a historic version to its own config, not the latest', () => {
    const resolved = resolveVersion('FDI-1.0');
    expect(resolved?.config.diagnosticVersion).toBe('FDI-1.0');
    expect(resolved?.questionSet.questionSetVersion).toBe(config.questionSetVersion);
    expect(resolved?.qualificationConfigVersion).toBe('FDI-QF-2.0');
  });

  it('resolves the active wording and qualification versions together', () => {
    const resolved = resolveVersion('FDI-1.1');
    expect(resolved?.config).toBe(FDI_1_1_CONFIG);
    expect(resolved?.questionSet).toBe(FDI_1_1_QUESTIONS);
    expect(resolved?.qualificationConfigVersion).toBe('FDI-QF-2.1');
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
