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
Capture the exact test count (e.g. "298 passed, 22 suites") and exact statement
coverage % from the output — these go verbatim into the report and into
README.md's Project stats table in step 4-6.

`jest.config.ts` holds `src/lib/fdi/score.ts`, `bands.ts`, and `rounding.ts` to
100% coverage — a gap in one of those three files fails this step. There is no
blanket global threshold; a drop in overall coverage outside those files does
not fail the step, but flag it in the report.

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

### 3b. Rendered type-scale audit
Run: npm run audit:type

Asserts the design system's mobile ceilings against the rendered pages — no h1–h4
above 24px and no `<p>`/`<li>`/`<label>` above 14px below 768px, no overflow at
320px. It builds and starts its own server on PORT (default 3000); make sure nothing
else is bound to it.

On failure:
- The report names the route, element, measured size and text. If the fix is a
  hardcoded size or a wrong `--step-N` for the element's role: fix it and re-run.
- If a heading is only oversized because it is the wrong element for the job (a
  `<p>` acting as a heading, or vice versa), fix the semantics rather than the size.
- If it needs a judgement call about the design intent: stop and report.

The ADVISORY list does not fail the step — `--step-1` is correct for logotypes and
diagram labels. Skipping this step because "only styling changed" is exactly when
it catches things; size inheritance means CSS review cannot substitute for it.

### 4–6. Update project docs (conditional)
This repo has no `spec.md` — skip that file, report `unchanged`. `CLAUDE.md` is
a single `@AGENTS.md` include with no stats of its own — skip it too.

`README.md` DOES have a "Project stats" table (Tests / DB tables / Migrations /
Routes). Update only the `Tests` row with the exact count and coverage % from
step 2 — e.g. `298 passing (22 suites), 58.17% statement coverage`. Touch
nothing else in the table unless the shipped work actually added a migration
or a DB table, in which case update that row too with the real count.

Architecture facts (stack, routes, tokens) live in `AGENTS.md`. If the shipped
work changed those, flag it in the report for the user to approve — do not
edit `AGENTS.md` unprompted.

### 7. Commit
First verify identity — `git config user.email` MUST be ajmalconsults@gmail.com.
If it is not, stop and report; never commit under a different identity.

Run: git add -A
Run: git commit -m "chore: ship — [count] tests, [coverage]% — [YYYY-MM-DD]"
Use the actual test count and coverage % captured in step 2, and today's date.

Add a short body describing what actually shipped, then the trailer
`Co-Authored-By: Claude <noreply@anthropic.com>`.

### 8. Push
Never push directly to `main` — push the current branch:
Run: git push -u origin <current-branch>
If the current branch IS `main`, stop and ask the user how they want to
proceed rather than pushing to it — this repo ships through feature branches
and pull requests, not direct commits to `main`.
On failure: stop. Report the exact error and what the user must do to resolve it.

## Report
Output only this at the end:

  Lint:       PASS / FAIL
  Tests:      [count] passing, [coverage]% — PASS / FAIL
  Build:      PASS / FAIL
  Type scale: [n] routes, ceilings hold — PASS / FAIL
  README.md:  updated / unchanged
  Commit:     [hash] [message]
  Push:       SUCCESS / FAILED

  USER ACTION REQUIRED:
  If nothing: None.

  If there are Supabase migrations to run, list them like this:

  1. Go to Supabase Dashboard → SQL Editor, or run `supabase db push`
     Run this SQL (from supabase/migrations/<new-file>.sql):

     ```sql
     -- full contents of the new migration file
     ```
SQL block must be copy-pasteable exactly as shown.
Never summarise or describe the SQL — always output the full statement.
