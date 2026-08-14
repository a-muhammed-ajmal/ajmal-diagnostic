/**
 * Structural guarantees about the FDI module's import graph.
 *
 * These are the enforcement half of two spec rules that are otherwise only
 * conventions:
 *
 *   §7/§16 — the scoring engine is a pure function: no database calls, no AI,
 *            no side effects. A future edit that imports a client here fails.
 *
 *   §19 #16 — a legacy health score is never converted into an FDI. There is no
 *            conversion path because `src/lib/fdi/**` cannot even see the legacy
 *            scorer or its question set.
 *
 * Implemented by reading the source rather than by mocking, so it holds
 * regardless of how the modules are bundled.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const FDI_ROOT = join(process.cwd(), 'src', 'lib', 'fdi');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    if (!entry.endsWith('.ts')) return [];
    if (entry.endsWith('.test.ts')) return [];
    if (entry === 'test-support.ts') return [];
    return [full];
  });
}

const FILES = sourceFiles(FDI_ROOT);

function importsOf(file: string): string[] {
  const source = readFileSync(file, 'utf8');
  const specifiers: string[] = [];
  const patterns = [/\bfrom\s+['"]([^'"]+)['"]/g, /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g, /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g];
  for (const pattern of patterns) {
    let match = pattern.exec(source);
    while (match !== null) {
      specifiers.push(match[1]);
      match = pattern.exec(source);
    }
  }
  return specifiers;
}

describe('the FDI module ships real files', () => {
  it('found the source set', () => {
    expect(FILES.length).toBeGreaterThan(0);
    const names = FILES.map((f) => f.replace(FDI_ROOT, '').replace(/\\/g, '/'));
    expect(names).toEqual(expect.arrayContaining(['/score.ts', '/bands.ts', '/report.ts']));
  });
});

describe('purity — no I/O, AI, or framework dependencies (§7, §16)', () => {
  const FORBIDDEN = [
    '@supabase/supabase-js',
    '@supabase/ssr',
    '@anthropic-ai/sdk',
    'resend',
    '@react-email/components',
    'react',
    'react-dom',
    'zod',
  ];

  it.each(FILES)('%s imports no client library or framework', (file) => {
    const specifiers = importsOf(file);
    for (const forbidden of FORBIDDEN) {
      expect(specifiers).not.toContain(forbidden);
    }
    for (const specifier of specifiers) {
      expect(specifier.startsWith('next/')).toBe(false);
      expect(specifier.startsWith('@/lib/supabase')).toBe(false);
      expect(specifier.startsWith('@/lib/ai')).toBe(false);
      expect(specifier.startsWith('@/lib/email')).toBe(false);
    }
  });

  it('the scoring engine imports only sibling FDI modules', () => {
    const specifiers = importsOf(join(FDI_ROOT, 'score.ts'));
    for (const specifier of specifiers) {
      expect(specifier.startsWith('./')).toBe(true);
    }
  });

  it('the scoring engine has no clock and no randomness', () => {
    const source = readFileSync(join(FDI_ROOT, 'score.ts'), 'utf8');
    expect(source).not.toContain('Date.now');
    expect(source).not.toContain('new Date');
    expect(source).not.toContain('Math.random');
    expect(source).not.toContain('process.env');
  });

  it('no FDI source module reads process.env', () => {
    for (const file of FILES) {
      expect(readFileSync(file, 'utf8')).not.toContain('process.env');
    }
  });
});

describe('§19 #16 — no path from a legacy health score to an FDI', () => {
  const LEGACY_MODULES = [
    '@/lib/scoring',
    '@/lib/questions',
    '../scoring',
    '../questions',
    '../../lib/scoring',
  ];

  it.each(FILES)('%s does not import the legacy scorer or question set', (file) => {
    const specifiers = importsOf(file);
    for (const legacy of LEGACY_MODULES) {
      expect(specifiers).not.toContain(legacy);
    }
  });

  it('never references a legacy scoring symbol by name', () => {
    for (const file of FILES) {
      const source = readFileSync(file, 'utf8');
      // Comments legitimately discuss the legacy model; code must not use it.
      const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
      expect(code).not.toContain('calculateResults');
      expect(code).not.toContain('DIMENSION_META');
      expect(code).not.toContain('healthScore');
      expect(code).not.toContain('severityLabel');
      expect(code).not.toContain('primaryConstraint');
    }
  });
});

describe('the legacy diagnostic is untouched', () => {
  it('still exports its original scorer', async () => {
    const legacy = await import('../scoring');
    expect(typeof legacy.calculateResults).toBe('function');
    expect(legacy.DIMENSION_META).toBeDefined();
  });

  it('still scores legacy answers on the legacy scale, with no FDI fields', () => {
    // A legacy record's meaning must remain interpretable after FDI ships (§18).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const legacy = require('../scoring') as typeof import('../scoring');
    const result = legacy.calculateResults({ 1: 'a', 2: 'a', 3: 'a', 4: 'a', 5: 'a' });

    expect(result).toHaveProperty('healthScore');
    expect(result).toHaveProperty('severityLabel');
    expect(result).not.toHaveProperty('fdi');
    expect(result).not.toHaveProperty('band');
    expect(result).not.toHaveProperty('concentration');
  });
});
