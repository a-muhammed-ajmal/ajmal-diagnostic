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
   Success: all tests pass AND `src/lib/fdi/score.ts`, `bands.ts`, and `rounding.ts` stay at
   100% statements/branches/functions/lines — this is enforced by `coverageThreshold` in
   `jest.config.ts` and Jest itself fails the run if any of the three drop below it. There is
   no other enforced global coverage floor; a drop elsewhere is worth flagging but is not a
   hard failure.
   If one of the three pinned files drops below 100%, identify the uncovered branch/line and
   suggest which case to add.

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
   Success: exits 0, no TypeScript errors.

## Output format

```
✅ Tests: [count] passed, fdi/score.ts, bands.ts, rounding.ts at 100%
✅ Lint: 0 errors, 0 warnings
✅ Build: compiled successfully ([N] routes)

Ready to commit.
```

Or on failure:
```
❌ Tests: 2 failed
  - lib/ai/__tests__/execute-tool.test.ts: "get_analytics returns monthly summary" — expected X, got Y
  
Suggested fix: ...
```

## Do not mark verify as complete until all 3 gates pass.
