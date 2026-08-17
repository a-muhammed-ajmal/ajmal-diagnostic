<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

@.claude/skills/frontend-design.md

---

# Project Constitution

## Project
A B2B consulting website and business diagnostic tool for Ajmal's consulting practice. It generates leads via an interactive quiz, captures emails, and manages prospects through an admin dashboard.

## Tech Stack
| Layer | Library / Version |
|---|---|
| Framework | Next.js **16.2.7** — App Router, React 19 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS **v4** (`@import "tailwindcss"` — no `tailwind.config.js`) |
| Database / Auth | Supabase (`@supabase/supabase-js`, `@supabase/ssr`) |
| AI | Anthropic SDK `@anthropic-ai/sdk` |
| Email | Resend + `@react-email/components` |
| Forms | `react-hook-form` + `zod` |
| Animations | Native CSS only — `animation-timeline` scroll-driven effects in `globals.css`. No animation library. |
| Icons | `lucide-react` |
| Class merging | `clsx` + `tailwind-merge` |

## Architecture
```
src/
  app/              # Next.js App Router — one folder per route
    api/            # Route handlers (route.ts convention)
    admin/          # Protected admin dashboard
    insights/       # Blog/article pages
    diagnostic/     # Quiz flow
    page.tsx        # Home
  components/
    layout/         # Navigation, Footer
    quiz/           # QuestionCard, OptionButton, ProgressBar
    contact/        # ContactForm, CalendlyWidget
    lead/           # LeadCaptureForm
    newsletter/     # NewsletterForm
    insights/       # ArticleToc
  lib/
    supabase/       # server.ts (createAdminClient) + client.ts (createBrowserClient)
    ai.ts           # Anthropic client
    email/templates/# React Email templates (DiagnosticReport, ContactNotification)
    scoring.ts      # Quiz scoring logic
    questions.ts    # Quiz question data
    articles.ts     # Insights content registry (source of truth for articles)
    metadata.ts     # Per-page metadata helper
    jsonLd.ts       # Structured-data builders
    rateLimit.ts    # IP + email rate limiting
    readingTime.ts  # Read-time from word count
    env.ts          # Build-time-validated public env (Calendly, site URL)
    adminAuth.ts    # Admin session helpers
  types/
    index.ts        # Shared TypeScript types
```

## Coding Standards
- **Components**: PascalCase filenames, named exports, no default exports for components
- **API routes**: `route.ts` with named exports (`GET`, `POST`, etc.)
- **Supabase client**: use `createAdminClient()` from `src/lib/supabase/server.ts` in Route Handlers and Server Components; `createBrowserClient()` from `client.ts` for Client Components
- **Forms**: always `react-hook-form` + `zod` schema — no uncontrolled inputs
- **Classes**: `cn()` helper (clsx + tailwind-merge) for conditional Tailwind classes
- **No raw hex in JSX**: all colors via CSS custom properties defined in `globals.css`

## Design System
**"Cyanotype Blueprint"** — deep ink-blue + warm brass on vellum paper, with a graph-paper grid that reads as an actual technical blueprint rather than decoration. Bold serif display type against a technical sans/mono body (per `/frontend-design`). This superseded the earlier soft-white/orange-Inter identity — do not revert to it.

```css
/* Brand tokens — defined in src/app/globals.css @theme block */
--color-navy / --color-ink:    #132A4A      /* Blueprint Ink — dark sections, strong text */
--color-gold / --color-orange: #C6752E      /* Brass — CTAs, accents, active states */
--color-gold-bright:           #E0964F      /* brass hover / gradient end */
--color-gold-ink:              #8C4D1F      /* dark brass for text on white (AA contrast) */
--color-charcoal:              #132A4A      /* body text */
--color-ivory:                 #F6F0E2      /* Vellum — primary background */
--color-teal:                  #3E8FB0      /* Blueprint Cyan — growth, digital transformation */
--color-slate:                 #7C7362      /* secondary text */
--color-line:                  #E3DBC7      /* borders */
--color-crimson:               #B33B2C      /* error / emphasis */
--color-emerald:               #5B7A45      /* success */
```

**Fonts**: Fraunces (bold serif, `--font-heading`/`--font-display`) for all headings — distinctive, editorial, high-character. IBM Plex Sans (`--font-body`/`--font-sans`) for body copy. IBM Plex Mono (`--font-mono`) for numbers, labels, and technical/data annotations. No Inter, no Arial, no system-ui as a primary face — those are fallback-only.

**Background**: Vellum `#F6F0E2` with 40×40px blueprint grid overlay using ink-blue at 5% opacity (this grid is now a literal part of the concept, not just texture), subtle ink/cyan/brass aurora radials.

**Utility classes** (already in globals.css):
- `.gold-gradient-text` / `.orange-gradient-text` — gradient text `#C6752E → #E0964F`
- `.graph-overlay` — ink-blue blueprint grid on light sections
- `.graph-overlay-dark` — brass blueprint grid on dark sections

## Pages
| Route | Purpose |
|---|---|
| `/` | Home / hero |
| `/about` | About Ajmal |
| `/services` | Services overview |
| `/diagnostic` | Interactive business quiz |
| `/results` | Diagnostic output — the personalised report shown after the quiz (client-rendered from sessionStorage; not a case-studies page) |
| `/contact` | Contact form + Calendly |
| `/insights` | Articles index |
| `/insights/[slug]` | Individual article |
| `/insights/category/[slug]` | Category-filtered article listing |
| `/privacy` | Privacy policy (PDPL-aligned) |
| `/unsubscribe` | Newsletter unsubscribe confirmation |
| `/admin` | Lead management dashboard (protected) |

## Key Constraints
- Tailwind v4 has **no config file** — custom tokens go in `globals.css` inside `@theme {}`
- Supabase: `createAdminClient()` uses the service-role key (bypasses RLS) — use only in Route Handlers, never client-side
- Email templates are React components rendered via `@react-email/render` before sending through Resend
- Admin auth is cookie-based (not Supabase Auth) — see `src/lib/adminAuth.ts`
