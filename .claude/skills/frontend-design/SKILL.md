# Frontend Design

The design system is already built. Your job is to **use the existing tokens**, not invent new ones. Every color, space, radius, and duration below is defined in [globals.css](../../../src/app/globals.css) inside `@theme {}`.

Read that file when you need a value this page doesn't list.

---

## Gotchas — read these first

These defy reasonable assumptions and are the mistakes most often made in this repo.

- **Body text is capped at 12px** (`--step-0` is a flat `0.75rem`). This is a deliberate brand decision that overrides the usual 16px floor. It also means **there is no size tier below body** — `--step--1` is the same 12px, and captions are just body. Do not "fix" this upward without asking.
- **Every string therefore needs 4.5:1.** At 12px nothing qualifies as WCAG "large text," so the 3:1 allowance is gone site-wide. `--color-muted` (`#5B6273`, 6.2:1) is the lightest legal text colour. Never mute text with opacity (`text-ink/60`) — use `--color-muted`.
- **Form controls stay at 16px.** `input, select, textarea { font-size: 16px }` in globals.css is non-negotiable: below 16px iOS Safari zooms the viewport on focus, which breaks the diagnostic, lead capture, and contact forms. Labels at 12px next to 16px inputs is expected, not a bug.
- **`--color-accent` (amber `#F59E0B`) is fill-only** — 2.1:1 on white. For amber *text* use `--color-accent-ink` (`#B45309`). Same pattern as `--color-brand` vs `--color-brand-ink`.
- **There are no dark sections.** The site is white and `--color-brand-tint` bands only. `text-white` is correct *only* on a `bg-brand` / `bg-danger` / `bg-success` / `bg-ink` fill. Anywhere else it is invisible.
- **The page background is flat white.** There is no grid overlay, no grain, no aurora. `.graph-overlay` and `.graph-overlay-dark` were deleted — don't reintroduce them.
- **Two typefaces, and only two.** `--font-heading` / `--font-display` are **Roboto Slab**; `--font-body` / `--font-sans` / `--font-mono` are **Lexend**. `font-mono` only means `tabular-nums`; it does not change family.
- **Tailwind v4 — there is no `tailwind.config.js`.** Custom tokens go in `@theme {}` in globals.css. Adding a config file will silently do nothing.
- **`cn()` lives in [src/lib/utils.ts](../../../src/lib/utils.ts)**, not `lib/cn.ts`.
- **`/results` is the diagnostic report page**, rendered client-side from `sessionStorage` after the quiz. It is not a case-studies or portfolio page.
- **`createAdminClient()` uses the service-role key and bypasses RLS.** Route Handlers and Server Components only — never import it into a Client Component.
- **No animation library.** Motion is native CSS only, including `animation-timeline` scroll-driven effects in globals.css.
- **Fonts load via `next/font/google` in `layout.tsx`.** Never add a `<link>` tag for Roboto Slab or Lexend.
- **If the dev server shows the wrong colours, delete `.next`.** Turbopack caches the compiled stylesheet and will happily serve a stale palette after a token change.

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

## Typography — Roboto Slab + Lexend

Two faces, each with one job. `--font-heading` / `--font-display` resolve to **Roboto Slab** — a slab serif that carries every heading. `--font-body` / `--font-sans` / `--font-mono` resolve to **Lexend**, which is drawn for reading ease and is the reason 12px prose stays workable. Never introduce a third typeface.

Roboto Slab sets wide and needs far less optical tightening than a geometric sans: globals.css applies `-0.01em` to `h1`/`h2` and none below that. Don't restate it.

**The scale is fixed, not fluid.** Brand direction caps h1 at 24px and section titles at 21px at *every* width, so no step clamps upward — a heading is the same size on a phone and on a 27" display:

