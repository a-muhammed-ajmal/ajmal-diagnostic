/**
 * Calendly booking-link validation and popup-URL construction.
 *
 * Deliberately pure and env-free. Two callers depend on that:
 *
 *  - `src/lib/env.ts` passes the single literal `process.env.NEXT_PUBLIC_CALENDLY_LINK`
 *    read into `resolveCalendlyLink`, so Next's build-time inlining still applies.
 *  - `next.config.ts` calls the same validator before compilation starts, so a missing
 *    or malformed link aborts the build loudly instead of shipping a dead booking button.
 *
 * Keeping the logic here (rather than at module scope in env.ts) also makes it unit
 * testable without importing a module that throws on import.
 */

/**
 * `www.calendly.com` is what a browser address bar shows, so accept it and normalise it
 * away — the popup iframe handles the apex domain without a redirect hop.
 */
const ALLOWED_HOSTS = new Set(["calendly.com", "www.calendly.com"]);

/**
 * Calendly reads its theme from the query string and cannot see our CSS custom
 * properties, so these are raw hex by necessity. Keep in sync with the brand tokens
 * in globals.css. Exported so the tests assert against this one definition instead
 * of restating the brand hexes in a second place.
 */
export const POPUP_THEME = {
  background_color: "FFFFFF", // --color-canvas
  text_color: "16181D", // --color-ink
  primary_color: "2563EB", // --color-brand — electric blue
} as const;

const MISSING_MESSAGE =
  "NEXT_PUBLIC_CALENDLY_LINK is not set.\n" +
  "Every booking CTA on the site depends on it.\n" +
  "Set it in .env.local for local builds and in the Vercel project " +
  "environment variables for deployed builds.\n" +
  "Example: NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/your-handle/your-event";

/**
 * Validates and normalises the configured booking link.
 *
 * @param raw the unvalidated env value. `"undefined"` is checked explicitly because
 *   Next inlines a missing NEXT_PUBLIC_* var as that literal string.
 * @throws if the value is missing, unparseable, not https, not a Calendly host, or
 *   carries no event path.
 */
export function resolveCalendlyLink(raw: string | undefined | null): string {
  if (!raw || raw.trim() === "" || raw.trim() === "undefined") {
    throw new Error(MISSING_MESSAGE);
  }

  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    throw new Error(`NEXT_PUBLIC_CALENDLY_LINK is not a valid URL: "${raw}"`);
  }

  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    throw new Error(
      `NEXT_PUBLIC_CALENDLY_LINK must be an https://calendly.com/... URL. Received: "${raw}"`,
    );
  }

  parsed.hostname = "calendly.com";
  // Strip the trailing slash off the path only. Doing it on the whole string (as this
  // once did) silently no-ops whenever a query string is present.
  parsed.pathname = parsed.pathname.replace(/\/+$/, "");

  if (parsed.pathname === "" || parsed.pathname === "/") {
    throw new Error(
      `NEXT_PUBLIC_CALENDLY_LINK needs an event path, not just the domain. Received: "${raw}"\n` +
        "Example: NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/your-handle/your-event",
    );
  }

  // Query string and hash are preserved — Calendly uses them for prefill and month.
  return parsed.toString();
}

/**
 * Builds the themed popup URL. Uses URLSearchParams rather than string concatenation so
 * a booking link that already carries a query (`?month=2026-08`) does not produce a
 * malformed second `?` and silently break the popup.
 */
export function calendlyPopupUrl(bookingLink: string): string {
  const url = new URL(bookingLink);
  for (const [key, value] of Object.entries(POPUP_THEME)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}
