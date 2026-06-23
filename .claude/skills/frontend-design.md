TRIGGER — Apply BEFORE writing any HTML, CSS, JSX/TSX, or Tailwind classes in this project. Re-read when asked to make UI "look better," "less generic," or "more polished."

---

# Frontend Design — Project Skill

This project has an established design system. Do NOT invent new tokens, colors, fonts, or utility classes — use what exists in `src/app/globals.css`.

## Brand Identity

Soft white base with architectural graph-paper grid and subtle navy/gold/teal aurora. Voice: "McKinsey meets modern AI" — executive, analytical, practical.

| Token | Value | Use |
|---|---|---|
| `--color-navy` / `--color-ink` | `#0B2545` | Executive Navy — headings, dark sections, trust |
| `--color-gold` / `--color-orange` | `#C8A24A` | Executive Gold — CTAs, accents (10-15% usage only) |
| `--color-gold-bright` | `#D4B366` | Lighter gold — hover states, gradients |
| `--color-charcoal` | `#1A1A1A` | Strategic Charcoal — body text, precision |
| `--color-ivory` | `#F9FAFB` | Soft White — primary background |
| `--color-teal` | `#0D9488` | AI Teal — growth, digital transformation |
| `--color-slate` / `--color-text-muted` | `#6B7280` | Secondary text |
| `--color-line` / `--color-border` | `#E5E7EB` | Borders, dividers |
| `--color-crimson` / `--color-danger` | `#E11D48` | Errors, destructive actions |
| `--color-emerald` / `--color-success` | `#10B981` | Success states |
| `--color-gold-ink` | `#9A7A2A` | Dark gold for text on white (AA contrast) |
| `--color-focus` | `#0B2545` | Focus rings (navy, not gold) |

**Gold usage rule**: Never as background fill. Only for CTAs, success metrics, framework markers, accent details.

Full neutral scale: `--color-neutral-50` through `--color-neutral-950`.

## Typography

| Layer | Font | Token | Use |
|---|---|---|---|
| Display / Headings | Fraunces (serif) | `font-heading`, `font-display` | h1–h6, hero text, authority |
| Body | Inter (sans-serif) | `font-body`, `font-sans` | Paragraphs, UI text |
| Mono | JetBrains Mono | `font-mono` | Code, data, stats |

Loaded via `next/font/google` in layout.tsx — do NOT add `<link>` tags for these fonts.

**Type scale** (fluid, clamp-based — use these, don't write raw font sizes):
`--step--1` (0.83–0.94rem) · `--step-0` (1–1.13rem) · `--step-1` (1.2–1.5rem) · `--step-2` (1.44–2rem) · `--step-3` (1.73–2.67rem) · `--step-4` (2.07–3.55rem) · `--step-5` (2.49–4.74rem)

**Rules already applied globally:**
- `text-wrap: balance` on all headings
- `text-wrap: pretty` on all paragraphs
- Headings use serif font-family (Fraunces) via CSS rule

## Background & Atmosphere

Already set on `body` in globals.css — do NOT override or duplicate:
- **Aurora**: 3-layer radial gradients (navy, teal, gold) — subtle, `background-attachment: fixed`
- **Graph grid**: 40×40px navy lines at 3.5% opacity (28px on mobile)
- **Grain**: SVG fractal noise pseudo-element at 2% opacity

## Existing Utility Classes

| Class | Effect |
|---|---|
| `.gold-gradient-text` / `.orange-gradient-text` | Gradient text `#C8A24A → #D4B366` |
| `.graph-overlay` | Navy grid on light sections (absolute positioned) |
| `.graph-overlay-dark` | Gold grid on dark sections |
| `.reveal` | Staggered entrance animation (translateY + fade, 80ms apart) |

## Spacing, Radius, Motion Tokens

**Space**: `--space-1` (0.25rem) through `--space-9` (6rem)
**Radius**: `--radius-1` (0.375rem) · `--radius-2` (0.625rem) · `--radius-3` (1rem) · `--radius-pill` (999px)
**Duration**: `--dur-1` (120ms) · `--dur-2` (220ms) · `--dur-3` (400ms) · `--dur-4` (650ms)
**Easing**: `--ease-out` = `cubic-bezier(0.16, 1, 0.3, 1)` — luxurious/considered, matching a premium consulting brand

**Shadows**: `--shadow-1` (subtle) · `--shadow-2` (card) · `--shadow-3` (modal/hero) — navy-tinted

## Tailwind Usage

This project uses **Tailwind v4** — no `tailwind.config.js`. All custom tokens are in `globals.css` inside `@theme {}`.

Use Tailwind utility classes with the project tokens:
- `text-navy`, `bg-ivory`, `text-gold`, `border-line`, `text-charcoal`, `text-teal`
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
- 4.5:1 contrast ratio for text — use `--color-gold-ink` (#9A7A2A) when placing gold text on white

## Anti-Patterns for This Project

| Don't | Do instead |
|---|---|
| Dark aurora / dark theme backgrounds | Soft white base with graph-paper grid |
| Sans-serif as heading font | Fraunces serif via `font-heading` |
| Raw hex colors in JSX | Tailwind token classes (`text-navy`, `bg-gold`) |
| New CSS custom properties for colors | Use existing tokens from globals.css |
| `<link>` tags for Google Fonts | Fonts loaded via `next/font/google` in layout.tsx |
| `transition: all` | Explicit: `transition: transform 220ms, opacity 220ms` |
| Fixed `px` font sizes | Fluid `--step-N` scale or Tailwind `text-*` |
| Inline `style={{}}` for layout | Tailwind classes + `cn()` |
| Gold as background fill | Gold only for accents, CTAs, metrics (10-15%) |
| Bright orange (#FF6535) | Executive Gold (#C8A24A) — subdued, premium |
