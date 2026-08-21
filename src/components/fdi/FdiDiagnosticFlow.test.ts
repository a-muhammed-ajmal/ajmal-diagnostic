import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('FDI-1.1 intro requirements', () => {
  const source = readFileSync(join(process.cwd(), 'src', 'components', 'fdi', 'FdiDiagnosticFlow.tsx'), 'utf8');

  it('uses the active question set and approved intro content', () => {
    expect(source).toContain('CURRENT_FDI_QUESTION_SET');
    expect(source).toContain('A free check of how much day-to-day operations still rely on you.');
    expect(source).toContain('This is a focused founder-dependency self-report, not a full financial, tax, legal, or business-performance audit.');
    expect(source).toContain('href="/privacy"');
    expect(source).toContain("value.sector !== 'other' || Boolean(value.sectorOther)");
  });
});
