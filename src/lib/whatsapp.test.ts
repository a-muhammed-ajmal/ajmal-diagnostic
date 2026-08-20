import { AUDIT_WHATSAPP_MESSAGE, resolveWhatsAppAuditLink } from './whatsapp';

describe('resolveWhatsAppAuditLink', () => {
  it('returns null when the optional WhatsApp channel is not configured', () => {
    expect(resolveWhatsAppAuditLink(undefined)).toBeNull();
  });

  it('normalises an E.164 number and pre-fills the Business Clarity Audit message', () => {
    expect(resolveWhatsAppAuditLink('+971 50 123 4567')).toBe(
      `https://wa.me/971501234567?text=${encodeURIComponent(AUDIT_WHATSAPP_MESSAGE)}`,
    );
  });

  it('rejects a configured value that is not an E.164 number', () => {
    expect(() => resolveWhatsAppAuditLink('not-a-number')).toThrow(
      'NEXT_PUBLIC_WHATSAPP_NUMBER must be an E.164 phone number',
    );
  });
});
