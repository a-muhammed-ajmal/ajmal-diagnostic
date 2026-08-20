/**
 * Builds an optional click-to-chat link for the Business Clarity Audit.
 *
 * The number is intentionally supplied through a public environment variable rather
 * than embedded in source. A WhatsApp link is safe to expose, but the business must
 * explicitly choose the number that receives qualified audit enquiries.
 */
export const AUDIT_WHATSAPP_MESSAGE =
  'Hello Muhammed, I have completed the Business Health Check and would like to discuss a Business Clarity Audit.';

/**
 * Returns null when WhatsApp has not been configured, so Calendly remains a fully
 * working standalone conversion path. Any configured value must be an E.164 number.
 */
export function resolveWhatsAppAuditLink(raw: string | undefined | null): string | null {
  if (!raw || raw.trim() === '' || raw.trim() === 'undefined') return null;

  const phone = raw.trim().replace(/[()\s+-]/g, '');
  if (!/^[1-9]\d{6,14}$/.test(phone)) {
    throw new Error(
      'NEXT_PUBLIC_WHATSAPP_NUMBER must be an E.164 phone number, for example +971501234567.',
    );
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(AUDIT_WHATSAPP_MESSAGE)}`;
}
