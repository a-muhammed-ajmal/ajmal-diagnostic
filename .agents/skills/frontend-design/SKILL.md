---
name: frontend-design
description: Builds and reviews UI for the Muhammed Ajmal Consulting site — Next.js 16 App Router, React 19, Tailwind v4, Supabase. Covers the orange/charcoal-navy token system, Inter-only typography, the graph-paper brand signature, component and form patterns, accessibility rules, and the anti-patterns this codebase rejects. Use when creating or editing any page, component, layout, or style; when writing Tailwind classes or editing globals.css; when asked to make an interface look better, less generic, or more polished; and when reviewing UI for brand, accessibility, or responsive correctness.
metadata:
  version: "3.0.0"
---

# Frontend Design

The design system is already built. Your job is to **use the existing tokens**, not invent new ones. Every color, space, radius, and duration below is defined in [globals.css](../../../src/app/globals.css) inside `@theme {}`.

Read that file when you need a value this page doesn't list.

---

## Gotchas — read these first

These defy reasonable assumptions and are the mistakes most often made in this repo.

- **`--color-gold` is orange (`#FF6535`), not gold.** The brand was renamed from muted gold to orange; the token names were kept for compatibility. `--color-gold`, `--color-orange`, and `--color-primary` are all the same orange. Never introduce `#C8A24A` or any actual gold.
- **Orange text on white fails AA.** Use `--color-gold-ink` (`#D6450F`) for orange text; `--color-gold` is for *fills* only. Same pattern for `--color-teal-ink`, `--color-emerald-ink`, `--color-warning-ink`.
- **The page background is already painted.** `body` carries the aurora radials, the 40×40px graph grid, and a 2% grain pseudo-element. Do not re-apply, override, or duplicate them on a section.
- **The utility is `.graph-overlay`**, not `.graph-bg`. Use `.graph-overlay-dark` on navy sections.
- **Tailwind v4 — there is no `tailwind.config.js`.** Custom tokens go in `@theme {}` in globals.css. Adding a config file will silently do nothing.
- **`cn()` lives in [src/lib/utils.ts](../../../src/lib/utils.ts)**, not `lib/cn.ts`.
- **`/results` is the diagnostic report page**, rendered client-side from `sessionStorage` after the quiz. It is not a case-studies or portfolio page.
- **`createAdminClient()` uses the service-role key and bypasses RLS.** Route Handlers and Server Components only — never import it into a Client Component.
- **No animation library.** Motion is native CSS only, including `animation-timeline` scroll-driven effects in globals.css.
- **Fonts load via `next/font/google` in `layout.tsx`.** Never add a `<link>` tag for Inter.

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

## Typography — Inter only

Single typeface. `--font-heading`, `--font-body`, `--font-sans`, and `--font-display` all resolve to Inter. `--font-mono` is JetBrains Mono, for code and figures only.

Never introduce Plus Jakarta Sans, Playfair, Lexend, or any serif.

Use the fluid clamp scale rather than raw font sizes:

| Token | Range | Typical use |
| --- | --- | --- |
| `--step--1` | 0.83–0.94rem | Captions, metadata |
| `--step-0` | 1–1.13rem | Body |
| `--step-1` | 1.2–1.5rem | Lead paragraph, h4 |
| `--step-2` | 1.44–2rem | h3 |
| `--step-3` | 1.73–2.67rem | h2 |
| `--step-4` | 2.07–3.55rem | h1 |
| `--step-5` | 2.49–4.74rem | Hero display |

`text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs are already global — don't restate them. Inputs are pinned to 16px to stop iOS zoom.

One `<h1>` per page. Don't skip heading levels.

---

## Color tokens

Reference by Tailwind class (`bg-gold`, `text-navy`) or CSS var. **Never raw hex in JSX.**

Two exceptions where hex is unavoidable because CSS custom properties aren't available: `icon.tsx` / `apple-icon.tsx` / `opengraph-image.tsx` (rendered through Satori / `ImageResponse`) and the email templates in `src/lib/email/templates/` (rendered outside the app's CSS). Values there must still match the tokens below.

| Token | Hex | Role |
| --- | --- | --- |
| `--color-navy` / `--color-ink` / `--color-charcoal` | `#1A1A2E` | Headings, body text, dark sections |
| `--color-gold` / `--color-orange` / `--color-primary` | `#FF6535` | Primary CTA, accents, active states, focus |
| `--color-gold-bright` | `#FF8159` | Orange hover, gradient end |
| `--color-gold-ink` | `#D6450F` | Orange *text* on white (AA) |
| `--color-ivory` / `--color-bg` | `#F9FAFB` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, inputs, modals |
| `--color-teal` | `#0D9488` | Growth / digital-transformation accent |
| `--color-teal-ink` | `#0F766E` | Teal text on white |
| `--color-slate` / `--color-text-muted` | `#6B7280` | Secondary text |
| `--color-line` / `--color-border` | `#E5E7EB` | Borders, dividers |
| `--color-footer` | `#0B1120` | Footer only |
| `--color-success` / `--color-emerald` | `#10B981` | Success |
| `--color-warning` | `#F59E0B` | Warning (text: `--color-warning-ink`) |
| `--color-danger` / `--color-crimson` | `#E11D48` | Error, destructive |
| `--color-info` | `#3B82F6` | Informational |

