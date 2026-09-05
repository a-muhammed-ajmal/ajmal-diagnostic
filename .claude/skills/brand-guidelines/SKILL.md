---
name: brand-guidelines
description: "Applies the Muhammed Ajmal Consulting brand — \"Electric Blue & Amber\": vibrant electric blue with a fill-only amber accent on slate neutrals, Plus Jakarta Sans headings paired with Lexend body text, responsive type scale with strict mobile ceilings — to any artifact, document, or surface that should carry the look without full component engineering. Use for one-off artifacts, marketing copy, presentations, diagrams, or README banners. For building actual app components, pages, or interfaces, use frontend-design instead — it owns the complete token system and implementation rules."
---

# Brand Guidelines

Quick-reference identity for anything that needs the brand look without full component engineering. For real UI (components, pages), defer to the `frontend-design` skill — it is the source of truth for tokens, accessibility, and implementation rules; this is a distilled subset.

---

## Identity in one line

**"Electric Blue & Amber" — vibrant electric blue as the primary brand colour, warm amber as the secondary accent, grounded on slate neutrals.** High-intensity technology balanced by premium warmth. Plus Jakarta Sans carries headings and display; Lexend carries body, UI, and small text — both on a responsive scale with hard mobile ceilings. Do not revert to any previous visual identity. Several were retired deliberately. DESIGN is the only current specification.

---

## Color

| Token | Hex | Use |
| --- | --- | --- |
| `--color-brand` | `#0066FF` | Primary accent — CTAs, fills, active states, focus rings (4.8:1 on white) |
| `--color-brand-hover` | `#0039CC` | Hover state for brand fills (8.6:1) |
| `--color-brand-ink` | `#003399` | Blue **text** on white (10.9:1) |
| `--color-brand-tint` | `#E6F0FF` | Light accent wash — alternating section bands |
| `--color-brand-soft` | `#DBEAFE` | Icon tiles, chips, chart fills |
| `--color-accent` | `#FFCC00` | Amber — **fill only**, never text on light (1.51:1 on white) |
| `--color-accent-hover` | `#D49E00` | Hover state for amber fills |
| `--color-accent-ink` | `#CC6600` | Amber **text** on a light surface (3.8:1 — large-text/UI only, below AA-normal) |
| `--color-accent-soft` | `#FFF8E6` | Amber tint |
| `--color-canvas` | `#FFFFFF` | Page background |
| `--color-canvas-dark` | `#000033` | Slate 900 — the dark surface amber is allowed to sit on |
| `--color-canvas-light` | `#F8FAFC` | Slate 50 — neutral band |
| `--color-surface` | `#FFFFFF` | Card and panel surface — same value as `--color-canvas` |
| `--color-ink` | `#000033` | Headings and body text (20.0:1) |
| `--color-ink-soft` | `#1E293B` | Slate 800 |
| `--color-muted` | `#475569` | Secondary text (7.6:1) — the lightest legal text colour |
| `--color-muted-invert` | `#CBD5E1` | Secondary text on a dark slate band (13.5:1) |
| `--color-line` | `#E2E8F0` | Borders, dividers (Slate 200) |
| `--color-line-strong` | `#CBD5E1` | Slate 300 — the heavier divider |
| `--color-canvas-border` | `#E2E8F0` | Same value as `--color-line` under a second name — a palette move must change both |
| `--color-focus` | `#0066FF` | Focus ring, via the global `:focus-visible` outline |

The full numbered palette is also available: `electric-50` `#EFF6FF` · `electric-100` `#DBEAFE` · `electric-500` `#0066FF` · `electric-600` `#0046D5` · `electric-700` `#003399` · `electric-900` `#1E3A8A`; `amber-50` `#FFFBEB` · `amber-100` `#FEF3C7` · `amber-500` `#FFCC00` · `amber-600` `#D97706` · `amber-700` `#CC6600`. **`amber-600` is a fill rung only** — at ~3.4:1 on white it fails AA for normal text, so `text-amber-600` is an anti-pattern; use `--color-accent-ink` `#CC6600` (3.8:1 — itself only legal at large-text/UI sizes, never body copy).

Semantic status colors (not brand accents — use only for their meaning). Each has a matching `-soft` tint for backgrounds:

| Status | Hex | `-soft` tint |
| --- | --- | --- |
| Success | `#0B6B43` | `#E7F6EE` |
| Danger | `#C0281D` | `#FDECEC` |
| Warning | `#9A5B08` | `#FFF8E6` |

**Rule:** Blue is the *primary*; amber is the *secondary*, and it is a fill, not a text colour. Amber `#FFCC00` on white or light grey lands at 1.51:1 — it may only sit on a dark slate surface (`#000033`) or act as a border highlight or badge fill with dark text on it. For amber text on a light surface, `#CC6600` (3.8:1) is the closest legal option, and it is large-text/UI only — it fails the 4.5:1 body-text minimum. Never introduce a third accent hue.

## Typography

