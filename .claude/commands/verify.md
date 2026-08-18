---
name: verify
description: Run the full quality gate — tests, coverage, build, lint — and summarise failures
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

## Output format

```
✅ Tests: 298 passed (22 suites), 58.17% statement coverage
✅ Lint: 0 errors, 0 warnings
✅ Build: compiled successfully

Ready to commit.
```

Or on failure:
```
❌ Tests: 2 failed
  - src/lib/fdi/score.test.ts: "rejects an out-of-range answer" — expected X, got Y

Suggested fix: ...
```

## Do not mark verify as complete until all 3 gates pass.
