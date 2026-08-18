---
name: frontend-design
description: Builds and reviews UI for the Muhammed Ajmal Consulting site — Next.js 16 App Router, React 19, Tailwind v4, Supabase. Covers the "Cyanotype Blueprint" identity (blueprint ink, brass, vellum), the Fraunces + IBM Plex type system, the blueprint-grid brand signature, component and form patterns, accessibility rules, and the anti-patterns this codebase rejects. Use when creating or editing any page, component, layout, or style; when writing Tailwind classes or editing globals.css; when asked to make an interface look better, less generic, or more polished; and when reviewing UI for brand, accessibility, or responsive correctness.
metadata:
  version: "4.0.0"
---

# Frontend Design

The design system is already built. Your job is to **use the existing tokens**, not invent new ones. Every color, space, radius, and duration below is defined in [globals.css](../../../src/app/globals.css) inside `@theme {}`.

Read that file when you need a value this page doesn't list.

The identity is **"Cyanotype Blueprint"** — deep ink-blue and warm brass on vellum paper, with a graph-paper grid that reads as an actual technical blueprint rather than decoration. Voice: executive, analytical, practical. This superseded an earlier soft-white / orange / Inter identity; do not revert to it.

---

## Gotchas — read these first

These defy reasonable assumptions and are the mistakes most often made in this repo.

- **`--color-orange` is not orange.** It is a legacy alias kept from the retired identity and now resolves to brass `#C6752E`. `--color-gold`, `--color-orange`, and `--color-primary` are all the same brass. Never reintroduce `#FF6535` or `#FF8159`.
- **Brass text on white fails AA.** Use `--color-gold-ink` (`#8C4D1F`) for brass text; `--color-gold` is for *fills* only. Same pattern for `--color-teal-ink` (`#255A70`), `--color-emerald-ink` (`#3C5330`), `--color-warning-ink` (`#92400E`).
- **The page background is already painted.** `body` carries the aurora radials, the 40×40px blueprint grid, and a 2% grain pseudo-element. Do not re-apply, override, or duplicate them on a section.
- **The utility is `.graph-overlay`**, not `.graph-bg`. Use `.graph-overlay-dark` on ink sections.
- **`.eyebrow` sets shape only, never colour.** It gives weight/size/tracking/uppercase; the colour stays a Tailwind utility so it can vary by section (`text-gold-ink` on light, `text-gold` on ink). Same for `.card-interactive` — it animates lift and shadow, and the hover border colour stays a utility on each card.
- **Tailwind v4 — there is no `tailwind.config.js`.** Custom tokens go in `@theme {}` in globals.css. Adding a config file will silently do nothing.
- **`cn()` lives in [src/lib/utils.ts](../../../src/lib/utils.ts)**, not `lib/cn.ts`.
- **`/results` is the diagnostic report page**, rendered client-side from `sessionStorage` after the quiz. It is not a case-studies or portfolio page.
- **`createAdminClient()` uses the service-role key and bypasses RLS.** Route Handlers and Server Components only — never import it into a Client Component.
- **No animation library.** Motion is native CSS only, including `animation-timeline` scroll-driven effects in globals.css.
- **Fonts load via `next/font/google` in `layout.tsx`.** Never add a `<link>` tag for Fraunces or IBM Plex.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16.2.7 — App Router, React 19 |
| Language | TypeScript 5, strict — `any` is forbidden |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`, no config file) |
| Data / auth | Supabase (`@supabase/supabase-js`, `@supabase/ssr`) |
| Forms | `react-hook-form` + `zod` — no uncontrolled inputs |
| Icons | `lucide-react` only |
| Class merging | `cn()` = `twMerge(clsx(...))` from `src/lib/utils.ts` |
| Motion | Native CSS only — no Framer Motion, no GSAP |

Breakpoints in use: `sm` `md` `lg`. `md` (768px) carries most of the layout shift.

Do not add a dependency without a functional reason. Prefer Server Components; keep `"use client"` boundaries small.

---

## Typography — Fraunces + IBM Plex

Three faces, each with a job. All are loaded once in `layout.tsx` via `next/font/google`.

| Layer | Face | Tokens | Use |
| --- | --- | --- | --- |
| Display / heading | **Fraunces** (`--font-fraunces`) | `--font-heading`, `--font-display` | h1–h6, hero type — bold serif, editorial character |
| Body | **IBM Plex Sans** (`--font-plex-sans`) | `--font-body`, `--font-sans` | Paragraphs, UI text |
| Mono | **IBM Plex Mono** (`--font-plex-mono`) | `--font-mono` | Numbers, stats, labels, technical annotations |

Headings already resolve to Fraunces through a global `h1`–`h6` rule — don't set `font-family` on a heading. Never introduce Inter, Arial, Roboto, or system-ui as a primary face; they exist only in the fallback stacks.

Use the fluid clamp scale rather than raw font sizes. Floors are tuned for 375px, ceilings for 1240px:

| Token | Range | Typical use |
| --- | --- | --- |
| `--step--1` | 13.5 → 15.0px | Captions, metadata |
| `--step-0` | 16.0 → 18.1px | Body |
| `--step-1` | 17 → 24px | Lead paragraph, h4 |
| `--step-2` | 18.5 → 32px | h3 |
| `--step-3` | 20 → 42.7px | h2 |
| `--step-4` | 26 → 44px | Shared section scale / h1 |
| `--step-5` | 32 → 56px | Hero display |

The mobile floors are deliberately compressed so `h1 > h2 > h3` stays in order at 375px — don't "fix" them upward.

`text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs are already global — don't restate them. Headings get extra line-height below 768px, also global. Inputs are pinned to 16px to stop iOS zoom.