- **Plus Jakarta Sans for headings and display; Lexend for body, UI, and small text.** No third face, and nothing in Lexend above weight 500. In the app, `--font-heading` / `--font-display` / `--font-mono` resolve to Plus Jakarta Sans and `--font-body` / `--font-sans` resolve to Lexend, where `font-mono` means tabular figures rather than a family change — never fall back to Inter or a system sans for headings.
- Headings run semibold to bold (600–800) in Plus Jakarta Sans, with loose tracking on large display titles. Body runs regular to medium (400–500) in Lexend at `line-height: 1.5–1.625`. 500 is the body ceiling — nothing in Lexend goes above it.
- Eyebrow labels are uppercase at 500 weight with no letter spacing, at the 12px micro-copy tier. They set their own colour: `accent-ink` on light surfaces, `accent` on dark bands. **Known gap:** at 12px/500-weight, eyebrow text doesn't qualify as WCAG large text (needs 18px regular or 14px bold), so `accent-ink` eyebrows on light surfaces sit at 3.8:1 against the 4.5:1 normal-text minimum — accepted as a tradeoff of the current amber value, not a compliant pattern to copy elsewhere.
- **Strict mobile ceilings below 768px.** No heading (h1 through h4) may exceed **24px**; h1 sits at 24px, h2 at 22px, h3 at 20px, h4 at 18px. No body paragraph, list item, or form description may exceed **14px**. UI micro-copy and labels sit at **12px**.
- **Above 768px the scale opens up** — body 16px, h4 20px, h3 24px, h2 32px, h1 48px. The ceilings are a mobile constraint, not a global cap.
- Form *inputs* are pinned at 16px at every width, because below that iOS Safari zooms the page on focus. On mobile that means 16px inputs beside 14px body copy — expected, not a bug.
- In-app, use the `--step-N` scale rather than pixel values; it carries both tiers:

| Token | < 768px | ≥ 768px | Role |
| --- | --- | --- | --- |
| `--step--1` | 12px | 13px | Micro-copy, labels, eyebrows |
| `--step-0` | 14px | 16px | Body, list items, form descriptions |
| `--step-1` | 16px | 18px | Card titles, h5 |
| `--step-2` | 18px | 20px | h4 |
| `--step-3` | 20px | 24px | h3 |
| `--step-4` | 22px | 32px | h2, section titles |
| `--step-5` | 24px | 48px | h1 |

- The 14px mobile body ceiling has exactly one in-app exception: `.article-longform` body on `/insights/[slug]` renders at 16px below 768px, being the site's only sustained-reading surface. No other route may claim it, and it does not extend to artifacts or documents.

## Brand signature: light canvas, banded rhythm, ambient depth

Structure comes from:

- A white canvas, with alternating `--color-canvas-light` and `--color-brand-tint` bands separated by hairline `--color-line` rules
- Cards as white surfaces with a 1px border and a light shadow — or glassmorphism panels (translucent white, backdrop blur, thin border) where depth is wanted
- Ambient blurred radials (`.orb-electric`, `.orb-amber`) behind hero sections, at 20–30% opacity
- Asymmetric layouts — a 7/5 split beats two equal halves; break up rows of equal-width cards
- Blue as the dominant colour emphasis, amber as the occasional premium highlight

An earlier version of this brand mandated a 40×40px blueprint grid on every surface. That is retired.

## Motion character

- Signature ease: `--ease-out` `cubic-bezier(0.16, 1, 0.3, 1)`. Also declared: `--ease-in` `cubic-bezier(0.5, 0, 0.75, 0)`, and `--ease-spring` `cubic-bezier(0.34, 1.56, 0.64, 1)` — which overshoots past 1 and settles back, making it correct only on a small decorative element, never on a panel or a control.
- Hover on any CTA: a small upward shift (`-2px`) plus a glow step — electric blue glow on blue fills, amber glow on amber. Bound to `200ms`.
- Duration scale: `--dur-1` 120ms · `--dur-2` 200ms · `--dur-3` 400ms · `--dur-4` 650ms. Hover and state transitions sit at 200ms; entrance animations run the full 650ms.
- Entrances stagger in 0.1s increments, capped at five children.
- Ambient loops — drifting orbs, the chip marquee, the hero spoke figure — sit outside the interaction scale on purpose and run in seconds, not milliseconds.
- Respect `prefers-reduced-motion`. Never ship a static interface with no hover or active feedback on its CTAs.

## Do / Don't

| Don't | Do |
| --- | --- |
| ❌ A third font family — Inter, or a system sans as headings | ✅ Plus Jakarta Sans for headings and display; Lexend for body, UI, and small text |
| Hardcoded hex in app code | CSS custom property token |
| A third accent color for "variety" | Blue primary, amber secondary — vary weight/size otherwise |
| Amber `#FFCC00` as text on white or light grey (1.51:1) | `#CC6600` (`--color-accent-ink`, 3.8:1, large-text/UI only), or amber fill under dark slate text |
| `text-white` on an amber fill | `text-canvas-dark` — amber demands dark text |
| Purple gradient washes behind floating cards | Electric-blue and amber ambient orbs, or a flat band |
| A blueprint grid or grain texture | Ambient blurred radials, or nothing |
| A heading above 24px or body above 14px below 768px | The `--step-N` scale, which enforces both ceilings |
| A hardcoded `px` font-size | `--step-N`, so the mobile ceiling applies automatically |
| Muting text with opacity | `--color-muted` |
| Rows of identical equal-width cards | An asymmetric split with a clear focal point |
| Brass `#C6752E`, vellum `#F6F0E2`, Fraunces, or IBM Plex | Electric blue `#0066FF` with Plus Jakarta Sans — those identities are retired |
