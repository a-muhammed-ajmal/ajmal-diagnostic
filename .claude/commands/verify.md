---
name: verify
description: Run the full quality gate — tests, coverage, build, lint, rendered type-scale audit — and summarise failures
---

# /verify — Quality Gate

Run these steps in order. Stop and report on the first failure.

## Steps

1. **Tests + coverage**
   ```bash
   npm run test:coverage
   ```
   Success: all tests pass. `jest.config.ts` holds `src/lib/fdi/score.ts`, `bands.ts`, and
   `rounding.ts` to 100% statements/branches/functions/lines — a gap in any of those three
   files fails the run. There is no blanket global coverage threshold; overall project
   coverage is tracked informationally (see the `README.md` "Project stats" table) and
   should not regress, but a drop outside the three pinned files does not fail this step
   on its own — flag it in the report instead.
   If coverage on a pinned file is below 100%, identify the uncovered branch and suggest
   which case to add.

2. **Lint**
   ```bash
   npm run lint
   ```
   Success: 0 errors, 0 warnings.
   If warnings exist, fix them (remove unused imports, add `// eslint-disable-next-line` only for intentional single-dep useEffect hooks).

3. **Build**
   ```bash
   npm run build
   ```
   Success: exits 0, no TypeScript errors. Note `next.config.ts` also aborts the build if
   `NEXT_PUBLIC_CALENDLY_LINK` is missing or malformed — that failure means the env var
   needs setting, not a code fix.

4. **Rendered type-scale audit**
   ```bash
   npm run audit:type
   ```
   Drives a real browser over all 14 routes at 375 / 320 / 1920px and asserts the
   design system's mobile ceilings: no h1–h4 above 24px, no `<p>`/`<li>`/`<label>`
   above 14px below 768px, no horizontal overflow at 320px. It builds and starts its
   own server, so run it last.

   This is the one rule that cannot be checked by reading code — sizes are inherited,
   so a violation only appears once rendered. A failure almost always means a
   hardcoded `px` size, or an element given the wrong `--step-N` for its role.

   The ADVISORY list (non-prose text above 14px — logotypes, diagram labels) does not
   fail the run; `--step-1` is the correct step for those. Scan it, don't action it.

   Needs Chrome or Edge on the machine (`CHROME_PATH` overrides discovery). It uses
   `playwright-core`, which drives an installed browser rather than downloading one.

## Output format

```
✅ Tests: 300 passed (22 suites), 58.23% statement coverage
✅ Lint: 0 errors, 0 warnings
✅ Build: compiled successfully
✅ Type scale: 14 routes, ceilings hold at 375/320px

Ready to commit.
```

Or on failure:
```
❌ Tests: 2 failed
  - src/lib/fdi/score.test.ts: "rejects an out-of-range answer" — expected X, got Y

Suggested fix: ...
```

## Do not mark verify as complete until all 4 gates pass.
