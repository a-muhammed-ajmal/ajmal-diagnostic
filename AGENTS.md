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
| Animations | `framer-motion` |
| Charts | `recharts` |
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
    quiz/           # QuizContainer, QuestionCard, OptionButton, ProgressBar
    results/        # ResultsDashboard, DimensionBar, CTASection, ConstraintHighlight
    contact/        # ContactForm, CalendlyWidget
    lead/           # LeadCaptureForm
    newsletter/     # NewsletterForm
    ui/             # Primitive components (Button, etc.)
  lib/
    supabase/       # server.ts (createAdminClient) + client.ts (createBrowserClient)
    ai.ts           # Anthropic client
    email/          # React Email templates
    scoring.ts      # Quiz scoring logic
    questions.ts    # Quiz question data
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
**Soft white base with architectural graph-paper grid** — orange-accented executive aesthetic (per `/frontend-design`).

```css
/* Brand tokens — defined in src/app/globals.css @theme block */
--color-navy / --color-ink:    #1A1A2E      /* Charcoal-Navy — dark sections, strong text */
--color-gold / --color-orange: #FF6535      /* Brand Orange — CTAs, accents, active states */
--color-gold-bright:           #FF8159      /* brand orange hover / gradient end */
--color-gold-ink:              #D6450F      /* dark orange for text on white (AA contrast) */
--color-charcoal:              #1A1A2E      /* body text */
--color-ivory:                 #F9FAFB      /* Soft White — primary background */
--color-teal:                  #0D9488      /* AI Teal — growth, digital transformation */
--color-slate:                 #6B7280      /* secondary text */
--color-line:                  #E5E7EB      /* borders */
--color-crimson:               #E11D48      /* error / emphasis */
--color-emerald:               #10B981      /* success */
```

**Fonts**: Inter only, everywhere — headings (`--font-heading`) and body (`--font-body`) both resolve to Inter. No Plus Jakarta Sans, no serif.

**Background**: Soft White `#F9FAFB` with 40×40px graph-paper grid overlay using charcoal-navy at 3.5% opacity, subtle navy/teal/orange aurora radials.

**Utility classes** (already in globals.css):
- `.gold-gradient-text` / `.orange-gradient-text` — gradient text `#FF6535 → #FF8159`
- `.graph-overlay` — charcoal-navy grid on light sections
- `.graph-overlay-dark` — brand orange grid on dark sections

## Pages
| Route | Purpose |
|---|---|
| `/` | Home / hero |
| `/about` | About Ajmal |
| `/services` | Services overview |
| `/results` | Case studies / results |
| `/diagnostic` | Interactive business quiz |
| `/contact` | Contact form + Calendly |
| `/insights` | Articles index |
| `/insights/[slug]` | Individual article |
| `/admin` | Lead management dashboard (protected) |

## Key Constraints
- Tailwind v4 has **no config file** — custom tokens go in `globals.css` inside `@theme {}`
- Supabase: `createAdminClient()` uses the service-role key (bypasses RLS) — use only in Route Handlers, never client-side
- Email templates are React components rendered via `@react-email/render` before sending through Resend
- Admin auth is cookie-based (not Supabase Auth) — see `src/lib/adminAuth.ts`