One `<h1>` per page. Don't skip heading levels.

---

## Color tokens

Reference by Tailwind class (`bg-gold`, `text-navy`) or CSS var. **Never raw hex in JSX.**

Two exceptions where hex is unavoidable because CSS custom properties aren't available: `icon.tsx` / `apple-icon.tsx` / `opengraph-image.tsx` (rendered through Satori / `ImageResponse`) and the email templates in `src/lib/email/templates/` (rendered outside the app's CSS). Values there must still match the tokens below.

| Token | Hex | Role |
| --- | --- | --- |
| `--color-navy` / `--color-ink` / `--color-charcoal` | `#132A4A` | Blueprint Ink — headings, body text, dark sections |
| `--color-gold` / `--color-orange` / `--color-primary` | `#C6752E` | Brass — primary CTA, accents, active states, focus |
| `--color-gold-bright` | `#E0964F` | Brass hover, gradient end |
| `--color-gold-ink` | `#8C4D1F` | Brass *text* on white (AA) |
| `--color-ivory` / `--color-bg` | `#F6F0E2` | Vellum — page background |
| `--color-surface` | `#FFFFFF` | Cards, inputs, modals |
| `--color-teal` / `--color-info` | `#3E8FB0` | Blueprint Cyan — growth / digital-transformation accent |
| `--color-teal-ink` | `#255A70` | Cyan text on white |
| `--color-slate` / `--color-text-muted` | `#7C7362` | Secondary text |
| `--color-text-subtle` | `#9C9484` | Tertiary text |
| `--color-line` / `--color-border` | `#E3DBC7` | Borders, dividers |
| `--color-footer` | `#0A1F3B` | Footer only — deepened ink |
| `--color-success` / `--color-emerald` | `#5B7A45` | Success (text: `--color-emerald-ink` `#3C5330`) |
| `--color-warning` | `#F59E0B` | Warning (text: `--color-warning-ink` `#92400E`) |
| `--color-danger` / `--color-crimson` | `#B33B2C` | Error, destructive |
| `--color-on-primary` | `#132A4A` | Ink text on a brass fill |
| `--color-focus` | `#C6752E` | Focus rings |

Full neutral ramp: `--color-neutral-50` … `--color-neutral-950`.

