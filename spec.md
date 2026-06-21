# Feature Spec — [Feature Name]

> **Usage:** Fill this out before starting a new feature. Hand it to Claude as the opening prompt.
> Delete and recreate per feature — this is a temporary working document, not permanent docs.
> Commit to CLAUDE.md anything that becomes a permanent project rule.

---

## Technology Constraints
- Use existing stack (Next.js App Router, Tailwind v4, Supabase, Framer Motion)
- New components go in `src/components/[domain]/ComponentName.tsx`
- New pages go in `src/app/[route]/page.tsx`
- Forms: react-hook-form + zod (no exceptions)
- Classes: `cn()` from clsx + tailwind-merge
- Colors: only via CSS custom properties from globals.css (no raw hex)
- [Add any additional constraints specific to this feature]

## Visual Requirements
- Match the established aesthetic: white base + 40px graph-paper grid, orange brand (#FF6535)
- Headings: Plus Jakarta Sans via `--font-heading`; body: Inter via `--font-body`
- Use `.orange-gradient-text` for any gradient text
- Use `.graph-overlay` or `.graph-overlay-dark` for section backgrounds
- [Describe what the feature looks like — be specific enough to guide, open enough for AI creativity]

## Performance Targets
- No new heavy dependencies without justification
- Images: `next/image` with explicit width/height
- Animations: Framer Motion, animate `opacity`/`transform` only
- [Add page-specific targets if needed, e.g. LCP < 2.5s]

## Interaction Model
- [Describe what the user does and what the UI responds with]
- [e.g. "User fills form → optimistic UI update → Supabase insert → success toast"]

## Data / API
- [Supabase tables involved and their shape]
- [API routes needed, if any]
- [AI calls via src/lib/ai.ts, if any]

## Acceptance Criteria
- [ ] [What "done" looks like — be specific and testable]
- [ ] Mobile responsive (test at 375px)
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] No ESLint errors (`npm run lint`)
