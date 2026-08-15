/**
 * Server-only environment validation.
 *
 * WHY THIS EXISTS
 * `env.ts` validates only NEXT_PUBLIC_* values and explicitly excludes server
 * secrets. That exclusion is why a Gmail `from` address and an invalid API key
 * silently dropped every diagnostic report for two months: nothing checked them,
 * and the Resend SDK reports API failures by RETURNING an error rather than
 * throwing, so the route's catch block never fired and nothing was logged.
 *
 * The rule this module enforces: any value that can silently break delivery is
 * validated, and a bad value fails loudly at startup rather than at send time.
 *
 * `validateResendConfig` is pure and takes its environment as an argument so the
 * rules are unit-testable without touching process.env. `requireResendConfig`
 * is the throwing wrapper route modules evaluate at import time.
 */

/**
 * Domains verified for sending in the Resend account.
 *
 * MUST mirror https://resend.com/domains. Resend rejects any `from` address on a
 * domain that is not verified there, so adding a domain here without verifying it
 * in the dashboard converts a loud startup failure into a silent send failure —
 * precisely the bug this module exists to prevent.
 *
 * Kept as a static list rather than fetched at startup on purpose: a network call
 * on the request path would add a failure mode and latency to every cold start,
 * and the answer changes about once a year.
 */
export const RESEND_VERIFIED_DOMAINS: readonly string[] = ['muhammedajmal.com'];

/** Consumer mailbox providers, named separately to give a precise error. */
const CONSUMER_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com',
  'yahoo.com', 'ymail.com', 'icloud.com', 'me.com', 'aol.com', 'proton.me',
  'protonmail.com', 'gmx.com', 'zoho.com', 'mail.com', 'yandex.com',
]);

const EMAIL_PATTERN = /^[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]+$/;

export interface ResendConfig {
  readonly apiKey: string;
  readonly fromEmail: string;
  readonly fromDomain: string;
}

export type ResendConfigResult =
  | { readonly ok: true; readonly config: ResendConfig }
  | { readonly ok: false; readonly problems: readonly string[] };

/** Returns the domain part of an address, lowercased. */
function domainOf(email: string): string {
  return email.slice(email.lastIndexOf('@') + 1).toLowerCase();
}

/**
 * Checks that an address sits on a verified domain. Exact match or a subdomain
 * of one (Resend treats mail.example.com as distinct, so a subdomain must be
 * verified in its own right — but allowing it here would be wrong, so it is not).
 */
export function isVerifiedSendingDomain(
  email: string,
  verified: readonly string[] = RESEND_VERIFIED_DOMAINS,
): boolean {
  const domain = domainOf(email);
  return verified.some((candidate) => candidate.toLowerCase() === domain);
}

/**
 * Validates the Resend configuration. Pure — no process.env access, no network.
 *
 * Collects every problem rather than stopping at the first, so a misconfigured
 * deploy reports all of them in one log line instead of one per redeploy.
 */
export function validateResendConfig(env: {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}, verified: readonly string[] = RESEND_VERIFIED_DOMAINS): ResendConfigResult {
  const problems: string[] = [];

  const apiKey = (env.RESEND_API_KEY ?? '').trim();
  if (!apiKey) {
    problems.push('RESEND_API_KEY is missing or empty.');
  } else if (!apiKey.startsWith('re_')) {
    problems.push(
      `RESEND_API_KEY does not look like a Resend key (expected the "re_" prefix, got "${apiKey.slice(0, 3)}…").`,
    );
  }

  const fromEmail = (env.RESEND_FROM_EMAIL ?? '').trim();
  if (!fromEmail) {
    problems.push('RESEND_FROM_EMAIL is missing or empty.');
  } else if (fromEmail.includes('<') || fromEmail.includes('>')) {
    problems.push(
      `RESEND_FROM_EMAIL must be a bare address, not a formatted header. Got "${fromEmail}". The display name is added by the caller.`,
    );
  } else if (!EMAIL_PATTERN.test(fromEmail)) {
    problems.push(`RESEND_FROM_EMAIL is not a valid email address. Got "${fromEmail}".`);
  } else if (!isVerifiedSendingDomain(fromEmail, verified)) {
    const domain = domainOf(fromEmail);
    problems.push(
      CONSUMER_DOMAINS.has(domain)
        ? `RESEND_FROM_EMAIL uses "${domain}", a consumer mailbox provider. Resend can only send from a domain you own and have verified. Use an address on one of: ${verified.join(', ')}.`
        : `RESEND_FROM_EMAIL uses the unverified domain "${domain}". Verified domains are: ${verified.join(', ')}. Verify it at https://resend.com/domains first, then add it to RESEND_VERIFIED_DOMAINS.`,
    );
  }

  if (problems.length > 0) return { ok: false, problems };

  return {
    ok: true,
    config: { apiKey, fromEmail, fromDomain: domainOf(fromEmail) },
  };
}

/**
 * Validates and returns the Resend configuration, or throws.
 *
 * Route modules evaluate this at import time so a misconfigured deploy fails on
 * its first request with the exact reason in the logs, instead of accepting the
 * submission and quietly failing to deliver.
 *
 * TRADE-OFF, stated deliberately: this makes a broken email configuration fail
 * the whole submission rather than capturing the lead and skipping the email.
 * That is the intended behaviour — silent partial success is what hid this bug.
 * If lead capture should survive a bad email config, move this call inside the
 * handler and branch on the result rather than weakening the validation.
 */
export function requireResendConfig(env: NodeJS.ProcessEnv = process.env): ResendConfig {
  const result = validateResendConfig({
    RESEND_API_KEY: env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: env.RESEND_FROM_EMAIL,
  });

  if (!result.ok) {
    throw new Error(
      `Invalid Resend configuration — email delivery cannot work:\n` +
        result.problems.map((p) => `  · ${p}`).join('\n'),
    );
  }

  return result.config;
}
