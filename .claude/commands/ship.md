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
This project has no test runner yet — deliberately deferred, not an oversight.
First check whether a `test:coverage` script exists in package.json.

- If it does NOT exist: skip this step. Record `0 tests, n/a coverage`.
  Do NOT scaffold a test harness as part of a ship — standing up Jest/Vitest
  is its own piece of work and needs the user's say-so.
- If it DOES exist: run `npm run test:coverage` and capture the exact test
  count and exact coverage % from the output.

On failure (only applies when the script exists):
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

### 4–6. Update project docs (conditional)
These steps were written for a different repo layout. In THIS repo:
- `spec.md` is a per-feature working template (no Current State Snapshot table)
- `CLAUDE.md` is a single `@AGENTS.md` include (no Testing Standard bullet)
- `README.md` is create-next-app boilerplate (no Project Stats table)

For each of the three files, look for the named structure:
- If the structure EXISTS: update only the named rows/bullet with the values
  from step 2. Touch nothing else.
- If it DOES NOT exist: leave the file untouched and report `unchanged`.
  Do NOT invent the table or add stats sections — creating new doc structure
  is a content change and needs the user's approval first.

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
  spec.md:    updated / unchanged
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
     ALTER TABLE habits ADD COLUMN reminder_time TIME DEFAULT NULL;
     ```
SQL block must be copy-pasteable exactly as shown.
Never summarise or describe the SQL — always output the full statement.
