/**
 * Governance-layer guard.
 *
 * Two jobs.
 *
 * 1. Positive assertions that WEB and PRODUCT still state the contracts the
 *    code depends on. Cross-reference by Document ID, never by filename.
 *
 * 2. A prohibited-language scan over the whole governance surface. The build
 *    used to scan only part of it, which is why three retired typeface names
 *    and one prohibited claim survived in documentation for weeks.
 *
 * The addendum this file once read was folded into PRODUCT during the
 * governance migration; every assertion now targets a document in the closed
 * four-document register.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();

const website = readFileSync(join(ROOT, 'docs', 'WEBSITE.md'), 'utf8');
const product = readFileSync(join(ROOT, 'docs', 'PRODUCT.md'), 'utf8');

// ─────────────────────────────────────────────────────────────────────────────
// WHAT THE GUARD SCANS
// ─────────────────────────────────────────────────────────────────────────────

/** Scanned whole: every file beneath these. */
const SCAN_DIRS = ['docs', '.claude'];

/** Scanned at the repository root. */
const ROOT_FILES = ['CLAUDE.md', 'AGENTS.md'];

/** Generated or vendored trees that are not part of the governance surface. */
const SKIP_DIRS = new Set(['node_modules', '.cache', 'learnings', '.next', 'coverage']);

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (SKIP_DIRS.has(entry)) continue;
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

function governanceFiles(): string[] {
  const files: string[] = [];
  for (const dir of SCAN_DIRS) files.push(...walk(join(ROOT, dir)));
  for (const file of ROOT_FILES) {
    const full = join(ROOT, file);
    if (existsSync(full)) files.push(full);
  }
  return files;
}

function repoPath(file: string): string {
  return relative(ROOT, file).split('\\').join('/');
}

// ─────────────────────────────────────────────────────────────────────────────
// WHAT IT FAILS ON
// ─────────────────────────────────────────────────────────────────────────────

interface Rule {
  readonly id: string;
  readonly label: string;
  readonly pattern: RegExp;
}

const RULES: readonly Rule[] = [
  {
    id: 'claim',
    label: 'prohibited growth claim',
    pattern: /predictable growth/i,
  },
  {
    id: 'band',
    // Hyphen and en-dash forms both, so a typographic paste cannot slip through.
    label: 'retired index band — the only four are in PRODUCT §A6',
    pattern: /Critical 0[-\u2013]39|Developing 40[-\u2013]69|Progressing 70[-\u2013]100/,
  },
  {
    id: 'typeface',
    label:
      'retired typeface — the pairing is Plus Jakarta Sans for headings and ' +
      'display, Lexend for body, UI, and small text',
    pattern: /Figtree|Segoe UI|Roboto Slab/,
  },
  {
    id: 'third-face',
    // Narrowing the retired list above must not become an open door. The
    // pairing is closed at two, so a third family named in prose fails here.
    label: 'a third typeface — the pairing is closed at Plus Jakarta Sans and Lexend',
    pattern: /\b(?:Inter|Roboto(?! Slab)|Open Sans|Montserrat|Poppins|Nunito|Raleway|Work Sans|DM Sans|Manrope|Rubik|Karla|Mulish|Heebo|Source Sans|Noto Sans|Helvetica|Georgia|Times New Roman|Verdana|Tahoma|Courier New)\b/,
  },
  {
    id: 'framework',
    label: 'the framework is Strategic Growth Architecture, not Architect',
    pattern: /Strategic Growth Architect(?!ure)/,
  },
  {
    id: 'percent',
    label: 'a percent sign beside the index — it is a value out of 100',
    pattern: /Founder Dependency Index.{0,40}%|%.{0,40}Founder Dependency Index/,
  },
];

/** The two faces the pairing allows, lower-cased for comparison. */
const APPROVED_FACES = new Set(['plus jakarta sans', 'lexend']);

/** Generic CSS keywords a stack may fall back to — never a third face. */
const GENERIC_FALLBACKS = new Set([
  'ui-sans-serif', 'system-ui', 'sans-serif', 'ui-serif', 'serif',
  'ui-monospace', 'monospace', 'cursive', 'fantasy', 'ui-rounded',
  'emoji', 'math', 'fangsong', 'inherit', 'initial', 'unset', 'revert',
]);

/**
 * The prose rule catches a third face by name. This catches one by binding:
 * every family a `font-family:` declaration names must be an approved face, a
 * generic fallback, or token indirection such as `var(--font-body)`.
 */
