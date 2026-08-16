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
**Flat, compact, GitHub-inspired business interface** — Brand Violet is dominant and Teal is supporting, per the attached `/frontend-design` specification.

```css
/* Brand tokens — defined in src/app/globals.css @theme block */
--color-violet:       #5B21B6      /* primary actions and selected emphasis */
--color-violet-deep:  #3B167A      /* hover / pressed state */
--color-ink:          #111827      /* primary text */
--color-canvas:       #F8FAFC      /* page background */
--color-surface:      #F1F5F9      /* secondary light surface */
--color-border:       #D0D7DE      /* structural borders */
--color-slate:        #475569      /* secondary text */
--color-teal:         #0F766E      /* supporting action and data highlight */
--color-teal-bright:  #0D9488      /* supporting emphasis */
--color-navy:         #0D1117      /* dark surface */
--color-dark-raised:  #161B22      /* dark raised surface */
--color-dark-border:  #30363D      /* dark boundary */
```

**Fonts**: system Segoe UI stack everywhere. Do not load Google Fonts or bundle proprietary font files.

**Surfaces**: use white, canvas, surface, dark surface, and dark raised backgrounds. Do not use gradients, graph-paper overlays, grain, glow effects, or glassmorphism as default treatments.

**Geometry**: 6px radius for controls and 8px radius for cards. Use 1px borders as a primary structural tool.

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
