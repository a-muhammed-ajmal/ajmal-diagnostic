import { NextRequest } from 'next/server';
import { renderToStaticMarkup } from 'react-dom/server';

const mockSend = jest.fn();
const mockFrom = jest.fn();
const mockCreateAdminClient = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: (...args: unknown[]) => mockSend(...args) },
  })),
}));

jest.mock('@/lib/rateLimit', () => ({
  enforcePublicFormLimits: () => Promise.resolve(null),
  normaliseEmail: (email: string) => email.trim().toLowerCase(),
}));

jest.mock('@/lib/serverEnv', () => ({
  requireResendConfig: () => ({ apiKey: 're_test_key', fromEmail: 'consult@muhammedajmal.com' }),
}));

jest.mock('@/lib/env', () => ({
  SITE_URL: 'https://www.muhammedajmal.com',
}));

jest.mock('@/lib/supabase/server', () => ({
  createAdminClient: (...args: unknown[]) => mockCreateAdminClient(...args),
}));

import { POST } from './route';

const UNIQUE_VIOLATION = { code: '23505', message: 'duplicate key value' };
const ROW = { id: 'row-1', unsubscribe_token: 'tok_abc', unsubscribed_at: null };

function request(email = 'New@Acme.ae') {
  return new NextRequest('http://localhost:3000/api/newsletter', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
    body: JSON.stringify({ email }),
  });
}

let updates: Record<string, unknown>[];

/**
 * insertResult drives the new-vs-existing path; selectResult is only consulted
 * when the insert reports a unique violation.
 */
function supabaseWith(
  insertResult: { data: unknown; error: unknown },
  selectResult?: { data: unknown; error: unknown },
  updateError: unknown = null,
) {
  updates = [];
  const insert = jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue(insertResult) }),
  });
  const select = jest.fn().mockReturnValue({
    eq: jest.fn().mockReturnValue({
      single: jest.fn().mockResolvedValue(selectResult ?? { data: null, error: null }),
    }),
  });
  const update = jest.fn().mockImplementation((payload: Record<string, unknown>) => {
    updates.push(payload);
    return { eq: jest.fn().mockResolvedValue({ error: updateError }) };
  });
  mockFrom.mockReturnValue({ insert, select, update });
  mockCreateAdminClient.mockReturnValue({ from: mockFrom });
}

const subjects = () => mockSend.mock.calls.map((c) => c[0].subject);

beforeEach(() => {
  jest.clearAllMocks();
  mockSend.mockResolvedValue({ data: { id: 'msg_1' }, error: null });
});

describe('POST /api/newsletter', () => {
  it('stores a new address and sends both the confirmation and the notification', async () => {
    supabaseWith({ data: ROW, error: null });

    const res = await POST(request());

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(subjects()).toEqual(['You are subscribed', 'New newsletter subscriber']);
  });

  it('sends the confirmation to the subscriber with a working unsubscribe link', async () => {
    supabaseWith({ data: ROW, error: null });

    await POST(request());

    const confirmation = mockSend.mock.calls[0][0];
    expect(confirmation.to).toBe('new@acme.ae');

    const html = renderToStaticMarkup(confirmation.react);
    expect(html).toContain(
      'https://www.muhammedajmal.com/api/newsletter/unsubscribe?token=tok_abc',
    );
    expect(html).toContain('Unsubscribe');
  });

  it('renders the approved confirmation copy verbatim', async () => {
    supabaseWith({ data: ROW, error: null });

    await POST(request());

    const text = renderToStaticMarkup(mockSend.mock.calls[0][0].react)
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ');

    for (const line of [
      'Thanks for subscribing.',
      'You are now on the Muhammed Ajmal Consulting insights list.',
      'I share practical notes on reducing founder dependency, strengthening operating systems, and keeping execution consistent when there is something useful to send.',
      'You can unsubscribe at any time using the link below.',
      'Muhammed Ajmal',
      'Business Operations & Growth Consultant',
      'Dubai, United Arab Emirates',
    ]) {
      expect(text).toContain(line);
    }
  });

  it('reports failure rather than false success when the write fails', async () => {
    supabaseWith({ data: null, error: { code: '42501', message: 'permission denied' } });

    const res = await POST(request());

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ success: false });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('sends nothing when an already-active address is resubmitted', async () => {
    supabaseWith(
      { data: null, error: UNIQUE_VIOLATION },
      { data: { ...ROW, unsubscribed_at: null }, error: null },
    );

    const res = await POST(request());

    expect(await res.json()).toEqual({ success: true });
    // No state changed, so neither email is warranted — and the public form
    // must not be usable to mail a stranger repeatedly.
    expect(mockSend).not.toHaveBeenCalled();
    expect(updates).toEqual([]);
  });

  it('reactivates an unsubscribed address, confirming but not notifying', async () => {
    supabaseWith(
      { data: null, error: UNIQUE_VIOLATION },
      { data: { ...ROW, unsubscribed_at: '2026-08-01T00:00:00Z' }, error: null },
    );

    const res = await POST(request());

    expect(await res.json()).toEqual({ success: true });
    expect(updates).toContainEqual({ unsubscribed_at: null });
    expect(subjects()).toEqual(['You are subscribed']);
  });

  it('keeps the subscription when the confirmation email fails', async () => {
    supabaseWith({ data: ROW, error: null });
    mockSend.mockResolvedValueOnce({ data: null, error: { message: 'Rejected by Resend' } });

    const res = await POST(request());

    // The write succeeded, so the subscription stands and is not reversed.
    expect(await res.json()).toEqual({ success: true });
    expect(updates).not.toContainEqual(expect.objectContaining({ unsubscribed_at: expect.anything() }));
  });

  it('rejects an invalid address', async () => {
    supabaseWith({ data: ROW, error: null });

    const res = await POST(request('not-an-email'));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ success: false });
    expect(mockSend).not.toHaveBeenCalled();
  });
});
