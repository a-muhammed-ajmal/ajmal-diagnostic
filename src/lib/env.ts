/**
 * Build-time validated public environment.
 *
 * Only NEXT_PUBLIC_* values belong here. Next.js inlines these at build time, so a
 * missing value silently becomes the string "undefined" in the shipped HTML — which is
 * exactly the bug this module exists to prevent. Reading them here means a bad build
 * fails loudly instead of rendering a broken booking link.
 *
 * Server-only secrets (SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, ANTHROPIC_API_KEY,
 * ADMIN_PASSWORD) are deliberately NOT validated here — they are read lazily inside
 * route handlers so the build never requires them.
 */

// The literal `process.env.NEXT_PUBLIC_CALENDLY_LINK` reference is required: Next.js
// replaces it textually at build time. Destructuring or dynamic access will not inline.
const rawCalendlyLink = process.env.NEXT_PUBLIC_CALENDLY_LINK;

function resolveCalendlyLink(): string {
  if (!rawCalendlyLink || rawCalendlyLink === "undefined") {
    throw new Error(
      "NEXT_PUBLIC_CALENDLY_LINK is not set.\n" +
        "Every booking CTA on the site depends on it.\n" +
        "Set it in .env.local for local builds and in the Vercel project " +
        "environment variables for deployed builds.\n" +
        "Example: NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/your-handle/your-event",
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(rawCalendlyLink);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_CALENDLY_LINK is not a valid URL: "${rawCalendlyLink}"`,
    );
  }

  if (parsed.protocol !== "https:" || parsed.hostname !== "calendly.com") {
    throw new Error(
      `NEXT_PUBLIC_CALENDLY_LINK must be an https://calendly.com/... URL. Received: "${rawCalendlyLink}"`,
    );
  }

  return parsed.toString().replace(/\/$/, "");
}

/** The practice's Calendly booking URL. Guaranteed to be a valid https://calendly.com URL. */
export const CALENDLY_LINK = resolveCalendlyLink();

/** Canonical public origin, used for metadata, sitemap and absolute links. */
export const SITE_URL = "https://www.muhammedajmal.com";
