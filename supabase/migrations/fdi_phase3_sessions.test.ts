import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const migration = readFileSync(
  join(process.cwd(), 'supabase', 'migrations', '20260815000003_fdi_phase3_sessions.sql'),
  'utf8',
).toLowerCase();

describe('FDI Phase 3 session migration', () => {
  it('does not name or mutate the legacy diagnostic table', () => {
    expect(migration).not.toContain('diagnostic_leads');
  });

  it('finalizes progressive lifecycle and keeps incomplete attempts unscored', () => {
    expect(migration).toContain("status in ('in_progress', 'completed')");
    expect(migration).toContain('fdi_sessions_in_progress_has_no_score');
    expect(migration).toContain('fdi_sessions_completed_is_stamped');
  });

  it('records explicit admin test-status overrides under RLS', () => {
    expect(migration).toContain('fdi_test_status_history');
    expect(migration).toContain('previous_is_test');
    expect(migration).toContain('new_is_test');
    expect(migration).toContain('admin_identifier');
    expect(migration).toContain('enable row level security');
    expect(migration).toContain('revoke all privileges on table public.fdi_test_status_history from anon, authenticated');
  });
});
