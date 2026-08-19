# Visual Aesthetics & Motion

Read this when asked to make an interface "look better," "less generic," or "more polished."

## Typography

- **Two faces, distinct jobs.** `--font-heading` / `--font-display` resolve to **Roboto Slab** (slab serif, carries the headings); `--font-body` / `--font-sans` / `--font-mono` resolve to **Lexend**, which is tuned for reading ease — the reason it holds up at 12px. `font-mono` only switches on tabular figures. No Inter, no Fraunces, no IBM Plex, no Figtree — those exist only as fallback stacks.
- **Weight and size drive hierarchy**, not font-swapping. 400 body, 500 medium emphasis, 600 section heads, 700 titles, 800 hero display. Body is 12px and h1 stops at 24px, so the whole scale is compressed into one octave — hierarchy leans on weight, case and the slab/sans contrast rather than size.
- **Tracking on display**: `letter-spacing: -0.02em` on anything 20px and above. Eyebrows go the other way: `+0.1em` uppercase (the `.eyebrow` class already sets the shape — weight, size, tracking, uppercase — but no colour).
- **Use the fluid `--step-N` scale** (`--step--1` through `--step-5`) rather than fixed pixel sizes. It is clamp-based and already tuned for this site.

## Color Aesthetic

- **Blue is the only brand accent.** `--color-brand` (`#2563EB`) for fills, `--color-brand-hover` (`#1D4ED8`) on hover, `--color-brand-ink` (`#1E40AF`) for coloured text on white.
- **There are no dark sections.** The brand is "Signal" — electric blue on a white canvas. Rhythm comes from alternating white and `--color-brand-tint` bands separated by hairline rules, not from dark slabs.
- **Amber supports, never competes.** `--color-accent` is a fill for highlights, chips, and the final step of a progression — never the primary action, and never text.
- **No decorative gradients** beyond the sanctioned `.brand-gradient-text` (display sizes only). No rainbow gradients, no purple, no AI pulse effects, no mesh backgrounds, and no texture or grid overlays — the canvas is deliberately flat.

## Brand Signature: Blueprint Grid

The 40×40px ink-blue grid, the aurora radials, and the grain layer are **already painted on `body`** in `globals.css` — this is a literal blueprint grid, part of the concept, not decoration. Do not re-declare them.

There is no grid overlay any more — `.graph-overlay` and `.graph-overlay-dark` were deleted along with the page grain and aurora radials. When a section needs separation, give it `bg-brand-tint` and `border-y border-line`.

## Motion

- **Signature easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out`) — luxurious and considered, matching a premium consulting brand.
- **Durations**: `--dur-1` 120ms · `--dur-2` 220ms · `--dur-3` 400ms · `--dur-4` 650ms. Keep interaction feedback at `--dur-1`/`--dur-2`.
- **Staggered entrances**: use the existing `.reveal` class (translateY + fade, 80ms apart). Don't hand-roll stagger delays.
- **Micro-interactions**: subtle lift (`translateY(-1px)`) plus shadow increase on card hover. Keep it restrained.
- **Never `transition: all`** — name the properties: `transition: transform var(--dur-2) var(--ease-out), opacity var(--dur-2) var(--ease-out);`
- Animate `transform` and `opacity` only. Respect `prefers-reduced-motion` (handled globally).
- **No glassmorphism.** Flat, structured surfaces only — including nav and modals.

## Card Hover Pattern

`.card-interactive` already handles the transition, the 2px lift, the `--shadow-2` step, and the blue hover border. Use it rather than rebuilding a hover.

```css
.card-interactive {
  transition:
    border-color 150ms var(--ease-out),
    box-shadow   150ms var(--ease-out),
    transform    150ms var(--ease-out);
}
.card-interactive:hover {
  box-shadow: var(--shadow-2);
  transform: translateY(-1px);
}
```

## When a Page Looks Generic

Diagnose in this order before adding any decoration:

1. **Hierarchy** — is there one clear focal point, or do five elements compete?
2. **Type scale contrast** — generic pages use three sizes that are all too close. Widen the jump between display and body.
3. **Density** — is the page padded into emptiness? Structured density reads as considered; large blank gaps read as unfinished.
4. **One dominant action** — is the primary CTA unmistakable, with secondaries visibly subordinate?
5. **Edges and rhythm** — consistent border treatment and a repeating spacing interval do more than any effect.

Only after those are resolved should you reach for the brand signature (grid, gradient text, orange accent).
