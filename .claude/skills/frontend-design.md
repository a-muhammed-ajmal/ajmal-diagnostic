TRIGGER — Apply BEFORE writing any HTML, CSS, JSX/TSX, or Tailwind classes in this project. Re-read when asked to make UI "look better," "less generic," or "more polished."

---

# Frontend Design — Project Skill

This project has an established design system. Do NOT invent new tokens, colors, fonts, or utility classes — use what exists in `src/app/globals.css`.

## Brand Identity

White base with graph-paper grid and orange aurora glow. NOT the dark aurora from the generic skill template.

| Token | Value | Use |
|---|---|---|
| `--color-gold` / `--color-orange` | `#FF6535` | CTAs, accents, active states |
| `--color-gold-bright` | `#FF8159` | Gradients, hover states |
| `--color-navy` / `--color-ink` | `#1A1A2E` | Headings, dark sections, primary text |
| `--color-ivory` | `#FFFFFF` | Background |
| `--color-slate` / `--color-text-muted` | `#6B6B6B` | Secondary text |
| `--color-line` / `--color-border` | `#E5E5E5` | Borders, dividers |
| `--color-crimson` / `--color-danger` | `#E11D48` | Errors, destructive actions |
| `--color-emerald` / `--color-success` | `#10B981` | Success states |
| `--color-orange-ink` | `#D6450F` | Orange text on white (passes AA contrast) |
| `--color-focus` | `#D6450F` | Focus rings |

Full neutral scale: `--color-neutral-50` through `--color-neutral-950`.

## Typography

| Layer | Font | Token | Use |
|---|---|---|---|
| Display / Headings | Bricolage Grotesque | `font-heading`, `font-display` | h1–h6, hero text |
| Body | Hanken Grotesk | `font-body`, `font-sans` | Paragraphs, UI text |
| Mono | JetBrains Mono | `font-mono` | Code, data, stats |

Loaded via `next/font/google` in layout.tsx — do NOT add `<link>` tags for these fonts.

**Type scale** (fluid, clamp-based — use these, don't write raw font sizes):
`--step--1` (0.83–0.94rem) · `--step-0` (1–1.13rem) · `--step-1` (1.2–1.5rem) · `--step-2` (1.44–2rem) · `--step-3` (1.73–2.67rem) · `--step-4` (2.07–3.55rem) · `--step-5` (2.49–4.74rem)

**Rules already applied globally:**
- `text-wrap: balance` on all headings
- `text-wrap: pretty` on all paragraphs
- `letter-spacing: -0.02em` on large display text

## Background & Atmosphere

Already set on `body` in globals.css — do NOT override or duplicate:
- **Aurora**: 3-layer orange radial gradients, `background-attachment: fixed`
- **Graph grid**: 40×40px navy lines at 4% opacity (28px on mobile)
- **Grain**: SVG fractal noise pseudo-element at 2.5% opacity

## Existing Utility Classes

| Class | Effect |
|---|---|
| `.orange-gradient-text` | Gradient text `#FF6535 → #FF8159` |
| `.graph-overlay` | Navy grid on white sections (absolute positioned) |
| `.graph-overlay-dark` | Orange grid on dark sections |
| `.reveal` | Staggered entrance animation (translateY + fade, 80ms apart) |

## Spacing, Radius, Motion Tokens

**Space**: `--space-1` (0.25rem) through `--space-9` (6rem)
**Radius**: `--radius-1` (0.375rem) · `--radius-2` (0.625rem) · `--radius-3` (1rem) · `--radius-pill` (999px)
**Duration**: `--dur-1` (120ms) · `--dur-2` (220ms) · `--dur-3` (400ms) · `--dur-4` (650ms)
**Easing**: `--ease-out` = `cubic-bezier(0.16, 1, 0.3, 1)` — luxurious/considered, matching a premium consulting brand

**Shadows**: `--shadow-1` (subtle) · `--shadow-2` (card) · `--shadow-3` (modal/hero)

## Tailwind Usage

This project uses **Tailwind v4** — no `tailwind.config.js`. All custom tokens are in `globals.css` inside `@theme {}`.

Use Tailwind utility classes with the project tokens:
- `text-navy`, `bg-ivory`, `text-gold`, `border-line`
- `font-heading`, `font-body`
- Use `cn()` (clsx + tailwind-merge) for conditional classes

**Never use raw hex in JSX** — always reference tokens via Tailwind classes or CSS custom properties.

## Component Patterns

- **Buttons**: `min-h-[48px]` touch target, `bg-gold text-navy font-heading font-bold`, hover `bg-gold-bright`, `rounded-xl`
- **Cards**: `bg-white rounded-2xl shadow-lg border border-navy/5 p-8`
- **Inputs**: `border border-navy/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold bg-white`
- **Section labels**: `text-gold font-heading font-bold tracking-widest text-xs uppercase`
- **Focus**: `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px }` (globally set)

## Accessibility

- `prefers-reduced-motion: reduce` guard already in globals.css — kills all animation
- `input, select, textarea` forced to `16px` to prevent iOS zoom
- All interactive elements must have `:focus-visible` styling (already global)
- Minimum 48px touch targets on buttons
- 4.5:1 contrast ratio for text — use `--color-orange-ink` (#D6450F) when placing orange text on white

## Anti-Patterns for This Project

| Don't | Do instead |
|---|---|
| Dark aurora / dark theme backgrounds | White base with graph-paper grid |
| Inter or system-ui as heading font | Bricolage Grotesque via `font-heading` |
| Raw hex colors in JSX | Tailwind token classes (`text-navy`, `bg-gold`) |
| New CSS custom properties for colors | Use existing tokens from globals.css |
| `<link>` tags for Google Fonts | Fonts loaded via `next/font/google` in layout.tsx |
| `transition: all` | Explicit: `transition: transform 220ms, opacity 220ms` |
| Fixed `px` font sizes | Fluid `--step-N` scale or Tailwind `text-*` |
| Inline `style={{}}` for layout | Tailwind classes + `cn()` |
