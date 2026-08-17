---
name: brand-guidelines
description: Applies the Muhammed Ajmal Consulting brand — orange accent, Inter-only type, charcoal-navy, graph-paper signature — to any artifact, document, or surface that should carry the look without full component engineering. Use for one-off artifacts, marketing copy, presentations, diagrams, or README banners. For building actual app components, pages, or interfaces, use frontend-design instead — it owns the complete token system and implementation rules.
---

# Brand Guidelines

Quick-reference identity for anything that needs the brand look without full component engineering. For real UI (components, pages), defer to the `frontend-design` skill — it is the source of truth for tokens, accessibility, and implementation rules; this is a distilled subset.

---

## Identity in one line

**Charcoal-navy + orange.** No black, no purple, no decorative gradients. A single typeface (Inter) carries all hierarchy through weight, not font-switching. A faint graph-paper grid is the recurring brand signature.

---

## Color

| Token | Hex | Use |
| --- | --- | --- |
| `--color-gold` / `--color-orange` | `#FF6535` | Primary accent — CTAs, active states, focus rings |
| `--color-gold-bright` | `#FF8159` | Hover state / gradient end for orange elements |
| `--color-gold-ink` | `#D6450F` | Orange text on white (AA 4.5:1 — `#FF6535` fails on white) |
| `--color-navy` / `--color-ink` | `#1A1A2E` | Headings, primary text, dark sections — navy, never pure black |
| `--color-ivory` | `#F9FAFB` | Page background |
| `--color-slate` | `#6B7280` | Secondary text |
| `--color-line` | `#E5E7EB` | Borders, dividers |

Note the naming quirk: `--color-gold` is **orange**. The brand moved from gold to orange and the token names were kept.

Semantic status colors (not brand accents — use only for their meaning):

| Status | Hex |
| --- | --- |
| Success | `#10B981` |
| Danger | `#E11D48` |
| Warning | `#F59E0B` |

**Rule:** Orange is the *only* brand accent. Teal (`#0D9488`) appears solely on growth / digital-transformation content. Never introduce a third accent hue for emphasis — reach for weight, size, or the orange instead.

## Typography

- **Single typeface: Inter.** No exceptions — no serif, no secondary display font.
- Hierarchy comes from **weight**, not font changes: 400 body → 500 medium emphasis → 600 section heads → 700 titles → 800 hero display.
- Tracking: `-0.02em` on anything ≥20px. Eyebrow labels go the other way: `+0.15em` uppercase.
- In-app, use the fluid `--step-N` scale (clamp-based). For static artifacts outside the app, fixed sizes are fine.

## Brand Signature: Graph-paper grid

The one non-negotiable visual motif — a faint 40×40px grid:

- Light surfaces → faint **navy** lines
- Dark surfaces → faint **orange** lines

A plain white or navy fill without it is off-brand. In the app this is already painted on `body`; only add it explicitly for artifacts and one-off surfaces.

## Motion character

- Signature ease: `cubic-bezier(0.16, 1, 0.3, 1)` for brand slide-ins.
- Entrances stagger in 0.08s increments.
- Hover = subtle lift (`translateY(-1px)`) + shadow increase.
- Nothing longer than 400ms for UI interactions. Respect `prefers-reduced-motion`.
- No AI-pulse or glow effects — AI has no separate visual identity from the core brand.

## Do / Don't

| Don't | Do |
| --- | --- |
| Any font other than Inter | Inter always |
| Hardcoded hex in app code | CSS custom property token |
| A second accent color for "variety" | Orange only — vary weight/size instead |
| Pure black for dark surfaces | Navy `#1A1A2E` |
| Decorative or rainbow gradients | Orange gradient text + graph-paper only |
| Flat background with no texture | Graph-paper grid (40×40px) |
| Orange text on white at `#FF6535` | `#D6450F` (`--color-gold-ink`) |
