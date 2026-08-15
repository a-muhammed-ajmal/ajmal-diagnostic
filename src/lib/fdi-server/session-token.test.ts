import { hasValidFdiSessionToken, issueFdiSessionToken } from './session-token';

describe('FDI session capability', () => {
  const initial = process.env.SUPABASE_SERVICE_ROLE_KEY;

  beforeEach(() => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-secret-key';
  });

  afterEach(() => {
    if (initial === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = initial;
  });

  it('is valid only for its issued session', () => {
    const token = issueFdiSessionToken('11111111-1111-4111-8111-111111111111');
    expect(hasValidFdiSessionToken('11111111-1111-4111-8111-111111111111', token)).toBe(true);
    expect(hasValidFdiSessionToken('22222222-2222-4222-8222-222222222222', token)).toBe(false);
    expect(hasValidFdiSessionToken('11111111-1111-4111-8111-111111111111', `${token}x`)).toBe(false);
  });
});
