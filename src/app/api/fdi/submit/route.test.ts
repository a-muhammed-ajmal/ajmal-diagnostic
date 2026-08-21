import { NextRequest } from 'next/server';

const mockSend = jest.fn();
const mockCompleteFdiSession = jest.fn();
const mockToFounderFdiReport = jest.fn();
const mockUpdate = jest.fn();
const mockFrom = jest.fn();
const mockCreateAdminClient = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send: (...args: unknown[]) => mockSend(...args) } })),
}));

jest.mock('@/lib/fdi-server/persistence', () => ({
  completeFdiSession: (...args: unknown[]) => mockCompleteFdiSession(...args),
  FdiInputError: class FdiInputError extends Error {},
  FdiSessionConflictError: class FdiSessionConflictError extends Error {},
}));

jest.mock('@/lib/fdi/public-report', () => ({
  toFounderFdiReport: (...args: unknown[]) => mockToFounderFdiReport(...args),
}));

jest.mock('@/lib/fdi-server/session-token', () => ({
  hasValidFdiSessionToken: () => true,
}));

jest.mock('@/lib/rateLimit', () => ({
  enforcePublicFormLimits: () => Promise.resolve(null),
}));

jest.mock('@/lib/serverEnv', () => ({
  requireResendConfig: () => ({ apiKey: 're_test_key', fromEmail: 'reports@muhammedajmal.com' }),
}));

jest.mock('@/lib/env', () => ({
  CALENDLY_LINK: 'https://calendly.com/muhammed-ajmal/business-clarity-audit',
  WHATSAPP_AUDIT_LINK: null,
}));

jest.mock('@/lib/supabase/server', () => ({
  createAdminClient: (...args: unknown[]) => mockCreateAdminClient(...args),
}));

import { POST } from './route';

const report = {
  index: {
    presentation: 'Founder Dependency Index: 50 / 100 — High Founder Dependency',
    display: 50,
    scaleMax: 100,
    band: { key: 'high', label: 'High Founder Dependency', displayRange: '50–74' },
  },
  components: [],
  alerts: [],
  concentration: { componentKeys: ['DS'], labels: ['Decision Speed'], raw: 6, unrounded: 50, display: 50 },
  observations: [],
  limitation: 'This result is based on founder self-report.',
};

function request() {
  return new NextRequest('http://localhost/api/fdi/submit', {
    method: 'POST',
    headers: { origin: 'http://localhost', 'content-type': 'application/json' },
    body: JSON.stringify({
      sessionId: '00000000-0000-4000-8000-000000000001',
      sessionToken: 'a'.repeat(32),
      contact: {
        name: 'QA Founder',
        companyName: 'QA Company',
        email: 'consult@muhammedajmal.com',
        phone: '+971500000000',
      },
      businessDetails: {},
      completionMs: 12000,
    }),
  });
}

function acceptedUpdate() {
  const secondEq = jest.fn().mockResolvedValue({ error: null });
  const firstEq = jest.fn().mockReturnValue({ eq: secondEq });
  mockUpdate.mockReturnValue({ eq: firstEq });
  mockFrom.mockReturnValue({ update: mockUpdate });
  mockCreateAdminClient.mockReturnValue({ from: mockFrom });
}

describe('FDI report delivery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCompleteFdiSession.mockResolvedValue(report);
    mockToFounderFdiReport.mockImplementation((value) => value);
    mockSend.mockResolvedValue({ data: { id: 'email_123' }, error: null });
    acceptedUpdate();
  });

  it('sets email_sent only after Resend accepts the deterministic report', async () => {
    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true, report, emailSent: true });
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      to: 'consult@muhammedajmal.com',
      subject: 'Your Founder Dependency Index: 50 / 100 — High Founder Dependency',
    }));
    expect(mockFrom).toHaveBeenCalledWith('fdi_sessions');
    expect(mockUpdate).toHaveBeenCalledWith({ email_sent: true });
  });

  it('preserves the result and leaves email_sent false when Resend rejects delivery', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'Rejected by Resend' } });

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true, report, emailSent: false });
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
