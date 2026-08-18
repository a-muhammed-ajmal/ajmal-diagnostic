---
name: review
description: Security, performance, type-safety and project-convention review of the current git diff
---

# /review — Code Review

Review `git diff HEAD` (or staged changes) across these dimensions. Output a structured findings table.

## Dimensions

### 1. Security

- Is `createAdminClient()` (service-role key, bypasses RLS) called anywhere outside Route Handlers / Server Components?
- Are `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `ANTHROPIC_API_KEY`, or `ADMIN_PASSWORD` referenced in a Client Component?
- Is admin auth going through `src/lib/adminAuth.ts` rather than being reimplemented or bypassed?
- Is user input at an API route boundary (`src/app/api/**`) validated with a `zod` schema?
- Is `src/lib/rateLimit.ts` applied to endpoints that accept public input (contact, newsletter, diagnostic submit)?
- Any `any` type used as an escape hatch that could mask unvalidated input?

### 2. TypeScript correctness

- Any `any` types introduced without justification?
- Are shared types from `src/types/index.ts` (or the relevant `src/lib/fdi/types.ts` for FDI code) used instead of ad hoc duplicates?
- All new functions fully typed (no implicit `any` params)?

### 3. Performance

- N+1 queries (sequential Supabase calls inside loops)?
- Missing `useCallback` on functions used in `useEffect` deps arrays?
- Large synchronous imports that should be dynamic?

### 4. Project conventions

- No raw hex colors in JSX — Tailwind token classes only (`text-navy`, `bg-gold`, etc.), per the `frontend-design` skill.
- Headings use Fraunces (`font-heading`), body uses IBM Plex Sans (`font-body`) — no Inter/Arial/system-ui as a primary face.
- Components: PascalCase filenames, named exports (no default exports for components).
- API routes: `route.ts` with named exports (`GET`, `POST`, etc.).
- Conditional classes go through `cn()` (clsx + tailwind-merge), not manual string concatenation.
- Forms use `react-hook-form` + `zod` — no uncontrolled inputs.
- Correct Supabase client for context: `createAdminClient()` server-side only, `createBrowserClient()` client-side only.

### 5. Test coverage

- If the diff touches `src/lib/fdi/score.ts`, `bands.ts`, or `rounding.ts`: coverage on that file must stay at 100% (statements/branches/functions/lines) — this is enforced in `jest.config.ts` and a drop is a hard failure.
- For other new `src/lib/**` code: is there reasonable test coverage for the new logic? There is no enforced global percentage — flag an obvious gap (untested branch, unhandled error path), don't invent a numeric target.

## Output format

| # | Severity | Dimension | Finding | File:Line | Fix |
|---|----------|-----------|---------|-----------|-----|
| 1 | 🔴 High | Security | Service-role client called from a Client Component | foo.tsx:12 | Move the query into a Route Handler |
| 2 | 🟡 Medium | Performance | N+1 query inside a lead-list loop | admin/leads/page.tsx:88 | Batch the query outside the loop |
| 3 | 🟢 Low | Convention | Raw hex `#132A4A` in JSX instead of `text-navy` | Hero.tsx:41 | Use the Tailwind token class |

Severity scale:
- 🔴 **High** — must fix before merge (security, data loss, broken RLS, FDI coverage regression)
- 🟡 **Medium** — should fix (performance, correctness, meaningful coverage gaps)
- 🟢 **Low** — nice to have (convention, style)

End with: **Overall: PASS** (no 🔴 findings) or **FAIL** (has 🔴 findings — do not merge).