| Token | Size | Typical use |
| --- | --- | --- |
| `--step--1` | 12px flat | Collapsed into body — no tier below |
| `--step-0` | 12px flat | **Body, captions, labels, everything prose** |
| `--step-1` | 14px flat | Card titles, diagram labels, h5 |
| `--step-2` | 16px flat | h4 |
| `--step-3` | 18px flat | h3 |
| `--step-4` | 21px flat | h2 / section titles — **hard cap** |
| `--step-5` | 24px flat | h1 — **hard cap** |

These are caps, not floors: h1 must never exceed 24px and a section title never 21px, on any screen. Verify with a real measurement at both 375px and 1920px, not by eye.

Control labels — buttons, nav links, form labels — are also `--step-0` (12px). The 44px touch target is preserved through `min-h-11` and padding, never through type size. Form *inputs* remain the one exception at 16px.

`text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs are already global — don't restate them.

One `<h1>` per page. Don't skip heading levels. If something reads as a label rather than a sentence, make it a `<span>` or a real heading — not a `<p>` above 12px.

---

## Color tokens

Reference by Tailwind class (`bg-brand`, `text-ink`) or CSS var. **Never raw hex in JSX.**

Two exceptions where hex is unavoidable because CSS custom properties aren't available: `icon.tsx` / `apple-icon.tsx` / `opengraph-image.tsx` (rendered through Satori / `ImageResponse`) and the email templates in `src/lib/email/templates/` (rendered outside the app's CSS). Values there must still match the tokens below.

| Token | Hex | Role |
| --- | --- | --- |
| `--color-brand` | `#2563EB` | Electric Blue — primary CTA, fills, focus (4.5:1 on white) |
| `--color-brand-hover` | `#1D4ED8` | CTA hover |
| `--color-brand-ink` | `#1E40AF` | Blue *text* on white (8.6:1) |
| `--color-brand-tint` | `#F5F8FF` | Pale wash — alternating section band |
| `--color-brand-soft` | `#DBE7FE` | Icon tiles, chips, chart fills |
| `--color-accent` | `#F59E0B` | Amber — **fill only** |
| `--color-accent-ink` | `#B45309` | Amber *text* on white (5.0:1) |
| `--color-accent-soft` | `#FEF3E2` | Amber tint |
| `--color-canvas` / `--color-surface` | `#FFFFFF` | Page and card background |
| `--color-ink` | `#16181D` | Headings and body text |
| `--color-muted` | `#5B6273` | Secondary text (6.2:1) — the lightest legal text colour |
| `--color-line` | `#E4E9F2` | Borders, dividers |
| `--color-line-strong` | `#CBD4E4` | Emphasised border |
| `--color-success` | `#0B6B43` | Success (tint: `--color-success-soft`) |
| `--color-warning` | `#9A5B08` | Warning (tint: `--color-warning-soft`) |
| `--color-danger` | `#C0281D` | Error, destructive (tint: `--color-danger-soft`) |
| `--color-focus` | `#2563EB` | Focus ring |

**Blue is the only brand accent.** Amber supports; it never competes. Blue means "primary action," not "error." Never communicate state through color alone — pair with an icon, label, weight, or border.

---

## Space, radius, motion

```
--space-1 .25rem  --space-2 .5rem   --space-3 .75rem  --space-4 1rem
--space-5 1.5rem  --space-6 2rem    --space-7 3rem    --space-8 4rem   --space-9 6rem

--radius-1 .5rem   --radius-2 .75rem   --radius-3 1rem   --radius-pill 999px

--dur-1 120ms  --dur-2 220ms  --dur-3 400ms  --dur-4 650ms
--ease-out cubic-bezier(0.16, 1, 0.3, 1)   --ease-in cubic-bezier(0.5, 0, 0.75, 0)
```

Shadows are neutral-tinted and deliberately light — `shadow-1` hairline · `shadow-2` card · `shadow-3` modal. They are declared in `@theme`, so they exist as real utilities: use `shadow-1`, not `shadow-sm`. No glow, no coloured shadow, no heavy blur.

