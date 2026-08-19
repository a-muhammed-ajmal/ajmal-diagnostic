---
name: brand-guidelines
description: "Applies the Muhammed Ajmal Consulting brand — \"Cyanotype Blueprint\": ink-blue + warm brass on vellum, Fraunces + IBM Plex typography, blueprint-grid signature — to any artifact, document, or surface that should carry the look without full component engineering. Use for one-off artifacts, marketing copy, presentations, diagrams, or README banners. For building actual app components, pages, or interfaces, use frontend-design instead — it owns the complete token system and implementation rules."
---

# Brand Guidelines

Quick-reference identity for anything that needs the brand look without full component engineering. For real UI (components, pages), defer to the `frontend-design` skill — it is the source of truth for tokens, accessibility, and implementation rules; this is a distilled subset.

---

## Identity in one line

**"Cyanotype Blueprint" — ink-blue + warm brass on vellum paper.** No black, no purple, no decorative gradients. Fraunces (bold serif) carries headings and authority; IBM Plex Sans carries body copy; IBM Plex Mono carries numbers and technical annotations. A faint blueprint grid is the recurring brand signature — it reads as an actual technical blueprint, not decoration. This superseded an earlier soft-white/orange-Inter identity — do not revert to it.

---

## Color

| Token | Hex | Use |
| --- | --- | --- |
| `--color-gold` / `--color-orange` | `#C6752E` | Primary accent (brass) — CTAs, active states, focus rings |
| `--color-gold-bright` | `#E0964F` | Hover state / gradient end for brass elements |
| `--color-gold-ink` | `#8C4D1F` | Brass text on white (AA 4.5:1 — `#C6752E` fails on white) |
| `--color-navy` / `--color-ink` | `#132A4A` | Headings, primary text, dark sections — ink-blue, never pure black |
| `--color-ivory` | `#F6F0E2` | Vellum — page background |
| `--color-slate` | `#7C7362` | Secondary text |
| `--color-line` | `#E3DBC7` | Borders, dividers |

Note the naming quirk: `--color-gold` is **brass**, not literal gold. The token names predate the current identity and were kept for compatibility.

Semantic status colors (not brand accents — use only for their meaning):

| Status | Hex |
| --- | --- |
| Success | `#5B7A45` |
| Danger | `#B33B2C` |
| Warning | `#F59E0B` |

**Rule:** Brass is the *only* brand accent. Teal (`#3E8FB0`) appears solely on growth / digital-transformation content. Never introduce a third accent hue for emphasis — reach for weight, size, or brass instead.

## Typography

- **Fraunces for headings.** Bold serif, editorial, high-character — carries the brand's distinctiveness. IBM Plex Sans for body copy. IBM Plex Mono for numbers, stats, and technical/data annotations. No Inter, no Arial, no system-ui as a primary face.
- Hierarchy comes from **weight**, not arbitrary font swaps within a role: 400 body → 500 medium emphasis → 600 section heads → 700 titles → 800 hero display.
- Tracking: `-0.02em` on anything ≥20px. Eyebrow labels go the other way: `+0.15em` uppercase.
- In-app, use the fluid `--step-N` scale (clamp-based). For static artifacts outside the app, fixed sizes are fine.

## Brand Signature: Blueprint grid

The one non-negotiable visual motif — a faint 40×40px grid:

- Light surfaces → faint **ink-blue** lines
- Dark surfaces → faint **brass** lines

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
| Any font other than Fraunces/IBM Plex | Fraunces for headings, IBM Plex Sans for body, IBM Plex Mono for data |
| Hardcoded hex in app code | CSS custom property token |
| A second accent color for "variety" | Brass only — vary weight/size instead |
| Pure black for dark surfaces | Ink-blue navy `#132A4A` |
| Decorative or rainbow gradients | Brass gradient text + blueprint grid only |
| Flat background with no texture | Blueprint grid (40×40px) |
| Brass text on white at `#C6752E` | `#8C4D1F` (`--color-gold-ink`) |
| Original brand orange `#FF6535` or Inter | Brass `#C6752E` and Fraunces/Plex — the old identity is retired |
