---
name: frontend-design
description: Builds and reviews UI for the Muhammed Ajmal Consulting site — Next.js 16 App Router, React 19, Tailwind v4, Supabase. Covers the "Cyanotype Blueprint" ink/brass/vellum token system, Fraunces + IBM Plex typography, the blueprint-grid brand signature, component and form patterns, accessibility rules, and the anti-patterns this codebase rejects. Use when creating or editing any page, component, layout, or style; when writing Tailwind classes or editing globals.css; when asked to make an interface look better, less generic, or more polished; and when reviewing UI for brand, accessibility, or responsive correctness.
metadata:
  version: "4.0.0"
---

# Frontend Design

The design system is already built. Your job is to **use the existing tokens**, not invent new ones. Every color, space, radius, and duration below is defined in [globals.css](../../../src/app/globals.css) inside `@theme {}`.

Read that file when you need a value this page doesn't list.

---

## Gotchas — read these first

These defy reasonable assumptions and are the mistakes most often made in this repo.

- **`--color-gold` is brass (`#C6752E`), not literal gold, and not the old brand orange.** The identity is "Cyanotype Blueprint" — deep ink-blue + warm brass on vellum paper. It superseded an earlier soft-white/orange-Inter identity; **never revert to `#FF6535` or Inter.** `--color-gold`, `--color-orange`, and `--color-primary` are all the same brass.
- **Brass text on white fails AA.** Use `--color-gold-ink` (`#8C4D1F`) for brass text; `--color-gold` is for *fills* only. Same pattern for `--color-teal-ink`, `--color-emerald-ink`, `--color-warning-ink`.
- **The page background is already painted.** `body` carries the aurora radials, the 40×40px blueprint grid, and a 2% grain pseudo-element. Do not re-apply, override, or duplicate them on a section.
- **The utility is `.graph-overlay`**, not `.graph-bg`. Use `.graph-overlay-dark` on navy sections.
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

