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

  it('takes a completed check directly to the canonical result route', () => {
    expect(source).toContain("router.push('/results')");
    expect(source).not.toContain("router.push('/results/fdi')");
  });
});

/* A second queued timer used to advance twice from one selection, carrying the
   founder past the following question with no answer recorded for it. */
describe('one selection moves the screen exactly once', () => {
  const source = readFileSync(join(process.cwd(), 'src', 'components', 'fdi', 'FdiDiagnosticFlow.tsx'), 'utf8');

  it('keeps at most one auto-advance queued and clears it on unmount', () => {
    expect(source).toContain('window.clearTimeout(advanceTimer.current)');
    expect(source).toContain('useEffect(() => cancelAdvance, [cancelAdvance])');
    /* Every scheduled advance is held, so it can be replaced rather than added to. */
    expect(source).toContain('advanceTimer.current = window.setTimeout(');
    expect(source.match(/window\.setTimeout\(/g)).toHaveLength(1);
  });

  it('advances only from the question the answer belongs to', () => {
    expect(source).toContain('const answeredAt = positionRef.current');
    expect(source).toContain('seq === answerSeq.current && positionRef.current === answeredAt');
    expect(source).toContain('if (!isCurrent()) return;');
    expect(source).toContain('goTo(answeredAt + 1)');
  });

  it('routes every manual move through the same guard', () => {
    expect(source).toContain('onClick={() => goTo(currentQuestion - 1)}');
    expect(source).toContain('onClick={() => goTo(currentQuestion + 1)}');
    /* Nothing may set the position behind goTo's back, or the guard reads a stale index. */
    expect(source.match(/setCurrentQuestion\(/g)).toHaveLength(1);
  });
});