Full neutral ramp: `--color-neutral-50` … `--color-neutral-950`.

**Orange is the only brand accent.** Teal supports; it never competes. Orange means "primary action," not "error." Never communicate state through color alone — pair with an icon, label, weight, or border.

---

## Space, radius, motion

```
--space-1 .25rem  --space-2 .5rem   --space-3 .75rem  --space-4 1rem
--space-5 1.5rem  --space-6 2rem    --space-7 3rem    --space-8 4rem   --space-9 6rem

--radius-1 .375rem   --radius-2 .625rem   --radius-3 1rem   --radius-pill 999px

--dur-1 120ms  --dur-2 220ms  --dur-3 400ms  --dur-4 650ms
--ease-out cubic-bezier(0.16, 1, 0.3, 1)   --ease-in cubic-bezier(0.5, 0, 0.75, 0)
```

Shadows: `--shadow-1` subtle · `--shadow-2` card · `--shadow-3` modal/hero — all navy-tinted.

Animate `transform` and `opacity` only. Never `transition: all` — name the properties. The `prefers-reduced-motion: reduce` guard is already global.

---

## Utility classes that exist

Use these instead of rebuilding them:

| Class | Effect |
| --- | --- |
| `.gold-gradient-text` / `.orange-gradient-text` | Gradient text `#FF6535 → #FF8159` |
| `.graph-overlay` | Navy graph grid on light sections (absolute) |
| `.graph-overlay-dark` | Orange graph grid on dark sections |
| `.reveal` | Staggered entrance, 80ms apart |
| `.eyebrow` | 11px bold uppercase orange section label |
| `.tap-target` | `min-height/width: 44px` — every icon-only button |
| `.card-interactive` | Card hover treatment |
| `.stage-rail` / `.stage-item` / `.stage-marker` / `.stage-card` | Process/timeline composition |
| `.article-longform` / `.article-toc` / `.reading-progress` | Insights article chrome |
| `.animate-fade-in` | Opacity entrance |

---

## Component patterns

- **Primary CTA** — there is no shared `Button` component; the recipe is applied inline. Canonical form:

  ```tsx
  className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gold px-8 py-4 font-heading text-base font-bold text-navy transition-colors hover:bg-gold-bright"
  ```

  44px is the accessibility floor; primary CTAs in this codebase sit at 52–56px.
- **Card** — `bg-white rounded-2xl shadow-lg border border-navy/5 p-8`.
- **Input** — `border border-navy/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold bg-white`, with a real `<label>`. Placeholders are not labels.
- **Section label** — `text-gold font-heading font-bold tracking-widest text-xs uppercase`.
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
| Dark-theme or dark-aurora backgrounds | Soft white base + graph grid |
| Any font but Inter | `font-heading` / `font-body` |
| Raw hex in JSX | Token classes (`text-navy`, `bg-gold`) |
| New CSS custom properties for color | Existing tokens |
| `<link>` for Google Fonts | `next/font/google` in `layout.tsx` |
| `transition: all` | Named properties |
| Fixed `px` font sizes | `--step-N` or Tailwind `text-*` |
| Inline `style={{}}` for layout | Tailwind + `cn()` |
| Muted gold `#C8A24A` | Brand orange `#FF6535` |
| Template literals for class merging | `cn()` |
| Icon button without `.tap-target` | Always `.tap-target` |
| Glassmorphism, mesh gradients, glow orbs, AI sparkles, circuit motifs, fake dashboards, logo clouds | Flat structured surfaces with real content |

---

## Before you finish

- [ ] No raw hex in JSX (outside the two documented exceptions)
- [ ] Orange text uses `--color-gold-ink`, not `--color-gold`
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