In practice: `rounded-lg` for inputs and chips, `rounded-xl` for buttons, `rounded-2xl` for cards.

Animate `transform`, `opacity`, and colour only. Never `transition: all` — name the properties. The `prefers-reduced-motion: reduce` guard is already global.

The house interaction is a **small lift**: buttons `hover:-translate-y-px` with a shadow step; cards `.card-interactive` (2px lift + `--shadow-2` + brand border). Reuse those rather than inventing a new hover.

---

## Utility classes that exist

Use these instead of rebuilding them:

| Class | Effect |
| --- | --- |
| `.brand-gradient-text` | Gradient text `#1E40AF → #3B82F6`. **Display sizes only** — the light end clears 3:1, not 4.5:1 |
| `.reveal` | Staggered entrance, 80ms apart |
| `.stage-reveal` / `.heading-reveal` | Scroll-driven reveal (`animation-timeline: view()`) |
| `.eyebrow` | 12px 800-weight uppercase section label — shape only; it sets no colour, so pick `text-brand-ink` or `text-accent-ink` |
| `.tap-target` | `min-height/width: 44px` — every icon-only button |
| `.card-interactive` | Card hover lift + shadow + brand border |
| `.stage-rail` / `.stage-item` / `.stage-marker` / `.stage-card` | Process/timeline composition |
| `.article-longform` / `.article-toc` / `.reading-progress` | Insights article chrome |
| `.animate-fade-in` | Opacity entrance |

`.stage-marker` uses `left: -64px` to sit in the rail's padding — set it to `0` and it lands on top of the card title.

**Screenshots and scroll-driven reveals**: `.stage-reveal` / `.heading-reveal` are `opacity: 0` until scrolled into view, so a full-page screenshot renders them blank. Capture with `reducedMotion: 'reduce'` to see the real layout.

---

## Component patterns

Three shared primitives exist. **Use them instead of re-deriving the recipe inline.**

- **`<Button>`** — [src/components/ui/Button.tsx](../../../src/components/ui/Button.tsx). Variants `primary` (default) · `secondary` · `quiet` · `danger`, plus `fullWidth`. Renders a `next/link` when given `href`, a plain `<a target="_blank" rel="noreferrer">` when also given `external`, and a `<button>` otherwise. Focus ring, disabled state, hover lift, and the 44px floor (`min-h-11`) are built in.

  ```tsx
  <Button href="/diagnostic">Start the Check</Button>
  <Button variant="secondary" onClick={reset}>Start over</Button>
  ```

- **`<Surface>`** — [src/components/ui/Surface.tsx](../../../src/components/ui/Surface.tsx). Card/section container; `tone` of `default` (white) · `muted` (brand tint) · `accent` (soft blue), and `interactive` to add `.card-interactive`.
- **`<SectionHeader>`** — same file. Takes `eyebrow` / `title` / `description`, with `align`.

Reach for a raw `<button>` or a hand-rolled card only when a variant genuinely doesn't fit — and prefer adding a variant over duplicating the recipe.

**Control heights.** `<Button>` is 44px (`min-h-11`), the accessibility floor, and is right for nav, forms, in-page actions, and hero CTAs alike. `min-h-[48px]` and `min-h-[52px]` appear on some admin and diagnostic forms. Those three heights are the whole ladder — reuse one, don't introduce a fourth.
- **Input** — `border border-line rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand bg-white`, with a real `<label>`. Placeholders are not labels. Inputs render at 16px by global rule.
- **Section band** — alternate `bg-white` and `bg-brand-tint`; separate tint bands with `border-y border-line`. Two adjacent white sections need a `border-t border-line` or they merge.
- **Focus** — `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px }` is global. Never remove it without an equally visible replacement.

Components: PascalCase filenames, named exports, explicit prop interfaces. API routes: `route.ts` with named `GET`/`POST` exports.

Create a component when the UI actually repeats or owns behaviour — not preemptively. Start concrete; abstract once the similarity is proven.

---

## Graphics

