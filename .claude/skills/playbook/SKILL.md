---
name: playbook
description: Decision framework for routing feature work, build sequence, security review triggers, and PR contracts. Activate when planning new features, reviewing PRs, or assessing security.
---

# Playbook — Project-Relevant Extract

## Decision Tree (stop at the first match)

- 1 file, 1-2 steps? → Chat / single prompt
- Needs live/external data? → Add MCP, then build
- Will you repeat this exact work? → Write a skill FIRST, then build
- 3+ stages with real deps? → Tasks or multi-phase plan
- Fully testable & well-scoped? → `/goal` with a cap
- One huge mechanical change across many files? → `/batch`
- Touches auth/payments/secrets? → Human-in-the-loop + security review

If you can't say what "done" looks like in one sentence, go back to the spec.

## Build Sequence

1. **Foundation** — repo exists, CLAUDE.md written, tests in place
2. **Spec** — run intake → spec.md; read it; catch wrong assumptions here
3. **Route** — pick a pattern from the decision tree above
4. **Build** — execute the pattern; use Context7 for Next.js 16 APIs (newer than training data)
5. **Verify** — tests pass + zero lint + dependencies actually resolve (guard against hallucinated packages)
6. **Review** — AI review first (mechanical), human review second (architecture, business logic)
7. **Harvest** — 30 seconds: what worked, what to save as a skill or template

## Security Gates

Anything touching auth, payments, secrets, or untrusted input gets human review before merge.

### Vulnerability vectors LLMs commonly write:
1. **SQL injection** — AI defaults to unparameterized queries. Use parameterized queries or Supabase client methods.
2. **Missing auth middleware** — AI forgets auth checks on nested routes. Verify every protected route calls `requireAdminAuth()`.
3. **Error disclosure** — Stack traces in API responses. Use the generic error shape, never expose internals.
4. **Hallucinated packages** — ~20% of AI code references packages that don't exist. Verify every `import` resolves.

### This project's specific risks:
- Admin auth is a single env-var password with no rate limiting — flag any changes to auth flow
- All API routes use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS) — input validation is the only guard
- No CSRF protection on form POST routes

## PR Contract

```
What/Why: [intent in 1-2 sentences]
Proof it works: [tests passed / screenshots / logs]
Risk + AI role: [tier; which parts AI-generated]
Review focus: [1-2 areas needing human eyes]
```

## Review Discipline

- Use a different model than the author (e.g., Opus to review Sonnet's code)
- Break agent output into digestible commits; never auto-merge
- Acceptance criteria must be machine-checkable ("npm test passes", not "works correctly")