function bindingViolations(rel: string, lines: readonly string[]): string[] {
  const out: string[] = [];
  lines.forEach((line, index) => {
    const decl = /font-family:\s*([^;{}]+)/i.exec(line);
    if (!decl) return;
    for (const raw of decl[1].split(',')) {
      const name = raw.trim().replace(/^['"]|['"]$/g, '');
      const key = name.toLowerCase();
      if (!key || key.startsWith('var(') || key.startsWith('--')) continue;
      if (APPROVED_FACES.has(key) || GENERIC_FALLBACKS.has(key)) continue;
      out.push(`${rel}:${index + 1} — a third typeface bound in a font stack — "${name}"`);
    }
  });
  return out;
}

/**
 * A line that quotes a banned term and declares it banned is the rule itself,
 * not a violation of it. ANCHOR is a locked file stating `"Predictable growth"
 * is prohibited language.` — without this the guard would fail on a document no
 * agent is permitted to edit.
 *
 * Deliberately narrow: the term must sit inside straight double quotes AND the
 * line must say it is prohibited. A retired typeface reintroduced in ordinary
 * prose still fails.
 */
function isProhibitionStatement(line: string, matched: string): boolean {
  return line.includes(`"${matched}"`) && /prohibited/i.test(line);
}

/**
 * The third-face rule is broader than the retired-typeface rule: it names
 * families the documents legitimately discuss in order to reject them. A line
 * that names a third face while refusing it is the rule, not a breach of it.
 *
 * This applies to `third-face` only. A RETIRED face reintroduced in ordinary
 * prose still fails, negation or not — that rule keeps its narrow
 * quoted-and-declared-prohibited exemption.
 */
const REFUSAL = /(?:never|not|no|avoid|instead of|rather than|retired|prohibited|forbidden|❌)/i;

function isRefusalStatement(line: string): boolean {
  return REFUSAL.test(line);
}

function scan(): string[] {
  const violations: string[] = [];
  for (const file of governanceFiles()) {
    const rel = repoPath(file);
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    for (const rule of RULES) {
      lines.forEach((line, index) => {
        const hit = rule.pattern.exec(line);
        if (!hit) return;
        if (isProhibitionStatement(line, hit[0])) return;
        if (rule.id === 'third-face' && isRefusalStatement(line)) return;
        violations.push(`${rel}:${index + 1} — ${rule.label} — "${hit[0]}"`);
      });
    }
    violations.push(...bindingViolations(rel, lines));
  }
  return violations;
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('WEB — the public website specification', () => {
  it('records the canonical routes and the two 308 aliases', () => {
    expect(website).toContain('Two aliases exist and return HTTP 308:');
    expect(website).toContain('| `/diagnostic/fdi` | `/diagnostic` |');
    expect(website).toContain('| `/results/fdi` | `/results` |');
  });

  it('registers the 404/500 fallback below the register, not as a route', () => {
    expect(website).toContain('One fallback exists and is not a route:');
    expect(website).toContain('| `not-found.tsx` | Any unmatched path — HTTP 404 |');
    expect(website).toContain(
      '| `error.tsx` | An unhandled render error in a public route segment — HTTP 500 |',
    );
    // Not a landing surface: noindex, no offer, no capture.
    expect(website).toContain(
      'The fallback is noindex, absent from the sitemap, and absent from navigation.',
    );
    expect(website).toContain('it carries no offer, no lead capture, and no claim');
  });

  it('fixes the two approved call-to-action labels', () => {
    expect(website).toContain('Start the Business Health Check →');
    expect(website).toContain('Discuss a Business Clarity Audit');
  });

  it('excludes retired presentation and route claims', () => {
    for (const retiredTerm of ['Cyanotype Blueprint', 'Fraunces', 'IBM Plex']) {
      expect(website).not.toContain(retiredTerm);
    }
    expect(website).not.toContain('`/results/fdi` is the Founder Dependency Index result route');
    expect(website).not.toContain('`/results` is the legacy diagnostic result route');
  });
});

describe('PRODUCT — the active FDI contract', () => {
  it('stamps the active version set on every new session', () => {
    expect(product).toContain('| Instrument | FDI-1.1 |');
    expect(product).toContain('| Question set | FDI-QS-1.1 |');
    expect(product).toContain('| Qualification configuration | FDI-QF-2.1 |');
    expect(product).toContain('| Scoring model | FDI-SM-1.0 |');
    expect(product).toContain('| Band configuration | FDI-BC-1.0 |');
  });

  it('keeps FDI-1.0 historical and locks delivery acceptance behaviour', () => {
    expect(product).toContain('FDI-1.0 is historic-only and resolvable.');
    expect(product).toContain('`email_sent` is set true only after Resend accepts');
    for (const reason of [
      'revenue_not_provided',
      'team_size_not_provided',
      'operating_age_not_provided',
      'sector_not_provided',
    ]) {
      expect(product).toContain(`\`${reason}\``);
    }
  });
});

describe('prohibited language across the governance surface', () => {
  it('actually reaches every governed file', () => {
    const scanned = governanceFiles().map(repoPath);
    for (const expected of [
      'docs/ANCHOR.md',
      'docs/PRODUCT.md',
      'docs/WEBSITE.md',
      'docs/design-changelog.md',
      'CLAUDE.md',
      'AGENTS.md',
      '.claude/skills/frontend-design/SKILL.md',
      '.claude/commands/ship.md',
    ]) {
      expect(scanned).toContain(expected);
    }
  });

  it('finds no prohibited term', () => {
    expect(scan()).toEqual([]);
  });
});