Three faces, each with a distinct job. `--font-heading` / `--font-display` resolve to **Fraunces** (bold serif, editorial character — carries the brand's distinctiveness). `--font-body` / `--font-sans` resolve to **IBM Plex Sans**. `--font-mono` resolves to **IBM Plex Mono**, for code, numbers, stats, and technical/data annotations.

Never introduce Inter, Arial, system-ui, or any other face as a primary typeface — they exist only as fallback stacks.

Use the fluid clamp scale rather than raw font sizes:

| Token | Range | Typical use |
| --- | --- | --- |
| `--step--1` | 0.83–0.94rem | Captions, metadata |
| `--step-0` | 1–1.13rem | Body |
| `--step-1` | 1.2–1.5rem | Lead paragraph, h4 |
| `--step-2` | 1.44–2rem | h3 |
| `--step-3` | 1.73–2.67rem | h2 |
| `--step-4` | 2.07–3.55rem | h1, shared section scale |
| `--step-5` | 2.49–4.74rem | Hero display |

`text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs are already global — don't restate them. Inputs are pinned to 16px to stop iOS zoom.

One `<h1>` per page. Don't skip heading levels.

---

## Color tokens

Reference by Tailwind class (`bg-gold`, `text-navy`) or CSS var. **Never raw hex in JSX.**

Two exceptions where hex is unavoidable because CSS custom properties aren't available: `icon.tsx` / `apple-icon.tsx` / `opengraph-image.tsx` (rendered through Satori / `ImageResponse`) and the email templates in `src/lib/email/templates/` (rendered outside the app's CSS). Values there must still match the tokens below.

| Token | Hex | Role |
| --- | --- | --- |
| `--color-navy` / `--color-ink` / `--color-charcoal` | `#132A4A` | Blueprint Ink — headings, body text, dark sections |
| `--color-gold` / `--color-orange` / `--color-primary` | `#C6752E` | Brass — primary CTA, accents, active states, focus |
| `--color-gold-bright` | `#E0964F` | Brass hover / gradient end |
| `--color-gold-ink` | `#8C4D1F` | Brass *text* on white (AA) |
| `--color-ivory` / `--color-bg` | `#F6F0E2` | Vellum — page background |
| `--color-surface` | `#FFFFFF` | Cards, inputs, modals |
| `--color-teal` / `--color-info` | `#3E8FB0` | Blueprint Cyan — growth / digital-transformation accent |
| `--color-teal-ink` | `#255A70` | Teal text on white (5.5:1) |
| `--color-slate` / `--color-text-muted` | `#7C7362` | Secondary text |
| `--color-line` / `--color-border` | `#E3DBC7` | Borders, dividers |
| `--color-footer` | `#0A1F3B` | Footer background only (deepened ink) |
| `--color-success` / `--color-emerald` | `#5B7A45` | Success |
| `--color-emerald-ink` | `#3C5330` | Emerald text on white (5.5:1) |
| `--color-warning` | `#F59E0B` | Warning (text: `--color-warning-ink` `#92400E`) |
| `--color-danger` / `--color-crimson` | `#B33B2C` | Error, destructive |

Full neutral ramp: `--color-neutral-50` … `--color-neutral-950`.

**Brass is the only brand accent.** Teal supports; it never competes. Brass means "primary action," not "error." Never communicate state through color alone — pair with an icon, label, weight, or border.

---

## Space, radius, motion

```
--space-1 .25rem  --space-2 .5rem   --space-3 .75rem  --space-4 1rem
--space-5 1.5rem  --space-6 2rem    --space-7 3rem    --space-8 4rem   --space-9 6rem

--radius-1 .375rem   --radius-2 .625rem   --radius-3 1rem   --radius-pill 999px

--dur-1 120ms  --dur-2 220ms  --dur-3 400ms  --dur-4 650ms
--ease-out cubic-bezier(0.16, 1, 0.3, 1)   --ease-in cubic-bezier(0.5, 0, 0.75, 0)
```

Shadows: `--shadow-1` subtle · `--shadow-2` card · `--shadow-3` modal/hero — all ink-blue-tinted.

Animate `transform` and `opacity` only. Never `transition: all` — name the properties. The `prefers-reduced-motion: reduce` guard is already global.

---

## Utility classes that exist

Use these instead of rebuilding them:

| Class | Effect |
| --- | --- |
| `.gold-gradient-text` / `.orange-gradient-text` | Gradient text `#C6752E → #E0964F` |
| `.graph-overlay` | Ink-blue blueprint grid on light sections (absolute) |
| `.graph-overlay-dark` | Brass blueprint grid on dark sections |
| `.reveal` | Staggered entrance, 80ms apart |
| `.eyebrow` | 11px bold uppercase section label (color set per section — `text-gold-ink` on light, `text-gold` on dark) |
| `.tap-target` | `min-height/width: 44px` — every icon-only button |
| `.card-interactive` | Card hover treatment |
| `.stage-rail` / `.stage-item` / `.stage-marker` / `.stage-card` | Process/timeline composition |
| `.article-longform` / `.article-toc` / `.reading-progress` | Insights article chrome |
| `.animate-fade-in` | Opacity entrance |

---

## Component patterns

Three shared primitives exist. **Use them instead of re-deriving the recipe inline.**

- **`<Button>`** — [src/components/ui/Button.tsx](../../../src/components/ui/Button.tsx). Variants `primary` (default) · `secondary` · `quiet` · `danger`, plus `fullWidth`. Renders a `next/link` when given `href`, a plain `<a target="_blank" rel="noreferrer">` when also given `external`, and a `<button>` otherwise. Focus ring, disabled state, and the 44px floor (`min-h-11`) are built in.

  ```tsx
  <Button href="/diagnostic">Start the Check</Button>
  <Button variant="secondary" onClick={reset}>Start over</Button>
  ```

- **`<Surface>`** — [src/components/ui/Surface.tsx](../../../src/components/ui/Surface.tsx). Card/section container; `tone` of `default` (white) · `muted` (ivory) · `dark` (navy), and `interactive` to add `.card-interactive`.
- **`<SectionHeader>`** — same file. Takes `eyebrow` / `title` / `description`, with `align` and `tone`. It already picks `text-gold-ink` on light and `text-gold` on dark, so don't override the eyebrow colour.

Reach for a raw `<button>` or a hand-rolled card only when a variant genuinely doesn't fit — and prefer adding a variant over duplicating the recipe.

**Control heights.** `<Button>` is 44px (`min-h-11`), the accessibility floor, and is right for nav, forms, and in-page actions. Hero CTAs deliberately run larger and are still written inline at `min-h-[52px]` or `min-h-[56px]`; `min-h-[48px]` appears on admin and secondary forms. Those four heights are the whole ladder — reuse one, don't introduce a fifth.
- **Input** — `border border-navy/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold bg-white`, with a real `<label>`. Placeholders are not labels.
- **Section label** — `text-gold font-heading font-bold tracking-widest text-xs uppercase`.
- **Focus** — `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px }` is global. Never remove it without an equally visible replacement.

Components: PascalCase filenames, named exports, explicit prop interfaces. API routes: `route.ts` with named `GET`/`POST` exports.

Create a component when the UI actually repeats or owns behaviour — not preemptively. Start concrete; abstract once the similarity is proven.

---

## Content integrity

Never invent testimonials, client names or logos, revenue figures, metrics, certifications, awards, partnerships, case-study results, customer counts, or geographic claims.

When a page needs evidence that hasn't been supplied, write `[TO CONFIRM]`. Do not write a realistic-looking placeholder that could be mistaken for a real business claim.

Voice: executive, analytical, practical — bold and distinctive, not generic. Avoid "revolutionize," "unlock your potential," "next-generation," "seamless," "supercharge."

---

## Anti-patterns

| Don't | Do |
| --- | --- |
| Soft-white / cool-gray backgrounds | Vellum base (`#F6F0E2`) + blueprint grid |
| Any font but Fraunces/IBM Plex (Inter, Arial, Roboto, etc.) | `font-heading` (Fraunces) / `font-body` (IBM Plex Sans) |
| Raw hex in JSX | Token classes (`text-navy`, `bg-gold`) |
| New CSS custom properties for color | Existing tokens |
| `<link>` for Google Fonts | `next/font/google` in `layout.tsx` |
| `transition: all` | Named properties |
| Fixed `px` font sizes | `--step-N` or Tailwind `text-*` |
| Inline `style={{}}` for layout | Tailwind + `cn()` |
| Original brand orange `#FF6535` or Inter | Brass `#C6752E` and Fraunces/Plex — the old identity is retired |
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
