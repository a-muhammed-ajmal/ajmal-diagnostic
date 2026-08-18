# Visual Aesthetics & Motion

Read this when asked to make an interface "look better," "less generic," or "more polished."

## Typography

- **Three faces, each with a job.** Fraunces (bold serif) carries display and all headings via `--font-heading` / `--font-display`; IBM Plex Sans carries body and UI via `--font-body` / `--font-sans`; IBM Plex Mono carries numbers, stats, and technical labels via `--font-mono`. Nothing else — not Inter, not Playfair Display, not Plus Jakarta Sans, not Lexend, not system-serif.
- **Hierarchy comes from face and scale first, weight second.** The serif/sans split already separates heading from body; don't add a fourth face to make a distinction that scale can carry. Fraunces runs 500/600/700/900, Plex Sans 400/500/600/700.
- **Tracking on display**: `letter-spacing: -0.02em` on anything 20px and above. Eyebrows go the other way: `+0.1em` uppercase (the `.eyebrow` class already does the shape — the colour stays yours).
- **Use the fluid `--step-N` scale** (`--step--1` through `--step-5`) rather than fixed pixel sizes. It is clamp-based and already tuned for this site, with deliberately compressed mobile floors so heading order survives at 375px.

## Color Aesthetic

- **Brass is the only brand accent.** `--color-gold` (`#C6752E`) for fills, `--color-gold-bright` (`#E0964F`) on hover, `--color-gold-ink` (`#8C4D1F`) for coloured text on white.
- **Dark sections use blueprint ink** (`#132A4A`), not black. The palette is ink + brass on vellum (`#F6F0E2`) — warm paper, never cool gray or soft white.
- **Blueprint Cyan supports, never competes.** `--color-teal` (`#3E8FB0`) marks growth and digital-transformation content only.
- **No decorative gradients** beyond the sanctioned `.gold-gradient-text` / `.orange-gradient-text` and the blueprint overlay. No rainbow gradients, no purple, no AI pulse effects, no mesh backgrounds.

## Brand Signature: Blueprint Grid

The 40×40px ink grid, the aurora radials, and the grain layer are **already painted on `body`** in `globals.css`. Do not re-declare them. The grid is a literal blueprint, part of the concept — not background texture to be swapped out.

Apply `.graph-overlay` only when a light section needs its own grid above the page background, and `.graph-overlay-dark` (brass grid) on ink sections. Both are absolutely positioned — the parent needs `position: relative`.

## Motion

- **Signature easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out`) — luxurious and considered, matching a premium consulting brand.
- **Durations**: `--dur-1` 120ms · `--dur-2` 220ms · `--dur-3` 400ms · `--dur-4` 650ms. Keep interaction feedback at `--dur-1`/`--dur-2`.
- **Staggered entrances**: use the existing `.reveal` class (translateY + fade, ~80ms apart). Don't hand-roll stagger delays.
- **Micro-interactions**: subtle lift (`translateY(-1px)`) plus shadow increase on card hover. Keep it restrained.
- **Never `transition: all`** — name the properties: `transition: transform var(--dur-2) var(--ease-out), opacity var(--dur-2) var(--ease-out);`
- Animate `transform` and `opacity` only. Respect `prefers-reduced-motion` (handled globally).
- **No glassmorphism.** Flat, structured surfaces only — including nav and modals.

## Card Hover Pattern

`.card-interactive` already handles the transition and the lift. It deliberately leaves `border-color` to a Tailwind utility on each card, so the accent can vary (brass by default, crimson on the Founder Trap cards).

```css
.card-interactive {
  transition:
    border-color 150ms var(--ease-out),
    box-shadow   150ms var(--ease-out),
    transform    150ms var(--ease-out);
}

.card-interactive:hover {
  box-shadow: 0 4px 16px rgba(19, 42, 74, 0.12);
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

Only after those are resolved should you reach for the brand signature (blueprint grid, gradient text, brass accent).