**Brass is the only brand accent.** Blueprint Cyan supports; it never competes. Brass means "primary action," not "error." Pair a brass fill with ink text (`--color-on-primary`), per `Button.tsx`. Never communicate state through color alone — pair with an icon, label, weight, or border.

---

## Space, radius, motion

```
--space-1 .25rem  --space-2 .5rem   --space-3 .75rem  --space-4 1rem
--space-5 1.5rem  --space-6 2rem    --space-7 3rem    --space-8 4rem   --space-9 6rem

--radius-1 .375rem   --radius-2 .625rem   --radius-3 1rem   --radius-pill 999px

--dur-1 120ms  --dur-2 220ms  --dur-3 400ms  --dur-4 650ms
--ease-out cubic-bezier(0.16, 1, 0.3, 1)   --ease-in cubic-bezier(0.5, 0, 0.75, 0)
```

Shadows: `--shadow-1` subtle · `--shadow-2` card · `--shadow-3` modal/hero — all ink-tinted (`rgba(19,42,74,…)`).

Animate `transform` and `opacity` only. Never `transition: all` — name the properties. The `prefers-reduced-motion: reduce` guard is already global.

---

## Background & atmosphere

Already painted on `body` in globals.css — do **not** override or duplicate on a section:

- **Aurora** — three radial gradients (ink, cyan, brass), `background-attachment: fixed`
- **Blueprint grid** — 40×40px ink lines at 5% opacity, tightening to 28×28px at ≤640px
- **Grain** — SVG fractal-noise pseudo-element at 2% opacity

---

## Utility classes that exist

Use these instead of rebuilding them:

| Class | Effect |
| --- | --- |
| `.gold-gradient-text` / `.orange-gradient-text` | Gradient text `#C6752E → #E0964F` |
| `.graph-overlay` | Ink blueprint grid on light sections (absolute, 5% opacity) |
| `.graph-overlay-dark` | Brass blueprint grid on ink sections (absolute, 9% opacity) |
| `.reveal` | Staggered entrance, ~80ms apart |
| `.eyebrow` | 12px bold uppercase section label — **shape only, colour is yours** |
| `.tap-target` | `min-height/width: 44px` — every icon-only button |
| `.card-interactive` | Card hover lift + shadow — **border colour is yours** |
| `.stage-rail` / `.stage-item` / `.stage-marker` / `.stage-card` | Process/timeline composition |
| `.article-longform` / `.article-toc` / `.reading-progress` | Insights article chrome |
| `.animate-fade-in` | Opacity entrance |

Both `.graph-overlay` variants are absolutely positioned — the parent needs `position: relative`.

---

## Component patterns

Three shared primitives exist. **Use them instead of re-deriving the recipe inline.**

- **`<Button>`** — [src/components/ui/Button.tsx](../../../src/components/ui/Button.tsx). Variants `primary` (default) · `secondary` · `quiet` · `danger`, plus `fullWidth`. Renders a `next/link` when given `href`, a plain `<a target="_blank" rel="noreferrer">` when also given `external`, and a `<button>` otherwise. Focus ring, disabled state, `font-heading`, and the 44px floor (`min-h-11`) are built in.

  ```tsx
  <Button href="/diagnostic">Start the Check</Button>
  <Button variant="secondary" onClick={reset}>Start over</Button>
  ```

- **`<Surface>`** — [src/components/ui/Surface.tsx](../../../src/components/ui/Surface.tsx). Card/section container; `tone` of `default` (white) · `muted` (vellum) · `dark` (ink), and `interactive` to add `.card-interactive`.
- **`<SectionHeader>`** — same file. Takes `eyebrow` / `title` / `description`, with `align` and `tone`. It already picks `text-gold-ink` on light and `text-gold` on dark, so don't override the eyebrow colour.

Reach for a raw `<button>` or a hand-rolled card only when a variant genuinely doesn't fit — and prefer adding a variant over duplicating the recipe.

