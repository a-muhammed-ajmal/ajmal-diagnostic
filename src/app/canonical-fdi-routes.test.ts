import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function source(...segments: string[]) {
  return readFileSync(join(root, ...segments), 'utf8');
}

describe('canonical Business Health Check routes', () => {
  it('serves FDI from /diagnostic and its browser-private result from /results', () => {
    expect(source('src', 'app', 'diagnostic', 'page.tsx')).toContain('FdiDiagnosticFlow');
    expect(source('src', 'app', 'results', 'page.tsx')).toContain('FdiResults');
  });

  it('permanently redirects both former FDI aliases to the canonical routes', () => {
    const diagnosticAlias = source('src', 'app', 'diagnostic', 'fdi', 'page.tsx');
    const resultsAlias = source('src', 'app', 'results', 'fdi', 'page.tsx');

    expect(diagnosticAlias).toContain("permanentRedirect('/diagnostic')");
    expect(resultsAlias).toContain("permanentRedirect('/results')");
  });

  it('keeps the aliases as noindex redirects rather than public destinations', () => {
    expect(source('src', 'app', 'diagnostic', 'fdi', 'layout.tsx')).toContain("path: '/diagnostic/fdi'");
    expect(source('src', 'app', 'diagnostic', 'fdi', 'layout.tsx')).toContain('index: false');
    expect(source('src', 'app', 'results', 'fdi', 'layout.tsx')).toContain("path: '/results/fdi'");
    expect(source('src', 'app', 'results', 'fdi', 'layout.tsx')).toContain('index: false');
  });

  it('does not retain a public feature-flag fallback or legacy public submit route', () => {
    for (const path of [
      ['src', 'app', 'diagnostic', 'page.tsx'],
      ['src', 'app', 'api', 'fdi', 'sessions', 'route.ts'],
      ['src', 'app', 'api', 'fdi', 'sessions', '[id]', 'route.ts'],
      ['src', 'app', 'api', 'fdi', 'submit', 'route.ts'],
    ]) {
      expect(source(...path)).not.toContain('isFdiEnabled');
    }

    expect(existsSync(join(root, 'src', 'app', 'api', 'submit', 'route.ts'))).toBe(false);
    expect(existsSync(join(root, 'src', 'lib', 'ai.ts'))).toBe(false);
    expect(existsSync(join(root, 'src', 'lib', 'email', 'templates', 'DiagnosticReport.tsx'))).toBe(false);
  });
});
