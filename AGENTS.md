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
| Design audit | `playwright-core` (dev only) — drives an installed Chrome for `npm run audit:type` |

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
    ui/             # Section, PageHero, Button, Surface + SectionHeader
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
**"Electric Blue & Amber"** — vibrant electric blue as the primary brand colour, warm amber as the secondary accent, grounded on slate neutrals. **Roboto Slab** headings over **Figtree** body, on a responsive type scale with hard mobile ceilings. This superseded "Signal" (`#2563EB` + Lexend, 12px flat body), which superseded the "Cyanotype Blueprint" ink/brass/vellum identity, which superseded a soft-white/orange-Inter one — do not revert to any of them.

```css
/* Brand tokens — defined in src/app/globals.css @theme block */
--color-brand:        #0052FF   /* Electric Blue — CTAs, fills, focus (5.8:1 on white) */
--color-brand-hover:  #0039CC   /* CTA hover (8.6:1) */
--color-brand-ink:    #0037A5   /* blue TEXT on white (10.1:1) */
--color-brand-tint:   #E6F0FF   /* light accent wash — alternating section band */
--color-brand-soft:   #DBEAFE   /* icon tiles, chips */
--color-accent:       #FFBF00   /* Amber — FILL ONLY, never text on light (1.65:1) */
--color-accent-hover: #D49E00   /* amber fill hover */
--color-accent-ink:   #B45309   /* amber text on light (5.0:1) */
--color-canvas:       #FFFFFF   /* page background */
--color-canvas-dark:  #0F172A   /* Slate 900 — the surface amber is allowed to sit on */
--color-canvas-light: #F8FAFC   /* Slate 50 — neutral band */
--color-ink:          #0F172A   /* headings and body text (17.9:1) */
--color-muted:        #475569   /* secondary text (7.6:1) */
--color-muted-invert: #CBD5E1   /* secondary text ON a canvas-dark band (12:1) */
--color-line:         #E2E8F0   /* borders (Slate 200) */
--color-success / --color-warning / --color-danger  /* status, each with a -soft tint */
```

The numbered palette (`electric-50…900`, `amber-50…700`, `canvas-dark/light/border`) is declared alongside these aliases, so `bg-electric-100` and `text-amber-700` are real utilities. Components should reach for the semantic alias first.

**Fonts**: two faces, loaded via `next/font/google` in `layout.tsx`. **Roboto Slab** for headings (`--font-heading` / `--font-display`); **Figtree** for body and UI text (`--font-body` / `--font-sans`), including button and control labels. `--font-mono` resolves to Figtree and means tabular figures — there is no third face.

The ceilings below are enforced by `npm run audit:type`, which measures the rendered
pages in a real browser rather than trusting the CSS — font sizes are inherited, so this
is the one design rule that code review cannot verify. It runs in CI and in `/ship`.

**Type scale**: **responsive, with strict mobile ceilings.** Below 768px, no heading (h1–h4) may exceed **24px** and no body copy may exceed **14px**; micro-copy and labels sit at 12px. At 768px and above the scale opens up — body 16px, h2 32px, h1 48px. Both tiers are declared once on `:root` in `globals.css`, so every `text-[length:var(--step-N)]` call site inherits them. `text-xs` is bound to `--step--1`, the micro-copy tier. `input`/`select`/`textarea` stay pinned at 16px at every width to stop iOS Safari zooming on focus.

**Background**: flat `#FFFFFF`. Section rhythm comes from alternating white, `--color-canvas-light`, and `--color-brand-tint` bands separated by `border-y border-line`, plus optional `.orb` ambient radials in a positioned, overflow-hidden section.

**Layout primitives**: `<Section>` (band tone/width/orbs) and `<PageHero>` (asymmetric page opener) in `src/components/ui/`. Every page section is a `<Section>`; every page opener is a `<PageHero>`. Neither offers a centred-hero variant — asymmetry is the house layout. `<Button>` gains an `accent` variant (amber fill, dark text) and `<Surface>` a `glass` tone.

**Utility classes** (already in globals.css):
- `.glass-panel` — glassmorphism: translucent white, backdrop blur, hairline border
- `.orb` + `.orb-electric` / `.orb-amber` — ambient blurred background radials
- `.hover-lift` — 2px lift + electric glow, 200ms
- `.brand-gradient-text` — gradient text `#0037A5 → #0052FF`; both ends clear 4.5:1
- `.eyebrow` — 800-weight uppercase section label at the micro-copy step; sets no colour
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
