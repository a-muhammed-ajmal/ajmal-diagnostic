/**
 * Server env validation — the guard that should have existed two months ago.
 *
 * The regression these lock down: RESEND_FROM_EMAIL was ajmalconsults@gmail.com,
 * a domain Resend can never send from, and nothing checked it. Every send was
 * rejected and the rejection was swallowed.
 */

import {
  RESEND_VERIFIED_DOMAINS,
  isVerifiedSendingDomain,
  requireResendConfig,
  validateResendConfig,
} from './serverEnv';

const GOOD = {
  RESEND_API_KEY: 're_abcdefghijklmnopqrstuvwxyz012345',
  RESEND_FROM_EMAIL: 'ajmal@muhammedajmal.com',
};

function problems(env: Partial<typeof GOOD>): string[] {
  const result = validateResendConfig(env);
  return result.ok ? [] : [...result.problems];
}

describe('a valid configuration', () => {
  it('passes and exposes the parsed values', () => {
    const result = validateResendConfig(GOOD);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('unreachable');
    expect(result.config.fromEmail).toBe('ajmal@muhammedajmal.com');
    expect(result.config.fromDomain).toBe('muhammedajmal.com');
    expect(result.config.apiKey).toBe(GOOD.RESEND_API_KEY);
  });

  it('trims incidental whitespace from env values', () => {
    const result = validateResendConfig({
      RESEND_API_KEY: `  ${GOOD.RESEND_API_KEY}  `,
      RESEND_FROM_EMAIL: `  ${GOOD.RESEND_FROM_EMAIL}\t`,
    });
    expect(result.ok).toBe(true);
  });
});

describe('THE REGRESSION — a consumer mailbox domain', () => {
  it('rejects the exact address that broke delivery', () => {
    const found = problems({ ...GOOD, RESEND_FROM_EMAIL: 'ajmalconsults@gmail.com' });
    expect(found).toHaveLength(1);
    expect(found[0]).toContain('gmail.com');
    expect(found[0]).toContain('consumer mailbox provider');
    expect(found[0]).toContain('muhammedajmal.com');
  });

  it.each([
    'someone@gmail.com',
    'someone@outlook.com',
    'someone@yahoo.com',
    'someone@icloud.com',
    'someone@hotmail.com',
    'someone@proton.me',
  ])('rejects %s', (address) => {
    expect(problems({ ...GOOD, RESEND_FROM_EMAIL: address })).toHaveLength(1);
  });
});

describe('unverified domains', () => {
  it('rejects a plausible but unverified business domain', () => {
    const found = problems({ ...GOOD, RESEND_FROM_EMAIL: 'ajmal@muhammedajmal.co' });
    expect(found[0]).toContain('unverified domain');
    expect(found[0]).toContain('resend.com/domains');
  });

  it('rejects a subdomain of a verified domain', () => {
    // Resend treats mail.example.com as a separate domain requiring its own
    // verification, so allowing it implicitly would reintroduce silent failure.
    expect(problems({ ...GOOD, RESEND_FROM_EMAIL: 'ajmal@mail.muhammedajmal.com' })).toHaveLength(1);
  });

  it('rejects a lookalike that merely ends with the verified domain', () => {
    expect(problems({ ...GOOD, RESEND_FROM_EMAIL: 'ajmal@notmuhammedajmal.com' })).toHaveLength(1);
  });

  it('accepts the verified domain regardless of case', () => {
    expect(problems({ ...GOOD, RESEND_FROM_EMAIL: 'Ajmal@MuhammedAjmal.COM' })).toHaveLength(0);
  });
});

describe('malformed or missing values', () => {
  it.each([
    ['missing key', { RESEND_FROM_EMAIL: GOOD.RESEND_FROM_EMAIL }, 'RESEND_API_KEY is missing'],
    ['empty key', { ...GOOD, RESEND_API_KEY: '' }, 'RESEND_API_KEY is missing'],
    ['whitespace key', { ...GOOD, RESEND_API_KEY: '   ' }, 'RESEND_API_KEY is missing'],
    ['wrong key prefix', { ...GOOD, RESEND_API_KEY: 'sk-not-a-resend-key' }, 'does not look like a Resend key'],
    ['missing from', { RESEND_API_KEY: GOOD.RESEND_API_KEY }, 'RESEND_FROM_EMAIL is missing'],
    ['empty from', { ...GOOD, RESEND_FROM_EMAIL: '' }, 'RESEND_FROM_EMAIL is missing'],
    ['not an email', { ...GOOD, RESEND_FROM_EMAIL: 'ajmal-at-muhammedajmal.com' }, 'not a valid email'],
    ['no TLD', { ...GOOD, RESEND_FROM_EMAIL: 'ajmal@localhost' }, 'not a valid email'],
  ])('rejects %s', (_label, env, expected) => {
    const found = problems(env);
    expect(found.join(' ')).toContain(expected);
  });

  it('rejects a formatted header rather than silently double-wrapping it', () => {
    // The caller composes "Display Name <address>". A pre-formatted value here
    // produces "Consulting <Consulting <a@b.com>>", which Resend rejects.
    const found = problems({ ...GOOD, RESEND_FROM_EMAIL: 'Muhammed Ajmal <ajmal@muhammedajmal.com>' });
    expect(found[0]).toContain('bare address');
  });

  it('reports every problem at once, not just the first', () => {
    expect(problems({ RESEND_API_KEY: 'nope', RESEND_FROM_EMAIL: 'someone@gmail.com' })).toHaveLength(2);
  });
});

describe('isVerifiedSendingDomain', () => {
  it('matches only exact verified domains', () => {
    expect(isVerifiedSendingDomain('a@muhammedajmal.com')).toBe(true);
    expect(isVerifiedSendingDomain('a@gmail.com')).toBe(false);
  });

  it('accepts an injected list for testing', () => {
    expect(isVerifiedSendingDomain('a@example.com', ['example.com'])).toBe(true);
    expect(isVerifiedSendingDomain('a@example.com', ['other.com'])).toBe(false);
  });
});

describe('requireResendConfig', () => {
  it('returns the config when the environment is valid', () => {
    expect(requireResendConfig(GOOD as unknown as NodeJS.ProcessEnv).fromDomain).toBe('muhammedajmal.com');
  });

  it('throws with every problem listed, so one deploy surfaces them all', () => {
    expect(() =>
      requireResendConfig({ RESEND_API_KEY: 'nope', RESEND_FROM_EMAIL: 'x@gmail.com' } as unknown as NodeJS.ProcessEnv),
    ).toThrow(/Invalid Resend configuration/);

    try {
      requireResendConfig({ RESEND_API_KEY: 'nope', RESEND_FROM_EMAIL: 'x@gmail.com' } as unknown as NodeJS.ProcessEnv);
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toContain('does not look like a Resend key');
      expect(message).toContain('consumer mailbox provider');
    }
  });

  it('throws on a completely empty environment', () => {
    expect(() => requireResendConfig({} as unknown as NodeJS.ProcessEnv)).toThrow(/Invalid Resend configuration/);
  });
});

describe('the verified-domain list itself', () => {
  it('is non-empty and contains no consumer providers', () => {
    expect(RESEND_VERIFIED_DOMAINS.length).toBeGreaterThan(0);
    for (const domain of RESEND_VERIFIED_DOMAINS) {
      expect(domain).not.toContain('gmail');
      expect(domain).toMatch(/^[a-z0-9.-]+\.[a-z]{2,}$/i);
    }
  });
});
