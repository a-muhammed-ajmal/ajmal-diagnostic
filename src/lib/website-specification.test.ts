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

/**
 * `.design-sync/` is text-scanned only. The `.woff2` faces are binary and carry
 * no prose; excluding them by extension keeps the scan meaningful without
 * pretending a font file can be proof-read.
 */
const DESIGN_SYNC_EXTENSIONS = ['.md', '.mjs', '.css', '.tsx'];

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
  for (const file of walk(join(ROOT, '.design-sync'))) {
    if (DESIGN_SYNC_EXTENSIONS.some((ext) => file.endsWith(ext))) files.push(file);
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
    label: 'retired typeface — Plus Jakarta Sans is the whole web-font budget',
    pattern: /Figtree|Lexend|Segoe UI|Roboto Slab/,
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

/**
 * The font pipeline must name the faces it downloads and binds. Renaming a face
 * here without re-downloading the `.woff2` files silently breaks the bundle, so
 * these three are exempt from the typeface rule — and from that rule only.
 */
const FONT_PIPELINE = new Set([
  '.design-sync/fetch-fonts.mjs',
  '.design-sync/build-css.mjs',
  '.design-sync/fonts/fonts-src.css',
]);

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

function scan(): string[] {
  const violations: string[] = [];
  for (const file of governanceFiles()) {
    const rel = repoPath(file);
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    for (const rule of RULES) {
      if (rule.id === 'typeface' && FONT_PIPELINE.has(rel)) continue;
      lines.forEach((line, index) => {
        const hit = rule.pattern.exec(line);
        if (!hit) return;
        if (isProhibitionStatement(line, hit[0])) return;
        violations.push(`${rel}:${index + 1} — ${rule.label} — "${hit[0]}"`);
      });
    }
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
      '.design-sync/conventions.md',
      '.design-sync/previews/IndexBandMeter.tsx',
    ]) {
      expect(scanned).toContain(expected);
    }
    // Binary faces are excluded on purpose.
    expect(scanned.some((file) => file.endsWith('.woff2'))).toBe(false);
  });

  it('finds no prohibited term', () => {
    expect(scan()).toEqual([]);
  });
});
