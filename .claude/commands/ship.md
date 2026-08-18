# /ship

## Rules
- Run every step in order.
- If a step fails and the fix is obvious from the error (missing import,
  type error, unused variable, lint warning) — fix it and re-run that
  step. Do not ask. Only fix what the error explicitly says to fix.
- If a step fails and fixing it requires any assumption or user decision —
  stop. Report exactly what failed and exactly what the user must do.
  Do not proceed.
- When all steps pass — update files, commit, push. No confirmation needed.

## Steps

### 1. Lint
Run: npm run lint
On failure:
- Run npx eslint --fix on the affected files then re-run npm run lint.
- If errors remain after auto-fix: stop. List every error with file
  path, line number, and error message. Wait for user.

### 2. Test coverage
Run: npm run test:coverage

Capture the exact test count and exact statement coverage % from the output.
`jest.config.ts` fails the run itself if `src/lib/fdi/score.ts`, `bands.ts`, or
`rounding.ts` drop below 100% coverage — there is no other enforced global floor.

On failure:
- If the failure is a broken import, missing mock, or type mismatch
  the error explicitly describes: fix it and re-run.
- If fixing requires understanding business logic or behaviour: stop.
  Report which test failed, the exact error, what the user must decide.

### 3. Build
Run: npm run build
On failure:
- If it is a TypeScript type error, missing import, or lint issue the
  error explicitly describes: fix it and re-run.
- If it requires any assumption about intent or architecture: stop.
  Report the exact error. Wait for user.

### 4–5. Update project docs (conditional)
In THIS repo:
- `README.md` has a "Project stats" table (Tests / DB tables / Migrations / Routes).
  Update only the Tests row with the count/coverage from step 2. Touch nothing else.
- `CLAUDE.md` is a single `@AGENTS.md` include plus its own Commands/FDI sections —
  it has no test-count bullet to update; leave it as `unchanged` unless the shipped
  work changed a command or the FDI architecture itself.

There is no `spec.md` in this repo — do not create one.

Architecture facts (stack, routes, tokens) live in `AGENTS.md`. If the shipped
work changed those, flag it in the report for the user to approve — do not
edit `AGENTS.md` unprompted.

### 7. Commit
First verify identity — `git config user.email` MUST be ajmalconsults@gmail.com.
If it is not, stop and report; never commit under a different identity.

Run: git add -A
Run: git commit -m "chore: ship — [count] tests, [coverage]% — [YYYY-MM-DD]"
Use actual values. Use today's date. When no runner exists, that reads
`0 tests, n/a coverage`.

Add a short body describing what actually shipped, then the trailer
`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

### 8. Push
Run: git push https://github.com/a-muhammed-ajmal/consulting main
User Email ID: ajmalconsults@gmail.com
On any other failure: stop. Report the exact error and what the
user must do to resolve it.

## Report
Output only this at the end:

  Lint:       PASS / FAIL
  Tests:      [count] passing, [coverage]% — PASS / FAIL / SKIPPED (no runner)
  Build:      PASS / FAIL
  CLAUDE.md:  updated / unchanged
  README.md:  updated / unchanged
  Commit:     [hash] [message]
  Push:       SUCCESS / FAILED

  USER ACTION REQUIRED:
  If nothing: None.

  If there are Supabase migration to run, list them like this:

  1. Go to Supabase Dashboard → SQL Editor
     Run this SQL:

     ```sql
     ALTER TABLE diagnostic_leads ADD COLUMN follow_up_at TIMESTAMPTZ DEFAULT NULL;
     ```
SQL block must be copy-pasteable exactly as shown.
Never summarise or describe the SQL — always output the full statement.
