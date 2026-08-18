---
name: brand-guidelines
description: Applies the Muhammed Ajmal Consulting brand — "Cyanotype Blueprint", blueprint ink + brass on vellum, Fraunces and IBM Plex type, blueprint-grid signature — to any artifact, document, or surface that should carry the look without full component engineering. Use for one-off artifacts, marketing copy, presentations, diagrams, or README banners. For building actual app components, pages, or interfaces, use frontend-design instead — it owns the complete token system and implementation rules.
---

# Brand Guidelines

Quick-reference identity for anything that needs the brand look without full component engineering. For real UI (components, pages), defer to the `frontend-design` skill — it is the source of truth for tokens, accessibility, and implementation rules; this is a distilled subset.

---

## Identity in one line

**"Cyanotype Blueprint" — blueprint ink + warm brass on vellum paper.** No black, no purple, no decorative gradients. A bold serif display face (Fraunces) sits against a technical sans/mono body (IBM Plex). A 40×40px graph-paper grid is the recurring brand signature, read as an actual technical blueprint rather than as texture.

This superseded an earlier soft-white / orange / Inter identity. Do not revert to it.

---

## Color

| Token | Hex | Use |
| --- | --- | --- |
| `--color-gold` / `--color-orange` | `#C6752E` | Brass — primary accent: CTAs, active states, focus rings |
| `--color-gold-bright` | `#E0964F` | Hover state / gradient end for brass elements |
| `--color-gold-ink` | `#8C4D1F` | Brass text on white (AA 4.5:1 — `#C6752E` fails on white) |
| `--color-navy` / `--color-ink` | `#132A4A` | Blueprint Ink — headings, primary text, dark sections; never pure black |
| `--color-ivory` | `#F6F0E2` | Vellum — page background |
| `--color-slate` | `#7C7362` | Secondary text |
| `--color-line` | `#E3DBC7` | Borders, dividers |

Note the naming quirk: `--color-orange` is **brass**, not orange. The brand moved off orange and the token names were kept for compatibility — `--color-gold`, `--color-orange`, and `--color-primary` are all `#C6752E`.

Semantic status colors (not brand accents — use only for their meaning):

| Status | Fill | Text on white |
| --- | --- | --- |
| Success | `#5B7A45` | `#3C5330` |
| Danger | `#B33B2C` | — |
| Warning | `#F59E0B` | `#92400E` |

**Rule:** Brass is the *only* brand accent. Blueprint Cyan (`#3E8FB0`, text `#255A70`) appears solely on growth / digital-transformation content. Never introduce a third accent hue for emphasis — reach for weight, size, or the brass instead. Pair a brass fill with ink text on top, never white.

## Typography

- **Fraunces** for display and headings — bold serif, editorial character. Weights 500 / 600 / 700 / 900.
- **IBM Plex Sans** for body and UI copy. Weights 400 / 500 / 600 / 700.
- **IBM Plex Mono** for numbers, stats, labels, and technical annotations.
- No Inter, Arial, Roboto, or system-ui as a primary face — fallback stacks only.
- Hierarchy comes from **face and scale first, weight second.** The serif/sans split already separates heading from body; don't add a fourth face.
- Tracking: `-0.02em` on anything ≥20px. Eyebrow labels go the other way: `+0.1em` uppercase.
- In-app, use the fluid `--step-N` scale (clamp-based). For static artifacts outside the app, fixed sizes are fine.

## Brand Signature: Blueprint grid

The one non-negotiable visual motif — a 40×40px grid that reads as drafting paper:

- Light surfaces → faint **ink** lines (`#132A4A`, ~5% opacity)
- Dark surfaces → faint **brass** lines (`#E0964F`, ~9% opacity)

A plain white or ink fill without it is off-brand. In the app this is already painted on `body`; only add it explicitly for artifacts and one-off surfaces.

## Motion character

- Signature ease: `cubic-bezier(0.16, 1, 0.3, 1)` for brand slide-ins.
- Entrances stagger in 0.08s increments.
- Hover = subtle lift (`translateY(-1px)`) + shadow increase.
- Nothing longer than 400ms for UI interactions. Respect `prefers-reduced-motion`.
- No AI-pulse or glow effects — AI has no separate visual identity from the core brand.

## Do / Don't

| Don't | Do |
| --- | --- |
| Any font other than Fraunces / IBM Plex | Fraunces for headings, Plex Sans for body, Plex Mono for data |
| Hardcoded hex in app code | CSS custom property token |
| A second accent color for "variety" | Brass only — vary weight/size instead |
| Pure black for dark surfaces | Blueprint Ink `#132A4A` |
| Soft-white or cool-gray backgrounds | Vellum `#F6F0E2` |
| Decorative or rainbow gradients | Brass gradient text + blueprint grid only |
| Flat background with no texture | Blueprint grid (40×40px) |
| Brass text on white at `#C6752E` | `#8C4D1F` (`--color-gold-ink`) |
| Retired orange `#FF6535` / `#FF8159`, or Inter | Brass `#C6752E` / `#E0964F`, Fraunces + Plex |
