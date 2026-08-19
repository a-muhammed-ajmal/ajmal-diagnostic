# Accessibility report — 12px body text

**Decision:** body and paragraph text is capped at 12px across the site, per explicit brand direction (confirmed 2026-08-19 after reviewing a rendered 12 / 14 / 16px comparison).

This document records what that choice costs, so the trade-off stays visible rather than being rediscovered later as a bug. Everything here was measured against the built site, not estimated.

---

## What passes

Measured across `/`, `/about`, `/services`, `/contact`, `/insights`, `/insights/[slug]`, `/diagnostic`, `/privacy`, `/unsubscribe`, `/admin` at 320 / 375 / 1280px:

| Check | Result |
| --- | --- |
| Text contrast (WCAG 1.4.3, AA) | **0 failures** — every string ≥ 4.5:1 |
| h1, all widths (320–1920px) | **24px** — exactly the specified cap, never scales up |
| Section titles, all widths | **21px** — exactly the specified cap |
| Prose (`<p>`, `<li>`) | **12px everywhere** — no element exceeds the cap |
| Control text (buttons, nav, labels) | **12px everywhere** |
| Horizontal overflow at 320px | **None**, on any page |
| Focus ring | Global `:focus-visible`, 2px `--color-focus`, never removed |
| Tap targets | 44px floor retained on all controls — held by height and padding, not type size |
| State signalling | Never colour-alone — selected options carry a filled radio and `aria-pressed` |

---

## What 12px costs

### 1. It contradicts the project's own former rule
`references/mobile.md` previously read *"Body prose never below 16px on mobile."* That rule has been rewritten to describe the 12px cap as a deliberate, accepted trade-off. Without that edit the documentation would have contradicted the shipped site, and the next agent session would have "fixed" the type scale back.

### 2. There is no size tier below body
At 12px there is nowhere left to go. `--step--1` and `--step-0` are now the same `0.75rem`, so captions, metadata, legal text, and body are all one size. Hierarchy below heading level now depends entirely on weight and colour.

### 3. The large-text contrast exemption is gone
WCAG allows 3:1 for text ≥ 24px, or ≥ 18.66px bold. At 12px essentially nothing on the site qualifies, so **every string must clear 4.5:1**. Consequences already applied:
- `--color-text-subtle` (`#9C9484`, ~3.3:1) was deleted outright — it had no legal use left.
- All opacity-based muting (`text-navy/60`, `text-ivory/70`, and similar) was replaced with `--color-muted` (`#5B6273`, 6.2:1). Opacity muting is now an anti-pattern.

### 4. Form labels sit at 12px next to 16px inputs
`input, select, textarea` remain pinned to `font-size: 16px`. This is not negotiable: below 16px, iOS Safari zooms the viewport on every field focus, which would break the diagnostic quiz, lead capture, and contact form on mobile. The visible result is a label noticeably smaller than the value beneath it, most obvious on `/contact`. This is a consequence of the cap, not a styling error.

### 5. Long-form articles took the largest regression
`/insights/[slug]` previously rendered body copy at 17–18px — the one place on the site with sustained reading. It is now 12px. Of everything in this change, this is the item most likely to affect real reading behaviour, and the one worth revisiting first if engagement drops.

### 6. Effective zoom floor
A reader reaches the browser's default reading size only at ~133% zoom. The "usable at 200% zoom" requirement still passes, but it now buys roughly half the headroom it used to.

### 7. Heading-to-body ratio
12px body against a 24px mobile h1 is a 2:1 jump. Typographically this reads as "small print beneath a headline" rather than "compact". It is legible and compliant; it is not conventional.

---

## If this is revisited

The single change that would resolve items 2, 3, 5, 6 and 7 is moving `--step-0` from `0.75rem` to `0.875rem` (14px) in [globals.css](../src/app/globals.css) and freeing 12px to become the caption tier again. That is a one-line change to the token; no markup depends on the literal value.

Item 4 is unaffected either way — inputs stay at 16px regardless.
