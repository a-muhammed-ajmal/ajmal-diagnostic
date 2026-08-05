import type { NextConfig } from "next";
import { PHASE_TEST } from "next/constants";
import { resolveCalendlyLink } from "./src/lib/calendly";

/**
 * Build-time guard for the booking link.
 *
 * Next loads .env* files before evaluating this config, so this runs on every
 * `next dev` / `next build` / `next start` and aborts before a single route is compiled
 * if NEXT_PUBLIC_CALENDLY_LINK is missing or malformed. Without it the build would only
 * fail incidentally — via whichever page happens to import src/lib/env.ts — and a
 * refactor could quietly restore the dead-booking-button bug.
 *
 * PHASE_TEST is exempt. `next/jest` loads this config to build the Jest transform, and it
 * does so *before* calling loadEnvConfig — so gating it would make the unit tests depend
 * on a deployment variable they never use. src/lib/calendly.test.ts covers the validator
 * directly instead.
 *
 * The check lives inside the exported function rather than at module scope so it can see
 * the phase. It is an explicit call, not a side-effect-only import, so no bundler can
 * tree-shake it away. Note the relative specifier: the `@/*` tsconfig alias is not
 * honoured here.
 */
export default function nextConfig(phase: string): NextConfig {
  if (phase !== PHASE_TEST) {
    resolveCalendlyLink(process.env.NEXT_PUBLIC_CALENDLY_LINK);
  }

  return {
    /* config options here */
  };
}
