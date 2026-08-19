---
name: brand-guidelines
description: "Applies the Muhammed Ajmal Consulting brand — \"Signal\": electric blue on a white canvas with an amber support accent, Figtree typography, compact 12px body scale — to any artifact, document, or surface that should carry the look without full component engineering. Use for one-off artifacts, marketing copy, presentations, diagrams, or README banners. For building actual app components, pages, or interfaces, use frontend-design instead — it owns the complete token system and implementation rules."
---

# Brand Guidelines

Quick-reference identity for anything that needs the brand look without full component engineering. For real UI (components, pages), defer to the `frontend-design` skill — it is the source of truth for tokens, accessibility, and implementation rules; this is a distilled subset.

---

## Identity in one line

**"Signal" — electric blue on a white canvas, with warm amber as the single supporting accent.** Flat, well-lit, and deliberately compact: hairline borders and light shadows carry structure, not dark slabs or texture. Figtree is the only typeface, at every weight. This superseded the "Cyanotype Blueprint" ink/brass/vellum identity, which itself superseded a soft-white/orange-Inter one — do not revert to either.

---

## Color

| Token | Hex | Use |
| --- | --- | --- |
| `--color-brand` | `#2563EB` | Primary accent — CTAs, fills, active states, focus rings (4.5:1 on white) |
| `--color-brand-hover` | `#1D4ED8` | Hover state for brand fills |
| `--color-brand-ink` | `#1E40AF` | Blue **text** on white (8.6:1) |
| `--color-brand-tint` | `#F5F8FF` | Pale wash — alternating section bands |
| `--color-brand-soft` | `#DBE7FE` | Icon tiles, chips, chart fills |
| `--color-accent` | `#F59E0B` | Amber — **fill only**, never text (2.1:1 on white) |
| `--color-accent-ink` | `#B45309` | Amber **text** on white (5.0:1) |
| `--color-canvas` | `#FFFFFF` | Page background |
| `--color-ink` | `#16181D` | Headings and body text — near-black, never pure black |
| `--color-muted` | `#5B6273` | Secondary text (6.2:1) — the lightest legal text colour |
| `--color-line` | `#E4E9F2` | Borders, dividers |

Semantic status colors (not brand accents — use only for their meaning). Each has a matching `-soft` tint for backgrounds:

| Status | Hex |
| --- | --- |
| Success | `#0B6B43` |
| Danger | `#C0281D` |
| Warning | `#9A5B08` |

**Rule:** Blue is the *only* brand accent. Amber supports — it appears as a fill for highlights, the final step of a progression, or a chip, and never competes for the primary action. Never introduce a third accent hue for emphasis — reach for weight, size, or blue instead.

## Typography

- **Figtree for everything.** Headings, body, and figures all use it; there is no second typeface. In the app, `--font-heading`, `--font-body`, and `--font-mono` all resolve to Figtree, and `font-mono` means tabular figures rather than a family change.
- Hierarchy comes from **weight and size**, not font swaps: 400 body → 500 medium emphasis → 600 section heads → 700 titles → 800 hero display.
- Tracking: Figtree is geometric, so tighten display type — `-0.02em` at h1/h2, `-0.015em` at h3/h4. Eyebrow labels go the other way: `+0.15em` uppercase at 800 weight.
- **Body copy is capped at 12px.** This is a deliberate brand decision. It means there is no caption tier below body, every string needs 4.5:1 contrast, and text is never muted with opacity. Form controls are the one exception and stay at 16px, because below that iOS Safari zooms the page on focus.
- Heading caps on mobile: h1 24px, sub-headings 21px. They grow to 40px / 32px on desktop.
- In-app, use the fluid `--step-N` scale (clamp-based). For static artifacts outside the app, fixed sizes are fine.

## Brand signature: flat canvas, banded rhythm

The identity is defined by what it *doesn't* have — no texture, no grid, no gradient wash. Structure comes from:

- A flat white canvas
- Alternating `--color-brand-tint` bands separated by hairline `--color-line` rules
- Cards as white surfaces with a 1px border and a light shadow
- Blue as the single point of colour emphasis, amber as the occasional highlight

An earlier version of this brand mandated a 40×40px blueprint grid on every surface. That is retired — adding texture now reads as off-brand.

## Motion character

- Signature ease: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Entrances stagger in 0.08s increments.
- Hover = small lift (buttons `-1px`, cards `-2px`) plus a shadow step and a blue border.
- Nothing longer than 400ms for UI interactions. Respect `prefers-reduced-motion`.
- No AI-pulse or glow effects — AI has no separate visual identity from the core brand.

## Do / Don't

| Don't | Do |
| --- | --- |
| Any font other than Figtree | Figtree at every weight |
| Hardcoded hex in app code | CSS custom property token |
| A second accent color for "variety" | Blue only — vary weight/size instead; amber for highlights |
| Pure black for text | Near-black ink `#16181D` |
| Cream, vellum, or textured backgrounds | Flat white canvas |
| A blueprint grid, grain, or aurora wash | Nothing — the canvas is flat |
| Dark navy section slabs | Light sections; contrast from fills and borders |
| Body prose above 12px | 12px, with 16px form controls |
| Muting text with opacity | `--color-muted` |
| Amber as text at `#F59E0B` | `#B45309` (`--color-accent-ink`) |
| Heavy or coloured drop shadows | Light neutral shadows (`shadow-1`/`2`/`3`) |
| Brass `#C6752E`, vellum `#F6F0E2`, Fraunces, or IBM Plex | Blue `#2563EB` and Figtree — that identity is retired |
