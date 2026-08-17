TRIGGER — Apply BEFORE writing any HTML, CSS, JSX/TSX, or Tailwind classes in this project. Re-read when asked to make UI "look better," "less generic," or "more polished."

---

# Frontend Design — Project Skill

This project has an established design system. Do NOT invent new tokens, colors, fonts, or utility classes — use what exists in `src/app/globals.css`.

## Brand Identity

"Cyanotype Blueprint" — deep ink-blue + warm brass on vellum paper, with a graph-paper grid that reads as an actual technical blueprint rather than decoration. Voice: executive, analytical, practical — bold and distinctive, not generic. This superseded an earlier soft-white/orange-Inter identity; do not revert to it.

| Token | Value | Use |
|---|---|---|
| `--color-navy` / `--color-ink` | `#132A4A` | Blueprint Ink — headings, dark sections, strong text |
| `--color-gold` / `--color-orange` | `#C6752E` | Brass — CTAs, accents, active states |
| `--color-gold-bright` | `#E0964F` | Brass hover / gradient end |
| `--color-charcoal` | `#132A4A` | Body text, precision |
| `--color-ivory` | `#F6F0E2` | Vellum — primary background |
| `--color-teal` | `#3E8FB0` | Blueprint Cyan — growth, digital transformation |
| `--color-slate` / `--color-text-muted` | `#7C7362` | Secondary text |
| `--color-line` / `--color-border` | `#E3DBC7` | Borders, dividers |
| `--color-crimson` / `--color-danger` | `#B33B2C` | Errors, destructive actions |
| `--color-emerald` / `--color-success` | `#5B7A45` | Success states |
| `--color-gold-ink` | `#8C4D1F` | Dark brass for text on white (AA contrast) |
| `--color-focus` | `#C6752E` | Focus rings (brass) |

**Brass usage rule**: Primary CTA, active states, accents, focus rings. Pair with dark ink (`#132A4A`) text on top of it for contrast, per existing `Button.tsx` pattern.

Full neutral scale: `--color-neutral-50` through `--color-neutral-950`.

## Typography

| Layer | Font | Token | Use |
|---|---|---|---|
| Display / Headings | Fraunces | `font-heading`, `font-display` | h1–h6, hero text, authority — bold serif, editorial character |
| Body | IBM Plex Sans | `font-body`, `font-sans` | Paragraphs, UI text |
| Mono | IBM Plex Mono | `font-mono` | Code, numbers, stats, technical/data annotations |

**No Inter, no Arial, no system-ui as a primary face** — those exist only as fallback stacks. Fraunces carries the bold/distinctive identity; IBM Plex Sans/Mono keep body copy and data legible and technical.

Loaded via `next/font/google` in `layout.tsx` — do NOT add `<link>` tags for these fonts.

**CSS variables**: `--font-fraunces` (heading/display), `--font-plex-sans` (body/sans), `--font-plex-mono` (mono)

**Type scale** (fluid, clamp-based — use these, don't write raw font sizes):
`--step--1` (0.83–0.94rem) · `--step-0` (1–1.13rem) · `--step-1` (1.2–1.5rem) · `--step-2` (1.44–2rem) · `--step-3` (1.73–2.67rem) · `--step-4` (2.07–3.55rem) · `--step-5` (2.49–4.74rem)

**Rules already applied globally:**
- `text-wrap: balance` on all headings
- `text-wrap: pretty` on all paragraphs
- Headings use Fraunces via CSS rule

## Background & Atmosphere

Already set on `body` in globals.css — do NOT override or duplicate:
- **Aurora**: 3-layer radial gradients (ink, cyan, brass) — subtle, `background-attachment: fixed`
- **Graph grid**: 40×40px ink-blue lines at 5% opacity (28px on mobile) — this is a literal blueprint grid, part of the concept
- **Grain**: SVG fractal noise pseudo-element at 2% opacity

## Existing Utility Classes

| Class | Effect |
|---|---|
| `.gold-gradient-text` / `.orange-gradient-text` | Gradient text `#C6752E → #E0964F` |
| `.graph-overlay` | Ink-blue blueprint grid on light sections (absolute positioned) |
| `.graph-overlay-dark` | Brass blueprint grid on dark sections |
| `.reveal` | Staggered entrance animation (translateY + fade, 80ms apart) |

## Spacing, Radius, Motion Tokens

**Space**: `--space-1` (0.25rem) through `--space-9` (6rem)
**Radius**: `--radius-1` (0.375rem) · `--radius-2` (0.625rem) · `--radius-3` (1rem) · `--radius-pill` (999px)
**Duration**: `--dur-1` (120ms) · `--dur-2` (220ms) · `--dur-3` (400ms) · `--dur-4` (650ms)
**Easing**: `--ease-out` = `cubic-bezier(0.16, 1, 0.3, 1)` — luxurious/considered, matching a premium consulting brand

**Shadows**: `--shadow-1` (subtle) · `--shadow-2` (card) · `--shadow-3` (modal/hero) — ink-blue-tinted

## Tailwind Usage

This project uses **Tailwind v4** — no `tailwind.config.js`. All custom tokens are in `globals.css` inside `@theme {}`.

Use Tailwind utility classes with the project tokens:
- `text-navy`, `bg-ivory`, `text-gold`, `border-line`, `text-charcoal`, `text-teal`
- `font-heading`, `font-body`
- Use `cn()` (clsx + tailwind-merge) for conditional classes

**Never use raw hex in JSX** — always reference tokens via Tailwind classes or CSS custom properties. Exceptions: `icon.tsx`/`apple-icon.tsx` (rendered via `ImageResponse`/Satori) and email templates (rendered outside the app's CSS) can't consume CSS custom properties — literal hex there is unavoidable, but must match the token values above.

## Component Patterns

- **Buttons**: `min-h-[44px]` touch target, `bg-gold text-navy font-heading font-bold`, hover `bg-gold-bright`, `rounded-xl` — see `src/components/ui/Button.tsx`
- **Cards**: `bg-white rounded-2xl shadow-lg border border-navy/5 p-8`
- **Inputs**: `border border-navy/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold bg-white`
- **Section labels**: `text-gold font-heading font-bold tracking-widest text-xs uppercase`
- **Focus**: `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px }` (globally set)

## Accessibility

- `prefers-reduced-motion: reduce` guard already in globals.css — kills all animation
- `input, select, textarea` forced to `16px` to prevent iOS zoom
- All interactive elements must have `:focus-visible` styling (already global)
- Minimum 44px touch targets on buttons
- 4.5:1 contrast ratio for text — use `--color-gold-ink` (#8C4D1F) when placing brass text on white

## Anti-Patterns for This Project

| Don't | Do instead |
|---|---|
| Soft-white / cool-gray backgrounds | Vellum base (`#F6F0E2`) with the blueprint grid |
| Any font other than Fraunces/IBM Plex (Inter, Arial, Roboto, etc.) | Fraunces via `font-heading`, IBM Plex Sans via `font-body`, IBM Plex Mono via `font-mono` |
| Raw hex colors in JSX | Tailwind token classes (`text-navy`, `bg-gold`) |
| New CSS custom properties for colors | Use existing tokens from globals.css |
| `<link>` tags for Google Fonts | Fonts loaded via `next/font/google` in layout.tsx |
| `transition: all` | Explicit: `transition: transform 220ms, opacity 220ms` |
| Fixed `px` font sizes | Fluid `--step-N` scale or Tailwind `text-*` |
| Inline `style={{}}` for layout | Tailwind classes + `cn()` |
| Original brand orange (#FF6535) or Inter | Brass (#C6752E) and Fraunces/Plex — the old identity is retired |
