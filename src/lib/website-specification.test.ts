import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const website = readFileSync(join(process.cwd(), 'docs', 'WEBSITE.md'), 'utf8');
const addendum = readFileSync(join(process.cwd(), 'docs', 'FDI-1.1-Addendum.md'), 'utf8');

describe('current WEBSITE specification', () => {
  it('records the canonical route and active FDI contract', () => {
    expect(website).toContain('`/diagnostic/fdi` -> `/diagnostic` with HTTP 308.');
    expect(website).toContain('`/results/fdi` -> `/results` with HTTP 308.');
    expect(website).toContain('`FDI-1.1`');
    expect(website).toContain('`FDI-QS-1.1`');
    expect(website).toContain('`FDI-QF-2.1`');
    expect(website).toContain('Start the Business Health Check ->');
    expect(website).toContain('Discuss a Business Clarity Audit');
  });

  it('excludes retired presentation and route claims', () => {
    for (const retiredTerm of ['Cyanotype Blueprint', 'Fraunces', 'IBM Plex', 'predictable growth']) {
      expect(website).not.toContain(retiredTerm);
    }
    expect(website).not.toContain('`/results/fdi` is the Founder Dependency Index result route');
    expect(website).not.toContain('`/results` is the legacy diagnostic result route');
  });
});

describe('FDI-1.1 addendum', () => {
  it('keeps FDI-1.0 historical and locks delivery acceptance behaviour', () => {
    expect(addendum).toContain('`FDI-1.0` remains historical-only');
    expect(addendum).toContain('`email_sent` is set to `true` only after Resend accepts');
    for (const reason of [
      'revenue_not_provided',
      'team_size_not_provided',
      'operating_age_not_provided',
      'sector_not_provided',
    ]) {
      expect(addendum).toContain(`\`${reason}\``);
    }
  });
});
