# Muhammed Ajmal Consulting

A B2B consulting website and business diagnostic tool. It generates leads via an
interactive quiz, emails a personalized (AI-assisted) diagnostic report, and manages
prospects through a protected admin dashboard.

## Stack

- **Next.js 16** (App Router, React 19) · TypeScript (strict)
- **Tailwind CSS v4** — tokens live in `src/app/globals.css` (`@theme`), no `tailwind.config.js`
- **Supabase** (`@supabase/supabase-js`) — Postgres + cookie-based admin auth
- **Anthropic** (`@anthropic-ai/sdk`) — generates the action plan
- **Resend** + `@react-email/components` — transactional email
- **react-hook-form** + **zod** — forms and validation
- **Vercel Analytics** — funnel tracking

## Getting started

```bash
npm install
npm run dev   # http://localhost:3000
```

Copy `.env.example` to `.env.local` and fill in the values (from Supabase, Resend,
Anthropic and your Calendly link):

```bash
cp .env.example .env.local
```

The build **fails loudly** if `NEXT_PUBLIC_CALENDLY_LINK` is missing or malformed. The
check runs in `next.config.ts` before compilation starts, and again in `src/lib/env.ts`
as a second line of defence — this is deliberate, it prevents a broken booking link from
shipping. Set that variable both locally and in the Vercel project environment.

## Founder Dependency Index (hidden rollout)

The Founder Dependency Index is a separate instrument from the live ten-question
diagnostic. Its `/diagnostic/fdi`, `/results/fdi`, and `/api/fdi/*` routes remain hidden
and return 404 until `NEXT_PUBLIC_FDI_ENABLED=true` is set for a build. Keep it `false`
until the Phase 3 migration has been applied and private QA is complete. The consultant
workspace is at `/admin/fdi`; test records are created only by an authenticated admin
using its explicit Test Mode link.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Jest test suite |
| `npm run test:coverage` | Jest with coverage |

## Project stats

| Metric | Value |
|---|---|
| Tests | 224 (Jest) — 61.07% lines overall; `scoring.ts` and `calendly.ts` 100% covered |
| DB tables | 5 (RLS on all) |
| Migrations | 2 (`20260723000001`–`20260723000002`) |
| Routes | App Router (see `AGENTS.md` for the full page list) |

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
