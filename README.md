# Muhammed Ajmal Consulting

A B2B consulting website and business diagnostic tool. It generates leads via an
interactive quiz, emails a personalised (AI-assisted) diagnostic report, and manages
prospects through a protected admin dashboard.

## Stack

- **Next.js 16** (App Router, React 19) · TypeScript (strict)
- **Tailwind CSS v4** — tokens live in `src/app/globals.css` (`@theme`), no `tailwind.config.js`
- **Supabase** (`@supabase/supabase-js`) — Postgres + cookie-based admin auth
- **Anthropic** (`@anthropic-ai/sdk`) — generates the action plan
- **Resend** + `@react-email/components` — transactional email
- **react-hook-form** + **zod** — forms and validation
- **Vercel Analytics** + optional Google Analytics — funnel tracking

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

The build **fails loudly** if `NEXT_PUBLIC_CALENDLY_LINK` is missing or malformed
(see `src/lib/env.ts`) — this is deliberate, it prevents a broken booking link from
shipping. Set that variable both locally and in the Vercel project environment.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Jest test suite |

## Project layout

```
src/
  app/            # Routes (App Router). api/ holds route handlers.
  components/     # Feature components (quiz, contact, lead, newsletter, insights, layout)
  lib/            # scoring, ai, email templates, articles registry, metadata, rate limiting, env
  types/          # Shared TypeScript types
supabase/
  migrations/     # SQL schema + RLS policies
```

## Database

Schema and Row-Level-Security policies live in `supabase/migrations/`. Every table has
RLS enabled with **no permissive policies** — all access flows through server-side route
handlers using the service-role key. The browser can read and write nothing directly.
Apply migrations with the Supabase CLI (`supabase db push`) or by running the SQL in the
Supabase SQL editor in filename order.

## Content

Articles are defined in `src/lib/articles.ts`. Adding an entry there makes it appear in
the insights index, its category page, the sitemap, and its own route automatically.

## Conventions

See `AGENTS.md` for the full project constitution: coding standards, the design system,
and the security constraints around the service-role key, admin auth, and email rendering.