**Control heights.** `<Button>` is 44px (`min-h-11`), the accessibility floor, and is right for nav, forms, and in-page actions. Hero CTAs deliberately run larger and are still written inline at `min-h-[52px]` or `min-h-[56px]`; `min-h-[48px]` appears on admin and secondary forms. Those four heights are the whole ladder — reuse one, don't introduce a fifth.

- **Card** — `bg-white rounded-2xl shadow-lg border border-navy/5 p-8`.
- **Input** — `border border-navy/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold bg-white`, with a real `<label>`. Placeholders are not labels.
- **Section label** — `.eyebrow` plus `text-gold-ink` on light / `text-gold` on ink.
- **Focus** — `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px }` is global. Never remove it without an equally visible replacement.

Components: PascalCase filenames, named exports, explicit prop interfaces. API routes: `route.ts` with named `GET`/`POST` exports.

Create a component when the UI actually repeats or owns behaviour — not preemptively. Start concrete; abstract once the similarity is proven.

---

## Content integrity

Never invent testimonials, client names or logos, revenue figures, metrics, certifications, awards, partnerships, case-study results, customer counts, or geographic claims.

When a page needs evidence that hasn't been supplied, write `[TO CONFIRM]`. Do not write a realistic-looking placeholder that could be mistaken for a real business claim.

Positioning is *AI-Powered Business Operating Systems for growing SMEs*; the narrative arc is **CHAOS → CONTROL → SCALE**. Lead with operational problems and measurable outcomes. Avoid "revolutionize," "unlock your potential," "next-generation," "seamless," "supercharge."

---

## Anti-patterns

| Don't | Do |
| --- | --- |
| Soft-white or cool-gray backgrounds | Vellum `#F6F0E2` + the blueprint grid |
| Any font but Fraunces / IBM Plex | `font-heading` / `font-body` / `font-mono` |
| Raw hex in JSX | Token classes (`text-navy`, `bg-gold`) |
| New CSS custom properties for color | Existing tokens |
| `<link>` for Google Fonts | `next/font/google` in `layout.tsx` |
| `transition: all` | Named properties |
| Fixed `px` font sizes | `--step-N` or Tailwind `text-*` |
| Inline `style={{}}` for layout | Tailwind + `cn()` |
| Retired orange `#FF6535` / `#FF8159`, or Inter | Brass `#C6752E` / `#E0964F`, Fraunces + Plex |
| Template literals for class merging | `cn()` |
| Icon button without `.tap-target` | Always `.tap-target` |
| Glassmorphism, mesh gradients, glow orbs, AI sparkles, circuit motifs, fake dashboards, logo clouds | Flat structured surfaces with real content |

---

## Before you finish

- [ ] No raw hex in JSX (outside the two documented exceptions)
- [ ] Brass text uses `--color-gold-ink`, not `--color-gold`
- [ ] One `<h1>`; heading levels not skipped
- [ ] Icon-only buttons have `.tap-target` and an accessible name
- [ ] Keyboard reaches every interactive element; focus ring visible
- [ ] Contrast ≥ 4.5:1 body, ≥ 3:1 large text and UI
- [ ] State is never signalled by color alone
- [ ] No horizontal overflow at 320px; usable at 200% zoom
- [ ] Loading, empty, and error states exist where the data can be absent
- [ ] No invented business evidence; unknowns marked `[TO CONFIRM]`
- [ ] No new dependency without a reason

---

## Deeper references — load only when the trigger applies

| Read | When |
| --- | --- |
| `references/accessibility.md` | Running an accessibility pass, or a review flags a11y |
| `references/aesthetics.md` | Asked to make UI "look better," "less generic," or "more polished" |
| `references/components.md` | Creating a new component file and unsure of the internal structure |
| `references/mobile.md` | The task is specifically mobile layout, touch, or bottom-sheet behaviour |
| `references/performance.md` | Addressing Core Web Vitals, bundle size, or layout shift |

For an exact token declaration, read [globals.css](../../../src/app/globals.css) — it is the only source of truth.
