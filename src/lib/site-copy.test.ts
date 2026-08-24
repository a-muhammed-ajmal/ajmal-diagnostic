/**
 * Copy guard — the shipped copy must match the governing documents.
 *
 * WHY THIS EXISTS
 * `website-specification.test.ts` asserts that WEB and PRODUCT still *say* the
 * right thing. Nothing asserted that the *code* said the same thing, so five
 * strings drifted from their specification and shipped: the footer descriptor
 * lost its location clause and its capitalisation, the diagnostic privacy line
 * lost a comma, three intro card bodies gained a trailing period, and the hero
 * lead used a word the positioning statement does not.
 *
 * THE RULE
 * Every expected string here is READ FROM the document. Nothing is hardcoded.
 * Copying a string into this file would make the test agree with whatever the
 * code happens to say, which is the failure it exists to prevent — so if an
 * extractor stops matching, it throws rather than asserting against an empty
 * expectation that would pass silently.
 *
 * WEB governs the footer descriptor. PRODUCT governs the diagnostic, the result
 * page, and the report email.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { FDI_1_1_CONFIG } from './fdi/config';
import { bandFor } from './fdi/bands';
import { renderPresentation } from './fdi/report';

const ROOT = process.cwd();

function read(...segments: string[]): string {
  return readFileSync(join(ROOT, ...segments), 'utf8');
}

const WEB = read('docs', 'WEBSITE.md');
const PRODUCT = read('docs', 'PRODUCT.md');

const footerSource = read('src', 'components', 'layout', 'Footer.tsx');
const flowSource = read('src', 'components', 'fdi', 'FdiDiagnosticFlow.tsx');
const resultsSource = read('src', 'components', 'fdi', 'FdiResults.tsx');
const emailSource = read('src', 'lib', 'email', 'templates', 'FdiReport.tsx');
const submitSource = read('src', 'app', 'api', 'fdi', 'submit', 'route.ts');

// ─────────────────────────────────────────────────────────────────────────────
// READING THE DOCUMENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Collapses the line wrapping JSX introduces and decodes the entities it needs,
 * so a sentence split across three source lines still compares equal to the one
 * line the document carries it on.
 */
