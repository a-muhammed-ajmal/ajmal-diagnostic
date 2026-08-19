<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

@.claude/skills/frontend-design/SKILL.md

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
**"Signal"** — electric blue on a white canvas, with warm amber as the single supporting accent. Figtree throughout, at a deliberately compact type scale. Flat, well-lit surfaces: hairline borders and light shadows, no dark slabs, no paper texture, no grid overlay. This superseded the "Cyanotype Blueprint" ink/brass/vellum identity (which itself superseded a soft-white/orange-Inter one) — do not revert to either.

```css
/* Brand tokens — defined in src/app/globals.css @theme block */
--color-brand:       #2563EB   /* Electric Blue — CTAs, fills, focus (4.5:1 on white) */
--color-brand-hover: #1D4ED8   /* CTA hover */
--color-brand-ink:   #1E40AF   /* blue TEXT on white (8.6:1) */
--color-brand-tint:  #F5F8FF   /* pale wash — alternating section band */
--color-brand-soft:  #DBE7FE   /* icon tiles, chips */
--color-accent:      #F59E0B   /* Amber — FILL ONLY, never text (2.1:1) */
--color-accent-ink:  #B45309   /* amber text on white (5.0:1) */
--color-canvas:      #FFFFFF   /* page background */
--color-ink:         #16181D   /* headings and body text */
--color-muted:       #5B6273   /* secondary text (6.2:1) */
--color-line:        #E4E9F2   /* borders */
--color-success / --color-warning / --color-danger  /* status, each with a -soft tint */
```

**Fonts**: Figtree only (`--font-heading` / `--font-body` / `--font-mono` all resolve to it), loaded via `next/font/google` in `layout.tsx`. `font-mono` no longer changes family — it now means tabular figures. No second typeface.

**Type scale**: body is capped at **12px** by brand direction, so `--step--1` and `--step-0` are both `0.75rem` and there is no caption tier below body. Heading floors are the mobile caps — h1 24px (`--step-5`), h2 21px (`--step-4`) — growing to 40px / 32px on desktop. See the accessibility note in `/frontend-design`.

**Background**: flat `#FFFFFF`. Section rhythm comes from alternating white and `--color-brand-tint` bands separated by `border-y border-line`. There is no grid overlay, no grain, and no aurora — all three were deleted.

**Utility classes** (already in globals.css):
- `.brand-gradient-text` — gradient text `#1E40AF → #3B82F6`, display sizes only (≥24px bold)
- `.eyebrow` — 12px 800-weight uppercase section label; sets no colour
- `.card-interactive` — hover lift 2px + `--shadow-2` + brand border
- `.stage-rail` / `.stage-item` / `.stage-marker` / `.stage-card` — the commercial-ladder composition
- `.reveal` / `.stage-reveal` / `.heading-reveal` — entrance and scroll-driven reveals

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
