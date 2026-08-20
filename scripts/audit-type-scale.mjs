/**
 * Design-system audit — measures the RENDERED pages, not the CSS source.
 *
 * The mobile ceilings in `.claude/skills/frontend-design/SKILL.md` §2C are the
 * one rule in this design system that cannot be checked by reading code: a
 * heading can inherit its size, a `<p>` can be handed a card-title step, and a
 * span can pick up a parent's font-size. All three have happened here. So this
 * drives a real browser and reads `getComputedStyle`.
 *
 * Asserted on every route:
 *   - visible content and form controls resolve to Plus Jakarta Sans
 *
 * Asserted, below 768px:
 *   - every visible h1..h4 is <= 24px
 *   - every visible <p>, <li> and <label> is <= 14px
 *   - no horizontal overflow at 320px
 *
 * Recorded but not asserted:
 *   - the 1920px sizes, where the scale is meant to open up
 *   - non-prose text above 14px (logotypes, diagram labels, numerals). These are
 *     legitimately `--step-1`, which the scale assigns to "card titles, diagram
 *     labels, h5" — so they are listed for review rather than failed.
 *
 * Usage:
 *   npm run audit:type                 # builds, starts a server, measures, exits
 *   BASE_URL=http://localhost:3000 \
 *     npm run audit:type               # measures an already-running server
 *   CHROME_PATH=/path/to/chrome ...    # override browser discovery
 *
 * Uses `playwright-core` against a browser already installed on the machine, so
 * no browser binaries are downloaded.
 */
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import process from 'node:process';

const HEADING_CEILING = 24;
const BODY_CEILING = 14;
const PORT = Number(process.env.PORT ?? 3000);
const EXTERNAL_BASE = process.env.BASE_URL ?? null;
const BASE = EXTERNAL_BASE ?? `http://localhost:${PORT}`;

/** Every route with a distinct layout. Query strings pick a specific state. */
const ROUTES = [
  '/',
  '/about',
  '/services',
  '/contact',
  '/insights',
  '/insights/founder-trap',
  '/insights/category/founder-led-operations',
  '/privacy',
  '/diagnostic',
  '/results',
  '/unsubscribe?status=success',
  '/diagnostic/fdi',
  '/results/fdi',
  '/admin',
];

/** Text-bearing elements. Buttons and links are UI text and share the body ceiling. */
const TEXT_SEL = 'p, li, button, label, a, span, dd, dt, summary, blockquote, td, th';
const FONT_SEL = `${TEXT_SEL}, input, select, textarea`;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

function findBrowser() {
  const hit = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!hit) {
    console.error(
      'No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser executable.\n' +
        'Looked in:\n  ' + CHROME_CANDIDATES.join('\n  '),
    );
    process.exit(2);
  }
  return hit;
}

async function waitForServer(url, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (res.ok || res.status < 500) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

function run(cmd, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: { ...process.env, ...env },
    });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
    child.on('error', reject);
  });
}

/**
 * Runs in the page. Returns the measured elements, largest first.
 *
 * Two exclusions matter. Text inside a heading inherits the heading's size, so
 * the heading ceiling already governs it — counting it again reports a false
 * body violation for things like a gradient <span> inside an <h1>. And an
 * element that owns no text node of its own would otherwise report a
 * descendant's size as its own.
 */