function normalise(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * A missing extraction is a failed test, never an empty expectation. Without
 * this, renaming a heading in PRODUCT would turn every assertion below into
 * `expect(source).toContain('')` — which passes against anything.
 */
function requireCapture(pattern: RegExp, corpus: string, what: string): string {
  const captured = pattern.exec(corpus)?.[1];
  if (!captured || captured.trim().length === 0) {
    throw new Error(`Could not read ${what} from the governing document. The guard cannot run.`);
  }
  return normalise(captured);
}

/**
 * Reads the data rows of the markdown table that follows `heading`.
 *
 * The `:----` separator is the boundary: everything before it is the header,
 * everything after it until the first non-table line is data. Keying off the
 * separator rather than a row count is what stops a header being read as data.
 */
function tableRows(corpus: string, heading: string, columns: number): string[][] {
  const start = corpus.indexOf(heading);
  if (start === -1) throw new Error(`Could not find "${heading}" in the governing document.`);
  const rows: string[][] = [];
  let pastSeparator = false;
  for (const line of corpus.slice(start + heading.length).split('\n')) {
    if (!line.startsWith('|')) {
      if (pastSeparator && rows.length > 0) break;
      continue;
    }
    const cells = line.split('|').slice(1, -1).map(normalise);
    if (cells.length === columns && cells.every((cell) => /^:?-+:?$/.test(cell))) {
      pastSeparator = true;
      continue;
    }
    if (!pastSeparator || cells.length !== columns) continue;
    rows.push(cells);
  }
  if (rows.length === 0) throw new Error(`No rows found under "${heading}".`);
  return rows;
}

/**
 * Strips JSX tags without inserting a separator, so `our <a …>Privacy Policy</a>.`
 * reads back as `our Privacy Policy.` with the period still attached.
 */
function visibleText(source: string): string {
  return normalise(source.replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ').replace(/<[^>]+>/g, ''));
}

// ─────────────────────────────────────────────────────────────────────────────
// WEB §5 — FOOTER
// ─────────────────────────────────────────────────────────────────────────────

describe('WEB §5 — the footer descriptor', () => {
  const descriptor = requireCapture(
    /and this descriptor: \*([^*]+)\*/,
    WEB,
    'the footer descriptor',
  );

  it('is one sentence, reproduced word for word', () => {
    expect(visibleText(footerSource)).toContain(descriptor);
  });

  it('is not split into a descriptor plus a separate location line', () => {
    expect(descriptor).toContain('based in Dubai, United Arab Emirates');
    expect(footerSource).not.toContain('>Dubai, United Arab Emirates<');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT §A3 — DIAGNOSTIC INTRO
// ─────────────────────────────────────────────────────────────────────────────

describe('PRODUCT §A3 — the three intro cards', () => {
  const cards = tableRows(PRODUCT, '### Intro screen cards', 2);

  it('reads all three from the document', () => {
    expect(cards).toHaveLength(3);
  });

  it.each(cards)('card "%s" carries its documented line exactly', (title, line) => {
    // Asserted as the quoted literal so a trailing period cannot slip back in.
    expect(flowSource).toContain(`'${title}', '${line}'`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT §A9 — FINAL SCREEN
// ─────────────────────────────────────────────────────────────────────────────

describe('PRODUCT §A9 — the final screen', () => {
  const fields = tableRows(PRODUCT, '| Field | Status | Label |', 3);

  it('reads all eight fields from the document', () => {
    expect(fields).toHaveLength(8);
    expect(fields.filter(([, status]) => status === 'Required')).toHaveLength(4);
    expect(fields.filter(([, status]) => status === 'Optional')).toHaveLength(4);
  });

  it.each(fields)('%s renders the documented label', (_field, _status, label) => {
    expect(flowSource).toContain(`>${label}</label>`);
  });

  it('carries the documented privacy footer line, comma included', () => {
    const footerLine = requireCapture(/Footer line: \*([^*]+)\*/, PRODUCT, 'the §A9 footer line');
    expect(visibleText(flowSource)).toContain(footerLine);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT §A10 — RESULT PAGE
// ─────────────────────────────────────────────────────────────────────────────

describe('PRODUCT §A10 — the limitation', () => {
  const limitation = requireCapture(
    /### Limitation — never edited\s*\n+>\s*([^\n]+)/,
    PRODUCT,
    'the §A10 limitation',
  );

  it('is the string the active instrument actually carries', () => {
    expect(normalise(FDI_1_1_CONFIG.limitationCopy)).toBe(limitation);
  });

  it('is rendered on the result page and in the report email', () => {
    expect(resultsSource).toContain('{report.limitation}');
    expect(emailSource).toContain('{report.limitation}');
  });

  it('precedes the next step on both surfaces, as §A10 orders it', () => {
    expect(resultsSource.indexOf('{report.limitation}')).toBeLessThan(
      resultsSource.indexOf('Next step: Business Clarity Audit'),
    );
    expect(emailSource.indexOf('{report.limitation}')).toBeLessThan(
      emailSource.indexOf('Discuss a Business Clarity Audit'),
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT §A11 — REPORT EMAIL
// ─────────────────────────────────────────────────────────────────────────────

describe('PRODUCT §A11 — the report email subject', () => {
  const format = requireCapture(/\n\| Subject \| ([^|]+) \|/, PRODUCT, 'the §A11 subject format');

  it('builds from the instrument template rather than a local concatenation', () => {
    expect(submitSource).toContain('subject: `Your ${report.index.presentation}`');
  });

  it.each(FDI_1_1_CONFIG.bands.map((band) => band.minInclusive))(
    'renders the documented format at a score of %i',
    (score) => {
      const band = bandFor(score, FDI_1_1_CONFIG);
      const expected = format
        .replace('{score}', String(score))
        .replace('{Band label}', band.label);
      const actual = `Your ${renderPresentation(score, FDI_1_1_CONFIG.componentScale, band.label, FDI_1_1_CONFIG)}`;

      expect(actual).toBe(expected);
      // §A6 — an index is a value out of 100, never a percentage.
      expect(actual).not.toContain('%');
    },
  );
});
