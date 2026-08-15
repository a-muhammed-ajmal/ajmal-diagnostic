import { createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_PREFIX = 'fdi1';

function signingKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required to protect FDI sessions.');
  return key;
}

function signature(sessionId: string): string {
  return createHmac('sha256', signingKey()).update(`fdi-session:${sessionId}`).digest('base64url');
}

/** A server-issued bearer capability for a single uncompleted browser session. */
export function issueFdiSessionToken(sessionId: string): string {
  return `${TOKEN_PREFIX}.${sessionId}.${signature(sessionId)}`;
}

/** Rejects malformed, substituted, or cross-session capabilities without revealing why. */
export function hasValidFdiSessionToken(sessionId: string, token: string): boolean {
  const expected = issueFdiSessionToken(sessionId);
  const received = Buffer.from(token);
  const expectedBytes = Buffer.from(expected);
  return received.length === expectedBytes.length && timingSafeEqual(received, expectedBytes);
}