function measureInPage({ textSelector, fontSelector }) {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') return false;
    if (el.closest('.sr-only')) return false;
    return true;
  };
  const ownsText = (el) =>
    Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
  const info = (el) => ({
    px: parseFloat(getComputedStyle(el).fontSize),
    tag: el.tagName.toLowerCase(),
    text: (el.textContent || '').trim().slice(0, 56),
  });

  const headings = [];
  for (const el of document.querySelectorAll('h1, h2, h3, h4')) {
    if (visible(el)) headings.push(info(el));
  }

  const prose = [];
  const other = [];
  for (const el of document.querySelectorAll(textSelector)) {
    if (!visible(el) || !ownsText(el)) continue;
    if (el.closest('h1, h2, h3, h4, h5, h6')) continue;
    (el.matches('p, li, label') ? prose : other).push(info(el));
  }

  const desc = (a) => a.sort((x, y) => y.px - x.px);
  const rootStyles = getComputedStyle(document.documentElement);
  const bodyFont = getComputedStyle(document.body).fontFamily;
  const primaryFont = rootStyles
    .getPropertyValue('--font-plus-jakarta-sans')
    .split(',')[0]
    .trim()
    .replace(/^['"]|['"]$/g, '');
  const fontMismatches = [];
  for (const el of document.querySelectorAll(fontSelector)) {
    const isControl = el.matches('input, select, textarea');
    if (!visible(el) || (!isControl && !ownsText(el))) continue;
    const actualFont = getComputedStyle(el).fontFamily;
    if (actualFont !== bodyFont) {
      fontMismatches.push({
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().slice(0, 56),
        actualFont,
      });
    }
  }
  return {
    headings: desc(headings),
    prose: desc(prose),
    other: desc(other),
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    font: { primary: primaryFont, body: bodyFont, mismatches: fontMismatches },
  };
}

async function main() {
  const executablePath = findBrowser();
  let server = null;

  if (!EXTERNAL_BASE) {
    console.log('› building (NEXT_PUBLIC_FDI_ENABLED=true, so the flagged routes are audited too)');
    await run('npm', ['run', 'build'], { NEXT_PUBLIC_FDI_ENABLED: 'true' });
    console.log('› starting server');
    server = spawn('npm', ['run', 'start'], {
      stdio: 'ignore',
      shell: process.platform === 'win32',
      detached: process.platform !== 'win32',
      env: { ...process.env, NEXT_PUBLIC_FDI_ENABLED: 'true', PORT: String(PORT) },
    });
  }

  const stop = () => {
    if (!server) return;
    try {
      if (process.platform === 'win32') spawn('taskkill', ['/pid', String(server.pid), '/f', '/t']);
      else process.kill(-server.pid, 'SIGTERM');
    } catch {
      /* already gone */
    }
  };
  process.on('exit', stop);
  process.on('SIGINT', () => { stop(); process.exit(130); });

  if (!(await waitForServer(BASE))) {
    console.error(`Server never became reachable at ${BASE}`);
    stop();
    process.exit(2);
  }

  const browser = await chromium.launch({ executablePath, headless: true });
  // Scroll-driven reveals sit at opacity:0 until scrolled into view; reduced
  // motion renders them in place so their text is measurable.
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();

  const failures = [];
  const advisories = [];
  const rows = [];

  for (const route of ROUTES) {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const mobile = await page.evaluate(measureInPage, { textSelector: TEXT_SEL, fontSelector: FONT_SEL });

    await page.setViewportSize({ width: 320, height: 800 });
    await page.waitForTimeout(120);
    const narrow = await page.evaluate(measureInPage, { textSelector: TEXT_SEL, fontSelector: FONT_SEL });

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(120);
    const desktop = await page.evaluate(measureInPage, { textSelector: TEXT_SEL, fontSelector: FONT_SEL });

    if (!mobile.font.primary.includes('Plus Jakarta Sans') || !mobile.font.body.includes('Plus Jakarta Sans')) {
      failures.push(`${route} does not expose the Plus Jakarta Sans font variable.`);
    }
    for (const mismatch of mobile.font.mismatches) {
      failures.push(`${route} <${mismatch.tag}> resolves "${mismatch.text}" to ${mismatch.actualFont} instead of the global Plus Jakarta Sans font.`);
    }

    for (const h of mobile.headings.filter((x) => x.px > HEADING_CEILING)) {
      failures.push(`${route} @375  <${h.tag}> ${h.px}px > ${HEADING_CEILING}px — "${h.text}"`);
    }
    for (const b of mobile.prose.filter((x) => x.px > BODY_CEILING)) {
      failures.push(`${route} @375  <${b.tag}> ${b.px}px > ${BODY_CEILING}px — "${b.text}"`);
    }
    for (const a of mobile.other.filter((x) => x.px > BODY_CEILING)) {
      advisories.push(`${route} @375  <${a.tag}> ${a.px}px — "${a.text}"`);
    }
    if (narrow.scrollW > narrow.clientW) {
      failures.push(`${route} @320  overflows by ${narrow.scrollW - narrow.clientW}px`);
    }

    const mx = (arr) => (arr.length ? arr[0].px : 0);
    rows.push(
      [
        route.padEnd(43),
        `h:${String(mx(mobile.headings)).padStart(4)}`,
        `prose:${String(mx(mobile.prose)).padStart(4)}`,
        `│ 1920  h:${String(mx(desktop.headings)).padStart(4)}`,
        `prose:${String(mx(desktop.prose)).padStart(4)}`,
        narrow.scrollW > narrow.clientW ? 'OVERFLOW' : 'ok',
      ].join(' '),
    );
  }

  await browser.close();
  stop();

  console.log('\n' + 'route'.padEnd(43) + '  375px max        │ 1920px max         320px');
  console.log('─'.repeat(102));
  rows.forEach((r) => console.log(r));
  console.log('─'.repeat(102));

  if (advisories.length) {
    console.log('\nADVISORY — non-prose text above 14px (logotypes, diagram labels, numerals):');
    advisories.forEach((a) => console.log('  · ' + a));
  }

  if (failures.length) {
    console.log(`\n✗ FAILURES (${failures.length}):`);
    failures.forEach((f) => console.log('  ✗ ' + f));
    console.log(
      '\nThe mobile ceilings are enforced by the --step-N scale. A failure here almost\n' +
        'always means a hardcoded size, or an element given the wrong step for its role.',
    );
    process.exit(1);
  }

  console.log(
    `\n✅ ${ROUTES.length} routes — every heading ≤ ${HEADING_CEILING}px and every ` +
      `<p>/<li>/<label> ≤ ${BODY_CEILING}px below 768px; no overflow at 320px.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
