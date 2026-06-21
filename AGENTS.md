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
    supabase/       # client.ts (browser) + server.ts (RSC/Route Handler)
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
- **Supabase client**: use `src/lib/supabase/client.ts` in Client Components, `server.ts` in Server Components and Route Handlers
- **Forms**: always `react-hook-form` + `zod` schema — no uncontrolled inputs
- **Classes**: `cn()` helper (clsx + tailwind-merge) for conditional Tailwind classes
- **No raw hex in JSX**: all colors via CSS custom properties defined in `globals.css`

## Design System
**White base with graph-paper grid** — not the dark aurora from the skill template. This project has its own established aesthetic.

```css
/* Brand tokens — defined in src/app/globals.css @theme block */
--color-gold / --color-orange: #FF6535      /* brand orange — CTAs, accents */
--color-gold-bright:           #FF8159      /* lighter orange — gradients, hover */
--color-navy / --color-ink:    #1A1A2E      /* dark text, dark sections */
--color-ivory:                 #FFFFFF      /* white base */
--color-slate:                 #6B6B6B      /* secondary text */
--color-line:                  #E5E5E5      /* borders */
--color-crimson:               #E11D48      /* error / emphasis */
--color-emerald:               #10B981      /* success */
```

**Fonts**: Plus Jakarta Sans (headings via `--font-heading`) · Inter (body via `--font-body`)

**Background**: White `#FFFFFF` with a 40×40px graph-paper grid overlay using navy at 4.5% opacity.

**Utility classes** (already in globals.css):
- `.orange-gradient-text` — gradient text `#FF6535 → #FF8159`
- `.graph-overlay` — light grid on white sections
- `.graph-overlay-dark` — orange grid on dark sections

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
- Supabase SSR requires cookie-based client — always use the `server.ts` helper in RSC
- Email templates are React components rendered via `@react-email/render` before sending through Resend
- Admin auth is cookie-based (not Supabase Auth) — see `src/lib/adminAuth.ts`
