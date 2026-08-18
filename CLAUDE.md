# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

The project constitution above (imported from AGENTS.md) covers tech stack, directory
layout, coding standards, and the design system. This file adds what that document
doesn't: commands, and the one subsystem whose architecture can't be understood from a
single file.

## Commands

```bash
npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Production build — fails loudly if NEXT_PUBLIC_CALENDLY_LINK
                         # is missing/malformed (checked in next.config.ts before compilation)
npm run lint             # ESLint (eslint-config-next core-web-vitals + typescript)
npm test                 # Jest (all suites)
npm run test:coverage    # Jest with coverage report

npx jest path/to/file.test.ts        # Single test file
npx jest -t "test name substring"    # Filter by test name
```

Copy `.env.example` to `.env.local` before running `dev` or `build`. Only
`NEXT_PUBLIC_CALENDLY_LINK` is required for a build to succeed; server-only secrets
(Supabase service role, Resend, Anthropic, admin password) are read lazily inside route
handlers, so their absence doesn't fail the build but will fail those routes at runtime.

`jest.config.ts` enforces **100% coverage** on `src/lib/fdi/score.ts`, `bands.ts`, and
`rounding.ts` — these are pure scoring functions with no legitimate untested branch. A
coverage drop there means a rejection path or score boundary went unexercised; treat it
as a bug, not a threshold to relax.

## The Founder Dependency Index (FDI) subsystem

`src/lib/fdi/` is a spec-driven scoring engine, not app-specific glue code. It's the
diagnostic engine behind the "Business Health Check" free offer (12 behavioural
questions → a 0–100 index across three components → a band + findings). It's gated
behind `NEXT_PUBLIC_FDI_ENABLED` (`src/lib/featureFlags.ts`) — `false` by default. When
disabled, `/diagnostic` and `/results` serve the legacy quiz (`src/lib/scoring.ts`,
`src/lib/questions.ts`); when enabled, they serve FDI instead, and `/diagnostic/fdi` +
`/results/fdi` become noindex aliases for private result handling.

**Source of truth**: `docs/Muhammed_Ajmal_Consulting_Founder_Dependency_Index_v1.0.md`
is the governing specification. Code comments throughout `src/lib/fdi/` reference it by
section number (e.g. `§3`, `§9`, `§12`, `§17`) — when a comment cites a section, that
section is the actual authority on intended behavior, and the doc's "Section 12: Source
files to keep aligned" lists what must move together when the spec changes. Read the
relevant section before changing scoring, bands, or question logic.

**Versioning model** (`src/lib/fdi/config/`): configs are immutable once shipped. Adding
a new diagnostic version means adding a new file (e.g. `fdi-1.1.ts`) and a new entry in
`config/index.ts`'s `REGISTRY` — never editing an existing version's config. A stored
session records the `diagnosticVersion` it was scored under, so a historic response can
always be recalculated against the exact config it was answered under, however many
versions have shipped since. An unknown version on lookup is a rejection (§12), never a
silent fallback to the current version.

**Integrity guards** (`src/lib/fdi/integrity.ts`): `validateVersion()` checks structural
invariants a config + question set must hold (equal item counts per component, bands
starting at 0 and strictly ascending, options in ascending dependency order, no `%` in
the presentation template since the index must never render as a percentage). These
return a list of problems rather than throwing — see `config.test.ts` for how each
registered version is validated. Any change to `config/fdi-1.0.ts` or
`questions/fdi-questions-1.0.ts` should keep this passing.

**Pipeline shape**: `observations.ts` (raw answers → per-component observations) →
`score.ts` (observations → component + composite scores) → `bands.ts` (score → band) →
`rejection.ts` / `qualification.ts` (§12 rejection paths, commercial qualification,
independent of scoring) → `report.ts` / `public-report.ts` (assembled result). Business
qualification (sector, headcount, revenue, age — all optional) is recorded separately
per the spec and never affects the score.

**Testing**: `golden.test.ts` and `phase3-cases.test.ts` check fixed input/output pairs
(`__fixtures__/fdi-1.0-golden.json`) — these encode the spec's worked examples and
should not be adjusted to make a change pass. `purity.test.ts` guards that scoring stays
side-effect-free.

Server-side session storage lives behind `src/app/api/fdi/` (`sessions/`, `submit/`) and
`supabase/migrations/20260814000001_fdi_sessions.sql` +
`20260815000003_fdi_phase3_sessions.sql`. The consultant-facing workspace is
`/admin/fdi`; test records there are created only via an authenticated admin's explicit
Test Mode link, not by the public flow.