Sections should not be unbroken walls of text. The house options, in order of preference:

1. **Icon in a tinted tile** — a `lucide-react` icon at `h-5 w-5` inside an `h-10 w-10 rounded-xl bg-brand-soft` span, `text-brand-ink`, `strokeWidth={2.25}`.
2. **CSS/flex diagrams** — bars, rails, steppers built from divs. See [Graphics.tsx](../../../src/components/home/Graphics.tsx).
3. **Inline SVG** — only for shapes carrying no labels.

**Do not put labelled text inside a scaled `<svg>`** — it shrinks below the legible floor on a 375px screen. Build labelled diagrams in HTML so the type stays at real size and reflows.

Decorative graphics get `aria-hidden="true"`. Icon-only controls get `.tap-target` and an accessible name.

---

## Content integrity

Never invent testimonials, client names or logos, revenue figures, metrics, certifications, awards, partnerships, case-study results, customer counts, or geographic claims.

This includes charts and score displays: a dial showing a plausible number is an invented metric. Use the product's own defined values — e.g. the real Founder Dependency Index bands (Critical 0–39 / Developing 40–69 / Progressing 70–100) — or show the scale without a fabricated reading.

When a page needs evidence that hasn't been supplied, write `[TO CONFIRM]`. Do not write a realistic-looking placeholder that could be mistaken for a real business claim.

Voice: executive, analytical, practical — bold and distinctive, not generic. Avoid "revolutionize," "unlock your potential," "next-generation," "seamless," "supercharge."

---

## Anti-patterns

| Don't | Do |
| --- | --- |
| Cream, vellum, or tinted page backgrounds | Flat white canvas + `bg-brand-tint` bands |
| Dark navy/ink section slabs | Light sections; contrast from fills and borders |
| Blueprint grid, grain, aurora radials | Nothing — the canvas is flat |
| A third font family (Inter, Fraunces, IBM Plex, Figtree, Arial) | `font-heading` (Roboto Slab) / `font-body` (Lexend) |
| Body, button or label text above 12px | `--step-0` |
| h1 above 24px or a section title above 21px, at any width | `--step-5` / `--step-4` — they are fixed, not fluid |
| A caption size below body | There isn't one — captions are 12px too |
| Muting text with opacity (`text-ink/60`) | `text-muted` |
| Amber as text | `text-accent-ink` |
| `text-white` on a light surface | `text-ink`; white is for brand/status fills only |
| Raw hex in JSX | Token classes (`text-ink`, `bg-brand`) |
| New CSS custom properties for color | Existing tokens |
| `<link>` for Google Fonts | `next/font/google` in `layout.tsx` |
| `transition: all` | Named properties |
| `shadow-lg` / `shadow-xl` / coloured shadow | `shadow-1` / `shadow-2` / `shadow-3` |
| Fixed `px` font sizes | `--step-N` |
| Inline `style={{}}` for layout | Tailwind + `cn()` |
| Template literals for class merging | `cn()` |
| Icon button without `.tap-target` | Always `.tap-target` |
| Glassmorphism, mesh gradients, glow orbs, AI sparkles, fake dashboards, logo clouds | Flat structured surfaces with real content |

---

## Before you finish

- [ ] No raw hex in JSX (outside the two documented exceptions)
- [ ] Every `<p>`, `<li>`, button label and form label is at `--step-0` (12px)
- [ ] h1 ≤ 24px and h2 ≤ 21px measured at 375px **and 1920px** — the scale is fixed, nothing scales up
- [ ] Amber text uses `--color-accent-ink`; blue text uses `--color-brand-ink`
- [ ] `text-white` appears only alongside a dark fill
- [ ] One `<h1>`; heading levels not skipped
- [ ] Icon-only buttons have `.tap-target` and an accessible name
- [ ] Keyboard reaches every interactive element; focus ring visible
- [ ] Contrast ≥ 4.5:1 for all text — at 12px there is no large-text exemption
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
