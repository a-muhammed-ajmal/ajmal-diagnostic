# Performance Targets

## Core Web Vitals

- **LCP** < 2.5s — optimise the critical rendering path. Figtree loads via `next/font/google`, which self-hosts and avoids FOUT.
- **CLS** < 0.1 — always give images explicit `width`/`height`, and reserve space for content that arrives late.
- **INP** < 200ms — the responsiveness metric that replaced FID. Avoid main-thread tasks over 50ms; break up heavy client work.

## Font Loading

Three typefaces, all loaded once in `src/app/layout.tsx`:

```ts
import { Figtree } from 'next/font/google';

const figtree = Figtree({ variable: '--font-figtree', subsets: ['latin'], weight: ['400','500','600','700','800'], display: 'swap' });
```

Every font token — `--font-heading`, `--font-display`, `--font-body`, `--font-sans`, `--font-mono` — resolves to `var(--font-figtree)`. Never add a `<link>` to Google Fonts; `next/font` self-hosts and eliminates the round-trip. One family is the whole budget — do not add a second, and keep the weight list as narrow as the design actually uses.

## Rendering

- **Default to Server Components.** Every `"use client"` boundary ships JavaScript; keep them small and pushed to the leaves.
- Fetch on the server where possible rather than in a client effect.
- Give routes explicit loading and error boundaries.
- Avoid making a whole page a Client Component for one interactive control.

## Optimization Rules

- **Images**: `next/image` for all production images, WebP/AVIF, `loading="lazy"` off-screen, explicit dimensions.
- **Animations**: `transform` and `opacity` only — never `width`, `height`, `top`, `left`, or any layout-triggering property.
- **Transitions**: keep UI feedback at `--dur-1` (120ms) or `--dur-2` (220ms); nothing over `--dur-4` (650ms). `prefers-reduced-motion` is handled globally in `globals.css`.
- **Layout thrashing**: never read and write DOM style in the same loop; batch reads before writes.

## Bundle

- **No animation library.** Motion is native CSS, including the scroll-driven `animation-timeline` effects already in `globals.css`.
- **No icon sets beyond `lucide-react`** — it tree-shakes per icon. Import named icons, never the barrel.
- **No utility-heavy dependencies** (lodash, moment) — use native JS and `Intl`.
- Audit before adding anything: a dependency needs a functional reason, not a convenience one.
