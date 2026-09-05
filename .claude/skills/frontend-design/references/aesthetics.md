# Visual Aesthetics & Motion

Read this when asked to make an interface "look better," "less generic," or "more polished."

## Typography

- **Two faces, three roles.** Plus Jakarta Sans for headings and display; Lexend for body, UI, and small text. No third face, and nothing in Lexend above weight 500. `--font-heading` / `--font-display` / `--font-mono` resolve to **Plus Jakarta Sans**; `--font-body` / `--font-sans` resolve to **Lexend**, which carries body copy and all UI text including button and control labels. `font-mono` only switches on tabular figures. No Inter, no Fraunces, no IBM Plex — those exist only as retired identities or fallback stacks.
- **Weight and size drive hierarchy**, not font-swapping. Headings run 600–800; body runs 300–400 with 500–600 for emphasis and labels.
- **Tracking**: loose on large display titles, none below — eyebrows included, which carry no letter spacing. The `.eyebrow` class sets weight (500), size, case, and colour: `accent-ink` on light surfaces, `accent` on dark bands.
- **Use the `--step-N` scale**, never a hardcoded pixel size. A `px` font-size escapes the mobile ceilings, which is the single most common way this design system gets broken.
- The scale is **responsive with hard mobile ceilings**: below 768px no heading exceeds 24px and no body copy exceeds 14px; above it the scale opens to 48px h1 / 32px h2 / 16px body. That jump is where the hierarchy lives on desktop — do not flatten it.

## Color Aesthetic

- **Electric blue is the primary.** `--color-brand` (`#0066FF`) for fills, `--color-brand-hover` (`#0039CC`) on hover, `--color-brand-ink` (`#003399`) for coloured text on white.
- **Amber is the secondary, and it is a fill.** `--color-accent` (`#FFCC00`) is 1.51:1 on white. It may sit on dark slate (`--color-canvas-dark`), carry dark text on top of itself, or act as a border highlight — never as text on a light surface. For that, `--color-accent-ink` (`#CC6600`, 3.8:1 — large-text/UI only, below AA-normal).
- **Slate grounds both.** `--color-ink` (`#000033`) for text, `--color-muted` (`#475569`) for secondary, `--color-line` (`#E2E8F0`) for borders, `--color-canvas-light` (`#F8FAFC`) for neutral bands.
- **No purple, no rainbow gradients, no AI pulse effects, no mesh backgrounds.** The sanctioned gradient is `.brand-gradient-text` (electric-700 → electric-500); both ends clear 4.5:1, so unlike the old one it is safe at any size.

## Depth: glass, orbs, and bands

Depth is welcome now, but it comes from three sanctioned devices, not from decoration:

- **`.glass-panel`** — translucent white, `backdrop-filter: blur(12px)`, thin border. Use for a panel that floats over ambient colour. It degrades to an opaque card where `backdrop-filter` is unsupported, so text never becomes unreadable.
- **`.orb` + `.orb-electric` / `.orb-amber`** — blurred radials at 20–30% opacity, sitting behind a hero. They need a positioned, `overflow-hidden` parent and `aria-hidden="true"`. Two is the budget for a section; more turns into soup.
- **Banded rhythm** — alternate white, `bg-canvas-light`, and `bg-brand-tint`, separated by `border-y border-line`. Two adjacent white sections need a `border-t border-line` or they merge.

## Layout

- **Asymmetric grids.** A 7/5 or 8/4 split reads as designed; two equal halves read as a template. Break up rows of identical equal-width cards — vary span, or give one card prominence.
- **One dominant action per view**, with secondaries visibly subordinate.

## Motion

- **Signature easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out`).
- **Durations**: `--dur-1` 120ms · `--dur-2` 200ms · `--dur-3` 400ms · `--dur-4` 650ms. Interaction feedback is `--dur-2` (200ms) — that is the mandated `transition-all duration-200`.
- **Staggered entrances**: use the existing `.reveal` class (translateY + fade, 100ms apart). Don't hand-roll stagger delays.
- **Hover micro-interactions are required on every CTA.** A static interface with no active/hover feedback is a defect. The house pattern is a 2px upward shift plus a glow step: `.hover-lift` (electric glow), `.hover-lift-amber` (amber glow), `.card-interactive` (lift + shadow + brand border).
- Prefer animating `transform`, `opacity`, and colour. Respect `prefers-reduced-motion` (handled globally).

## Card Hover Pattern

`.card-interactive` already handles the transition, the 2px lift, the `--shadow-2` step, and the electric hover border. Use it rather than rebuilding a hover.

```css
.card-interactive { transition: all var(--dur-2) var(--ease-out); }
.card-interactive:hover {
  border-color: var(--color-brand);
  box-shadow: var(--shadow-2);
  transform: translateY(-2px);
}
```

## When a Page Looks Generic

Diagnose in this order before adding any decoration:

1. **Hierarchy** — is there one clear focal point, or do five elements compete?
2. **Type scale contrast** — generic pages use three sizes that are all too close. On desktop the scale spans 13px to 48px; use its ends.
3. **Symmetry** — a page of equal-width cards in equal rows is the single strongest "template" signal. Break it.
4. **Density** — is the page padded into emptiness? Structured density reads as considered; large blank gaps read as unfinished.
5. **One dominant action** — is the primary CTA unmistakable, with secondaries visibly subordinate?
6. **Edges and rhythm** — consistent border treatment and a repeating spacing interval do more than any effect.

Only after those are resolved should you reach for the brand signature (glass, orbs, gradient text, amber accent).
