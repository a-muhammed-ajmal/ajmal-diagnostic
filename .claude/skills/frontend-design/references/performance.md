# Performance Targets

## Core Web Vitals

- **LCP** < 2.5s — optimise the critical rendering path. Plus Jakarta Sans and Lexend load via `next/font/google`, which self-hosts and avoids FOUT.
- **CLS** < 0.1 — always give images explicit `width`/`height`, and reserve space for content that arrives late.
- **INP** < 200ms — the responsiveness metric that replaced FID. Avoid main-thread tasks over 50ms; break up heavy client work.

## Font Loading

Two typefaces, loaded once in `src/app/layout.tsx`:

```ts
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Lexend } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({ variable: '--font-plus-jakarta-sans', subsets: ['latin'], weight: ['300','400','500','600','700','800'], display: 'swap' });
const lexend = Lexend({ subsets: ['latin'], weight: ['400','500'], variable: '--font-lexend', display: 'swap' });
```

`--font-heading`, `--font-display`, and `--font-mono` resolve to `var(--font-plus-jakarta-sans)`; `--font-body` and `--font-sans` resolve to `var(--font-lexend)`. Never add a `<link>` to Google Fonts and never a CSS `@import` — `next/font` self-hosts and eliminates the round-trip. Two families are the whole budget — do not add a third, and keep each weight list as narrow as the design actually uses. Lexend loads 400 and 500 only, because no body-role text may exceed 500.

## Rendering

- **Default to Server Components.** Every `"use client"` boundary ships JavaScript; keep them small and pushed to the leaves.
- Fetch on the server where possible rather than in a client effect.
- Give routes explicit loading and error boundaries.
- Avoid making a whole page a Client Component for one interactive control.

## Optimization Rules

- **Images**: `next/image` for all production images, WebP/AVIF, `loading="lazy"` off-screen, explicit dimensions.
- **Animations**: `transform` and `opacity` only — never `width`, `height`, `top`, `left`, or any layout-triggering property. The `transition: all 200ms` on `.hover-lift` / `.card-interactive` is safe because only transform, shadow, border and colour change on those elements — do not extend it to something whose layout properties move.
- **Transitions**: keep UI feedback at `--dur-1` (120ms) or `--dur-2` (200ms); nothing over `--dur-4` (650ms). `prefers-reduced-motion` is handled globally in `globals.css`.
- **`backdrop-filter` is expensive.** `.glass-panel` is fine for a handful of panels; do not blanket a long list with it. Same for `.orb` — two blurred radials per section is the budget.
- **Layout thrashing**: never read and write DOM style in the same loop; batch reads before writes.

## Bundle

- **No animation library.** Motion is native CSS, including the scroll-driven `animation-timeline` effects already in `globals.css`.
- **No icon sets beyond `lucide-react`** — it tree-shakes per icon. Import named icons, never the barrel.
- **No utility-heavy dependencies** (lodash, moment) — use native JS and `Intl`.
- Audit before adding anything: a dependency needs a functional reason, not a convenience one.
